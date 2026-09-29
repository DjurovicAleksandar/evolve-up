import type { Metadata } from "next";
import "@fontsource-variable/space-grotesk/index.css";
import "@fontsource-variable/archivo/index.css";
import "@fontsource-variable/jetbrains-mono/index.css";
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
