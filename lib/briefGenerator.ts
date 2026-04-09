import { buildKeywordStrategy } from "./keywordEngine";
import { buildSitemap } from "./sitemapGenerator";
import { estimateTime } from "./timeEstimator";
import { BriefInput, BriefResult, PageInstruction } from "./types";

function instructionForPage(page: string, input: BriefInput, keywords: string[]): PageInstruction {
  const mainCity = input.primaryCity;
  return {
    page,
    purpose: `Convert ${mainCity} visitors into qualified leads while reinforcing premium positioning for ${input.businessName}.`,
    sections: [
      "Hero with clear promise + primary CTA",
      "Trust bar (ratings, years, guarantees)",
      "Service outcomes and proof",
      "Process steps",
      "FAQ and objection handling",
      "Strong footer CTA with contact details"
    ],
    copyDirection: [
      `Write in a ${input.brandTone} tone with short sentences and confident language.`,
      "Lead with outcomes before features.",
      "Use concrete local references and avoid generic claims.",
      "Include one differentiator block for unique selling points."
    ],
    seo: {
      h1: `${page} | ${input.businessName} in ${mainCity}`,
      h2: [
        `Why ${input.businessName} is trusted in ${mainCity}`,
        `What to expect from our ${page.toLowerCase()} experience`,
        "Frequently asked questions"
      ],
      keywords: keywords.slice(0, 6)
    },
    internalLinks: [
      "Link to Main Services from first content block.",
      "Link to Contact page after every major CTA.",
      "Cross-link related service pages with anchor text matching intent keywords."
    ],
    conversionElements: [
      "Sticky mobile CTA button",
      "Inline quote form above the fold",
      "Trust badges adjacent to form",
      "Two-step CTA near page end"
    ],
    imageGuidance: [
      "Use real team/project photos where possible.",
      "Add geo-relevant imagery from actual service neighborhoods.",
      "Avoid generic stock photography unless no first-party assets exist."
    ],
    designInstructions: [
      "Use generous whitespace and consistent 8px spacing scale.",
      "Apply bold heading hierarchy with high contrast.",
      "Keep sections modular with clean dividers.",
      "Use premium minimal styling inspired by Apple/Tesla landing pages."
    ]
  };
}

export function generateBrief(input: BriefInput): BriefResult {
  const keywordStrategy = buildKeywordStrategy(input);
  const timeEstimate = estimateTime(input);
  const trimmedServices = input.services.slice(0, timeEstimate.serviceCount);
  const constrainedInput = { ...input, services: trimmedServices };
  const sitemap = buildSitemap(constrainedInput, timeEstimate);

  const vaInstructions = sitemap.map((page) => instructionForPage(page, constrainedInput, keywordStrategy.secondaryKeywords));

  return {
    meta: {
      generatedAt: new Date().toISOString(),
      businessName: input.businessName,
      industry: input.customIndustry || input.industry,
      city: input.primaryCity
    },
    executiveSummary: `${input.businessName} needs a premium lead-generation website that ranks in ${input.primaryCity}, pre-qualifies prospects, and gives VAs a precise execution roadmap for fast production delivery.`,
    goals: [
      "Increase local organic visibility for core service keywords.",
      "Lift conversion rate with stronger CTA hierarchy and trust proof.",
      "Standardize website production instructions so VA execution is consistent.",
      "Create AI-search-friendly page structure with concise answer blocks."
    ],
    conversionStrategy: [
      "Use sticky CTA + above-the-fold form on every core page.",
      "Place trust bar under hero: reviews, guarantees, years in business.",
      "Use objection-handling FAQ near conversion blocks.",
      "Add location-specific proof and case snippets for credibility."
    ],
    keywordStrategy,
    sitemap,
    vaInstructions,
    aiSearchOptimization: [
      "Answer likely customer questions directly in the first 100 words of each section.",
      "Use heading structures that map to spoken queries and assistant prompts.",
      "Embed entity signals: service, city, neighborhoods, credentials, guarantees.",
      "Maintain conversational but authoritative tone for answer-style blocks.",
      "Add summary bullets under long sections for machine-readable extraction.",
      "Publish FAQ content in schema-ready Q&A formatting."
    ],
    checklist: [
      "Confirm all pages include one primary CTA and one secondary CTA.",
      "Validate on mobile breakpoints before QA handoff.",
      "Ensure each page has unique H1 and localized metadata.",
      "Link every service page back to contact and main services.",
      "Run final proofread for tone consistency and factual accuracy."
    ],
    timeEstimate: {
      totalHours: timeEstimate.totalHours,
      breakdown: timeEstimate.breakdown,
      notes: timeEstimate.notes
    }
  };
}
