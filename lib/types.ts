export type BriefInput = {
  businessName: string;
  industry: string;
  customIndustry?: string;
  primaryCity: string;
  secondaryCities: string[];
  services: string[];
  uniqueSellingPoints: string;
  offers?: string;
  websiteUrl?: string;
  competitorUrls: string[];
  brandTone: string;
  contactInfo: string;
};

export type PageInstruction = {
  page: string;
  purpose: string;
  sections: string[];
  copyDirection: string[];
  seo: {
    h1: string;
    h2: string[];
    keywords: string[];
  };
  internalLinks: string[];
  conversionElements: string[];
  imageGuidance: string[];
  designInstructions: string[];
};

export type BriefResult = {
  meta: {
    generatedAt: string;
    businessName: string;
    industry: string;
    city: string;
  };
  executiveSummary: string;
  goals: string[];
  conversionStrategy: string[];
  keywordStrategy: {
    primaryKeyword: string;
    secondaryKeywords: string[];
    serviceKeywords: Record<string, string[]>;
    semanticKeywords: string[];
    faqKeywords: string[];
  };
  sitemap: string[];
  vaInstructions: PageInstruction[];
  aiSearchOptimization: string[];
  checklist: string[];
  timeEstimate: {
    totalHours: number;
    breakdown: { item: string; hours: number }[];
    notes: string[];
  };
};
