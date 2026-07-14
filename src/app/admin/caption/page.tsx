import Link from "next/link";
import { getAllListings } from "@/lib/data";
import BatchCaption, { type CaptionRow } from "@/components/admin/BatchCaption";

export const dynamic = "force-dynamic";

export default async function CaptionPage() {
  const listings = await getAllListings();
  const rows: CaptionRow[] = listings
    .filter((l) => l.id && l.images.length > 0)
    .map((l) => ({
      id: l.id!,
      slug: l.slug,
      title: l.title,
      titleEn: l.titleEn,
      area: l.area,
      city: l.city,
      developer: l.developer,
      category: l.category,
      images: l.images,
      hasMeta: l.imageMeta.length > 0,
    }));

  return (
    <main className="mx-auto min-h-screen max-w-4xl px-5 py-10">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-extrabold text-ink">
            AI 描述图片 Image SEO
          </h1>
          <p className="text-sm text-muted">
            AI 看图自动写每张图的双语 alt + caption（喂 Google 图片 / AI 搜索）。可在房源编辑页逐张修改。
          </p>
        </div>
        <Link
          href="/admin"
          className="rounded-full border border-line px-5 py-2.5 text-sm font-semibold text-ink transition hover:border-fire"
        >
          ← 返回
        </Link>
      </div>
      <BatchCaption listings={rows} />
    </main>
  );
}
