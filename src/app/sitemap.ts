import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";
import { getPublicListings } from "@/lib/data";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const listings = await getPublicListings();

  // 两项目站：链接权重全部聚焦项目深页，不做分面页
  const routes: { rest: string; pri: number; mod?: Date; images?: string[] }[] = [
    { rest: "", pri: 1 },
    { rest: "/projects", pri: 0.9 },
    ...listings.map((l) => ({
      rest: `/projects/${l.slug}`,
      pri: 0.9,
      mod: l.updatedAt ? new Date(l.updatedAt) : now,
      // 把每个项目的全部照片喂给 Google 图片搜索（image sitemap，补全站点域名）
      images: (l.images ?? []).map((u) =>
        /^https?:\/\//.test(u) ? u : `${SITE.url}${u}`,
      ),
    })),
    { rest: "/privacy", pri: 0.2 },
    { rest: "/terms", pri: 0.2 },
  ];

  // 每个 URL 出 en + zh 两条，带 hreflang alternates
  return routes.flatMap(({ rest, pri, mod, images }) =>
    (["en", "zh"] as const).map((lang) => ({
      url: `${SITE.url}/${lang}${rest}`,
      lastModified: mod ?? now,
      changeFrequency: "weekly" as const,
      priority: pri,
      ...(images && images.length ? { images } : {}),
      alternates: {
        languages: {
          en: `${SITE.url}/en${rest}`,
          "zh-MY": `${SITE.url}/zh${rest}`,
        },
      },
    })),
  );
}
