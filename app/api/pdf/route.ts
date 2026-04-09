import { buildPdfHtml } from "@/templates/pdfTemplate";
import { BriefResult } from "@/lib/types";
import { NextResponse } from "next/server";
import puppeteer from "puppeteer";
import { buildFallbackPdf } from "@/lib/pdfFallback";

export async function POST(req: Request) {
  try {
    const { brief } = (await req.json()) as { brief: BriefResult };
    const html = buildPdfHtml(brief);

    try {
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
    } catch (error) {
      console.warn("Puppeteer PDF failed; using PDFKit fallback.", error);
      const fallbackPdf = await buildFallbackPdf(brief);
      return new Response(fallbackPdf, {
        status: 200,
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": "attachment; filename=legend-brief.pdf",
          "X-PDF-Engine": "pdf-lib-fallback"
        }
      });
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to generate PDF.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
