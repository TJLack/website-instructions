"use client";

import { BriefResult } from "@/lib/types";

export function BriefPreview({ brief }: { brief: BriefResult }) {
  async function downloadPdf() {
    const response = await fetch("/api/pdf", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ brief })
    });
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "legend-brief.pdf";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Brief Preview</h2>
        <button onClick={downloadPdf} className="rounded-xl bg-slate-900 px-4 py-2 text-white dark:bg-slate-100 dark:text-slate-900">
          Download PDF
        </button>
      </div>
      <p>{brief.executiveSummary}</p>
      <p className="font-semibold">Total Estimated Time: {brief.timeEstimate.totalHours.toFixed(1)} hours</p>
      <ul className="list-disc pl-6 text-sm">
        {brief.timeEstimate.breakdown.map((row) => (
          <li key={row.item}>
            {row.item}: {row.hours} hrs
          </li>
        ))}
      </ul>
      <h3 className="font-semibold">Sitemap</h3>
      <ul className="grid list-disc grid-cols-2 gap-2 pl-6 text-sm">
        {brief.sitemap.map((page) => (
          <li key={page}>{page}</li>
        ))}
      </ul>
    </div>
  );
}
