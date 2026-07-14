import type { Metadata } from "next";
import { notFound } from "next/navigation";
import SegmentView from "@/components/SegmentView";
import { getPublicListings } from "@/lib/data";
import { resolveLang } from "@/lib/i18n";
import { hreflang } from "@/lib/seo";
import {
  landingAffordability,
  landingCopy,
  landingCta,
  landingDef,
  landingListings,
  landingPriceBadge,
  landingTrust,
} from "@/lib/landingPages";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}): Promise<Metadata> {
  const { lang: rawLang, slug } = await params;
  const lang = resolveLang(rawLang);
  const def = landingDef(slug);
  if (!def) return {};
  const all = await getPublicListings();
  const matched = landingListings(all, def);
  if (matched.length === 0) return {};
  const copy = landingCopy(slug, matched, lang);
  return {
    title: copy.metaTitle,
    description: copy.metaDesc,
    alternates: hreflang(`/lp/${slug}`, lang),
    openGraph: { title: copy.metaTitle, description: copy.metaDesc },
    // 纯广告落地页：noindex 避免跟自动 segment 页自我竞争（keyword cannibalization）；
    // follow 保留，让内链权重还能流给项目详情页。
    robots: { index: false, follow: true },
  };
}

export default async function LandingPage({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}) {
  const { lang: rawLang, slug } = await params;
  const lang = resolveLang(rawLang);
  const def = landingDef(slug);
  if (!def) notFound();
  const all = await getPublicListings();
  const matched = landingListings(all, def);
  if (matched.length === 0) notFound();
  const copy = landingCopy(slug, matched, lang);

  return (
    <SegmentView
      kind="area"
      slug={slug}
      basePath="/lp"
      lang={lang}
      copy={copy}
      listings={matched}
      allListings={all}
      priceFromLabel={landingPriceBadge(matched, lang)}
      trust={landingTrust(lang)}
      ctaLabel={landingCta(lang)}
      affordability={landingAffordability(matched, lang) ?? undefined}
      heroImage={matched[0]?.images?.[0]}
      listingsHeading={
        lang === "zh" ? "精选项目 · Ulu Tiram 及周边" : "Handpicked homes — Ulu Tiram & nearby"
      }
    />
  );
}
