import {
  BusinessIdentity,
  GoogleBusinessCandidate,
  MatchScoringBreakdown,
  ScanData,
  ScoredGoogleCandidate,
} from "@/lib/googleBusinessTypes";

const SEARCH_FIELD_MASK = [
  "places.id",
  "places.name",
  "places.displayName",
  "places.formattedAddress",
  "places.websiteUri",
  "places.nationalPhoneNumber",
  "places.rating",
  "places.userRatingCount",
  "places.businessStatus",
  "places.primaryType",
  "places.primaryTypeDisplayName",
  "places.googleMapsUri",
  "places.location",
].join(",");

const DETAILS_FIELD_MASK = [
  "id",
  "name",
  "displayName",
  "formattedAddress",
  "websiteUri",
  "nationalPhoneNumber",
  "rating",
  "userRatingCount",
  "businessStatus",
  "primaryType",
  "primaryTypeDisplayName",
  "googleMapsUri",
  "location",
].join(",");

const PLACES_BASE_URL = "https://places.googleapis.com/v1";

function safeDomain(rawUrl?: string): string | undefined {
  if (!rawUrl) return undefined;
  try {
    return new URL(rawUrl).hostname.replace(/^www\./, "").toLowerCase();
  } catch {
    return undefined;
  }
}

function normalizePhone(raw?: string): string | undefined {
  if (!raw) return undefined;
  const digits = raw.replace(/\D/g, "");
  return digits.length >= 10 ? digits.slice(-10) : undefined;
}

function similarityContains(left?: string, right?: string): boolean {
  if (!left || !right) return false;
  const l = left.toLowerCase().trim();
  const r = right.toLowerCase().trim();
  return l.includes(r) || r.includes(l);
}

function mapGooglePlace(place: any): GoogleBusinessCandidate {
  return {
    id: place.id,
    name: place.displayName?.text ?? "Unknown",
    resourceName: place.name,
    formattedAddress: place.formattedAddress,
    websiteUri: place.websiteUri,
    nationalPhoneNumber: place.nationalPhoneNumber,
    rating: place.rating,
    userRatingCount: place.userRatingCount,
    businessStatus: place.businessStatus,
    primaryType: place.primaryType,
    primaryTypeDisplayName: place.primaryTypeDisplayName?.text,
    googleMapsUri: place.googleMapsUri,
    location: place.location,
  };
}

export function extractBusinessIdentityFromScan(scanData: ScanData): BusinessIdentity {
  const schema = scanData.schemaLocalBusiness;
  const firstAddress = schema?.address
    ? [
        schema.address.streetAddress,
        schema.address.addressLocality,
        schema.address.addressRegion,
        schema.address.postalCode,
      ]
        .filter(Boolean)
        .join(", ")
    : scanData.addresses?.[0];

  const googleHints = [...(scanData.mapLinks ?? []), ...(scanData.googleLinks ?? [])].filter(Boolean);

  return {
    businessName: schema?.name ?? scanData.businessName ?? scanData.title,
    phone: normalizePhone(schema?.telephone ?? scanData.phoneNumbers?.[0]),
    address: firstAddress,
    city: schema?.address?.addressLocality ?? scanData.city,
    state: schema?.address?.addressRegion ?? scanData.state,
    websiteUrl: schema?.url ?? scanData.websiteUrl,
    schemaDetected: Boolean(schema),
    googleHints,
  };
}

export async function searchGoogleBusinesses(
  query: string,
  city?: string,
  state?: string,
  maxResults = 5,
): Promise<GoogleBusinessCandidate[]> {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  if (!apiKey) throw new Error("Missing GOOGLE_MAPS_API_KEY");

  const scopedQuery = [query, city, state].filter(Boolean).join(", ");

  const response = await fetch(`${PLACES_BASE_URL}/places:searchText`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": apiKey,
      "X-Goog-FieldMask": SEARCH_FIELD_MASK,
    },
    body: JSON.stringify({
      textQuery: scopedQuery,
      pageSize: maxResults,
      languageCode: "en",
      regionCode: "US",
    }),
    cache: "no-store",
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Google Places search failed: ${response.status} ${errorBody}`);
  }

  const payload = await response.json();
  return (payload.places ?? []).map(mapGooglePlace);
}

export async function getGoogleBusinessDetails(placeResourceNameOrId: string): Promise<GoogleBusinessCandidate> {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  if (!apiKey) throw new Error("Missing GOOGLE_MAPS_API_KEY");

  const resourceName = placeResourceNameOrId.startsWith("places/")
    ? placeResourceNameOrId
    : `places/${placeResourceNameOrId}`;

  const response = await fetch(`${PLACES_BASE_URL}/${resourceName}`, {
    headers: {
      "X-Goog-Api-Key": apiKey,
      "X-Goog-FieldMask": DETAILS_FIELD_MASK,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Google Places details failed: ${response.status} ${errorBody}`);
  }

  const payload = await response.json();
  return mapGooglePlace(payload);
}

export function scoreBusinessMatch(scanIdentity: BusinessIdentity, googleCandidate: GoogleBusinessCandidate): MatchScoringBreakdown {
  let score = 0;
  const reasons: string[] = [];

  const domainFromScan = safeDomain(scanIdentity.websiteUrl);
  const domainFromCandidate = safeDomain(googleCandidate.websiteUri);
  const phoneFromScan = normalizePhone(scanIdentity.phone);
  const phoneFromCandidate = normalizePhone(googleCandidate.nationalPhoneNumber);

  if (similarityContains(scanIdentity.businessName, googleCandidate.name)) {
    score += 35;
    reasons.push("Business name is a strong match.");
  }

  if (similarityContains(scanIdentity.city, googleCandidate.formattedAddress)) {
    score += 15;
    reasons.push("City appears to match.");
  }

  if (phoneFromScan && phoneFromCandidate && phoneFromScan === phoneFromCandidate) {
    score += 20;
    reasons.push("Phone number matches.");
  }

  if (domainFromScan && domainFromCandidate && domainFromScan === domainFromCandidate) {
    score += 20;
    reasons.push("Website domain matches.");
  }

  if (similarityContains(scanIdentity.address, googleCandidate.formattedAddress)) {
    score += 15;
    reasons.push("Address looks similar.");
  }

  if (scanIdentity.googleHints.some((hint) => googleCandidate.googleMapsUri && hint.includes(googleCandidate.googleMapsUri))) {
    score += 10;
    reasons.push("Existing Google map hint points to this listing.");
  }

  const decision: MatchScoringBreakdown["decision"] = score >= 70 ? "high" : score >= 45 ? "medium" : "low";
  return { score, decision, reasons };
}

export function rankCandidates(scanIdentity: BusinessIdentity, candidates: GoogleBusinessCandidate[]): ScoredGoogleCandidate[] {
  return candidates
    .map((candidate) => ({
      ...candidate,
      confidence: scoreBusinessMatch(scanIdentity, candidate),
    }))
    .sort((a, b) => b.confidence.score - a.confidence.score);
}
