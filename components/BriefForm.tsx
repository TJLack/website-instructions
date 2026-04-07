"use client";

import { useState } from "react";
import { BriefInput, BriefResult } from "@/lib/types";

const industries = ["Home Services", "Legal", "Healthcare", "Finance", "Other"];

const defaultState: BriefInput = {
  businessName: "",
  industry: "Home Services",
  customIndustry: "",
  primaryCity: "",
  secondaryCities: [],
  services: [],
  uniqueSellingPoints: "",
  offers: "",
  websiteUrl: "",
  competitorUrls: [],
  brandTone: "Premium",
  contactInfo: ""
};

export function BriefForm({ onGenerated }: { onGenerated: (brief: BriefResult) => void }) {
  const [form, setForm] = useState(defaultState);
  const [loading, setLoading] = useState(false);

  const update = (key: keyof BriefInput, value: string) => setForm((prev) => ({ ...prev, [key]: value }));

  async function generateBrief() {
    setLoading(true);
    const payload = {
      ...form,
      secondaryCities: form.secondaryCities,
      services: form.services,
      competitorUrls: form.competitorUrls
    };

    const response = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const data = await response.json();
    onGenerated(data.brief);
    setLoading(false);
  }

  return (
    <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <h2 className="text-xl font-semibold">Business Input</h2>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <input className="input" placeholder="Business Name" onChange={(e) => update("businessName", e.target.value)} />
        <select className="input" onChange={(e) => update("industry", e.target.value)}>
          {industries.map((industry) => (
            <option key={industry}>{industry}</option>
          ))}
        </select>
        {form.industry === "Other" && <input className="input" placeholder="Custom Industry" onChange={(e) => update("customIndustry", e.target.value)} />}
        <input className="input" placeholder="Primary City" onChange={(e) => update("primaryCity", e.target.value)} />
        <input className="input" placeholder="Secondary Cities (comma separated)" onChange={(e) => setForm((p) => ({ ...p, secondaryCities: e.target.value.split(",").map((x) => x.trim()).filter(Boolean) }))} />
        <input className="input" placeholder="Services (comma separated)" onChange={(e) => setForm((p) => ({ ...p, services: e.target.value.split(",").map((x) => x.trim()).filter(Boolean) }))} />
        <input className="input" placeholder="Unique Selling Points" onChange={(e) => update("uniqueSellingPoints", e.target.value)} />
        <input className="input" placeholder="Offers (optional)" onChange={(e) => update("offers", e.target.value)} />
        <input className="input" placeholder="Website URL (optional)" onChange={(e) => update("websiteUrl", e.target.value)} />
        <input className="input" placeholder="Competitor URLs (comma separated)" onChange={(e) => setForm((p) => ({ ...p, competitorUrls: e.target.value.split(",").map((x) => x.trim()).filter(Boolean) }))} />
        <input className="input" placeholder="Brand Tone" onChange={(e) => update("brandTone", e.target.value)} />
        <input className="input" placeholder="Contact Info" onChange={(e) => update("contactInfo", e.target.value)} />
      </div>
      <button onClick={generateBrief} className="rounded-xl bg-brand-500 px-4 py-2 font-semibold text-white hover:bg-brand-700" disabled={loading}>
        {loading ? "Generating..." : "Generate Brief"}
      </button>
      <style jsx>{`
        .input {
          border-radius: 0.75rem;
          border: 1px solid rgb(203 213 225);
          background: transparent;
          padding: 0.6rem 0.8rem;
          outline: none;
        }
      `}</style>
    </div>
  );
}
