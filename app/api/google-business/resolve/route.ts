import { NextRequest, NextResponse } from "next/server";
import {
  extractBusinessIdentityFromScan,
  rankCandidates,
  searchGoogleBusinesses,
} from "@/lib/googleBusinessResolver";
import { ScanData } from "@/lib/googleBusinessTypes";

export async function POST(request: NextRequest) {
  try {
    const { scanData } = (await request.json()) as { scanData: ScanData };

    if (!scanData) {
      return NextResponse.json({ error: "scanData is required." }, { status: 400 });
    }

    const identity = extractBusinessIdentityFromScan(scanData);
    if (!identity.businessName) {
      return NextResponse.json({
        identity,
        decision: "low",
        candidates: [],
        message: "We couldn't confidently match your business. Let's find it manually.",
      });
    }

    const candidates = await searchGoogleBusinesses(identity.businessName, identity.city, identity.state, 6);
    const ranked = rankCandidates(identity, candidates);
    const top = ranked[0];

    const decision = top?.confidence.decision ?? "low";

    return NextResponse.json({
      identity,
      decision,
      topMatch: top,
      candidates: decision === "medium" ? ranked.slice(0, 3) : ranked,
      message:
        decision === "high"
          ? "Found your business on Google"
          : "We couldn't confidently match your business. Let's find it manually.",
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to resolve business.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
