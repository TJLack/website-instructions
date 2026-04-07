import { BriefInput } from "./types";

const HOURS = {
  homepage: 3.5,
  about: 1.25,
  contact: 0.75,
  servicePage: 1.25,
  seoPerPage: 0.5,
  internalLinking: 1.5,
  mobileOptimization: 1.75,
  qa: 1
};

export function estimateTime(input: BriefInput) {
  const notes: string[] = [];
  let serviceCount = Math.max(1, input.services.length);
  let includeReviews = true;
  let includeGallery = true;
  let includeServiceAreas = input.secondaryCities.length > 0;

  const calculate = () => {
    const staticPages = 5 + (includeReviews ? 1 : 0) + (includeGallery ? 1 : 0) + (includeServiceAreas ? 1 : 0);
    const servicePages = serviceCount;
    const pageCount = staticPages + servicePages;

    const breakdown = [
      { item: "Homepage", hours: HOURS.homepage },
      { item: "About", hours: HOURS.about },
      { item: "Contact", hours: HOURS.contact },
      { item: `Service Pages (${servicePages})`, hours: +(servicePages * HOURS.servicePage).toFixed(2) },
      { item: "SEO (0.5 hr/page)", hours: +(pageCount * HOURS.seoPerPage).toFixed(2) },
      { item: "Internal Linking", hours: HOURS.internalLinking },
      { item: "Mobile Optimization", hours: HOURS.mobileOptimization },
      { item: "QA", hours: HOURS.qa }
    ];

    return {
      breakdown,
      total: +breakdown.reduce((sum, entry) => sum + entry.hours, 0).toFixed(2),
      pageCount
    };
  };

  let current = calculate();

  while (current.total > 30 && serviceCount > 1) {
    serviceCount -= 1;
    notes.push("Reduced individual service pages to stay under 30 hours.");
    current = calculate();
  }

  if (current.total > 30 && includeServiceAreas) {
    includeServiceAreas = false;
    notes.push("Removed Service Areas page to maintain timeline cap.");
    current = calculate();
  }

  if (current.total > 30 && includeGallery) {
    includeGallery = false;
    notes.push("Removed Gallery page to protect 30-hour hard cap.");
    current = calculate();
  }

  if (current.total > 30 && includeReviews) {
    includeReviews = false;
    notes.push("Removed Reviews page to protect 30-hour hard cap.");
    current = calculate();
  }

  if (current.total > 30) {
    notes.push("Scope simplified aggressively; merge related services into unified pages before build.");
  }

  return {
    totalHours: Math.min(30, current.total),
    breakdown: current.breakdown,
    serviceCount,
    includeReviews,
    includeGallery,
    includeServiceAreas,
    notes
  };
}
