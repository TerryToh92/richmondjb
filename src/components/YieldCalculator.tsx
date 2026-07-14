"use client";

import { useState } from "react";
import { waLink } from "@/lib/site";
import { track } from "@/lib/track";
import type { TargetYield } from "@/lib/projectContent";
import type { Lang } from "@/lib/i18n";

/**
 * 目标回酬计算器（预览期项目·无公开 GRR 方案时用）。
 * 客户输入预算 + 拖目标年化 → 看每年/每月/5 年示算 → 一键 WhatsApp 登记拿正式方案。
 * 跟 RoiCalculator 一样是成交名单工具：进线自带预算。
 */

const FMT = (n: number) => "RM " + Math.round(n).toLocaleString("en-MY");
const SGD_RATE = 3.3;
const FMT_SGD = (n: number) =>
  "≈ SGD " + Math.round(n / SGD_RATE).toLocaleString("en-SG");

export default function YieldCalculator({
  lang,
  projectName,
  scheme,
}: {
  lang: Lang;
  projectName: string;
  scheme: TargetYield;
}) {
  const zh = lang === "zh";
  const [price, setPrice] = useState(scheme.defaultPrice);
  const [pct, setPct] = useState(scheme.defaultPct);

  const yearly = (price * pct) / 100;
  const monthly = yearly / 12;
  const fiveYear = yearly * 5;

  const waMsg = zh
    ? `[${projectName} 回酬测算·抢先预览] 你好，我按目标年化 ${pct}% 算了一下：预算 ${FMT(price)}，每年约 ${FMT(yearly)}（每月约 ${FMT(monthly)}），5 年约 ${FMT(fiveYear)}。请帮我登记 Exclusive Preview，发我正式价目表和回酬方案。`
    : `[${projectName} ROI · Exclusive Preview] Hi, at a ${pct}% p.a. target I calculated: budget ${FMT(price)}, ~${FMT(yearly)}/year (~${FMT(monthly)}/month), ~${FMT(fiveYear)} over 5 years. Please register me for the Exclusive Preview and send the official price list & return scheme.`;

  const t = {
    title: zh ? "算一算：你的目标回酬" : "Calculate your target return",
    sub: zh ? scheme.sourceNoteZh : scheme.sourceNoteEn,
    priceLabel: zh ? "你的预算（RM）" : "Your budget (RM)",
    pctLabel: zh ? "目标年化回报" : "Target annual return",
    yearly: zh ? "每年回酬（示算）" : "Per year (illustrative)",
    monthly: zh ? "≈ 每月" : "≈ per month",
    fiveYear: zh ? "5 年累计（示算）" : "5-year total (illustrative)",
    cta: zh ? "登记抢先预览 · 拿正式方案" : "Register for the Preview · get official terms",
    ctaNote: zh
      ? "WhatsApp 直达 · 价目表与回酬方案优先发给登记买家"
      : "Straight to WhatsApp · price list & scheme released to registered buyers first",
    disclaimer: zh ? scheme.disclaimerZh : scheme.disclaimerEn,
    sgdNote: zh ? "（新元换算仅供参考）" : "(SGD conversion indicative only)",
  };

  return (
    <div className="glass p-7 sm:p-9">
      <h3 className="font-display text-2xl text-ink sm:text-3xl">{t.title}</h3>
      <p className="mt-3 max-w-[62ch] text-sm leading-relaxed text-muted">{t.sub}</p>

      {/* 预算 */}
      <div className="mt-8">
        <div className="flex items-baseline justify-between gap-4">
          <label htmlFor="yield-price" className="text-sm text-faint">{t.priceLabel}</label>
          <span className="font-display text-2xl text-fire">
            {FMT(price)}{" "}
            <span className="font-sans text-xs font-normal text-faint">
              {FMT_SGD(price)} {t.sgdNote}
            </span>
          </span>
        </div>
        <input
          id="yield-price"
          type="range"
          min={300000}
          max={1500000}
          step={10000}
          value={price}
          onChange={(e) => setPrice(Number(e.target.value))}
          className="mt-3 w-full accent-[var(--fire)]"
        />
      </div>

      {/* 目标年化 */}
      <div className="mt-6">
        <div className="flex items-baseline justify-between gap-4">
          <label htmlFor="yield-pct" className="text-sm text-faint">{t.pctLabel}</label>
          <span className="font-display text-2xl text-ink">{pct}% p.a.</span>
        </div>
        <input
          id="yield-pct"
          type="range"
          min={scheme.minPct}
          max={scheme.maxPct}
          step={0.5}
          value={pct}
          onChange={(e) => setPct(Number(e.target.value))}
          className="mt-3 w-full accent-[var(--fire)]"
        />
      </div>

      {/* 结果 */}
      <dl className="mt-7 divide-y divide-line border-y border-line">
        <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 py-4">
          <dt className="text-sm text-ink/85">{t.yearly}</dt>
          <dd className="text-right">
            <span className="font-display text-xl text-ink">{FMT(yearly)}</span>
            <span className="ml-2 text-xs text-faint">{t.monthly} {FMT(monthly)}</span>
          </dd>
        </div>
        <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 py-5">
          <dt className="text-sm font-semibold text-ink">{t.fiveYear}</dt>
          <dd className="text-right">
            <span className="font-display text-3xl text-fire">{FMT(fiveYear)}</span>
            <span className="ml-2 text-xs text-faint">{FMT_SGD(fiveYear)}</span>
          </dd>
        </div>
      </dl>

      {/* 登记 CTA */}
      <div className="mt-8">
        <a
          href={waLink(waMsg)}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => track("yield_calc_whatsapp", { price, pct, project: projectName })}
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
