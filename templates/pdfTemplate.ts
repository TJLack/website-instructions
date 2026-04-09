import { BriefResult } from "@/lib/types";

export function buildPdfHtml(result: BriefResult) {
  const pagesHtml = result.vaInstructions
    .slice(0, 4)
    .map(
      (instruction) => `
      <section class="page">
        <h2>${instruction.page}</h2>
        <p><strong>Purpose:</strong> ${instruction.purpose}</p>
        <h3>Required Sections</h3>
        <ul>${instruction.sections.map((s) => `<li>${s}</li>`).join("")}</ul>
        <h3>Copy Direction</h3>
        <ul>${instruction.copyDirection.map((s) => `<li>${s}</li>`).join("")}</ul>
        <h3>SEO Structure</h3>
        <p><strong>H1:</strong> ${instruction.seo.h1}</p>
        <p><strong>H2s:</strong> ${instruction.seo.h2.join(" | ")}</p>
        <p><strong>Keywords:</strong> ${instruction.seo.keywords.join(", ")}</p>
      </section>
      `
    )
    .join("");

  return `
  <html>
  <head>
    <style>
      body { font-family: Inter, Arial, sans-serif; color: #0f172a; margin:0; }
      .page { page-break-after: always; padding: 42px; min-height: 92vh; }
      h1, h2, h3 { margin: 0 0 12px; }
      p, li { font-size: 13px; line-height: 1.55; }
      .muted { color: #475569; }
      .grid { display:grid; grid-template-columns: 1fr 1fr; gap: 12px; }
      .pill { display:inline-block; background:#e2e8f0; padding:4px 8px; border-radius:999px; margin: 4px; font-size: 11px; }
      table { width:100%; border-collapse: collapse; }
      td, th { border: 1px solid #cbd5e1; padding:8px; font-size:12px; }
    </style>
  </head>
  <body>
    <section class="page">
      <h1>Legend Brief Builder</h1>
      <p class="muted">Prepared by Key City Digital</p>
      <h2>${result.meta.businessName}</h2>
      <p><strong>Industry:</strong> ${result.meta.industry}</p>
      <p><strong>City:</strong> ${result.meta.city}</p>
      <p><strong>Date:</strong> ${new Date(result.meta.generatedAt).toLocaleDateString()}</p>
    </section>

    <section class="page">
      <h2>Executive Summary</h2>
      <p>${result.executiveSummary}</p>
      <h3>Website Goals</h3>
      <ul>${result.goals.map((g) => `<li>${g}</li>`).join("")}</ul>
      <h3>Conversion Strategy</h3>
      <ul>${result.conversionStrategy.map((c) => `<li>${c}</li>`).join("")}</ul>
    </section>

    <section class="page">
      <h2>Keyword Strategy</h2>
      <p><strong>Primary:</strong> ${result.keywordStrategy.primaryKeyword}</p>
      <h3>Secondary</h3>
      ${result.keywordStrategy.secondaryKeywords.map((k) => `<span class="pill">${k}</span>`).join("")}
      <h3>Semantic & FAQ</h3>
      <ul>${result.keywordStrategy.semanticKeywords.slice(0, 8).map((k) => `<li>${k}</li>`).join("")}</ul>
      <ul>${result.keywordStrategy.faqKeywords.map((k) => `<li>${k}</li>`).join("")}</ul>
    </section>

    <section class="page">
      <h2>Sitemap</h2>
      <ol>${result.sitemap.map((p) => `<li>${p}</li>`).join("")}</ol>
    </section>

    ${pagesHtml}

    <section class="page">
      <h2>AI Search Optimization Strategy</h2>
      <ul>${result.aiSearchOptimization.map((s) => `<li>${s}</li>`).join("")}</ul>
    </section>

    <section class="page">
      <h2>Build Checklist</h2>
      <ul>${result.checklist.map((s) => `<li>${s}</li>`).join("")}</ul>
      <h2>Time Estimate</h2>
      <p><strong>Total Estimated Time:</strong> ${result.timeEstimate.totalHours.toFixed(1)} hours</p>
      <table>
        <thead><tr><th>Item</th><th>Hours</th></tr></thead>
        <tbody>${result.timeEstimate.breakdown.map((row) => `<tr><td>${row.item}</td><td>${row.hours}</td></tr>`).join("")}</tbody>
      </table>
      <ul>${result.timeEstimate.notes.map((n) => `<li>${n}</li>`).join("")}</ul>
    </section>
  </body>
  </html>
  `;
}
