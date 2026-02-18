import type { Metadata } from "next";
import "./globals.css";
import Providers from "./providers";

export const metadata: Metadata = {
  title: "KP Astrology — Krishnamurti Paddhati Calculator",
  description:
    "Premium KP Astrology dashboard with birth chart and horary calculations powered by sub-lord theory. Experience precision Jyotish with a modern cosmic interface.",
  keywords: [
    "KP Astrology",
    "Krishnamurti Paddhati",
    "Birth Chart",
    "Horary",
    "Jyotish",
    "Sub Lord",
    "Vimshottari Dasha",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-theme="cosmic" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Playfair+Display:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
