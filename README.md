# Legend Brief Builder

Legend Brief Builder is a production-ready internal app for Key City Digital that generates SEO + AI-search optimized website build briefs and exports them as polished PDFs.

## Tech Stack
- Next.js (App Router, TypeScript)
- Tailwind CSS
- Node API routes
- Puppeteer PDF generation (from server-rendered HTML template)

## Setup
```bash
npm install
npm run dev
```
Open `http://localhost:3000`.

## Core Features
- Structured business intake dashboard
- Rule-based keyword engine (no external APIs)
- Dynamic sitemap with strict 30-hour cap logic
- Page-by-page VA instruction generator
- AI-search optimization guidance
- Preview panel + one-click PDF download

## Example Test Input
- Business Name: Skyline Roofing Co.
- Industry: Home Services
- Primary City: Austin
- Secondary Cities: Round Rock, Cedar Park
- Services: Roof Repair, Roof Replacement, Storm Damage Restoration
- Unique Selling Points: 24/7 emergency dispatch, drone inspections, lifetime workmanship warranty
- Offers: Free roof inspection
- Website URL: https://example.com
- Competitor URLs: https://competitor1.com, https://competitor2.com
- Brand Tone: Premium and modern
- Contact Info: (555) 201-4455 | hello@skyline.test

## Example Generated Output (Excerpt)
- Primary keyword: `Roof Repair in Austin`
- Total estimated time: `19.5 hours`
- Sitemap: Homepage, About, Main Services, FAQ, Contact, individual service pages + optional pages based on cap
- VA instructions include purpose, sections, copywriting direction, SEO headers, internal links, conversion modules, image guidance, and premium design rules.

## API Endpoints
- `POST /api/generate` → returns brief JSON
- `POST /api/pdf` → returns generated PDF bytes (`application/pdf`)

## Notes
- Time estimator enforces a hard maximum of 30 hours by reducing service scope and optional pages.
- No external API calls are used.
