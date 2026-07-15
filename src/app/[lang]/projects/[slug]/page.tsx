import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import StickyWhatsApp from "@/components/StickyWhatsApp";
import Gallery from "@/components/Gallery";
import RoundContact from "@/components/RoundContact";
import InquiryForm from "@/components/InquiryForm";
import JsonLd from "@/components/JsonLd";
import {
  BedIcon, BathIcon, AreaIcon, DeedIcon, CarIcon,
  CalendarIcon, SofaIcon, ViewIcon, PinIcon, CheckIcon,
} from "@/components/Icons";
import { SITE } from "@/lib/site";
import { priceText, altFor, metaFor } from "@/lib/listings";
import { getListingBySlug, getPublicListings } from "@/lib/data";
import { t, pickListing, lp, resolveLang } from "@/lib/i18n";
import { hreflang } from "@/lib/seo";
import { projectExtra, extraFaq } from "@/lib/projectContent";
import RoiCalculator from "@/components/RoiCalculator";
import YieldCalculator from "@/components/YieldCalculator";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}): Promise<Metadata> {
  const { lang: rawLang, slug } = await params;
  const lang = resolveLang(rawLang);
  const l = await getListingBySlug(slug);
  if (!l) return {};
  const zh = lang === "zh";
  const name = zh ? l.title : l.titleEn || l.title;
  const title =
    l.priceFrom > 0
      ? `${name}｜${priceText(l.priceFrom, lang)} ${zh ? "起" : "From"}`
      : name;
  const desc = zh
    ? `${l.area}，${l.city} · ${l.developer} 项目，授权销售咨询。${(l.description || l.descriptionEn).slice(0, 90)}`
    : `${l.area}, ${l.city} · ${l.developer} project — authorized sales enquiry. ${(l.descriptionEn || l.description).slice(0, 90)}`;
  return {
    title,
    description: desc,
    alternates: hreflang(`/projects/${l.slug}`, lang),
    openGraph: {
      title,
      description: desc,
      images: l.images[0] ? [l.images[0]] : undefined,
    },
  };
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}) {
  const { lang: rawLang, slug } = await params;
  const lang = resolveLang(rawLang);
  const l = await getListingBySlug(slug);
  if (!l) notFound();
  const root = t(lang);
  const d = root.detail;
  const c = pickListing(l, lang);
  const zh = lang === "zh";
  const extra = projectExtra(l.slug);
  const all = await getPublicListings();
  const other = all.find((x) => x.slug !== l.slug);

  // 只显示有真实数据的规格，过滤掉占位（Enquire / 洽询 / TBD / 待定 / 空）
  const isPlaceholder = (v: unknown) => {
    const s = String(v ?? "").trim();
    return !s || /enquire|洽询|tbd|待定|n\/?a/i.test(s);
  };

  // 每张图升级成 ImageObject（带 caption/name），让 Google/AI 更懂图在讲什么
  const imageLd = l.images.map((url) => {
    const m = metaFor(l, url);
    const caption = m?.captionEn || m?.altEn || `${l.titleEn || l.title} — ${l.area}, ${l.city}`;
    return {
      "@type": "ImageObject",
      contentUrl: url,
      url,
      caption,
      name: caption,
      ...(m?.captionZh || m?.altZh
        ? { description: m.captionZh || m.altZh }
        : {}),
    };
  });

  const listingLd = {
    "@context": "https://schema.org",
    "@type": ["Product", "Residence"],
    name: l.titleEn || l.title,
    description: l.descriptionEn || l.description,
    image: imageLd.length ? imageLd : l.images,
    brand: { "@type": "Organization", name: l.developer },
    offers: {
      "@type": "Offer",
      ...(l.priceFrom > 0 ? { price: l.priceFrom } : {}),
      priceCurrency: "MYR",
      availability:
        l.status === "sold" ? "https://schema.org/SoldOut" : "https://schema.org/InStock",
      seller: {
        "@type": "RealEstateAgent",
        name: SITE.agent.name,
        telephone: "+" + SITE.agent.whatsapp,
      },
    },
    areaServed: { "@type": "City", name: l.city },
  };

  // 每项目专属 FAQPage —— 两项目站吃 GEO 的主力
  const faqItems = extra ? extraFaq(extra, lang) : [];
  const faqLd = faqItems.length
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faqItems.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      }
    : null;

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: d.home, item: `${SITE.url}/${lang}` },
      { "@type": "ListItem", position: 2, name: d.projects, item: `${SITE.url}/${lang}/projects` },
      { "@type": "ListItem", position: 3, name: l.titleEn || l.title, item: `${SITE.url}/${lang}/projects/${l.slug}` },
    ],
  };

  // 干净的项目名当 automation 触发词（取分隔符前段，如 "Richmond Estelar"）
  const projectName = (l.titleEn || l.title).split(/[—｜|·]/)[0].trim();
  const waMsg = zh
    ? `[${projectName}] 你好，我对这个项目有兴趣，想了解更多（价格 / 看房）。`
    : `[${projectName}] Hi, I'm interested in this project — could you share more (price / viewing)?`;

  const specGrid = (
    [
      [<BedIcon key="i" />, d.specs.beds, l.bedrooms],
      [<BathIcon key="i" />, d.specs.baths, l.bathrooms],
      [<AreaIcon key="i" />, d.specs.size, l.sizeSqft ? `${l.sizeSqft} sqft` : ""],
      [<DeedIcon key="i" />, d.specs.tenure, l.tenure],
      [<CalendarIcon key="i" />, d.specs.built, l.builtYear],
      [<CarIcon key="i" />, d.specs.parking, l.parking],
      [<SofaIcon key="i" />, d.specs.furnishing, l.furnishing],
      [<ViewIcon key="i" />, d.specs.view, l.facing],
    ] as const
  ).filter(([, , v]) => !isPlaceholder(v));

  const anchors: [string, string][] = [
    ["#overview", d.about],
    ...(extra?.invest || extra?.targetYield
      ? ([["#invest", d.invest]] as [string, string][])
      : []),
    ...(extra?.layouts?.length ? ([["#layouts", d.layouts]] as [string, string][]) : []),
    ["#facilities", d.facilities],
    ["#location", d.location],
    ["#gallery", d.gallery],
    ["#register", d.register],
  ];

  return (
    <>
      <JsonLd data={listingLd} />
      {faqLd && <JsonLd data={faqLd} />}
      <JsonLd data={breadcrumbLd} />
      <Header lang={lang} />

      <main className="flex-1">
        {/* ── Hero：官网式全幅 + 项目名 + tagline ── */}
        <section className="relative isolate flex min-h-[82vh] items-end overflow-hidden">
          <Image
            src={l.images[0]}
            alt={altFor(l, l.images[0], lang)}
            fill priority sizes="100vw"
            className="-z-20 object-cover"
          />
          <div className="absolute inset-0 -z-10 bg-gradient-to-t from-bg via-bg/70 to-bg/35" />
          <div className="mx-auto w-full max-w-6xl px-5 pb-14 pt-36">
            <nav className="mb-6 text-sm text-muted">
              <Link href={lp(lang, "/")} className="hover:text-ink">{d.home}</Link>{" "}/{" "}
              <Link href={lp(lang, "/projects")} className="hover:text-ink">{d.projects}</Link>
            </nav>
            <p className="kicker">
              {l.developer}
              {extra?.badgeEn && (
                <span className="ml-3 inline-block rounded-sm bg-fire px-2.5 py-1 text-[11px] font-semibold tracking-[0.14em] text-bg">
                  {zh ? extra.badgeZh : extra.badgeEn}
                </span>
              )}
            </p>
            <h1 className="font-display mt-3 max-w-4xl text-[clamp(2.3rem,5.5vw,4.5rem)] text-ink">
              {projectName}
            </h1>
            {extra && (
              <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted">
                {zh ? extra.taglineZh : extra.taglineEn}
              </p>
            )}
            <div className="mt-6 flex flex-wrap items-center gap-x-8 gap-y-3 text-sm text-ink/90">
              <span className="flex items-center gap-2">
                <PinIcon className="text-fire" /> {l.area}, {l.city}
              </span>
              <span className="flex items-center gap-2">
                <DeedIcon className="text-fire" /> {l.tenure.split(" / ")[zh ? 1 : 0] ?? l.tenure}
              </span>
              <span className="font-display text-2xl text-fire">
                {priceText(l.priceFrom, lang)}
                {l.priceFrom > 0 && (
                  <span className="ml-2 font-sans text-sm font-medium text-muted">{d.from}</span>
                )}
              </span>
            </div>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <WhatsAppButton label={d.enquireBtn} message={waMsg} className="justify-center" />
              {extra?.tourUrl && (
                <a
                  href={extra.tourUrl}
                  className="inline-flex items-center justify-center gap-2 rounded-sm px-7 py-3.5 text-[15px] font-semibold text-ink ring-1 ring-fire/45 transition hover:bg-fire/10"
                >
                  {d.tour} →
                </a>
              )}
            </div>
          </div>
        </section>

        {/* ── 锚点导航（官网 OVERVIEW/GALLERY 式） ── */}
        <nav className="sticky top-[57px] z-20 border-y border-line bg-bg/90 backdrop-blur-sm">
          <div className="mx-auto flex max-w-6xl gap-7 overflow-x-auto px-5 py-3 text-[13px] font-medium uppercase tracking-[0.14em] text-muted">
            {anchors.map(([href, label]) => (
              <a key={href} href={href} className="shrink-0 whitespace-nowrap transition hover:text-fire">
                {label}
              </a>
            ))}
          </div>
        </nav>

        {/* ── Overview ── */}
        <section id="overview" className="mx-auto max-w-6xl scroll-mt-28 px-5 py-16 sm:py-24">
          <div className="grid gap-12 lg:grid-cols-5">
            <div className="lg:col-span-3">
              <h2 className="font-display text-3xl text-ink md:text-4xl">{d.about}</h2>
              <p className="mt-6 max-w-[68ch] leading-relaxed text-ink/85">{c.description}</p>
              <ul className="mt-10 grid gap-3.5 sm:grid-cols-2">
                {c.highlights.map((h) => (
                  <li key={h} className="flex gap-3 text-ink/85">
                    <CheckIcon className="mt-1.5 shrink-0 text-fire" />
                    {h}
                  </li>
                ))}
              </ul>
            </div>
            <div className="lg:col-span-2">
              {specGrid.length > 0 && (
                <dl className="divide-y divide-line border-y border-line">
                  {specGrid.map(([icon, k, v]) => (
                    <div key={k} className="flex items-center gap-4 py-4">
                      <span className="text-fire">{icon}</span>
                      <dt className="w-28 shrink-0 text-sm text-faint">{k}</dt>
                      <dd className="font-medium text-ink">{v}</dd>
                    </div>
                  ))}
                </dl>
              )}
              {l.kpkt.filled && (
                <div className="mt-8 border border-line p-5 text-sm">
                  <div className="font-semibold text-ink">{d.kpktTitle}</div>
                  <dl className="mt-4 space-y-2.5">
                    {[
                      [d.kpkt.license, l.kpkt.developerLicenseNo],
                      [d.kpkt.permit, l.kpkt.adPermitNo],
                      [d.kpkt.valid, l.kpkt.validUntil],
                    ]
                      .filter(([, v]) => (v ?? "").trim())
                      .map(([k, v]) => (
                        <div key={k} className="flex justify-between gap-4">
                          <dt className="text-faint">{k}</dt>
                          <dd className="font-medium text-ink">{v}</dd>
                        </div>
                      ))}
                  </dl>
                  <p className="mt-3 text-xs text-faint">
                    {d.kpktVerify}{" "}
                    <a
                      href="https://teduh.kpkt.gov.my"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-fire underline underline-offset-2 hover:text-ink"
                    >
                      teduh.kpkt.gov.my
                    </a>
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* ── 投资回报（GRR / 目标回酬示算 · 成交名单工具） ── */}
        {(extra?.invest || extra?.targetYield) && (
          <section id="invest" className="border-y border-line bg-surface/50">
            <div className="mx-auto max-w-4xl scroll-mt-28 px-5 py-16 sm:py-24">
              <h2 className="font-display text-3xl text-ink md:text-4xl">{d.invest}</h2>
              <div className="mt-10">
                {extra?.invest ? (
                  <RoiCalculator
                    lang={lang}
                    projectName={projectName}
                    invest={extra.invest}
                    minPrice={l.priceFrom > 0 ? l.priceFrom : 900000}
                  />
                ) : (
                  extra?.targetYield && (
                    <YieldCalculator
                      lang={lang}
                      projectName={projectName}
                      scheme={extra.targetYield}
                    />
                  )
                )}
              </div>
            </div>
          </section>
        )}

        {/* ── 户型图（Layout Plans） ── */}
        {extra?.layouts && extra.layouts.length > 0 && (
          <section id="layouts" className="border-y border-line bg-surface/50">
            <div className="mx-auto max-w-6xl scroll-mt-28 px-5 py-16 sm:py-24">
              <h2 className="font-display text-3xl text-ink md:text-4xl">{d.layouts}</h2>
              <div className="mt-10 grid gap-10 sm:grid-cols-2">
                {extra.layouts.map((p) => (
                  <figure key={p.img}>
                    <div className="relative aspect-[5/4] overflow-hidden bg-white">
                      <Image
                        src={p.img}
                        alt={`${projectName} ${zh ? p.nameZh : p.nameEn} — ${p.size}`}
                        fill
                        sizes="(max-width: 640px) 100vw, 50vw"
                        className="object-contain"
                      />
                    </div>
                    <figcaption className="mt-4 flex items-baseline justify-between gap-4 border-b border-line pb-4">
                      <span className="font-display text-xl text-ink">{zh ? p.nameZh : p.nameEn}</span>
                      {p.size && <span className="shrink-0 text-fire">{p.size}</span>}
                    </figcaption>
                  </figure>
                ))}
              </div>
              <p className="mt-8 text-sm text-muted">{d.enquireNote}</p>
            </div>
          </section>
        )}

        {/* ── 招牌特色（全幅编辑式） ── */}
        {extra && l.images[1] && (
          <section className="relative isolate overflow-hidden">
            <Image
              src={l.images[1]}
              alt={altFor(l, l.images[1], lang)}
              fill sizes="100vw"
              className="-z-20 object-cover"
            />
            <div className="absolute inset-0 -z-10 bg-bg/72" />
            <div className="mx-auto max-w-6xl px-5 py-24 sm:py-36">
              <div className="max-w-xl">
                <hr className="hairline mb-8 w-24 !bg-none bg-fire/60" />
                <h2 className="font-display text-3xl text-ink md:text-5xl">
                  {zh ? extra.signatureTitleZh : extra.signatureTitleEn}
                </h2>
                <p className="mt-6 leading-relaxed text-ink/85">
                  {zh ? extra.signatureBodyZh : extra.signatureBodyEn}
                </p>
                {extra.partnerLogos && extra.partnerLogos.length > 0 && (
                  <div className="mt-9 flex items-center gap-8 border-t border-ink/15 pt-7">
                    {extra.partnerLogos.map((pl) => (
                      <Image
                        key={pl.img}
                        src={pl.img}
                        alt={pl.alt}
                        width={110}
                        height={74}
                        unoptimized
                        className="h-16 w-auto opacity-90"
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

        {/* ── Facilities ── */}
        <section id="facilities" className="mx-auto max-w-6xl scroll-mt-28 px-5 py-16 sm:py-24">
          <h2 className="font-display text-3xl text-ink md:text-4xl">{d.facilities}</h2>
          <ul className="mt-8 grid gap-x-10 gap-y-4 sm:grid-cols-2 lg:grid-cols-3">
            {c.amenities.map((a) => (
              <li key={a} className="flex items-center gap-3 border-b border-line pb-4 text-ink/85">
                <CheckIcon className="shrink-0 text-fire" /> {a}
              </li>
            ))}
          </ul>
        </section>

        {/* ── Location & 周边（官网距离数据） ── */}
        {extra && (
          <section id="location" className="border-y border-line bg-surface/50">
            <div className="mx-auto max-w-6xl scroll-mt-28 px-5 py-16 sm:py-24">
              <h2 className="font-display text-3xl text-ink md:text-4xl">{d.location}</h2>
              <p className="mt-3 text-lg text-muted">
                {zh ? extra.nearbyTitleZh : extra.nearbyTitleEn}
              </p>
              <div className="mt-10 grid gap-12 lg:grid-cols-2 lg:items-start">
                <dl>
                  {extra.nearby.map((n) => (
                    <div
                      key={n.nameEn}
                      className="flex items-baseline justify-between gap-4 border-b border-line py-4"
                    >
                      <dt className="text-ink/85">{zh ? n.nameZh : n.nameEn}</dt>
                      <dd className="shrink-0 font-display text-lg text-fire">{n.dist}</dd>
                    </div>
                  ))}
                </dl>
                {extra.mapQuery && (
                  <div>
                    <iframe
                      src={`https://maps.google.com/maps?q=${encodeURIComponent(extra.mapQuery)}&z=15&output=embed`}
                      title={`${projectName} — Google Maps`}
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      allowFullScreen
                      className="aspect-[4/3] w-full border border-line"
                    />
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(extra.mapQuery)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 inline-block text-sm text-fire underline underline-offset-4 transition hover:text-ink"
                    >
                      {zh ? "在 Google Maps 打开 →" : "Open in Google Maps →"}
                    </a>
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

        {/* ── Gallery ── */}
        <section id="gallery" className="mx-auto max-w-6xl scroll-mt-28 px-5 py-16 sm:py-24">
          <h2 className="font-display mb-10 text-3xl text-ink md:text-4xl">{d.galleryTitle}</h2>
          <Gallery
            images={l.images}
            alt={`${l.titleEn || l.title} — ${[l.area, l.city].filter(Boolean).join(", ")}`}
            alts={l.images.map((url) => altFor(l, url, lang))}
            labels={root.lightbox}
          />
        </section>

        {/* ── FAQ（FAQPage schema · GEO 主力） ── */}
        {faqItems.length > 0 && (
          <section className="mx-auto max-w-3xl px-5 pb-16 sm:pb-24">
            <h2 className="font-display text-3xl text-ink md:text-4xl">{d.faqTitle}</h2>
            <dl className="mt-10 space-y-8">
              {faqItems.map((f) => (
                <div key={f.q} className="border-b border-line pb-8">
                  <dt className="font-semibold text-ink">{f.q}</dt>
                  <dd className="mt-3 max-w-[68ch] text-sm leading-relaxed text-muted">{f.a}</dd>
                </div>
              ))}
            </dl>
          </section>
        )}

        {/* ── Register Your Interest ── */}
        <section id="register" className="border-t border-line bg-surface/50">
          <div className="mx-auto max-w-5xl scroll-mt-28 px-5 py-16 sm:py-24">
            <div className="text-center">
              <h2 className="font-display text-3xl text-ink md:text-4xl">{d.register}</h2>
              <p className="mx-auto mt-4 max-w-xl text-muted">{d.registerSub}</p>
            </div>
            <div className="mx-auto mt-12 grid max-w-3xl gap-8 md:grid-cols-2 md:items-start">
              <InquiryForm
                lang={lang}
                defaultProject={l.slug}
                projects={all.map((x) => ({ slug: x.slug, title: x.titleEn || x.title }))}
              />
              <div className="glass flex flex-col p-7">
                <div className="flex items-center gap-3">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-fire font-display text-base text-bg">
                    RJ
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="font-semibold leading-tight text-ink">{SITE.agent.name}</div>
                    <div className="truncate text-xs text-muted">{d.agentLabel}</div>
                  </div>
                  <RoundContact message={waMsg} />
                </div>
                <div className="mt-6">
                  <WhatsAppButton label={d.enquireBtn} message={waMsg} className="w-full justify-center" />
                </div>
                <p className="mt-3 text-center text-xs text-muted">{d.enquireNote}</p>
                {other && (
                  <Link
                    href={lp(lang, `/projects/${other.slug}`)}
                    className="mt-6 border-t border-line pt-5 text-sm text-muted transition hover:text-fire"
                  >
                    {d.otherProject}: <span className="font-medium">{(other.titleEn || other.title).split(/[—｜|·]/)[0].trim()}</span> →
                  </Link>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer lang={lang} />
      <StickyWhatsApp
        message={waMsg}
        waLabel={root.sticky.wa}
        callLabel={root.sticky.call}
      />
    </>
  );
}
