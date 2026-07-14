/**
 * 分面 / Segment landing pages —— 既是 SEO 分面页，也是 SEM 广告落地页。
 * 数据驱动：同一份 Supabase 房源，按 地区 / 发展商 / 类型 切出独立 URL。
 *   /areas/[area]        例 /areas/johor-bahru-ciq
 *   /developers/[dev]    例 /developers/ksl-holdings-berhad
 *   /type/[category]     例 /type/condos | /type/landed | /type/commercial
 */
import type { Listing } from "./listings";
import { formatPrice } from "./listings";
import type { Lang } from "./i18n";

export type SegmentKind = "area" | "developer" | "type";

export function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/* ---- 类型(category) 的友好 slug 与双语标签 ---- */
const TYPE_SLUG: Record<string, string> = {
  high_rise: "condos",
  landed: "landed",
  commercial: "commercial",
};
const TYPE_FROM_SLUG: Record<string, Listing["category"]> = {
  condos: "high_rise",
  landed: "landed",
  commercial: "commercial",
};
const TYPE_LABEL: Record<string, { en: string; zh: string }> = {
  high_rise: { en: "Serviced Apartments & Condos", zh: "服务式公寓" },
  landed: { en: "Landed Homes", zh: "有地排屋" },
  commercial: { en: "Commercial Properties", zh: "商业店铺" },
};

export function typeSlug(cat: string): string {
  return TYPE_SLUG[cat] ?? cat;
}
export function categoryFromSlug(slug: string): Listing["category"] | null {
  return TYPE_FROM_SLUG[slug] ?? null;
}

/* ---- 从房源里取出唯一的 地区 / 发展商 列表 ---- */
function distinct(ls: Listing[], pick: (l: Listing) => string) {
  const seen = new Map<string, { value: string; count: number }>();
  for (const l of ls) {
    const v = pick(l).trim();
    if (!v) continue;
    const slug = slugify(v);
    const cur = seen.get(slug);
    if (cur) cur.count++;
    else seen.set(slug, { value: v, count: 1 });
  }
  return [...seen.entries()].map(([slug, v]) => ({ slug, ...v }));
}

export const distinctAreas = (ls: Listing[]) => distinct(ls, (l) => l.area);
export const distinctDevelopers = (ls: Listing[]) => distinct(ls, (l) => l.developer);
export const categories: Listing["category"][] = ["high_rise", "landed", "commercial"];

/* ---- 取某 segment 的房源 ---- */
export function listingsFor(
  ls: Listing[],
  kind: SegmentKind,
  slug: string,
): Listing[] {
  if (kind === "type") {
    const cat = categoryFromSlug(slug);
    return cat ? ls.filter((l) => l.category === cat) : [];
  }
  const pick = kind === "area" ? (l: Listing) => l.area : (l: Listing) => l.developer;
  return ls.filter((l) => slugify(pick(l)) === slug);
}

/** segment 的显示名（取该组第一条的原始值，类型用固定标签） */
export function segmentLabel(
  kind: SegmentKind,
  slug: string,
  matched: Listing[],
  lang: Lang,
): string {
  if (kind === "type") {
    const cat = categoryFromSlug(slug);
    return cat ? TYPE_LABEL[cat][lang] : slug;
  }
  const v = matched[0];
  return v ? (kind === "area" ? v.area : v.developer) : slug;
}

export interface SegmentCopy {
  label: string;
  h1: string;
  metaTitle: string;
  metaDesc: string;
  intro: string;
  faq: { q: string; a: string }[];
  waMsg: string;
}

/** 生成 segment 页的双语文案（标题/简介/FAQ/WhatsApp 预填）。城市跟数据走（Estelar=KL，JBCC=新山）。 */
export function segmentCopy(
  kind: SegmentKind,
  slug: string,
  matched: Listing[],
  lang: Lang,
): SegmentCopy {
  const label = segmentLabel(kind, slug, matched, lang);
  const n = matched.length;
  const prices = matched.map((l) => l.priceFrom).filter((p) => p > 0);
  const min = prices.length ? Math.min(...prices) : 0;
  const fromPrice = min ? formatPrice(min) : (lang === "zh" ? "待询" : "on enquiry");
  const city = matched[0]?.city || "Malaysia";
  const cityZh = city === "Kuala Lumpur" ? "吉隆坡" : city === "Johor Bahru" ? "新山" : city;

  if (lang === "zh") {
    const where =
      kind === "area" ? `${cityZh} ${label}`
      : kind === "developer" ? `${label}`
      : `${cityZh}`;
    const what =
      kind === "type" ? label : `酒店品牌新盘`;
    const h1 =
      kind === "area" ? `${label} 房产项目 · ${cityZh}`
      : kind === "developer" ? `${label} 项目`
      : `${label}`;
    const intro =
      `精选 ${where} 的${what} ${n} 个项目${min ? `，起价 ${fromPrice}` : ""}。` +
      `均为 Richmond Asia 永久地契酒店品牌项目，本站为授权销售咨询——价目表、户型、看房预约，WhatsApp 即时回复。`;
    return {
      label, h1,
      metaTitle: min ? `${h1}｜起价 ${fromPrice}` : h1,
      metaDesc:
        `${where}${what} ${n} 个${min ? `，起价 ${fromPrice}` : ""}。授权销售团队提供价目表、户型与看房预约，WhatsApp 即时回复。`,
      intro,
      waMsg: `[${label}] 你好，我想了解${where}的${what}，麻烦给我详情（价格 / 看房）。`,
      faq: [
        {
          q: `${label} 的项目多少钱？`,
          a: `${label} 的起价与户型价格请以最新价目表为准。WhatsApp 销售团队拿最新价目表与可售单位。`,
        },
        {
          q: `外国人 / 新加坡人可以买吗？`,
          a: `Richmond JBCC 与 Richmond Mayor 均开放给外国买家，须符合柔佛州的外国人最低购买价门槛。销售团队可帮你核对资格与流程。`,
        },
        {
          q: `这是发展商官网吗？`,
          a: `不是——本站为独立授权销售咨询网站，两个项目均由 Richmond Asia Group Sdn Bhd 发展，订购与付款一律经由发展商官方渠道。`,
        },
      ],
    };
  }

  // EN
  const where =
    kind === "area" ? `${label}, ${city}`
    : kind === "developer" ? `${label}`
    : city;
  const what = kind === "type" ? label.toLowerCase() : "hotel-branded new launches";
  const h1 =
    kind === "area" ? `${label} Property — ${city}`
    : kind === "developer" ? `${label} Projects`
    : `${label} — ${city}`;
  const intro =
    `${n} ${what} ${kind === "developer" ? "by " : "in "}${where}${min ? `, priced from ${fromPrice}` : ""}. ` +
    `All freehold hotel-branded developments by Richmond Asia — this is the authorized sales enquiry site. Price lists, layouts and viewings with quick WhatsApp replies.`;
  return {
    label, h1,
    metaTitle: min ? `${h1} | From ${fromPrice}` : h1,
    metaDesc:
      `${n} ${what} in ${where}${min ? ` from ${fromPrice}` : ""}. Authorized sales team — price lists, layouts and viewing bookings, quick WhatsApp replies.`,
    intro,
    waMsg: `[${label}] Hi, I'm interested in ${what} in ${where} — could you share details (pricing / viewing)?`,
    faq: [
      {
        q: `How much do properties in ${label} cost?`,
        a: `Pricing varies by layout and floor — WhatsApp the sales team for the latest price list and unit availability for ${label}.`,
      },
      {
        q: `Can foreigners and Singaporeans buy here?`,
        a: `Yes — both Richmond JBCC and Richmond Mayor are open to foreign buyers, subject to Johor's minimum purchase price for foreigners. The sales team can confirm eligibility for your nationality.`,
      },
      {
        q: `Is this the developer's official website?`,
        a: `No — this is an independent authorized sales enquiry site. Both projects are developed by Richmond Asia Group Sdn Bhd; bookings and payments always go through official developer channels.`,
      },
    ],
  };
}
