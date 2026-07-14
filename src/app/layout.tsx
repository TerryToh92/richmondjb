import type { Metadata } from "next";
import { Geist, Marcellus } from "next/font/google";
import "./globals.css";
import { SITE } from "@/lib/site";
import { getLang } from "@/lib/i18n.server";
import Analytics from "@/components/Analytics";
import AttributionCapture from "@/components/AttributionCapture";
import JsonLd from "@/components/JsonLd";

const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
});

// 展示字：Marcellus —— 与 Richmond logo 的 Trajan 式罗马体同族，全大写也易读
const marcellus = Marcellus({
  variable: "--font-marcellus",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.brand}｜${SITE.tagline}`,
    template: `%s｜${SITE.brand}`,
  },
  description: SITE.description,
  keywords: [
    "Richmond JBCC",
    "Richmond Mayor",
    "Richmond Mayor Mount Austin",
    "Richmond Asia",
    "Johor Bahru hotel suites",
    "新山 酒店式套房",
    "Hyatt Place Johor Bahru",
    "Capri by Fraser Johor Bahru",
    "Frasers Hospitality Richmond Mayor",
    "Mount Austin property",
    "JB Singapore RTS property",
    "新柔捷运 房产",
    "JS-SEZ property",
    "柔新经济特区 房产",
    "freehold Johor Bahru",
    "永久地契 新山",
    "foreigner buy property Johor",
  ],
  alternates: { canonical: SITE.url },
  openGraph: {
    type: "website",
    locale: "zh_MY",
    url: SITE.url,
    siteName: SITE.brand,
    title: `${SITE.brand}｜${SITE.tagline}`,
    description: SITE.description,
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE.brand}｜${SITE.tagline}`,
    description: SITE.description,
  },
  robots: { index: true, follow: true },
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const lang = await getLang();
  const websiteLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE.url}/#website`,
    name: SITE.brand,
    url: SITE.url,
    inLanguage: ["en-MY", "zh-MY"],
    publisher: {
      "@type": "Organization",
      name: SITE.brand,
      url: SITE.url,
      memberOf: { "@type": "Organization", name: SITE.agency.name },
    },
  };
  return (
    <html
      lang={lang === "zh" ? "zh-MY" : "en-MY"}
      className={`${geist.variable} ${marcellus.variable} h-full`}
    >
      <body className="min-h-full flex flex-col bg-bg text-ink">
        <JsonLd data={websiteLd} />
        {children}
        <Analytics />
        <AttributionCapture />
      </body>
    </html>
  );
}
