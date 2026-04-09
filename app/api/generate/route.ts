import { generateBrief } from "@/lib/briefGenerator";
import { sanitizeInput, validateInput } from "@/lib/validation";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const rawInput = await req.json();
    const input = sanitizeInput(rawInput);
    const validation = validateInput(input);

    if (!validation.valid) {
      return NextResponse.json({ error: "Validation failed", issues: validation.issues }, { status: 400 });
    }

    const brief = generateBrief(input);
    return NextResponse.json({ brief });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to generate brief.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
