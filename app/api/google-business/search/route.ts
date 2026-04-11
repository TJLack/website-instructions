import { NextRequest, NextResponse } from "next/server";
import { searchGoogleBusinesses } from "@/lib/googleBusinessResolver";

export async function POST(request: NextRequest) {
  try {
    const { query, city, state } = await request.json();

    if (!query || typeof query !== "string") {
      return NextResponse.json({ error: "Business name is required." }, { status: 400 });
    }

    const businesses = await searchGoogleBusinesses(query, city, state, 8);
    return NextResponse.json({ businesses });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to search Google businesses.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
