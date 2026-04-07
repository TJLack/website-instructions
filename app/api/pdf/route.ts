import { buildPdfHtml } from "@/templates/pdfTemplate";
import { BriefResult } from "@/lib/types";
import { NextResponse } from "next/server";
import puppeteer from "puppeteer";

export async function POST(req: Request) {
  try {
    const { brief } = (await req.json()) as { brief: BriefResult };
    const html = buildPdfHtml(brief);

    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"]
    });
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle0" });
    const pdfBuffer = await page.pdf({ format: "A4", printBackground: true });
    await browser.close();

    return new Response(Buffer.from(pdfBuffer), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": "attachment; filename=legend-brief.pdf"
      }
    });
  } catch {
    return NextResponse.json({ error: "Failed to generate PDF." }, { status: 500 });
  }
}
