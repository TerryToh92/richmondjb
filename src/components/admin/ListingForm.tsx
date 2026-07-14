"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import { type Listing, type ImageMeta } from "@/lib/listings";
import { slugify } from "@/lib/segments";

const EMPTY: Listing = {
  slug: "",
  title: "",
  titleEn: "",
  developer: "Richmond Asia",
  projectType: "new_launch",
  category: "high_rise",
  area: "",
  city: "Johor Bahru",
  priceFrom: 0,
  bedrooms: "",
  bathrooms: "",
  sizeSqft: "",
  landSize: "",
  tenure: "Enquire / 洽询",
  highlights: [],
  highlightsEn: [],
  description: "",
  descriptionEn: "",
  images: [],
  imageMeta: [],
  lat: 0,
  lng: 0,
  builtYear: "",
  parking: "",
  furnishing: "",
  facing: "",
  amenities: [],
  amenitiesEn: [],
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

const lines = (s: string) =>
  s.split("\n").map((x) => x.trim()).filter(Boolean);

export default function ListingForm({ initial }: { initial?: Listing }) {
  const router = useRouter();
  const editing = !!initial?.id;
  const [f, setF] = useState<Listing>(initial ?? EMPTY);
  const [hl, setHl] = useState((initial?.highlights ?? []).join("\n"));
  const [hlEn, setHlEn] = useState((initial?.highlightsEn ?? []).join("\n"));
  const [am, setAm] = useState((initial?.amenities ?? []).join("\n"));
  const [amEn, setAmEn] = useState((initial?.amenitiesEn ?? []).join("\n"));
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");

  const set = <K extends keyof Listing>(k: K, v: Listing[K]) =>
    setF((p) => ({ ...p, [k]: v }));
  const setKpkt = (k: keyof Listing["kpkt"], v: string | boolean) =>
    setF((p) => ({ ...p, kpkt: { ...p.kpkt, [k]: v } }));

  async function uploadFiles(files: FileList) {
    setBusy(true);
    setMsg("上传图片中…");
    const supabase = createClient();
    const urls: string[] = [];
    // SEO 文件名：项目-区域-序号.ext（别留 IMG_1234），含关键词利于 Google 图片搜索
    const base = [f.slug, slugify(f.area || "")].filter(Boolean).join("-") || "listing";
    let seq = f.images.length;
    for (const file of Array.from(files)) {
      seq += 1;
      const ext = (file.name.split(".").pop() || "jpg").toLowerCase().replace(/[^a-z0-9]/g, "");
      const path = `${f.slug || "tmp"}/${base}-${seq}.${ext}`;
      const { error } = await supabase.storage
        .from("listings")
        .upload(path, file, { upsert: true });
      if (error) {
        setMsg("上传失败：" + error.message);
        setBusy(false);
        return;
      }
      const { data } = supabase.storage.from("listings").getPublicUrl(path);
      urls.push(data.publicUrl);
    }
    set("images", [...f.images, ...urls]);
    setMsg("");
    setBusy(false);
  }

  // 删图时同步移除它的描述
  function removeImage(i: number) {
    const url = f.images[i];
    setF((p) => ({
      ...p,
      images: p.images.filter((_, j) => j !== i),
      imageMeta: p.imageMeta.filter((m) => m.url !== url),
    }));
  }

  // AI 看图生描述（kind + 双语 alt/caption）→ 填进 imageMeta，Ivy 可改后保存
  async function aiDescribe() {
    if (f.images.length === 0) {
      setMsg("先上传图片再让 AI 描述。");
      return;
    }
    setBusy(true);
    setMsg("AI 看图生描述中…");
    try {
      const res = await fetch("/api/image-meta", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          images: f.images,
          context: {
            title: f.title, titleEn: f.titleEn, area: f.area,
            city: f.city, developer: f.developer, category: f.category,
          },
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setMsg("AI 描述失败：" + (data.error || res.status));
      } else {
        set("imageMeta", data.meta);
        setMsg("AI 描述完成，请检查/修改后保存。");
      }
    } catch (e) {
      setMsg("AI 描述失败：" + (e instanceof Error ? e.message : "网络错误"));
    }
    setBusy(false);
  }

  // 改某张图的某个描述字段
  function setMetaField(url: string, key: "kind" | "altEn" | "altZh" | "captionEn" | "captionZh", value: string) {
    setF((p) => {
      const exists = p.imageMeta.some((m) => m.url === url);
      const base: ImageMeta = { url, kind: "other", altEn: "", altZh: "", captionEn: "", captionZh: "" };
      const imageMeta = exists
        ? p.imageMeta.map((m) => (m.url === url ? ({ ...m, [key]: value } as ImageMeta) : m))
        : [...p.imageMeta, { ...base, [key]: value } as ImageMeta];
      return { ...p, imageMeta };
    });
  }

  async function save() {
    if (!f.slug || !f.title) {
      setMsg("请至少填写「网址 slug」和「标题」。");
      return;
    }
    setBusy(true);
    setMsg("保存中…");
    const supabase = createClient();
    const row = {
      slug: f.slug,
      title: f.title,
      title_en: f.titleEn,
      developer: f.developer,
      project_type: f.projectType,
      category: f.category,
      area: f.area,
      city: f.city,
      price_from: Number(f.priceFrom) || 0,
      bedrooms: f.bedrooms,
      bathrooms: f.bathrooms,
      size_sqft: f.sizeSqft,
      land_size: f.landSize,
      tenure: f.tenure,
      highlights: lines(hl),
      highlights_en: lines(hlEn),
      description: f.description,
      description_en: f.descriptionEn,
      images: f.images,
      image_meta: f.imageMeta.map((m) => ({
        url: m.url,
        kind: m.kind,
        alt_en: m.altEn,
        alt_zh: m.altZh,
        caption_en: m.captionEn,
        caption_zh: m.captionZh,
      })),
      lat: Number(f.lat) || 0,
      lng: Number(f.lng) || 0,
      built_year: f.builtYear,
      parking: f.parking,
      furnishing: f.furnishing,
      facing: f.facing,
      amenities: lines(am),
      kpkt_developer_license: f.kpkt.developerLicenseNo,
      kpkt_ad_permit: f.kpkt.adPermitNo,
      kpkt_valid_until: f.kpkt.validUntil,
      kpkt_filled: f.kpkt.filled,
      status: f.status,
      approved_by: f.approval.approvedBy,
      approved_at: f.approval.approvedAt,
    };
    const q = editing
      ? supabase.from("listings").update(row).eq("id", initial!.id!)
      : supabase.from("listings").insert(row);
    const { error } = await q;
    setBusy(false);
    if (error) {
      setMsg("保存失败：" + error.message);
      return;
    }
    router.push("/admin");
    router.refresh();
  }

  async function remove() {
    if (!editing || !confirm("确定删除这个房源？此操作不可恢复。")) return;
    setBusy(true);
    const supabase = createClient();
    const { error } = await supabase
      .from("listings")
      .delete()
      .eq("id", initial!.id!);
    setBusy(false);
    if (error) {
      setMsg("删除失败：" + error.message);
      return;
    }
    router.push("/admin");
    router.refresh();
  }

  return (
    <div className="space-y-8">
      {/* 基本 */}
      <Section title="基本资料 Basic">
        <Grid>
          <Field label="标题 Title（中文）" req>
            <Input value={f.title} onChange={(v) => set("title", v)} />
          </Field>
          <Field label="标题 Title（English）">
            <Input value={f.titleEn} onChange={(v) => set("titleEn", v)} />
          </Field>
          <Field label="网址 slug（英文，唯一，如 ksl-city-residences）" req>
            <Input value={f.slug} onChange={(v) => set("slug", v)} />
          </Field>
          <Field label="发展商 Developer">
            <Input value={f.developer} onChange={(v) => set("developer", v)} />
          </Field>
          <Field label="类型 Type">
            <Select
              value={f.projectType}
              onChange={(v) => set("projectType", v as Listing["projectType"])}
              options={[
                ["new_launch", "新盘 New Launch"],
                ["subsale", "转售 Subsale"],
                ["rent", "出租 Rent"],
              ]}
            />
          </Field>
          <Field label="分类 Category（筛选用）">
            <Select
              value={f.category}
              onChange={(v) => set("category", v as Listing["category"])}
              options={[
                ["high_rise", "高层公寓 High-rise"],
                ["landed", "有地排屋 Landed"],
                ["commercial", "商业店铺 Commercial"],
              ]}
            />
          </Field>
          <Field label="起价 Price (RM)">
            <Input
              type="number"
              value={String(f.priceFrom)}
              onChange={(v) => set("priceFrom", Number(v) || 0)}
            />
          </Field>
          <Field label="区域 Area">
            <Input value={f.area} onChange={(v) => set("area", v)} />
          </Field>
          <Field label="城市 City">
            <Input value={f.city} onChange={(v) => set("city", v)} />
          </Field>
        </Grid>
      </Section>

      {/* 规格 */}
      <Section title="单位规格 Details">
        <Grid>
          <Field label="房间 Bedrooms（如 2-3）">
            <Input value={f.bedrooms} onChange={(v) => set("bedrooms", v)} />
          </Field>
          <Field label="浴室 Bathrooms">
            <Input value={f.bathrooms} onChange={(v) => set("bathrooms", v)} />
          </Field>
          <Field label="面积 Built-up（如 750 - 1,100）">
            <Input value={f.sizeSqft} onChange={(v) => set("sizeSqft", v)} />
          </Field>
          <Field label="地皮尺寸 Land size（如 20x70，有地排屋用）">
            <Input value={f.landSize} onChange={(v) => set("landSize", v)} />
          </Field>
          <Field label="地契 Tenure">
            <Input value={f.tenure} onChange={(v) => set("tenure", v)} />
          </Field>
          <Field label="落成 Completion">
            <Input value={f.builtYear} onChange={(v) => set("builtYear", v)} />
          </Field>
          <Field label="车位 Parking">
            <Input value={f.parking} onChange={(v) => set("parking", v)} />
          </Field>
          <Field label="家具 Furnishing">
            <Input value={f.furnishing} onChange={(v) => set("furnishing", v)} />
          </Field>
          <Field label="朝向/景观 View">
            <Input value={f.facing} onChange={(v) => set("facing", v)} />
          </Field>
        </Grid>
      </Section>

      {/* 文案 */}
      <Section title="卖点与介绍 Content（默认显示英文，中文供切换）">
        <Grid>
          <Field label="卖点 Highlights · English（每行一条）">
            <Textarea value={hlEn} onChange={setHlEn} rows={4} />
          </Field>
          <Field label="卖点 Highlights · 中文（每行一条）">
            <Textarea value={hl} onChange={setHl} rows={4} />
          </Field>
          <Field label="设施 Facilities · English（每行一条）">
            <Textarea value={amEn} onChange={setAmEn} rows={4} />
          </Field>
          <Field label="设施 Facilities · 中文（每行一条）">
            <Textarea value={am} onChange={setAm} rows={4} />
          </Field>
        </Grid>
        <Field label="项目介绍 Description · English">
          <Textarea
            value={f.descriptionEn}
            onChange={(v) => set("descriptionEn", v)}
            rows={5}
          />
        </Field>
        <Field label="项目介绍 Description · 中文">
          <Textarea
            value={f.description}
            onChange={(v) => set("description", v)}
            rows={5}
          />
        </Field>
      </Section>

      {/* 图片 */}
      <Section title="图片 Images（第一张是封面）">
        <div className="mb-3 flex flex-wrap items-center gap-3">
          <label className="inline-block cursor-pointer rounded-full border border-line px-4 py-2 text-sm text-ink hover:border-fire">
            ＋ 上传图片
            <input
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(e) => e.target.files && uploadFiles(e.target.files)}
            />
          </label>
          <button
            type="button"
            onClick={aiDescribe}
            disabled={busy || f.images.length === 0}
            className="rounded-full bg-fire px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
          >
            ✨ AI 描述图片（生成 alt / caption）
          </button>
          <span className="text-xs text-faint">AI 看图判断类型 + 双语描述，利于 Google 图片 / AI 搜索。生成后可手改。</span>
        </div>

        <div className="space-y-3">
          {f.images.map((src, i) => {
            const m = f.imageMeta.find((x) => x.url === src);
            return (
              <div key={src + i} className="flex gap-3 rounded-lg border border-line p-3">
                <div className="relative h-24 w-32 shrink-0 overflow-hidden rounded-md">
                  <Image src={src} alt={m?.altEn || ""} fill className="object-cover" sizes="128px" />
                  {i === 0 && (
                    <span className="absolute left-1 top-1 rounded bg-fire px-1.5 text-[10px] font-bold text-white">封面</span>
                  )}
                  <button
                    type="button"
                    onClick={() => removeImage(i)}
                    className="absolute right-1 top-1 rounded bg-black/60 px-1.5 text-xs text-white"
                  >
                    ✕
                  </button>
                </div>
                <div className="grid flex-1 gap-2 sm:grid-cols-2">
                  <select
                    value={m?.kind || "other"}
                    onChange={(e) => setMetaField(src, "kind", e.target.value)}
                    className="rounded-md border border-line bg-bg px-2 py-1.5 text-sm text-ink sm:col-span-2"
                  >
                    {["facade","living","bedroom","kitchen","pool","facility","view","floorplan","location","other"].map((k) => (
                      <option key={k} value={k}>{k}</option>
                    ))}
                  </select>
                  <input
                    placeholder="alt (EN)"
                    value={m?.altEn || ""}
                    onChange={(e) => setMetaField(src, "altEn", e.target.value)}
                    className="rounded-md border border-line bg-bg px-2 py-1.5 text-sm text-ink"
                  />
                  <input
                    placeholder="alt (中文)"
                    value={m?.altZh || ""}
                    onChange={(e) => setMetaField(src, "altZh", e.target.value)}
                    className="rounded-md border border-line bg-bg px-2 py-1.5 text-sm text-ink"
                  />
                  <input
                    placeholder="caption (EN)"
                    value={m?.captionEn || ""}
                    onChange={(e) => setMetaField(src, "captionEn", e.target.value)}
                    className="rounded-md border border-line bg-bg px-2 py-1.5 text-sm text-ink"
                  />
                  <input
                    placeholder="caption (中文)"
                    value={m?.captionZh || ""}
                    onChange={(e) => setMetaField(src, "captionZh", e.target.value)}
                    className="rounded-md border border-line bg-bg px-2 py-1.5 text-sm text-ink"
                  />
                </div>
              </div>
            );
          })}
        </div>
      </Section>

      {/* KPKT */}
      <Section title="KPKT 合规（推广新盘法律要求）">
        <Grid>
          <Field label="发展商执照号">
            <Input
              value={f.kpkt.developerLicenseNo}
              onChange={(v) => setKpkt("developerLicenseNo", v)}
            />
          </Field>
          <Field label="广告与销售准证 APDL">
            <Input
              value={f.kpkt.adPermitNo}
              onChange={(v) => setKpkt("adPermitNo", v)}
            />
          </Field>
          <Field label="准证有效期">
            <Input
              value={f.kpkt.validUntil}
              onChange={(v) => setKpkt("validUntil", v)}
            />
          </Field>
        </Grid>
        <label className="mt-3 flex items-center gap-2 text-sm text-ink">
          <input
            type="checkbox"
            checked={f.kpkt.filled}
            onChange={(e) => setKpkt("filled", e.target.checked)}
          />
          已填入真实 KPKT 号码（勾选后页面不再显示「待补」警示）
        </label>
      </Section>

      {/* 状态 / 审批 */}
      <Section title="上线状态 · 发展商审批">
        <Grid>
          <Field label="状态 Status">
            <Select
              value={f.status}
              onChange={(v) => set("status", v as Listing["status"])}
              options={[
                ["draft", "草稿 Draft（不公开）"],
                ["pending_approval", "待发展商批 Pending（不公开）"],
                ["approved", "已上线 Live（公开）"],
                ["sold", "已售 Sold"],
              ]}
            />
          </Field>
          <Field label="发展商批准人 Approved by">
            <Input
              value={f.approval.approvedBy ?? ""}
              onChange={(v) =>
                set("approval", { ...f.approval, approvedBy: v || null })
              }
            />
          </Field>
          <Field label="批准日期 Approved at">
            <Input
              value={f.approval.approvedAt ?? ""}
              onChange={(v) =>
                set("approval", { ...f.approval, approvedAt: v || null })
              }
            />
          </Field>
        </Grid>
        <p className="mt-2 text-xs text-fire">
          ⚠️ 只有「已上线 Live」会公开显示。推广项目前，请先取得发展商 marketing 书面批准再设为上线。
        </p>
      </Section>

      {msg && (
        <p className="rounded-lg bg-surface px-4 py-3 text-sm text-ink">{msg}</p>
      )}

      <div className="flex items-center gap-3">
        <button
          onClick={save}
          disabled={busy}
          className="rounded-full bg-fire px-7 py-3 font-semibold text-white transition hover:bg-fire-2 disabled:opacity-60"
        >
          {busy ? "处理中…" : editing ? "保存修改 Save" : "新增房源 Create"}
        </button>
        <button
          onClick={() => router.push("/admin")}
          className="rounded-full border border-line px-5 py-3 text-sm text-muted hover:text-ink"
        >
          取消
        </button>
        {editing && (
          <button
            onClick={remove}
            disabled={busy}
            className="ml-auto rounded-full px-5 py-3 text-sm text-fire hover:underline"
          >
            删除房源
          </button>
        )}
      </div>
    </div>
  );
}

// ── 小组件 ──
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-xl border border-line bg-surface/40 p-6">
      <h2 className="font-display mb-4 text-lg font-bold text-ink">{title}</h2>
      {children}
    </section>
  );
}
function Grid({ children }: { children: React.ReactNode }) {
  return <div className="grid gap-4 sm:grid-cols-2">{children}</div>;
}
function Field({
  label,
  req,
  children,
}: {
  label: string;
  req?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm text-muted">
        {label} {req && <span className="text-fire">*</span>}
      </span>
      {children}
    </label>
  );
}
function Input({
  value,
  onChange,
  type = "text",
}: {
  value: string;
  onChange: (v: string) => void;
  type?: string;
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-lg border border-line bg-bg px-3 py-2.5 text-ink outline-none focus:border-fire"
    />
  );
}
function Textarea({
  value,
  onChange,
  rows = 4,
}: {
  value: string;
  onChange: (v: string) => void;
  rows?: number;
}) {
  return (
    <textarea
      value={value}
      rows={rows}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-lg border border-line bg-bg px-3 py-2.5 text-ink outline-none focus:border-fire"
    />
  );
}
function Select({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  options: [string, string][];
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-lg border border-line bg-bg px-3 py-2.5 text-ink outline-none focus:border-fire"
    >
      {options.map(([v, l]) => (
        <option key={v} value={v}>
          {l}
        </option>
      ))}
    </select>
  );
}
