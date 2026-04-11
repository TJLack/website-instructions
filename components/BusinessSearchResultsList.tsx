import { GoogleBusinessCandidate } from "@/lib/googleBusinessTypes";

type BusinessSearchResultsListProps = {
  results: GoogleBusinessCandidate[];
  loading?: boolean;
  onSelect: (resourceName: string) => void;
};

export function BusinessSearchResultsList({ results, loading, onSelect }: BusinessSearchResultsListProps) {
  if (loading) {
    return <p className="text-sm text-slate-500">Searching Google businesses...</p>;
  }

  if (!results.length) {
    return (
      <p className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
        No results yet. Try adjusting business name, city, or state.
      </p>
    );
  }

  return (
    <div className="space-y-2">
      {results.map((result) => (
        <button
          type="button"
          key={result.resourceName}
          onClick={() => onSelect(result.resourceName)}
          className="w-full rounded-xl border border-slate-200 bg-white p-3 text-left shadow-sm hover:border-brand-300"
        >
          <p className="font-semibold text-slate-900">{result.name}</p>
          <p className="text-sm text-slate-700">{result.formattedAddress}</p>
          <p className="mt-1 text-xs text-slate-500">
            {result.primaryTypeDisplayName ?? result.primaryType ?? "Business"}
            {result.rating ? ` · ${result.rating.toFixed(1)}★` : ""}
            {result.userRatingCount ? ` (${result.userRatingCount})` : ""}
          </p>
        </button>
      ))}
    </div>
  );
}
