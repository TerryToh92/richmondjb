"use client";

/**
 * 广告归因捕获：落地时把 Google/Meta 的点击 id(gclid 等)+ UTM 存进 localStorage，
 * 表单提交时一起写进 lead → 以后把真实成交回传 Google（offline conversion / 智能出价）。
 * first-touch 保留落地页/来源/时间；点击 id 取 last-touch（驱动这次转化的那次点击）。
 */

const KEY = "ivy_attr_v1";
const CLICK_PARAMS = ["gclid", "gbraid", "wbraid", "fbclid"] as const;
const UTM_PARAMS = [
  "utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content",
] as const;

export type Attribution = {
  gclid?: string;
  gbraid?: string;
  wbraid?: string;
  fbclid?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
  landing_path?: string;
  referrer?: string;
  ts?: string;
};

export function captureAttribution(): void {
  if (typeof window === "undefined") return;
  try {
    const sp = new URLSearchParams(window.location.search);
    const incoming: Attribution = {};
    let hasParams = false;
    for (const p of [...CLICK_PARAMS, ...UTM_PARAMS]) {
      const v = sp.get(p);
      if (v) {
        (incoming as Record<string, string>)[p] = v;
        hasParams = true;
      }
    }
    const existing = getAttribution();
    const isFirst = !existing.ts;
    if (!hasParams && !isFirst) return; // 没新参数、已有记录 → 不动

    const rec: Attribution = {
      ...existing,
      ...incoming, // 点击 id / UTM 取最新（last-touch）
      landing_path: existing.landing_path ?? window.location.pathname + window.location.search,
      referrer: existing.referrer ?? (document.referrer || undefined),
      ts: existing.ts ?? new Date().toISOString(),
    };
    localStorage.setItem(KEY, JSON.stringify(rec));
  } catch {
    /* localStorage 不可用就算了，不影响主流程 */
  }
}

export function getAttribution(): Attribution {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(localStorage.getItem(KEY) || "{}") as Attribution;
  } catch {
    return {};
  }
}
