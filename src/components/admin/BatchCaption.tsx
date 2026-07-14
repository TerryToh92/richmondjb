"use client";

import { useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export type CaptionRow = {
  id: string;
  slug: string;
  title: string;
  titleEn: string;
  area: string;
  city: string;
  developer: string;
  category: string;
  images: string[];
  hasMeta: boolean;
};

/** 批量「AI 描述图片」：浏览器里逐个房源调用 /api/image-meta，拿到 meta 后存回 DB。 */
export default function BatchCaption({ listings }: { listings: CaptionRow[] }) {
  const [force, setForce] = useState(false);
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(0);
  const [log, setLog] = useState<Record<string, string>>({});

  const targets = useMemo(
    () => listings.filter((r) => force || !r.hasMeta),
    [listings, force],
  );

  async function run() {
    setRunning(true);
    setDone(0);
    setLog({});
    const supabase = createClient();
    let n = 0;
    for (const r of targets) {
      setLog((p) => ({ ...p, [r.id]: "⏳ 处理中…" }));
      try {
        const res = await fetch("/api/image-meta", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            images: r.images,
            context: {
              title: r.title,
              titleEn: r.titleEn,
              area: r.area,
              city: r.city,
              developer: r.developer,
              category: r.category,
            },
          }),
        });
        const data = await res.json();
        if (!res.ok) {
          setLog((p) => ({ ...p, [r.id]: "✗ " + (data.error || res.status) }));
        } else {
          const image_meta = (data.meta || []).map(
            (m: Record<string, string>) => ({
              url: m.url,
              kind: m.kind,
              alt_en: m.altEn,
              alt_zh: m.altZh,
              caption_en: m.captionEn,
              caption_zh: m.captionZh,
            }),
          );
          const { error } = await supabase
            .from("listings")
            .update({ image_meta })
            .eq("id", r.id);
          setLog((p) => ({
            ...p,
            [r.id]: error ? "✗ 保存失败：" + error.message : `✓ ${image_meta.length} 张描述已存`,
          }));
        }
      } catch (e) {
        setLog((p) => ({
          ...p,
          [r.id]: "✗ " + (e instanceof Error ? e.message : "网络错误"),
        }));
      }
      n += 1;
      setDone(n);
    }
    setRunning(false);
  }

  return (
    <div>
      <div className="flex flex-wrap items-center gap-4 rounded-xl border border-line p-5">
        <button
          type="button"
          onClick={run}
          disabled={running || targets.length === 0}
          className="rounded-full bg-fire px-6 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
        >
          {running ? `跑中… ${done}/${targets.length}` : `✨ AI 描述全部（${targets.length} 个房源）`}
        </button>
        <label className="flex items-center gap-2 text-sm text-muted">
          <input type="checkbox" checked={force} onChange={(e) => setForce(e.target.checked)} disabled={running} />
          连已有描述的也重跑
        </label>
        <span className="text-xs text-faint">
          逐个房源调用，跑完一个存一个；可随时离开（已跑的已存）。
        </span>
      </div>

      <div className="mt-5 space-y-1.5">
        {targets.map((r) => (
          <div key={r.id} className="flex items-center justify-between gap-3 rounded-lg border border-line px-4 py-2.5 text-sm">
            <span className="min-w-0 flex-1 truncate text-ink">
              {r.titleEn || r.title}
              <span className="ml-2 text-xs text-faint">{r.images.length} 图{r.hasMeta ? " · 已有描述" : ""}</span>
            </span>
            <span className={`shrink-0 text-xs ${log[r.id]?.startsWith("✓") ? "text-emerald-400" : log[r.id]?.startsWith("✗") ? "text-fire" : "text-muted"}`}>
              {log[r.id] || "待处理"}
            </span>
          </div>
        ))}
        {targets.length === 0 && (
          <p className="p-6 text-center text-muted">所有有图房源都已有 AI 描述 🎉（勾选上面可重跑）</p>
        )}
      </div>
    </div>
  );
}
