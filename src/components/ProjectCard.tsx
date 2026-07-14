import Link from "next/link";
import Image from "next/image";
import { type Listing, priceText, altFor, foreignerStatus } from "@/lib/listings";
import { type Lang, t, pickListing, lp } from "@/lib/i18n";
import { BedIcon, BathIcon, AreaIcon, PinIcon } from "./Icons";

type Variant = "default" | "featured" | "row";

export default function ProjectCard({
  listing,
  lang,
  variant = "default",
}: {
  listing: Listing;
  lang: Lang;
  variant?: Variant;
}) {
  const d = t(lang).card;
  const { title, description } = pickListing(listing, lang);
  const typeLabel =
    listing.projectType === "subsale"
      ? d.subsale
      : listing.projectType === "rent"
        ? d.rent
        : d.newLaunch;

  const badges = (
    <>
      <span className="rounded-md bg-fire px-2.5 py-1 text-xs font-semibold text-white">
        {typeLabel}
      </span>
      <span className="rounded-md bg-black/50 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur-sm">
        {listing.developer}
      </span>
    </>
  );

  // 只显示有真实数据的规格（导入的新盘多半没有房/卫数）
  const isReal = (v: string) => {
    const s = (v ?? "").trim();
    return !!s && !/enquire|洽询|tbd|待定|n\/?a/i.test(s);
  };
  const specChips = [
    isReal(listing.bedrooms) && (
      <span key="bed" className="flex items-center gap-1.5">
        <BedIcon className="text-faint" /> {listing.bedrooms} {d.beds}
      </span>
    ),
    isReal(listing.bathrooms) && (
      <span key="bath" className="flex items-center gap-1.5">
        <BathIcon className="text-faint" /> {listing.bathrooms} {d.baths}
      </span>
    ),
    // 地皮尺寸优先（有地排屋买家更看这个，例 "20x70"）
    isReal(listing.landSize) && (
      <span key="land" className="flex items-center gap-1.5">
        <AreaIcon className="text-faint" /> {listing.landSize}
        <span className="text-faint">{lang === "zh" ? "地皮" : "land"}</span>
      </span>
    ),
    isReal(listing.sizeSqft) && (
      <span key="area" className="flex items-center gap-1.5">
        <AreaIcon className="text-faint" /> {listing.sizeSqft} sqft
      </span>
    ),
  ].filter(Boolean);

  // 外国人购买资格徽章（🌍 / 🇲🇾，仿 KSL）——盖在图片右上角
  const fstatus = foreignerStatus(listing);
  const foreignBadge = fstatus && (
    <span className="absolute bottom-3 right-3 z-10 rounded-md bg-black/60 px-2 py-1 text-[11px] font-semibold text-white backdrop-blur-sm">
      {fstatus === "foreign"
        ? lang === "zh"
          ? "🌍 外国人可买"
          : "🌍 Foreigner Friendly"
        : lang === "zh"
          ? "🇲🇾 土著保留"
          : "🇲🇾 Bumi Lot"}
    </span>
  );
  const foreignBadgeMini = fstatus && (
    <span
      className="absolute bottom-2 right-2 z-10 rounded-md bg-black/60 px-1.5 py-0.5 text-[11px] backdrop-blur-sm"
      title={fstatus === "foreign" ? "Foreigner friendly" : "Bumi lot"}
    >
      {fstatus === "foreign" ? "🌍" : "🇲🇾"}
    </span>
  );

  const specs = specChips.length > 0 && (
    <div className="mt-auto flex items-center gap-4 border-t border-line pt-4 text-sm text-muted">
      {specChips}
    </div>
  );

  const price = (size: string) => (
    <div className="flex items-baseline gap-1.5">
      <span className={`font-display font-extrabold text-fire ${size}`}>
        {priceText(listing.priceFrom, lang)}
      </span>
      {listing.priceFrom > 0 && (
        <span className="text-sm font-medium text-muted">{d.from}</span>
      )}
    </div>
  );

  const location = (
    <div className="flex items-center gap-1.5 text-sm text-muted">
      <PinIcon className="text-fire" />
      {listing.area}, {listing.city}
    </div>
  );

  // 描述性属性（类型 / 地契 / 预计完工年）—— 用现有真实数据让卡片一眼看到更多
  const typeLabel2: Record<Listing["category"], { en: string; zh: string }> = {
    high_rise: { en: "Serviced apt", zh: "服务式公寓" },
    landed: { en: "Landed", zh: "有地排屋" },
    commercial: { en: "Commercial", zh: "商业店铺" },
  };
  const propType = typeLabel2[listing.category]?.[lang];
  const tenureShort = (() => {
    const tv = (listing.tenure ?? "").trim();
    if (!isReal(tv)) return "";
    const parts = tv.split("/").map((s) => s.trim());
    return parts.length >= 2 ? (lang === "zh" ? parts[1] : parts[0]) : tv;
  })();
  const completion = isReal(listing.builtYear)
    ? lang === "zh"
      ? `${listing.builtYear} 完工`
      : `Ready ${listing.builtYear}`
    : "";
  const metaParts = [propType, tenureShort, completion].filter(Boolean);
  const meta = metaParts.length > 0 && (
    <div className="mt-1.5 text-xs text-muted">{metaParts.join(" · ")}</div>
  );

  // ── List-view row (horizontal, compact) ──
  if (variant === "row") {
    return (
      <Link
        href={lp(lang, `/projects/${listing.slug}`)}
        className="group flex overflow-hidden rounded-xl glass glass-hover transition duration-300"
      >
        <div className="relative aspect-[4/3] w-32 shrink-0 overflow-hidden sm:w-56">
          <Image
            src={listing.images[0]}
            alt={altFor(listing, listing.images[0], lang)}
            fill
            sizes="(max-width: 640px) 33vw, 224px"
            className="object-cover transition duration-700 group-hover:scale-105"
          />
          <span className="absolute left-2 top-2 rounded-md bg-fire px-2 py-0.5 text-[11px] font-semibold text-white">
            {typeLabel}
          </span>
          {foreignBadgeMini}
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-1.5 p-4 sm:p-5">
          <div className="flex items-start justify-between gap-3">
            <h3 className="font-display truncate text-base font-bold text-ink transition group-hover:text-fire sm:text-lg">
              {title}
            </h3>
            <span className="hidden shrink-0 text-xs text-faint sm:block">
              {listing.developer}
            </span>
          </div>
          {location}
          {meta}
          <div className="mt-1">{price("text-xl sm:text-2xl")}</div>
          {specChips.length > 0 && (
            <div className="mt-1 hidden flex-wrap items-center gap-4 text-sm text-muted sm:flex">
              {specChips}
            </div>
          )}
        </div>
      </Link>
    );
  }

  // ── Featured (big, horizontal on desktop) ──
  if (variant === "featured") {
    return (
      <Link
        href={lp(lang, `/projects/${listing.slug}`)}
        className="group flex flex-col overflow-hidden rounded-2xl glass glass-hover transition duration-300 sm:col-span-2 sm:flex-row lg:col-span-3"
      >
        <div className="relative aspect-[16/10] overflow-hidden sm:aspect-auto sm:w-1/2">
          <Image
            src={listing.images[0]}
            alt={altFor(listing, listing.images[0], lang)}
            fill
            sizes="(max-width: 640px) 100vw, 50vw"
            className="object-cover transition duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/45 to-transparent" />
          <div className="absolute left-4 top-4 flex flex-wrap gap-2">{badges}</div>
          {foreignBadge}
        </div>
        <div className="flex flex-1 flex-col p-6 sm:p-8">
          <h3 className="font-display text-2xl font-extrabold leading-tight text-ink transition group-hover:text-fire sm:text-3xl">
            {title}
          </h3>
          <div className="mt-2">{location}</div>
          {meta}
          <p className="mt-4 line-clamp-2 text-sm leading-relaxed text-muted">
            {description}
          </p>
          <div className="mt-6">{price("text-3xl sm:text-4xl")}</div>
          {specs}
        </div>
      </Link>
    );
  }

  // ── Default card ──
  return (
    <Link
      href={lp(lang, `/projects/${listing.slug}`)}
      className="group flex flex-col overflow-hidden rounded-xl glass glass-hover transition duration-300"
    >
      <div className="relative aspect-[16/11] overflow-hidden">
        <Image
          src={listing.images[0]}
          alt={altFor(listing, listing.images[0], lang)}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover transition duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/45 to-transparent" />
        <div className="absolute left-3 top-3 flex flex-wrap gap-2">{badges}</div>
        {foreignBadge}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-display text-lg font-bold leading-snug text-ink transition group-hover:text-fire">
          {title}
        </h3>
        <div className="mt-1.5">{location}</div>
        {meta}
        <div className="mt-4">{price("text-2xl")}</div>
        {specs}
      </div>
    </Link>
  );
}
