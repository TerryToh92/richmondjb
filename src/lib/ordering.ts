import type { Listing } from "@/lib/listings";

/**
 * 首页 / 项目列表的自定义展示顺序。
 * 本站只有两个项目：JBCC（销售中·有导览）在前，Mayor（抢先预览）在后。要调顺序改这个名单即可。
 */
export const FEATURED_ORDER: string[] = [
  "richmond-jbcc",
  "richmond-mayor",
];

const RANK = new Map(FEATURED_ORDER.map((slug, i) => [slug, i]));

/** 分桶：0=钉选，1=CIQ 公寓，2=其他公寓，3=其他有地，4=商铺/工厂（垫底）。 */
function bucket(l: Listing): number {
  if (RANK.has(l.slug)) return 0;
  if (l.category === "commercial") return 4;
  if (l.category === "landed") return 3;
  // high_rise（公寓）：CIQ 的排前面
  const isCiq = /ciq/i.test(l.area) || /ciq/i.test(l.city);
  return isCiq ? 1 : 2;
}

/** 按自定义顺序排列房源。稳定排序（同桶保留原顺序，即 updated_at 倒序）。 */
export function orderListings(all: Listing[]): Listing[] {
  return all
    .map((l, i) => ({ l, i }))
    .sort((a, b) => {
      const ba = bucket(a.l);
      const bb = bucket(b.l);
      if (ba !== bb) return ba - bb;
      if (ba === 0) return RANK.get(a.l.slug)! - RANK.get(b.l.slug)!;
      return a.i - b.i; // 同桶稳定
    })
    .map((x) => x.l);
}
