/**
 * 精选落地页（广告专用）。
 * 跟 areas/developers/type 的「自动 segment 页」不同：这里是**手动挑选**一组房源
 * 组成一个主题落地页（广告点进去的页），文案针对特定买家 + 为转化调过。
 * 复用 SegmentView 排版，不动后台地区标签、不影响 SEO 自动页。
 *   /[lang]/lp/[slug]   例 /en/lp/ulu-tiram-homes
 *
 * 转化 / 合规取向（Alex Hormozi + Ali Raza 评审落实）：
 *  - CTA 降门槛（不是「预约看房」而是「我供得起哪间」），预填讯息带预算空格
 *  - 月供试算钩子打掉「我供得起吗」门槛
 *  - 起价徽章按产品诚实分段（公寓 / 排屋），不拿最低公寓价误导排屋买家
 *  - 只放有授权的 KSL 项目（移除 Tiland 的 Meadow Heights，避免无授权品牌出现在广告页）
 *  - 不夸大 / 不保证（账号求稳），月供注明「估算·以银行为准」
 */
import type { Listing } from "./listings";
import { formatPrice } from "./listings";
import type { Lang } from "./i18n";
import type { SegmentCopy } from "./segments";

export interface LandingDef {
  slug: string;
  /** 要显示的房源 slug，按顺序（第一个 = featured 大卡）。 */
  listingSlugs: string[];
}

/* ---- 精选落地页清单 ----
 * 目前为空：本站只有两个项目，主页 / 项目页已够用。
 * 之后跑广告要做主题落地页（如「新加坡买家 · JBCC」）时，照下面格式加即可：
 *   "sg-buyers-jbcc": { slug: "sg-buyers-jbcc", listingSlugs: ["richmond-jbcc"] },
 */
const LANDINGS: Record<string, LandingDef> = {};

export function landingDef(slug: string): LandingDef | null {
  return LANDINGS[slug] ?? null;
}

export function landingSlugs(): string[] {
  return Object.keys(LANDINGS);
}

/** 按配置顺序取出房源（保留 featured = 第一个；忽略后台已删/未上架的）。 */
export function landingListings(all: Listing[], def: LandingDef): Listing[] {
  const bySlug = new Map(all.map((l) => [l.slug, l] as const));
  return def.listingSlugs
    .map((s) => bySlug.get(s))
    .filter((x): x is Listing => Boolean(x));
}

/* ---------- 转化辅助 ---------- */

function minPrice(ls: Listing[]): number {
  const ps = ls.map((l) => l.priceFrom).filter((p) => p > 0);
  return ps.length ? Math.min(...ps) : 0;
}

/** 首屏起价徽章——按产品诚实分段（公寓 / 排屋），不拿最低公寓价误导排屋买家。 */
export function landingPriceBadge(matched: Listing[], lang: Lang): string | undefined {
  const condo = minPrice(matched.filter((l) => l.category === "high_rise"));
  const landed = minPrice(matched.filter((l) => l.category === "landed"));
  const parts: string[] = [];
  if (condo) parts.push(lang === "zh" ? `公寓 ${formatPrice(condo)} 起` : `Condos from ${formatPrice(condo)}`);
  if (landed) parts.push(lang === "zh" ? `排屋 ${formatPrice(landed)} 起` : `Landed from ${formatPrice(landed)}`);
  return parts.length ? parts.join(" · ") : undefined;
}

/** 保守月供估算：90% 贷款 · 35 年 · 利率约 4.2%，四舍五入到 50。仅供参考。 */
function estMonthly(price: number): number {
  const loan = price * 0.9;
  const r = 0.042 / 12;
  const n = 35 * 12;
  const m = loan * (r / (1 - Math.pow(1 + r, -n)));
  return Math.round(m / 50) * 50;
}

export interface Affordability {
  heading: string;
  note: string;
  cta: string;
  rows: { home: string; monthly: string }[];
}

/** 月供试算钩子——打掉「我供得起吗」门槛（本地自住家庭最大心理障碍）。 */
export function landingAffordability(matched: Listing[], lang: Lang): Affordability | null {
  const condo = minPrice(matched.filter((l) => l.category === "high_rise"));
  const landed = minPrice(matched.filter((l) => l.category === "landed"));
  const rows: { home: string; monthly: string }[] = [];
  const fmtM = (rm: number) =>
    lang === "zh" ? `每月约 ${formatPrice(estMonthly(rm))}` : `~${formatPrice(estMonthly(rm))}/mo`;
  if (condo)
    rows.push({
      home: lang === "zh" ? `公寓 ${formatPrice(condo)} 起` : `Condos from ${formatPrice(condo)}`,
      monthly: fmtM(condo),
    });
  if (landed)
    rows.push({
      home: lang === "zh" ? `排屋 ${formatPrice(landed)} 起` : `Landed from ${formatPrice(landed)}`,
      monthly: fmtM(landed),
    });
  if (rows.length === 0) return null;
  return {
    heading: lang === "zh" ? "供得起吗？先看月供" : "Can you afford it? Start with the instalment",
    note:
      lang === "zh"
        ? "估算：90% 贷款 · 35 年 · 利率约 4.2%，实际以银行核准为准。"
        : "Estimate: 90% loan · 35 years · ~4.2% rate. Actual figures subject to bank approval.",
    cta: lang === "zh" ? "WhatsApp 帮你算自己那间" : "WhatsApp us — get your own numbers",
    rows,
  };
}

/** 首屏信任条短句（含「不 hard sell」——本地买家按 WhatsApp 前最大犹豫）。 */
export function landingTrust(lang: Lang): string[] {
  return lang === "zh"
    ? ["永久地契 · 酒店品牌", "发展商 Richmond Asia", "WhatsApp 回复快", "不 hard sell，先问清楚再决定"]
    : ["Freehold · hotel-branded", "Developer: Richmond Asia", "Quick WhatsApp replies", "No pushy sales — ask first"];
}

/** 首屏主 CTA 钮文字——降门槛到「零承诺」（不是预约看房）。 */
export function landingCta(lang: Lang): string {
  return lang === "zh" ? "WhatsApp 问：我适合哪个项目？" : "WhatsApp us — which project fits me?";
}

/** 落地页文案（双语）。目前无落地页 —— 加新 LANDINGS 时在这里按 slug 写专属文案。 */
export function landingCopy(slug: string, matched: Listing[], lang: Lang): SegmentCopy {
  // 未知 slug 兜底（route 已先挡）
  void matched;
  return {
    label: slug,
    h1: slug,
    metaTitle: slug,
    metaDesc: "",
    intro: "",
    waMsg: lang === "zh" ? "你好，我想了解详情。" : "Hi, I'd like more details.",
    faq: [],
  };
}
