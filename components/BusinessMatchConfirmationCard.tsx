import { GoogleBusinessCandidate } from "@/lib/googleBusinessTypes";

type BusinessMatchConfirmationCardProps = {
  business: GoogleBusinessCandidate;
  confidenceScore: number;
  onConfirm: () => void;
  onReject: () => void;
};

export function BusinessMatchConfirmationCard({
  business,
  confidenceScore,
  onConfirm,
  onReject,
}: BusinessMatchConfirmationCardProps) {
  return (
    <section className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 shadow-sm">
      <p className="text-sm font-semibold text-emerald-700">Found your business on Google</p>
      <h3 className="mt-1 text-lg font-semibold text-slate-900">{business.name}</h3>
      <p className="text-sm text-slate-700">{business.formattedAddress}</p>
      <p className="mt-2 text-sm text-slate-700">
        {business.rating ? `${business.rating.toFixed(1)}★` : "No rating yet"}
        {business.userRatingCount ? ` (${business.userRatingCount} reviews)` : ""}
      </p>
      <p className="mt-1 text-xs text-slate-500">Confidence: {confidenceScore}/100</p>

      <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
        <button
          type="button"
          onClick={onConfirm}
          className="rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700"
        >
          Yes, continue
        </button>
        <button
          type="button"
          onClick={onReject}
          className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
        >
          Not the right business
        </button>
      </div>
    </section>
  );
}
