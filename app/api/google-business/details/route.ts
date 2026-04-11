import { NextRequest, NextResponse } from "next/server";
import { getGoogleBusinessDetails } from "@/lib/googleBusinessResolver";

export async function POST(request: NextRequest) {
  try {
    const { place } = await request.json();

    if (!place || typeof place !== "string") {
      return NextResponse.json({ error: "A place resource is required." }, { status: 400 });
    }

    const business = await getGoogleBusinessDetails(place);
    return NextResponse.json({ business });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to fetch Google business details.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
