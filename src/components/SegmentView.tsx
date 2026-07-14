import Link from "next/link";
import Image from "next/image";
import Header from "@/components/Header";
import RoundContact from "@/components/RoundContact";
import Footer from "@/components/Footer";
import ProjectCard from "@/components/ProjectCard";
import WhatsAppButton from "@/components/WhatsAppButton";
import StickyWhatsApp from "@/components/StickyWhatsApp";
import InquiryForm from "@/components/InquiryForm";
import JsonLd from "@/components/JsonLd";
import { CheckIcon } from "@/components/Icons";
import TopRay from "@/components/TopRay";
import { SITE } from "@/lib/site";
import type { Listing } from "@/lib/listings";
import { type Lang, t, lp } from "@/lib/i18n";
import { type SegmentKind, type SegmentCopy } from "@/lib/segments";

const BASE: Record<SegmentKind, string> = {
  area: "/areas",
  developer: "/developers",
  type: "/type",
};

export default function SegmentView({
  kind,
  slug,
  lang,
  copy,
  listings,
  allListings,
  basePath,
  priceFromLabel,
  trust,
  ctaLabel,
  affordability,
  heroImage,
  listingsHeading,
}: {
  kind: SegmentKind;
  slug: string;
  lang: Lang;
  copy: SegmentCopy;
  listings: Listing[];
  allListings: Listing[];
  /** 覆盖面包屑 / canonical 的 URL 前缀（精选落地页用 /lp）。默认依 kind。 */
  basePath?: string;
  /** 首屏起价徽章，例：「公寓 RM232,000 起 · 排屋 RM678,000 起」。不传则不显示。 */
  priceFromLabel?: string;
  /** 首屏信任条短句（持牌 / 公司 / 即时回复 / 不 hard sell）。不传则不显示。 */
  trust?: string[];
  /** 覆盖首屏主 CTA 钮文字（落地页降门槛用）。默认用全站 contact.cta。 */
  ctaLabel?: string;
  /** 月供试算区块（落地页转化钩）。不传则不显示。 */
  affordability?: {
    heading: string;
    note: string;
    cta: string;
    rows: { home: string; monthly: string }[];
  };
  /** 首屏背景大图（落地页用，自动压深色遮罩 + 文字）。不传则维持纯深色 hero。 */
  heroImage?: string;
  /** 项目格子上方的区块标题（落地页用）。不传则只显示数量。 */
  listingsHeading?: string;
}) {
  const root = t(lang);
  const d = root.detail;
  const url = `${SITE.url}${basePath ?? BASE[kind]}/${slug}`;

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: d.home, item: SITE.url },
      { "@type": "ListItem", position: 2, name: d.projects, item: `${SITE.url}/projects` },
      { "@type": "ListItem", position: 3, name: copy.label, item: url },
    ],
  };
  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: copy.faq.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
  const itemListLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: listings.slice(0, 25).map((l, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `${SITE.url}/projects/${l.slug}`,
      name: l.titleEn || l.title,
    })),
  };

  const featured = listings[0];
  const rest = listings.slice(1);
  const onImg = Boolean(heroImage);

  return (
    <>
      <JsonLd data={breadcrumbLd} />
      <JsonLd data={faqLd} />
      <JsonLd data={itemListLd} />
      <Header lang={lang} />

      <main className="flex-1">
        <section className="relative isolate overflow-hidden border-b border-line bg-surface/40">
          {onImg && (
            <>
              <Image
                src={heroImage!}
                alt=""
                fill
                priority
                sizes="100vw"
                className="object-cover object-center"
              />
              {/* 深色遮罩：左/下更暗保证文字对比，右上让项目透出来 = 有图又抢眼 */}
              <div className="absolute inset-0 bg-gradient-to-tr from-black/92 via-black/80 to-black/45" />
            </>
          )}
          <TopRay />
          <div className="relative z-10 mx-auto max-w-6xl px-5 pb-14 pt-28">
            <nav className={`mb-5 text-sm ${onImg ? "text-white/70" : "text-muted"}`}>
              <Link href={lp(lang, "/")} className="hover:text-fire">{d.home}</Link>{" "}/{" "}
              <Link href={lp(lang, "/projects")} className="hover:text-fire">{d.projects}</Link>{" "}/{" "}
              <span className={onImg ? "text-white" : "text-ink"}>{copy.label}</span>
            </nav>
            <h1
              className={`font-display text-balance text-[clamp(2rem,4.5vw,3.25rem)] font-extrabold ${onImg ? "text-white drop-shadow-sm" : "text-ink"}`}
            >
              {copy.h1}
            </h1>
            {priceFromLabel && (
              <div
                className={`mt-4 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-bold ${onImg ? "bg-fire text-white shadow-lg shadow-fire/30" : "bg-fire/10 text-fire ring-1 ring-fire/30"}`}
              >
                {priceFromLabel}
              </div>
            )}
            <p
              className={`mt-4 max-w-2xl text-pretty text-lg leading-relaxed ${onImg ? "text-white/85" : "text-muted"}`}
            >
              {copy.intro}
            </p>
            <div className="mt-6">
              <WhatsAppButton label={ctaLabel ?? root.contact.cta} message={copy.waMsg} />
            </div>
            {trust && trust.length > 0 && (
              <ul
                className={`mt-6 flex flex-wrap gap-x-5 gap-y-2 text-sm ${onImg ? "text-white/80" : "text-muted"}`}
              >
                {trust.map((it) => (
                  <li key={it} className="flex items-center gap-1.5">
                    <CheckIcon className="shrink-0 text-fire" /> {it}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>

        {/* 月供试算 — 打掉「我供得起吗」门槛（落地页转化钩） */}
        {affordability && (
          <section className="border-b border-line bg-surface/40">
            <div className="mx-auto max-w-3xl px-5 py-10">
              <h2 className="font-display text-xl font-extrabold text-ink md:text-2xl">
                {affordability.heading}
              </h2>
              <div className="mt-5 divide-y divide-line overflow-hidden rounded-xl ring-1 ring-line">
                {affordability.rows.map((r) => (
                  <div
                    key={r.home}
                    className="flex items-center justify-between gap-4 bg-bg/40 px-5 py-3.5"
                  >
                    <span className="text-sm font-medium text-ink">{r.home}</span>
                    <span className="font-display text-base font-extrabold text-fire">
                      {r.monthly}
                    </span>
                  </div>
                ))}
              </div>
              <p className="mt-3 text-xs text-faint">{affordability.note}</p>
              <div className="mt-5">
                <WhatsAppButton label={affordability.cta} message={copy.waMsg} />
              </div>
            </div>
          </section>
        )}

        <section className="mx-auto max-w-6xl px-5 py-14">
          {listings.length === 0 ? (
            <p className="text-muted">{root.projectsPage.none}</p>
          ) : (
            <>
              <div className="mb-8">
                {listingsHeading && (
                  <h2 className="font-display text-balance text-2xl font-extrabold text-ink md:text-3xl">
                    {listingsHeading}
                  </h2>
                )}
                <p className="mt-1.5 text-sm text-muted">{root.projectsPage.count(listings.length)}</p>
              </div>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {featured && <ProjectCard listing={featured} lang={lang} variant="featured" />}
                {rest.map((l) => (
                  <ProjectCard key={l.slug} listing={l} lang={lang} />
                ))}
              </div>
            </>
          )}
        </section>

        {/* FAQ — GEO / AI 搜索 + FAQPage schema */}
        <section className="border-y border-line bg-surface/40">
          <div className="mx-auto max-w-3xl px-5 py-16">
            <h2 className="font-display mb-8 text-2xl font-extrabold text-ink md:text-3xl">
              {root.seg.faqTitle}
            </h2>
            <dl className="space-y-5">
              {copy.faq.map((f) => (
                <div key={f.q} className="glass rounded-xl p-5">
                  <dt className="font-display flex gap-2.5 font-bold text-ink">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-fire/15 text-xs font-bold text-fire">
                      ?
                    </span>
                    {f.q}
                  </dt>
                  <dd className="mt-2 pl-7 text-sm leading-relaxed text-muted">{f.a}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        <section className="mx-auto max-w-3xl px-5 py-16">
          <h2 className="font-display mb-2 text-center text-2xl font-extrabold text-ink md:text-3xl">
            {root.contact.title}
          </h2>
          <p className="mx-auto mb-8 max-w-xl text-center text-muted">{root.contact.sub}</p>
          <div className="glass mx-auto mb-6 flex max-w-xl items-center gap-3 rounded-xl p-5">
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-fire font-display text-lg font-extrabold text-white ring-2 ring-fire/40">
              RJ
            </span>
            <div className="min-w-0 flex-1">
              <div className="font-display text-lg font-extrabold leading-tight text-ink">
                {SITE.agent.name}
              </div>
              <div className="truncate text-sm text-muted">{root.agentRole}</div>
            </div>
            <RoundContact message={copy.waMsg} />
          </div>
          <InquiryForm
            lang={lang}
            projects={allListings.map((x) => ({ slug: x.slug, title: x.titleEn || x.title }))}
          />
        </section>
      </main>

      <Footer lang={lang} />
      <StickyWhatsApp message={copy.waMsg} waLabel={root.sticky.wa} callLabel={root.sticky.call} />
    </>
  );
}
