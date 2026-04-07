import { generateBrief } from "@/lib/briefGenerator";
import { BriefInput } from "@/lib/types";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const input = (await req.json()) as BriefInput;
    const brief = generateBrief(input);
    return NextResponse.json({ brief });
  } catch (error) {
    return NextResponse.json({ error: "Failed to generate brief." }, { status: 500 });
  }
}
