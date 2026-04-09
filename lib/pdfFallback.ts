import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { BriefResult } from "./types";

function drawWrappedLines(
  page: import("pdf-lib").PDFPage,
  text: string,
  options: {
    x: number;
    y: number;
    maxWidth: number;
    lineHeight: number;
    font: import("pdf-lib").PDFFont;
    size: number;
    color?: import("pdf-lib").RGB;
  }
) {
  const words = text.split(/\s+/);
  let line = "";
  let cursorY = options.y;

  for (const word of words) {
    const testLine = line ? `${line} ${word}` : word;
    const width = options.font.widthOfTextAtSize(testLine, options.size);
    if (width > options.maxWidth && line) {
      page.drawText(line, {
        x: options.x,
        y: cursorY,
        size: options.size,
        font: options.font,
        color: options.color || rgb(0.12, 0.12, 0.12)
      });
      line = word;
      cursorY -= options.lineHeight;
    } else {
      line = testLine;
    }
  }

  if (line) {
    page.drawText(line, {
      x: options.x,
      y: cursorY,
      size: options.size,
      font: options.font,
      color: options.color || rgb(0.12, 0.12, 0.12)
    });
    cursorY -= options.lineHeight;
  }

  return cursorY;
}

export async function buildFallbackPdf(result: BriefResult) {
  const doc = await PDFDocument.create();
  const bold = await doc.embedFont(StandardFonts.HelveticaBold);
  const regular = await doc.embedFont(StandardFonts.Helvetica);

  const margin = 42;
  const width = 595.28;
  const height = 841.89;

  let page = doc.addPage([width, height]);
  let y = height - margin;

  const addHeading = (text: string) => {
    page.drawText(text, { x: margin, y, font: bold, size: 16, color: rgb(0.05, 0.09, 0.2) });
    y -= 24;
  };

  const addParagraph = (text: string, size = 11) => {
    y = drawWrappedLines(page, text, {
      x: margin,
      y,
      maxWidth: width - margin * 2,
      lineHeight: 15,
      font: regular,
      size
    });
    y -= 6;
  };

  const addBullets = (items: string[]) => {
    items.forEach((item) => addParagraph(`• ${item}`));
  };

  addHeading("Legend Brief Builder");
  addParagraph("Prepared by Key City Digital", 12);
  addParagraph(`Business: ${result.meta.businessName}`);
  addParagraph(`Industry: ${result.meta.industry}`);
  addParagraph(`City: ${result.meta.city}`);
  addParagraph(`Date: ${new Date(result.meta.generatedAt).toLocaleDateString()}`);

  addHeading("Executive Summary");
  addParagraph(result.executiveSummary);

  addHeading("Website Goals");
  addBullets(result.goals);

  addHeading("Keyword Strategy");
  addParagraph(`Primary Keyword: ${result.keywordStrategy.primaryKeyword}`);
  addBullets(result.keywordStrategy.secondaryKeywords.slice(0, 8));

  page = doc.addPage([width, height]);
  y = height - margin;

  addHeading("Sitemap");
  addBullets(result.sitemap);

  addHeading("VA Instructions (Top Pages)");
  result.vaInstructions.slice(0, 4).forEach((instruction) => {
    if (y < 140) {
      page = doc.addPage([width, height]);
      y = height - margin;
    }
    page.drawText(instruction.page, { x: margin, y, font: bold, size: 13 });
    y -= 18;
    addParagraph(`Purpose: ${instruction.purpose}`);
    addBullets(instruction.sections.slice(0, 4));
  });

  addHeading("AI Search Optimization");
  addBullets(result.aiSearchOptimization);

  addHeading("Time Estimate");
  addParagraph(`Total Estimated Time: ${result.timeEstimate.totalHours.toFixed(1)} hours`);
  addBullets(result.timeEstimate.breakdown.map((row) => `${row.item}: ${row.hours} hrs`));

  return Buffer.from(await doc.save());
}
