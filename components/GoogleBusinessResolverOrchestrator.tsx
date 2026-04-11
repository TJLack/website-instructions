"use client";

import { useMemo, useState } from "react";
import { BusinessMatchConfirmationCard } from "@/components/BusinessMatchConfirmationCard";
import { BusinessSearchResultsList } from "@/components/BusinessSearchResultsList";
import { ManualBusinessSearchForm } from "@/components/ManualBusinessSearchForm";
import { GoogleBusinessCandidate, ScanData } from "@/lib/googleBusinessTypes";

type ResolveResponse = {
  decision: "high" | "medium" | "low";
  topMatch?: (GoogleBusinessCandidate & { confidence?: { score: number } }) | null;
  candidates?: GoogleBusinessCandidate[];
  identity?: {
    businessName?: string;
    city?: string;
    state?: string;
  };
  message?: string;
};

type SelectedBusiness = {
  resourceName: string;
  name: string;
  address?: string;
};

const demoScanData: ScanData = {
  websiteUrl: "https://www.exampledental.com",
  businessName: "Example Dental",
  city: "Austin",
  state: "TX",
  phoneNumbers: ["(512) 555-1234"],
};

export function GoogleBusinessResolverOrchestrator() {
  const [scanDataText, setScanDataText] = useState(JSON.stringify(demoScanData, null, 2));
  const [isResolving, setIsResolving] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [resolveData, setResolveData] = useState<ResolveResponse | null>(null);
  const [results, setResults] = useState<GoogleBusinessCandidate[]>([]);
  const [selectedBusiness, setSelectedBusiness] = useState<SelectedBusiness | null>(null);

  const initialManualValues = useMemo(
    () => ({
      businessName: resolveData?.identity?.businessName ?? "",
      city: resolveData?.identity?.city ?? "",
      state: resolveData?.identity?.state ?? "",
    }),
    [resolveData],
  );

  async function runAutoResolve() {
    setIsResolving(true);
    setSelectedBusiness(null);
    setStatusMessage(null);
    setResults([]);

    try {
      const scanData = JSON.parse(scanDataText);
      const response = await fetch("/api/google-business/resolve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scanData }),
      });

      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error ?? "Unable to resolve business.");

      setResolveData(payload);
      if (payload.decision === "medium") {
        setResults(payload.candidates ?? []);
      }
      setStatusMessage(payload.message ?? null);
    } catch (error) {
      setStatusMessage(error instanceof Error ? error.message : "Something went wrong.");
      setResolveData({ decision: "low" });
    } finally {
      setIsResolving(false);
    }
  }

  async function handleManualSearch(values: { businessName: string; city: string; state?: string }) {
    setIsSearching(true);
    setStatusMessage(null);

    try {
      const response = await fetch("/api/google-business/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: values.businessName, city: values.city, state: values.state }),
      });

      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error ?? "Unable to search Google businesses.");

      setResults(payload.businesses ?? []);
      if (!(payload.businesses ?? []).length) {
        setStatusMessage("We couldn't find a close result. Please edit and search again.");
      }
    } catch (error) {
      setStatusMessage(error instanceof Error ? error.message : "Search failed.");
    } finally {
      setIsSearching(false);
    }
  }

  async function handleSelectBusiness(resourceName: string) {
    setStatusMessage("Saving your selected business...");
    try {
      const response = await fetch("/api/google-business/details", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ place: resourceName }),
      });

      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error ?? "Unable to load business details.");

      const business = payload.business as GoogleBusinessCandidate;
      setSelectedBusiness({
        resourceName: business.resourceName,
        name: business.name,
        address: business.formattedAddress,
      });
      setStatusMessage("Great — we found the right Google listing and saved it.");
    } catch (error) {
      setStatusMessage(error instanceof Error ? error.message : "Unable to save selected business.");
    }
  }

  return (
    <section className="mx-auto mt-8 max-w-2xl space-y-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:p-6">
      <header>
        <p className="text-sm font-medium text-brand-600">WebsiteLeakDetector.com</p>
        <h2 className="text-2xl font-bold text-slate-900">Google Business Resolver</h2>
        <p className="text-sm text-slate-600">Fast auto-match first. Simple fallback when needed.</p>
      </header>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-slate-700">Website scan data JSON</label>
        <textarea
          value={scanDataText}
          onChange={(event) => setScanDataText(event.target.value)}
          className="h-40 w-full rounded-xl border border-slate-300 bg-white p-3 font-mono text-xs"
        />
        <button
          type="button"
          onClick={runAutoResolve}
          disabled={isResolving}
          className="w-full rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-70"
        >
          {isResolving ? "Checking Google..." : "Run automatic business match"}
        </button>
      </div>

      {resolveData?.decision === "high" && resolveData.topMatch ? (
        <BusinessMatchConfirmationCard
          business={resolveData.topMatch}
          confidenceScore={resolveData.topMatch.confidence?.score ?? 0}
          onConfirm={() => handleSelectBusiness(resolveData.topMatch!.resourceName)}
          onReject={() => setResolveData({ ...resolveData, decision: "low" })}
        />
      ) : null}

      {(resolveData?.decision === "low" || resolveData?.decision === "medium") && (
        <div className="space-y-3">
          <p className="rounded-xl bg-white p-3 text-sm text-slate-700">
            We couldn&apos;t confidently match your business. Let&apos;s find it manually.
          </p>
          <ManualBusinessSearchForm
            loading={isSearching}
            initialValues={initialManualValues}
            onSearch={handleManualSearch}
          />
          <BusinessSearchResultsList results={results} loading={isSearching} onSelect={handleSelectBusiness} />
        </div>
      )}

      {statusMessage ? <p className="text-sm text-slate-700">{statusMessage}</p> : null}

      {selectedBusiness ? (
        <div className="rounded-xl border border-brand-200 bg-brand-50 p-3 text-sm text-brand-900">
          Selected Google business: <strong>{selectedBusiness.name}</strong>
          <br />
          {selectedBusiness.address}
        </div>
      ) : null}
    </section>
  );
}
