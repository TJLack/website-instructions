"use client";

import { useState } from "react";
import { BriefForm } from "@/components/BriefForm";
import { BriefPreview } from "@/components/BriefPreview";
import { ThemeToggle } from "@/components/ThemeToggle";
import { GoogleBusinessResolverOrchestrator } from "@/components/GoogleBusinessResolverOrchestrator";
import { BriefResult } from "@/lib/types";

export default function HomePage() {
  const [brief, setBrief] = useState<BriefResult | null>(null);

  return (
    <main className="min-h-screen px-6 py-10 md:px-10">
      <div className="mx-auto max-w-6xl space-y-6">
        <header className="flex items-center justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-brand-500">Key City Digital</p>
            <h1 className="text-3xl font-bold">Legend Brief Builder</h1>
            <p className="text-slate-600 dark:text-slate-300">Premium website strategy briefs and polished PDF export for VA execution.</p>
          </div>
          <ThemeToggle />
        </header>

        <div className="grid gap-6 lg:grid-cols-2">
          <BriefForm onGenerated={setBrief} />
          {brief ? (
            <BriefPreview brief={brief} />
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-300 p-8 text-slate-500 dark:border-slate-700">
              Generate a brief to preview strategy, sitemap, and time estimate.
            </div>
          )}
        </div>
      </div>

      <GoogleBusinessResolverOrchestrator />
    </main>
  );
}
