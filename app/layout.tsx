import type { Metadata } from "next";
import "./globals.css";
import Providers from "./providers";

export const metadata: Metadata = {
  title: "PanAstro — Professional KP Astrology System",
  description:
    "Premium KP Astrology system with high-precision birth chart and horary calculations. Experience traditional sub-lord theory with a modern editorial interface.",
  keywords: [
    "PanAstro",
    "KP Astrology",
    "Krishnamurti Paddhati",
    "Precision Astrology",
    "Birth Chart",
    "Horary",
    "Sub Lord",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
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
