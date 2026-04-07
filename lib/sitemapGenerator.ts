import { BriefInput } from "./types";

type SitemapOpts = {
  serviceCount: number;
  includeReviews: boolean;
  includeGallery: boolean;
  includeServiceAreas: boolean;
};

export function buildSitemap(input: BriefInput, opts: SitemapOpts) {
  const pages = ["Homepage", "About", "Main Services", "FAQ", "Contact"];

  input.services.slice(0, opts.serviceCount).forEach((service) => {
    pages.push(`${service} Service Page`);
  });

  if (opts.includeReviews) pages.push("Reviews");
  if (opts.includeGallery) pages.push("Gallery");
  if (opts.includeServiceAreas) pages.push("Service Areas");

  return pages;
}
