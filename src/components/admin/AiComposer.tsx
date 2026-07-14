"use client";

import { useState } from "react";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import ListingForm from "./ListingForm";
import type { Listing } from "@/lib/listings";

type Draft = Partial<Listing>;

export default function AiComposer() {
  const [rawText, setRawText] = useState("");
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");
  const [initial, setInitial] = useState<Listing | null>(null);

  async function uploadFiles(files: FileList) {
    setBusy(true);
    setMsg("上传图片中…");
    const supabase = createClient();
    const urls: string[] = [];
    for (const file of Array.from(files)) {
      const path = `ai/${Date.now()}-${file.name.replace(/[^\w.-]/g, "_")}`;
      const { error } = await supabase.storage
        .from("listings")
        .upload(path, file, { upsert: true });
      if (error) {
        setMsg("上传失败：" + error.message);
        setBusy(false);
        return;
      }
      urls.push(supabase.storage.from("listings").getPublicUrl(path).data.publicUrl);
    }
    setImageUrls((p) => [...p, ...urls]);
    setMsg("");
    setBusy(false);
  }

  async function analyze() {
    if (!rawText.trim() && imageUrls.length === 0) {
      setMsg("请先贴文字或上传图片。");
      return;
    }
    setBusy(true);
    setMsg("AI 分析中…（约 10 秒）");
    try {
      const res = await fetch("/api/ai-listing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rawText, imageUrls }),
      });
      const data = await res.json();
      if (!res.ok) {
        setMsg("AI 失败：" + (data.error || res.status));
        setBusy(false);
        return;
      }
      const d: Draft = data.draft ?? {};
      setInitial(buildListing(d, imageUrls));
      setMsg("");
    } catch (e) {
      setMsg("出错：" + (e instanceof Error ? e.message : "未知"));
    }
    setBusy(false);
  }

  // 已生成草稿 → 显示可审核编辑的表单（状态默认草稿，Ivy 看一眼按上线）
  if (initial) {
    return (
      <div className="space-y-5">
        <div className="rounded-xl border border-fire/40 bg-fire/10 p-4 text-sm text-ink">
          ✓ AI 已根据资料填好下方表单。请核对（特别是价格、面积、KPKT 准证号），
          确认无误后把状态设为「已上线」再保存。
          <button
            onClick={() => setInitial(null)}
            className="ml-2 font-semibold text-fire hover:underline"
          >
            重新分析
          </button>
        </div>
        <ListingForm initial={initial} />
      </div>
    );
  }

  const field =
    "w-full rounded-lg border border-line bg-bg px-4 py-3 text-ink placeholder:text-faint focus:border-fire focus:outline-none";

  return (
    <div className="space-y-5">
      <div>
        <label className="mb-1 block text-sm font-medium text-ink">
          原始资料（发展商简介 / WhatsApp 文案 / 笔记，中英都行）
        </label>
        <textarea
          value={rawText}
          onChange={(e) => setRawText(e.target.value)}
          rows={10}
          placeholder="把楼盘资料整段贴进来，AI 会自动整理成房源栏位…"
          className={field}
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-ink">
          图片（选填，AI 也会参考；之后就是房源相片）
        </label>
        <div className="flex flex-wrap gap-3">
          {imageUrls.map((src, i) => (
            <div
              key={i}
              className="relative h-20 w-28 overflow-hidden rounded-lg border border-line"
            >
              <Image src={src} alt="" fill className="object-cover" sizes="112px" />
              <button
                onClick={() => setImageUrls(imageUrls.filter((_, j) => j !== i))}
                className="absolute right-1 top-1 rounded bg-black/60 px-1.5 text-xs text-white"
              >
                ✕
              </button>
            </div>
          ))}
          <label className="flex h-20 w-28 cursor-pointer items-center justify-center rounded-lg border border-dashed border-line text-sm text-muted hover:border-fire">
            ＋ 图片
            <input
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(e) => e.target.files && uploadFiles(e.target.files)}
            />
          </label>
        </div>
      </div>

      <button
        onClick={analyze}
        disabled={busy}
        className="rounded-full bg-fire px-7 py-3 font-semibold text-white transition hover:bg-fire-2 disabled:opacity-60"
      >
        {busy ? "处理中…" : "✦ AI 分析并填表"}
      </button>
      {msg && <p className="text-sm text-muted">{msg}</p>}
    </div>
  );
}

function buildListing(d: Draft, images: string[]): Listing {
  return {
    slug: d.slug || "",
    title: d.title || "",
    titleEn: d.titleEn || "",
    developer: d.developer || "Richmond Asia",
    projectType: (d.projectType as Listing["projectType"]) || "new_launch",
    category: (d.category as Listing["category"]) || "high_rise",
    area: d.area || "",
    city: d.city || "Johor Bahru",
    priceFrom: typeof d.priceFrom === "number" ? d.priceFrom : 0,
    bedrooms: d.bedrooms || "",
    bathrooms: d.bathrooms || "",
    sizeSqft: d.sizeSqft || "",
    landSize: (d as { landSize?: string }).landSize || "",
    tenure: d.tenure || "Enquire / 洽询",
    highlights: d.highlights || [],
    highlightsEn: d.highlightsEn || [],
    description: d.description || "",
    descriptionEn: d.descriptionEn || "",
    images,
    imageMeta: [],
    lat: 0,
    lng: 0,
    builtYear: d.builtYear || "",
    parking: d.parking || "",
    furnishing: d.furnishing || "",
    facing: d.facing || "",
    amenities: d.amenities || [],
    amenitiesEn: d.amenitiesEn || [],
    kpkt: {
      developerLicenseNo: "待发展商提供 / TBD",
      adPermitNo: "待发展商提供 / TBD",
      validUntil: "待发展商提供 / TBD",
      filled: false,
    },
    status: "draft",
    approval: { approvedBy: null, approvedAt: null },
    updatedAt: "",
  };
}
