import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Legend Brief Builder",
  description: "Internal strategy brief and PDF generator for Key City Digital."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
