import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import StickyWhatsApp from "@/components/StickyWhatsApp";
import WhatsAppButton, { FireButton } from "@/components/WhatsAppButton";
import { getPublicListings } from "@/lib/data";
import { priceText, altFor } from "@/lib/listings";
import { t, lp, resolveLang, LANGS, pickListing } from "@/lib/i18n";
import { hreflang } from "@/lib/seo";
import { projectExtra } from "@/lib/projectContent";
import { CheckIcon } from "@/components/Icons";

export function generateStaticParams() {
  return LANGS.map((lang) => ({ lang }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const lang = resolveLang((await params).lang);
  const d = t(lang).projectsPage;
  return {
    title: d.title,
    description: d.sub,
    alternates: hreflang("/projects", lang),
    openGraph: { title: d.title, description: d.sub },
  };
}

export default async function ProjectsPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const lang = resolveLang((await params).lang);
  const root = t(lang);
  const d = root.projectsPage;
  const zh = lang === "zh";
  const listings = await getPublicListings();

  // 对比表（只放两案都有的真实维度）
  const rows: { label: string; values: string[] }[] = [
    {
      label: zh ? "地点" : "Location",
      values: listings.map((l) => `${l.area}, ${l.city}`),
    },
    {
      label: zh ? "地契" : "Tenure",
      values: listings.map((l) => l.tenure.split(" / ")[zh ? 1 : 0] ?? l.tenure),
    },
    {
      label: zh ? "管理" : "Management",
      values: listings.map((l) =>
        l.slug === "richmond-jbcc"
          ? "Hyatt Place (Hyatt Hotels)"
          : "Capri by Fraser (Frasers Hospitality)",
      ),
    },
    {
      label: zh ? "阶段" : "Stage",
      values: listings.map((l) =>
        l.slug === "richmond-mayor"
          ? zh ? "抢先预览 · 预计 2030 年开业" : "Exclusive Preview · opening 2030"
          : zh ? "销售中 · 站内 360° 导览" : "Selling · 360° tour on site",
      ),
    },
    {
      label: zh ? "招牌设施" : "Signature",
      values: listings.map((l) => {
        const e = projectExtra(l.slug);
        return e ? (zh ? e.signatureTitleZh : e.signatureTitleEn) : "—";
      }),
    },
    {
      label: zh ? "起价" : "Price",
      values: listings.map((l) => priceText(l.priceFrom, lang)),
    },
  ];

  return (
    <>
      <Header lang={lang} />
      <main className="flex-1">
        <section className="border-b border-line bg-surface/50">
          <div className="mx-auto max-w-6xl px-5 pb-14 pt-32">
            <h1 className="font-display text-[clamp(2.2rem,5vw,3.6rem)] text-ink">{d.title}</h1>
            <p className="mt-4 max-w-2xl text-lg text-muted">{d.sub}</p>
          </div>
        </section>

        {/* 两个项目：并排编辑式 */}
        <section className="mx-auto max-w-6xl px-5 py-16 sm:py-24">
          <div className="grid gap-12 md:grid-cols-2 md:gap-10">
            {listings.map((l) => {
              const extra = projectExtra(l.slug);
              const name = (l.titleEn || l.title).split(/[—｜|·]/)[0].trim();
              return (
                <article key={l.slug}>
                  <Link
                    href={lp(lang, `/projects/${l.slug}`)}
                    className="group relative block aspect-[16/11] overflow-hidden"
                  >
                    <Image
                      src={l.images[0]}
                      alt={altFor(l, l.images[0], lang)}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover transition duration-700 group-hover:scale-[1.04]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/35 to-transparent" />
                  </Link>
                  <h2 className="font-display mt-7 text-3xl text-ink">
                    <Link href={lp(lang, `/projects/${l.slug}`)} className="transition hover:text-fire">
                      {name}
                    </Link>
                  </h2>
                  {extra && (
                    <p className="mt-2 text-muted">{zh ? extra.taglineZh : extra.taglineEn}</p>
                  )}
                  <ul className="mt-5 space-y-2 text-sm text-muted">
                    {pickListing(l, lang).highlights.slice(0, 3).map((h) => (
                      <li key={h} className="flex gap-2.5">
                        <CheckIcon className="mt-1 shrink-0 text-fire" /> {h}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-7">
                    <FireButton href={lp(lang, `/projects/${l.slug}`)}>
                      {root.card.viewDetails} →
                    </FireButton>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        {/* 对比表 */}
        {listings.length === 2 && (
          <section className="border-t border-line bg-surface/50">
            <div className="mx-auto max-w-6xl px-5 py-16 sm:py-24">
              <h2 className="font-display text-3xl text-ink md:text-4xl">
                {zh ? "两案对比" : "Side by side"}
              </h2>
              <div className="mt-10 overflow-x-auto">
                <table className="w-full min-w-[560px] border-collapse text-sm">
                  <thead>
                    <tr className="border-b border-fire/35 text-left">
                      <th className="py-4 pr-6 font-normal text-faint" />
                      {listings.map((l) => (
                        <th key={l.slug} className="font-display py-4 pr-6 text-lg font-normal text-ink">
                          {(l.titleEn || l.title).split(/[—｜|·]/)[0].trim()}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((r) => (
                      <tr key={r.label} className="border-b border-line align-top">
                        <th className="w-36 py-4 pr-6 text-left font-normal text-faint">{r.label}</th>
                        {r.values.map((v, i) => (
                          <td key={i} className="py-4 pr-6 text-ink/85">{v}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-10">
                <WhatsAppButton label={root.hero.cta1} message={root.waMsgGeneric} />
              </div>
            </div>
          </section>
        )}
      </main>
      <Footer lang={lang} />
      <StickyWhatsApp
        message={root.waMsgGeneric}
        waLabel={root.sticky.wa}
        callLabel={root.sticky.call}
      />
    </>
  );
}
