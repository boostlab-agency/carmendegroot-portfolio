import type { Metadata, Viewport } from "next";
import { Instrument_Serif, Inter_Tight } from "next/font/google";
import { SITE_URL } from "@/lib/env";
import { getSiteSettings } from "@/lib/data";
import "./globals.css";

const sans = Inter_Tight({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const serif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-serif",
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  return {
    metadataBase: new URL(SITE_URL),
    title: { default: settings.siteTitle, template: `%s — ${settings.siteName}` },
    description: settings.siteDescription,
    keywords: settings.keywords.split(",").map((k) => k.trim()).filter(Boolean),
    authors: [{ name: settings.siteName, url: SITE_URL }],
    creator: settings.siteName,
    applicationName: settings.siteName,
    formatDetection: { telephone: false },
    alternates: { canonical: SITE_URL },
    openGraph: {
      type: "website",
      locale: "nl_NL",
      url: SITE_URL,
      siteName: settings.siteName,
      title: settings.siteTitle,
      description: settings.siteDescription,
    },
    twitter: { card: "summary_large_image", title: settings.siteTitle, description: settings.siteDescription },
    robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large" } },
  };
}

export const viewport: Viewport = {
  themeColor: "#F6F5F0",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="nl" className={`${sans.variable} ${serif.variable}`} suppressHydrationWarning>
      <head>
        {/* Enables progressive scroll-reveal; without JS all content is simply visible. */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
