import { BriefInput } from "./types";

export function buildKeywordStrategy(input: BriefInput) {
  const city = input.primaryCity.trim();
  const mainService = input.services[0] || "service";
  const primaryKeyword = `${mainService} in ${city}`;

  const secondaryKeywords = Array.from(
    new Set(
      input.services.flatMap((service) => [
        `${service} ${city}`,
        `${service} in ${city}`,
        `${service} near me`,
        `best ${service} ${city}`,
        `affordable ${service} ${city}`,
        `${city} ${service} company`
      ])
    )
  );

  const serviceKeywords = Object.fromEntries(
    input.services.map((service) => [
      service,
      [
        `${service} ${city}`,
        `${service} specialists ${city}`,
        `${service} quote ${city}`,
        `${service} contractor ${city}`
      ]
    ])
  );

  const semanticKeywords = Array.from(
    new Set(
      input.services.flatMap((service) => [
        `${service} for busy homeowners`,
        `${service} that saves time`,
        `${service} with transparent pricing`,
        `${service} with guaranteed workmanship`,
        `licensed ${service} in ${city}`,
        `${service} in ${city} and nearby areas`
      ])
    )
  );

  const faqKeywords = Array.from(
    new Set(
      input.services.flatMap((service) => [
        `How much does ${service} cost in ${city}?`,
        `How quickly can I book ${service} in ${city}?`,
        `What should I look for when hiring ${service} in ${city}?`,
        `Do you offer same-day ${service} in ${city}?`,
        `Is ${service} available in nearby areas of ${city}?`
      ])
    )
  ).slice(0, 10);

  return {
    primaryKeyword,
    secondaryKeywords,
    serviceKeywords,
    semanticKeywords,
    faqKeywords
  };
}
