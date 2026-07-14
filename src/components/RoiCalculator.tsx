"use client";

import { useMemo, useState } from "react";
import { waLink } from "@/lib/site";
import { track } from "@/lib/track";
import type { InvestScheme } from "@/lib/projectContent";
import type { Lang } from "@/lib/i18n";

/**
 * 回酬计算器 = 成交名单工具。
 * 客户按公开 GRR 方案示算自己的回酬，一键把「单位价 + 每年回酬 + 5 年合计」
 * 发到销售团队 WhatsApp —— 进来的每条消息都是带预算的热名单。
 * 铁律：只用公开行销资料的数字，永远带「以正式合约为准」免责。
 */

const FMT = (n: number) =>
  "RM " + Math.round(n).toLocaleString("en-MY");
/** 参考汇率（显示用，标明仅供参考） */
const SGD_RATE = 3.3;
const FMT_SGD = (n: number) =>
  "≈ SGD " + Math.round(n / SGD_RATE).toLocaleString("en-SG");

export default function RoiCalculator({
  lang,
  projectName,
  invest,
  minPrice,
}: {
  lang: Lang;
  projectName: string;
  invest: InvestScheme;
  minPrice: number;
}) {
  const zh = lang === "zh";
  const [price, setPrice] = useState(minPrice);

  const rows = useMemo(
    () =>
      invest.grrPhases.map((p) => ({
        label: zh
          ? `第 ${p.fromYear}–${p.toYear} 年 · ${p.ratePct}% p.a.`
          : `Years ${p.fromYear}–${p.toYear} · ${p.ratePct}% p.a.`,
        yearly: (price * p.ratePct) / 100,
        monthly: (price * p.ratePct) / 100 / 12,
      })),
    [invest, price, zh],
  );
  const total = (price * invest.grrTotalPct) / 100;

  const waMsg = zh
    ? `[${projectName} 回酬测算] 你好，我用网站算了一下：单位价 ${FMT(price)}，${invest.grrPhases
        .map((p) => `第${p.fromYear}–${p.toYear}年每年约 ${FMT((price * p.ratePct) / 100)}`)
        .join("、")}，${invest.grrTotalYears} 年保证回酬合计约 ${FMT(total)}。请给我完整价目表和 GRR 方案。`
    : `[${projectName} ROI] Hi, I ran the numbers on your site: unit price ${FMT(price)}, ${invest.grrPhases
        .map((p) => `~${FMT((price * p.ratePct) / 100)}/yr in years ${p.fromYear}–${p.toYear}`)
        .join(", ")}, ~${FMT(total)} total guaranteed over ${invest.grrTotalYears} years. Please send me the full price list & GRR terms.`;

  const t = {
    title: zh ? "算一算：你的保证回酬" : "Calculate your guaranteed return",
    sub: zh
      ? `按公开方案示算 —— 首 ${invest.grrTotalYears} 年保证回酬共 ${invest.grrTotalPct}%。拖动价钱，看自己的数字。`
      : `Based on the published scheme — ${invest.grrTotalPct}% guaranteed over the first ${invest.grrTotalYears} years. Drag the price to see your numbers.`,
    priceLabel: zh ? "单位价（RM）" : "Unit price (RM)",
    yearly: zh ? "每年回酬" : "Per year",
    monthly: zh ? "≈ 每月" : "≈ per month",
    totalLabel: zh
      ? `${invest.grrTotalYears} 年保证回酬合计`
      : `Total guaranteed over ${invest.grrTotalYears} years`,
    after: zh ? invest.profitShareZh : invest.profitShareEn,
    perks: zh ? invest.perksZh : invest.perksEn,
    cta: zh ? "把这份测算发给销售团队" : "Send my numbers to the sales team",
    ctaNote: zh
      ? "WhatsApp 直达 · 回你完整价目表与 GRR 合约条款"
      : "Straight to WhatsApp · full price list & GRR terms in reply",
    disclaimer: zh ? invest.disclaimerZh : invest.disclaimerEn,
    sgdNote: zh ? "（新元换算仅供参考）" : "(SGD conversion indicative only)",
  };

  return (
    <div className="glass p-7 sm:p-9">
      <h3 className="font-display text-2xl text-ink sm:text-3xl">{t.title}</h3>
      <p className="mt-3 max-w-[62ch] text-sm leading-relaxed text-muted">{t.sub}</p>

      {/* 价钱滑杆 */}
      <div className="mt-8">
        <div className="flex items-baseline justify-between gap-4">
          <label htmlFor="roi-price" className="text-sm text-faint">
            {t.priceLabel}
          </label>
          <span className="font-display text-2xl text-fire">
            {FMT(price)}{" "}
            <span className="font-sans text-xs font-normal text-faint">
              {FMT_SGD(price)} {t.sgdNote}
            </span>
          </span>
        </div>
        <input
          id="roi-price"
          type="range"
          min={minPrice}
          max={minPrice * 2.2}
          step={10000}
          value={price}
          onChange={(e) => setPrice(Number(e.target.value))}
          className="mt-3 w-full accent-[var(--fire)]"
        />
      </div>

      {/* 回酬分段 */}
      <dl className="mt-7 divide-y divide-line border-y border-line">
        {rows.map((r) => (
          <div key={r.label} className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 py-4">
            <dt className="text-sm text-ink/85">{r.label}</dt>
            <dd className="text-right">
              <span className="font-display text-xl text-ink">{FMT(r.yearly)}</span>
              <span className="ml-2 text-xs text-faint">
                {t.yearly} · {t.monthly} {FMT(r.monthly)}
              </span>
            </dd>
          </div>
        ))}
        <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 py-5">
          <dt className="text-sm font-semibold text-ink">{t.totalLabel}</dt>
          <dd className="text-right">
            <span className="font-display text-3xl text-fire">{FMT(total)}</span>
            <span className="ml-2 text-xs text-faint">{FMT_SGD(total)}</span>
          </dd>
        </div>
      </dl>

      {/* 保证期后 + 附带权益 */}
      <p className="mt-5 text-sm leading-relaxed text-muted">{t.after}</p>
      <ul className="mt-3 space-y-1.5 text-sm text-muted">
        {t.perks.map((p) => (
          <li key={p} className="flex gap-2.5">
            <span className="text-fire">✓</span> {p}
          </li>
        ))}
      </ul>

      {/* 成交名单 CTA —— 带着测算数字进 WhatsApp */}
      <div className="mt-8">
        <a
          href={waLink(waMsg)}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => track("roi_calc_whatsapp", { price, project: projectName })}
          className="inline-flex w-full items-center justify-center gap-2.5 rounded-sm bg-fire px-7 py-4 text-[15px] font-semibold text-bg transition hover:bg-fire-2 sm:w-auto"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" aria-hidden>
            <path d="M.057 24l1.687-6.163a11.867 11.867 0 01-1.587-5.946C.157 5.335 5.493 0 12.05 0a11.82 11.82 0 018.413 3.488 11.82 11.82 0 013.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 01-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884a9.86 9.86 0 001.51 5.26l-.999 3.648 3.477-.911z" />
          </svg>
          {t.cta}
        </a>
        <p className="mt-2.5 text-xs text-muted">{t.ctaNote}</p>
      </div>

      <p className="mt-6 max-w-[70ch] text-[11px] leading-relaxed text-faint">{t.disclaimer}</p>
    </div>
  );
}
