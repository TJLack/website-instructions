import { BriefInput } from "./types";

function normalizeList(value: unknown) {
  if (Array.isArray(value)) {
    return value.map((item) => String(item).trim()).filter(Boolean);
  }
  if (typeof value === "string") {
    return value.split(",").map((item) => item.trim()).filter(Boolean);
  }
  return [];
}

export function sanitizeInput(raw: Partial<BriefInput>): BriefInput {
  return {
    businessName: String(raw.businessName || "").trim(),
    industry: String(raw.industry || "Home Services").trim(),
    customIndustry: String(raw.customIndustry || "").trim(),
    primaryCity: String(raw.primaryCity || "").trim(),
    secondaryCities: normalizeList(raw.secondaryCities),
    services: normalizeList(raw.services),
    uniqueSellingPoints: String(raw.uniqueSellingPoints || "").trim(),
    offers: String(raw.offers || "").trim(),
    websiteUrl: String(raw.websiteUrl || "").trim(),
    competitorUrls: normalizeList(raw.competitorUrls),
    brandTone: String(raw.brandTone || "Premium").trim(),
    contactInfo: String(raw.contactInfo || "").trim()
  };
}

export function validateInput(input: BriefInput) {
  const issues: string[] = [];

  if (!input.businessName) issues.push("Business Name is required.");
  if (!input.primaryCity) issues.push("Primary City is required.");
  if (!input.services.length) issues.push("At least one service is required.");
  if (!input.uniqueSellingPoints) issues.push("Unique Selling Points are required.");
  if (!input.contactInfo) issues.push("Contact Info is required.");

  return {
    valid: issues.length === 0,
    issues
  };
}
