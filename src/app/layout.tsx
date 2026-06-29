import type { Metadata } from "next";
import "locomotive-scroll/dist/locomotive-scroll.css";
import { SmoothScroll } from "@/components/SmoothScroll";
import "./globals.css";

export const metadata: Metadata = {
  title: "Evolve Up Consulting",
  description:
    "Digitalna agencija za strategiju, performance marketing, SEO, web development i automatizaciju prodaje.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="bs">
      <body>
        <SmoothScroll />
        {children}
      </body>
    </html>
  );
}
