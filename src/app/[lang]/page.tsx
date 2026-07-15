import Image from "next/image";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton, { FireButton } from "@/components/WhatsAppButton";
import RoundContact from "@/components/RoundContact";
import StickyWhatsApp from "@/components/StickyWhatsApp";
import InquiryForm from "@/components/InquiryForm";
import AwardsCarousel from "@/components/AwardsCarousel";
import JsonLd from "@/components/JsonLd";
import type { Metadata } from "next";
import { CheckIcon, PinIcon, DeedIcon } from "@/components/Icons";
import { SITE } from "@/lib/site";
import { getPublicListings } from "@/lib/data";
import { priceText, altFor } from "@/lib/listings";
import { t, lp, resolveLang, LANGS, pickListing } from "@/lib/i18n";
import { hreflang } from "@/lib/seo";
import { projectExtra, AWARDS } from "@/lib/projectContent";

export function generateStaticParams() {
  return LANGS.map((lang) => ({ lang }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const lang = resolveLang((await params).lang);
  const title = lang === "zh" ? SITE.tagline : SITE.taglineEn;
  const description = lang === "zh" ? SITE.description : SITE.descriptionEn;
  return {
    title,
    description,
    alternates: hreflang("", lang),
  };
}

export default async function Home({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const lang = resolveLang((await params).lang);
  const d = t(lang);
  const zh = lang === "zh";
  const all = await getPublicListings();

  const orgLd = {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    "@id": `${SITE.url}/#org`,
    name: SITE.brand,
    description: SITE.descriptionEn,
    url: SITE.url,
    telephone: "+" + SITE.agent.whatsapp,
    email: SITE.agent.email,
    areaServed: SITE.areaServed.map((a) => ({ "@type": "City", name: a })),
    knowsAbout: [
      "Richmond JBCC Johor Bahru",
      "Richmond Mayor Mount Austin Johor Bahru",
      "freehold hotel-branded residences Johor",
      "Hyatt Place managed suites Johor Bahru",
      "Capri by Fraser Frasers Hospitality Richmond Mayor",
      "JB Singapore RTS Link property",
      "Johor Singapore Special Economic Zone property",
    ],
  };

  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: d.homeFaq.items.map(([q, a]) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: { "@type": "Answer", text: a },
    })),
  };

  return (
    <>
      <JsonLd data={orgLd} />
      <JsonLd data={faqLd} />
      <Header lang={lang} />

      <main className="flex-1">
        {/* ── Hero：官网式全幅项目摄影 + Bebas 大字 ── */}
        <section className="relative isolate flex min-h-[86vh] items-end overflow-hidden">
          <Image
            src="/listings/richmond-jbcc-lobby.webp"
            alt="Richmond JBCC — freehold hotel suites managed by Hyatt Place in the Johor Bahru city centre"
            fill
            priority
            fetchPriority="high"
            unoptimized
            sizes="100vw"
            className="-z-20 object-cover"
          />
          <div className="absolute inset-0 -z-10 bg-gradient-to-t from-bg via-bg/70 to-bg/35" />
          <div className="mx-auto w-full max-w-6xl px-5 pb-14 pt-32 sm:pb-24">
            <p className="reveal reveal-1 kicker">
              <span className="sm:hidden">{d.badge.split(" · ")[0]}</span>
              <span className="hidden sm:inline">{d.badge}</span>
            </p>
            <h1 className={`reveal reveal-2 font-display mt-5 max-w-4xl text-ink ${zh ? "text-[clamp(1.9rem,4.5vw,3.6rem)]" : "text-[clamp(2.1rem,4.8vw,4.2rem)]"}`}>
              {d.hero.pre}
              <span className="text-fire">{d.hero.hi}</span>
              {d.hero.post}
            </h1>
            <p className="reveal reveal-3 mt-6 hidden max-w-2xl text-lg leading-relaxed text-muted sm:block">
              {d.hero.intro}
            </p>
            <div className="reveal reveal-4 mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
              <WhatsAppButton label={d.hero.cta1} message={d.waMsgGeneric} className="w-full justify-center sm:w-auto" />
              <FireButton
                href={lp(lang, "/projects")}
                className="w-full justify-center !bg-transparent !text-ink ring-1 ring-fire/40 hover:!bg-fire/10 sm:w-auto"
              >
                {d.hero.cta2}
              </FireButton>
            </div>
            <div className="reveal reveal-5 mt-7 flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-muted sm:mt-9 sm:gap-x-7 sm:gap-y-2 sm:text-sm">
              {d.hero.trust.map((tx) => (
                <span key={tx} className="flex items-center gap-1.5 sm:gap-2">
                  <CheckIcon className="text-fire" /> {tx}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* ── 授权身份条 ── */}
        <div className="border-y border-line bg-surface/50">
          <p className="mx-auto max-w-4xl px-5 py-4 text-center text-[13px] leading-relaxed text-muted">
            {d.authStrip.text}
          </p>
        </div>

        {/* ── The Collection：两个项目，编辑式交错大区块 ── */}
        <section id="projects" className="mx-auto max-w-6xl px-5 py-20 sm:py-28">
          <div className="max-w-2xl">
            <h2 className="font-display text-[clamp(2rem,4.5vw,3.4rem)] text-ink">
              {d.projects.title}
            </h2>
            <p className="mt-4 text-lg text-muted">{d.projects.sub}</p>
          </div>

          <div className="mt-16 space-y-24 sm:space-y-32">
            {all.map((l, i) => {
              const extra = projectExtra(l.slug);
              const name = (l.titleEn || l.title).split(/[—｜|·]/)[0].trim();
              const flip = i % 2 === 1;
              return (
                <article
                  key={l.slug}
                  className="grid items-center gap-10 lg:grid-cols-12 lg:gap-14"
                >
                  <Link
                    href={lp(lang, `/projects/${l.slug}`)}
                    className={`group relative block aspect-[16/11] overflow-hidden lg:col-span-7 ${flip ? "lg:order-2" : ""}`}
                  >
                    <Image
                      src={l.images[0]}
                      alt={altFor(l, l.images[0], lang)}
                      fill
                      sizes="(max-width: 1024px) 100vw, 58vw"
                      className="object-cover transition duration-700 group-hover:scale-[1.04]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/35 to-transparent" />
                    {extra?.badgeEn && (
                      <span className="absolute left-4 top-4 rounded-sm bg-fire px-3 py-1.5 text-xs font-semibold tracking-[0.12em] text-bg">
                        {zh ? extra.badgeZh : extra.badgeEn}
                      </span>
                    )}
                  </Link>
                  <div className={`lg:col-span-5 ${flip ? "lg:order-1" : ""}`}>
                    <hr className="hairline mb-7 w-20" />
                    <h3 className="font-display text-[clamp(2rem,4vw,3rem)] text-ink">
                      <Link href={lp(lang, `/projects/${l.slug}`)} className="transition hover:text-fire">
                        {name}
                      </Link>
                    </h3>
                    {extra && (
                      <p className="mt-3 text-muted">{zh ? extra.taglineZh : extra.taglineEn}</p>
                    )}
                    <dl className="mt-7 space-y-3 text-sm">
                      <div className="flex items-center gap-3">
                        <PinIcon className="text-fire" />
                        <dd className="text-ink/85">{l.area}, {l.city}</dd>
                      </div>
                      <div className="flex items-center gap-3">
                        <DeedIcon className="text-fire" />
                        <dd className="text-ink/85">{l.tenure.split(" / ")[zh ? 1 : 0] ?? l.tenure}</dd>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-display text-xl text-fire">
                          {priceText(l.priceFrom, lang)}
                        </span>
                        {l.priceFrom > 0 && <span className="text-muted">{d.card.from}</span>}
                      </div>
                    </dl>
                    <ul className="mt-6 space-y-2 text-sm text-muted">
                      {pickListing(l, lang).highlights.slice(0, 3).map((h) => (
                        <li key={h} className="flex gap-2.5">
                          <CheckIcon className="mt-1 shrink-0 text-fire" /> {h}
                        </li>
                      ))}
                    </ul>
                    <div className="mt-8 flex flex-wrap items-center gap-4">
                      <FireButton href={lp(lang, `/projects/${l.slug}`)}>
                        {d.card.viewDetails} →
                      </FireButton>
                      {extra?.tourUrl && (
                        <a
                          href={extra.tourUrl}
                          className="text-sm font-medium text-fire underline underline-offset-4 transition hover:text-ink"
                        >
                          {d.detail.tour} →
                        </a>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        {/* ── About developer（drenched 暗层 + 大图） ── */}
        <section id="about" className="border-y border-line bg-surface/50">
          <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 py-20 sm:py-28 md:grid-cols-2">
            <div className="relative aspect-[4/5] overflow-hidden">
              <Image
                src="/listings/richmond-jbcc-lobby.webp"
                alt="Grand hotel lobby at Richmond JBCC, managed under the Hyatt Place brand"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
            <div>
              <Image
                src="/brand/richmond-asia-logo.svg"
                alt="Richmond Asia Group"
                width={238}
                height={84}
                unoptimized
                className="mb-8 h-12 w-auto opacity-90"
              />
              <h2 className="font-display text-3xl text-ink md:text-4xl">
                {d.about.title}
              </h2>
              <p className="mt-6 leading-relaxed text-muted">{d.about.p1}</p>
              <p className="mt-3 leading-relaxed text-muted">{d.about.p2}</p>
              <dl className="mt-8 divide-y divide-line border-y border-line">
                {d.about.stats.map(([k, v]) => (
                  <div key={k} className="flex items-baseline justify-between gap-6 py-3.5">
                    <dt className="text-sm text-faint">{k}</dt>
                    <dd className="text-right font-medium text-ink">{v}</dd>
                  </div>
                ))}
              </dl>
              <div className="mt-8">
                <WhatsAppButton message={d.waMsgGeneric} label={d.hero.cta1} />
              </div>
            </div>
          </div>
        </section>

        {/* ── 荣誉与奖项（发展商信任层） ── */}
        <section className="mx-auto max-w-6xl px-5 py-20 sm:py-28">
          <div className="max-w-2xl">
            <h2 className="font-display text-3xl text-ink md:text-4xl">{d.awards.title}</h2>
            <p className="mt-4 text-lg text-muted">{d.awards.sub}</p>
          </div>
          <AwardsCarousel
            items={AWARDS.map((a) => ({ img: a.img, label: zh ? a.nameZh : a.nameEn }))}
          />
        </section>

        {/* ── Why + 服务：文字三栏，无卡片 ── */}
        <section id="services" className="border-t border-line">
          <div className="mx-auto max-w-6xl px-5 py-20 sm:py-28">
          <h2 className="font-display max-w-2xl text-3xl text-ink md:text-4xl">{d.why.title}</h2>
          <p className="mt-4 max-w-2xl text-lg text-muted">{d.why.sub}</p>
          <div className="mt-12 grid gap-x-12 gap-y-10 sm:grid-cols-3">
            {d.why.items.map(([title, desc]) => (
              <div key={title} className="border-t border-fire/35 pt-6">
                <h3 className="font-display text-xl text-ink">{title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted">{desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-16 grid gap-x-12 gap-y-8 border-t border-line pt-12 sm:grid-cols-3">
            {d.services.items.map(([title, desc]) => (
              <div key={title}>
                <h3 className="font-semibold text-ink">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{desc}</p>
              </div>
            ))}
          </div>
          </div>
        </section>

        {/* ── FAQ (GEO / AI search + FAQPage schema) ── */}
        <section className="border-t border-line">
          <div className="mx-auto max-w-3xl px-5 py-20 sm:py-28">
            <h2 className="font-display text-3xl text-ink md:text-4xl">{d.homeFaq.title}</h2>
            <p className="mt-4 text-lg text-muted">{d.homeFaq.sub}</p>
            <dl className="mt-12 space-y-8">
              {d.homeFaq.items.map(([q, a]) => (
                <div key={q} className="border-b border-line pb-8">
                  <dt className="font-semibold text-ink">{q}</dt>
                  <dd className="mt-3 max-w-[68ch] text-sm leading-relaxed text-muted">{a}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* ── Contact / Register ── */}
        <section id="contact" className="border-t border-line bg-surface/50">
          <div className="mx-auto max-w-5xl px-5 py-20 sm:py-28">
            <div className="text-center">
              <h2 className="font-display text-3xl text-ink md:text-4xl">
                {d.contact.title}
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-lg text-muted">{d.contact.sub}</p>
            </div>
            <div className="mx-auto mt-12 grid max-w-3xl gap-8 md:grid-cols-2 md:items-start">
              <InquiryForm lang={lang} projects={all.map((l) => ({ slug: l.slug, title: l.titleEn || l.title }))} />
              <div className="glass flex flex-col p-7">
                <div className="flex items-center gap-3">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-fire font-display text-base text-bg">
                    RJ
                  </span>
                  <div className="min-w-0 flex-1">
                    {SITE.agent.name ? (
                      <>
                        <div className="font-semibold leading-tight text-ink">
                          {SITE.agent.name}
                        </div>
                        <div className="truncate text-sm text-muted">{d.agentRole}</div>
                      </>
                    ) : (
                      <div className="font-semibold leading-tight text-ink">{d.agentRole}</div>
                    )}
                  </div>
                  <RoundContact message={d.waMsgGeneric} />
                </div>
                <dl className="mt-6 divide-y divide-line border-t border-line text-sm">
                  {SITE.agent.renNo && (
                    <div className="flex items-center justify-between py-3">
                      <dt className="text-faint">REN</dt>
                      <dd className="font-medium text-ink">{SITE.agent.renNo}</dd>
                    </div>
                  )}
                  <div className="flex items-center justify-between py-3">
                    <dt className="text-faint">{d.footer.agencyLabel}</dt>
                    <dd className="font-medium text-ink">{SITE.developer.name} Group</dd>
                  </div>
                  <div className="flex items-center justify-between py-3">
                    <dt className="text-faint">Richmond JBCC</dt>
                    <dd className="font-medium text-ink">JB City Centre</dd>
                  </div>
                  <div className="flex items-center justify-between py-3">
                    <dt className="text-faint">Richmond Mayor</dt>
                    <dd className="font-medium text-ink">Mount Austin, JB</dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer lang={lang} />
      <StickyWhatsApp
        message={d.waMsgGeneric}
        waLabel={d.sticky.wa}
        callLabel={d.sticky.call}
      />
    </>
  );
}
