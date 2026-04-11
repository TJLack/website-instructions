export type ScanData = {
  websiteUrl?: string;
  title?: string;
  phoneNumbers?: string[];
  addresses?: string[];
  city?: string;
  state?: string;
  businessName?: string;
  schemaLocalBusiness?: {
    name?: string;
    telephone?: string;
    address?: {
      streetAddress?: string;
      addressLocality?: string;
      addressRegion?: string;
      postalCode?: string;
    };
    url?: string;
  };
  mapLinks?: string[];
  googleLinks?: string[];
};

export type BusinessIdentity = {
  businessName?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  websiteUrl?: string;
  schemaDetected: boolean;
  googleHints: string[];
};

export type GoogleBusinessCandidate = {
  id?: string;
  name: string;
  resourceName: string;
  formattedAddress?: string;
  websiteUri?: string;
  nationalPhoneNumber?: string;
  rating?: number;
  userRatingCount?: number;
  businessStatus?: string;
  primaryType?: string;
  primaryTypeDisplayName?: string;
  googleMapsUri?: string;
  location?: {
    latitude: number;
    longitude: number;
  };
};

export type MatchScoringBreakdown = {
  score: number;
  decision: "high" | "medium" | "low";
  reasons: string[];
};

export type ScoredGoogleCandidate = GoogleBusinessCandidate & {
  confidence: MatchScoringBreakdown;
};
