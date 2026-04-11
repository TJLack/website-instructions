"use client";

import { FormEvent, useState } from "react";

type ManualBusinessSearchFormProps = {
  loading?: boolean;
  initialValues?: {
    businessName?: string;
    city?: string;
    state?: string;
  };
  onSearch: (values: { businessName: string; city: string; state?: string }) => Promise<void>;
};

export function ManualBusinessSearchForm({ loading, initialValues, onSearch }: ManualBusinessSearchFormProps) {
  const [businessName, setBusinessName] = useState(initialValues?.businessName ?? "");
  const [city, setCity] = useState(initialValues?.city ?? "");
  const [state, setState] = useState(initialValues?.state ?? "");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await onSearch({ businessName, city, state });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <h3 className="text-lg font-semibold text-slate-900">Find your business on Google</h3>
      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">Business Name</label>
        <input
          required
          value={businessName}
          onChange={(event) => setBusinessName(event.target.value)}
          className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
          placeholder="Acme Dental"
        />
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">City</label>
          <input
            required
            value={city}
            onChange={(event) => setCity(event.target.value)}
            className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
            placeholder="Austin"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">State (optional)</label>
          <input
            value={state}
            onChange={(event) => setState(event.target.value)}
            className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
            placeholder="TX"
          />
        </div>
      </div>
      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-xl bg-brand-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {loading ? "Searching..." : "Search Google"}
      </button>
    </form>
  );
}
