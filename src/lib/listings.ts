/**
 * 房源型别定义。真实数据来自 Supabase（见 data.ts）。
 * 这个 Listing 型别 = 数据库一行。小白用户在 /admin 后台填表格维护，不碰代码。
 */

export type ListingStatus = "draft" | "pending_approval" | "approved" | "sold";
export type ListingCategory = "high_rise" | "landed" | "commercial";

/** 图片类型——驱动 AI 出题、alt/caption 与结构化数据。 */
export type ImageKind =
  | "facade" // 楼盘外观 / 建筑
  | "living" // 客厅 / 示范单位
  | "bedroom" // 睡房
  | "kitchen" // 厨房 / 餐厅
  | "pool" // 泳池
  | "facility" // 健身房 / 大堂 / 设施
  | "view" // 景观 / 阳台外望
  | "floorplan" // 平面图 / 户型图
  | "location" // 位置 / 地图 / 周边
  | "other";

/** 每张图的 SEO 元数据（按 url 对应 images[]）。 */
export interface ImageMeta {
  url: string;
  kind: ImageKind;
  altEn: string; // 英文 alt（简短描述图中是什么）
  altZh: string; // 中文 alt
  captionEn: string; // 英文 caption（结构化数据 / lightbox）
  captionZh: string; // 中文 caption
}

export interface Listing {
  id?: string;
  slug: string;
  title: string; // 中文标题
  titleEn: string; // 英文标题
  developer: string;
  projectType: "new_launch" | "subsale" | "rent";
  category: ListingCategory; // 高层公寓 / 有地排屋
  area: string;
  city: string;
  priceFrom: number;
  bedrooms: string;
  bathrooms: string;
  sizeSqft: string; // 建筑面积（built-up）
  landSize: string; // 地皮尺寸，例 "20x70"（有地排屋用；高层公寓留空）
  tenure: string;
  highlights: string[]; // 中文卖点
  highlightsEn: string[]; // 英文卖点
  description: string; // 中文描述
  descriptionEn: string; // 英文描述
  images: string[];
  imageMeta: ImageMeta[]; // 每张图的 SEO 元数据（按 url 对应）
  lat: number;
  lng: number;
  builtYear: string;
  parking: string;
  furnishing: string;
  facing: string;
  amenities: string[]; // 中文设施
  amenitiesEn: string[]; // 英文设施

  // KPKT 合规栏位（推广新盘法律要求；号码待 KSL 提供）
  kpkt: {
    developerLicenseNo: string;
    adPermitNo: string;
    validUntil: string;
    filled: boolean;
  };

  // KSL 审批闸门
  status: ListingStatus;
  approval: {
    approvedBy: string | null;
    approvedAt: string | null;
  };

  updatedAt: string;
}

/**
 * 本地种子数据 = 本站两个项目（Richmond JBCC + Richmond Mayor · 全 Johor）。
 * 未配 Supabase 时全站直接吃这份数据，零数据库可跑。
 * ⚠️ TODO 上线前：priceFrom 填真实起价（现为 0 = 显示「价格待询」）；kpkt 准证号向发展商索取。
 */
export const LISTINGS: Listing[] = [
  {
    slug: "richmond-mayor",
    title: "Richmond Mayor 新山 Mount Austin · Capri by Fraser 酒店套房（抢先预览）",
    titleEn: "Richmond Mayor — Hotel Suites Managed by Capri by Fraser, Mount Austin JB (Exclusive Preview)",
    developer: "Richmond Asia",
    projectType: "new_launch",
    category: "high_rise",
    area: "Mount Austin",
    city: "Johor Bahru",
    priceFrom: 0,
    bedrooms: "Studio / 1 / 2",
    bathrooms: "",
    sizeSqft: "323 – 431",
    landSize: "",
    tenure: "Freehold / 永久地契",
    highlights: [
      "抢先预览（Exclusive Preview）—— 登记优先获取价目与户型",
      "凯德旗下 Frasers Hospitality「Capri by Fraser」品牌管理酒店套房",
      "275 间套房（Studio / 一房 / 两房），预计 2030 年开业",
      "混合开发地标：酒店套房 + 服务套房 + 办公 + 精品生活商场",
      "永久地契，位于柔佛-新加坡经济特区（JS-SEZ）范围",
      "Mount Austin 成熟商圈：IKEA Tebrau、美食街、水上乐园",
      "外国人可购买",
    ],
    highlightsEn: [
      "Exclusive Preview — register for early access to pricing & layouts",
      "Hotel suites managed under Frasers Hospitality's Capri by Fraser brand",
      "275 suites (studio / 1-bedroom / 2-bedroom), opening 2030",
      "Integrated landmark: hotel suites + serviced suites + offices + premium lifestyle mall",
      "Freehold, within the Johor–Singapore Special Economic Zone (JS-SEZ)",
      "Mount Austin hub: IKEA Tebrau, food streets, water park",
      "Open to foreign buyers",
    ],
    description:
      "Richmond Mayor 是 Richmond Asia 在新山 Mount Austin 打造的永久地契混合开发地标，把酒店套房、服务套房、办公空间与精品生活商场整合在同一个地址。酒店套房部分由 Frasers Hospitality 旗下 Capri by Fraser 品牌管理 —— 共 275 间 Studio、一房与两房套房，预计 2030 年开业，配套全日餐厅、住户酒廊、泳池、健身房与会议空间。项目落在柔佛-新加坡经济特区（JS-SEZ）范围内，背靠 Mount Austin 成熟商圈：IKEA Tebrau、Austin Heights 水上乐园、美食街与国际学校、医院一应俱全。现处抢先预览（Exclusive Preview）阶段，登记即可优先获取价目表与户型资料。",
    descriptionEn:
      "Richmond Mayor is Richmond Asia's freehold mixed-use landmark in Mount Austin, Johor Bahru — hotel suites, serviced suites, offices and a premium lifestyle mall united at a single address. The hotel-suites component is managed under Frasers Hospitality's Capri by Fraser brand: 275 studio, one-bedroom and two-bedroom suites opening in 2030, with an all-day dining restaurant, residents' lounge, pool, gym and meeting spaces. The development sits within the Johor–Singapore Special Economic Zone (JS-SEZ), backed by the mature Mount Austin hub — IKEA Tebrau, Austin Heights water park, food streets, international schools and hospitals. Now in Exclusive Preview: register for early access to pricing and layouts.",
    images: [
      "/listings/richmond-mayor-facade.jpg",
      "/listings/richmond-mayor.jpg",
      "/listings/richmond-mayor-2.jpg",
      "/listings/richmond-mayor-3.jpg",
    ],
    imageMeta: [
      {
        url: "/listings/richmond-mayor-facade.jpg",
        kind: "facade",
        altEn: "Richmond Mayor towers and lifestyle mall facade with signage, Mount Austin Johor Bahru",
        altZh: "Richmond Mayor 塔楼与生活商场外观（Mount Austin 新山）",
        captionEn: "Richmond Mayor — towers above the premium lifestyle mall, Mount Austin",
        captionZh: "Richmond Mayor —— 精品商场之上的双塔地标，Mount Austin",
      },
      {
        url: "/listings/richmond-mayor.jpg",
        kind: "facade",
        altEn: "Richmond Mayor mixed-use development render in Mount Austin, Johor Bahru",
        altZh: "Richmond Mayor 新山 Mount Austin 混合开发项目效果图",
        captionEn: "Richmond Mayor — freehold mixed-use landmark, Mount Austin JB",
        captionZh: "Richmond Mayor —— 新山 Mount Austin 永久地契混合开发地标",
      },
      {
        url: "/listings/richmond-mayor-2.jpg",
        kind: "facility",
        altEn: "Lifestyle mall and hotel suites at Richmond Mayor, Johor Bahru",
        altZh: "Richmond Mayor 生活商场与酒店套房效果图",
        captionEn: "Hotel suites, serviced suites, offices and a premium mall in one address",
        captionZh: "酒店套房、服务套房、办公与精品商场一体",
      },
      {
        url: "/listings/richmond-mayor-3.jpg",
        kind: "living",
        altEn: "Suite interior render at Richmond Mayor managed by Capri by Fraser",
        altZh: "Richmond Mayor 套房室内效果图（Capri by Fraser 管理）",
        captionEn: "Suites managed under the Capri by Fraser brand",
        captionZh: "Capri by Fraser 品牌管理套房",
      },
    ],
    lat: 1.558,
    lng: 103.7752,
    builtYear: "2030",
    parking: "",
    furnishing: "Fully furnished / 精装全家私",
    facing: "",
    amenities: [
      "全日餐厅",
      "住户酒廊",
      "泳池",
      "健身房",
      "会议空间",
      "精品生活商场（同址）",
    ],
    amenitiesEn: [
      "All-day dining restaurant",
      "Residents' lounge",
      "Swimming pool",
      "Gym",
      "Meeting spaces",
      "Premium lifestyle mall (same address)",
    ],
    kpkt: { developerLicenseNo: "", adPermitNo: "", validUntil: "", filled: false },
    status: "approved",
    approval: { approvedBy: null, approvedAt: null },
    updatedAt: "2026-07-11",
  },
  {
    slug: "richmond-jbcc",
    title: "Richmond JBCC 新山市中心 · Hyatt Place 酒店式套房",
    titleEn: "Richmond JBCC — Freehold Hotel Suites Managed by Hyatt Place, JB City Centre",
    developer: "Richmond Asia",
    projectType: "new_launch",
    category: "high_rise",
    area: "JB City Centre",
    city: "Johor Bahru",
    // 起价来自项目公开行销资料（RM9xxK 起）——以最新价目表为准
    priceFrom: 900000,
    bedrooms: "",
    bathrooms: "",
    sizeSqft: "301 – 614",
    landSize: "",
    tenure: "Freehold / 永久地契",
    highlights: [
      "5 年 32% 保证回酬（GRR）：首 3 年 6% p.a. + 后 2 年 7% p.a.*",
      "第 6–15 年净利分红 70/30（业主 70%），可续约 10 年*",
      "永久地契酒店式套房，由 Hyatt Place（凯悦集团）管理",
      "首 5 年每年 5 晚免费住宿 + 精装全家私",
      "柔佛首创玻璃底高空泳池，毗邻新柔捷运 RTS（2027）",
      "外国人 / 新加坡人可购买",
    ],
    highlightsEn: [
      "32% Guaranteed Rental Return over 5 years: 6% p.a. (yrs 1–3) + 7% p.a. (yrs 4–5)*",
      "Years 6–15: net profit sharing 70/30 (70% to owners), renewable 10 years*",
      "Freehold hotel suites managed by Hyatt Place (Hyatt Hotels Corporation)",
      "5 complimentary nights yearly (first 5 years) + fully furnished",
      "Johor's first Celestial Glass-Bottom Pool, minutes from the RTS Link (2027)",
      "Open to foreign & Singaporean buyers",
    ],
    description:
      "Richmond JBCC 位于新山市中心商业区（JBCC），紧邻陈旭年文化街，是 Richmond Asia 打造、由凯悦集团 Hyatt Place 品牌管理的永久地契酒店式套房。项目落在依斯干达经济特区与 IIBD 国际商业区的核心地段，步行可达 JB City Square（75 米）与 Komtar JBCC（1 公里）；新柔捷运 RTS 通车后（预计 2027 年），5 分钟即可过境新加坡。招牌设施为柔佛首创的玻璃底高空泳池，另配 280 人宴会厅、餐厅、健身房与会议空间 —— 城市脉动与老街风华在此交汇。",
    descriptionEn:
      "Richmond JBCC sits in the Johor Bahru Central Business District beside Tan Hiok Nee Heritage Street — freehold hotel suites by Richmond Asia, managed under the Hyatt Place brand of Hyatt Hotels Corporation. The development is at the core of the Iskandar Special Economic Zone and the Ibrahim International Business District (IIBD), steps from JB City Square (75m) and Komtar JBCC (1km). Once the JB–Singapore RTS Link opens (expected 2027), Singapore is a 5-minute crossing away. Signature facilities include Johor's first Celestial Glass-Bottom Pool, plus a 280-pax ballroom, restaurant, gym and meeting spaces — where city pulse meets heritage charm.",
    images: [
      "/listings/richmond-jbcc-lobby.webp",
      "/listings/richmond-jbcc-aerial.jpg",
      "/listings/richmond-jbcc.webp",
      "/listings/richmond-jbcc-bedroom.webp",
      "/listings/richmond-jbcc-facilities.webp",
    ],
    imageMeta: [
      {
        url: "/listings/richmond-jbcc.webp",
        kind: "facade",
        altEn: "Richmond JBCC tower in Johor Bahru City Centre",
        altZh: "Richmond JBCC 新山市中心项目外观",
        captionEn: "Richmond JBCC — freehold hotel suites in the JB Central Business District",
        captionZh: "Richmond JBCC —— 新山市中心永久地契酒店式套房",
      },
      {
        url: "/listings/richmond-jbcc-lobby.webp",
        kind: "facility",
        altEn: "Grand hotel lobby at Richmond JBCC managed by Hyatt Place",
        altZh: "Richmond JBCC 酒店大堂（Hyatt Place 管理）",
        captionEn: "Grand lobby — managed under the Hyatt Place brand",
        captionZh: "气派大堂 —— 由 Hyatt Place 品牌管理",
      },
      {
        url: "/listings/richmond-jbcc-bedroom.webp",
        kind: "bedroom",
        altEn: "Deluxe suite bedroom at Richmond JBCC, Johor Bahru",
        altZh: "Richmond JBCC 豪华套房卧室",
        captionEn: "Deluxe hotel suite interior",
        captionZh: "豪华酒店式套房室内",
      },
      {
        url: "/listings/richmond-jbcc-facilities.webp",
        kind: "pool",
        altEn: "Celestial Glass-Bottom Pool and facilities at Richmond JBCC",
        altZh: "Richmond JBCC 玻璃底高空泳池与设施",
        captionEn: "Johor's first Celestial Glass-Bottom Pool",
        captionZh: "柔佛首创玻璃底高空泳池",
      },
      {
        url: "/listings/richmond-jbcc-aerial.jpg",
        kind: "location",
        altEn: "Aerial view of Richmond JBCC beside the JB–Singapore Causeway, near Bukit Chagar RTS station and CIQ",
        altZh: "Richmond JBCC 航拍图 —— 毗邻新柔长堤、Bukit Chagar 捷运站与 CIQ 关卡",
        captionEn: "Aerial: Richmond JBCC between the CIQ, Bukit Chagar RTS station and the Causeway",
        captionZh: "航拍：Richmond JBCC 座落于 CIQ 关卡、Bukit Chagar 捷运站与长堤之间",
      },
    ],
    lat: 1.4589,
    lng: 103.7626,
    builtYear: "",
    parking: "",
    furnishing: "Fully furnished / 精装全家私",
    facing: "",
    amenities: [
      "玻璃底高空泳池",
      "280 人宴会厅",
      "餐厅（100 人）",
      "健身房",
      "会议室与多功能空间",
      "酒店大堂与礼宾服务",
    ],
    amenitiesEn: [
      "Celestial Glass-Bottom Pool",
      "Ballroom (280 pax)",
      "Restaurant (100 pax)",
      "Gym",
      "Meeting rooms & multipurpose spaces",
      "Hotel lobby & concierge",
    ],
    kpkt: { developerLicenseNo: "", adPermitNo: "", validUntil: "", filled: false },
    status: "approved",
    approval: { approvedBy: null, approvedAt: null },
    updatedAt: "2026-07-11",
  },
];

export function formatPrice(rm: number): string {
  return "RM " + rm.toLocaleString("en-MY");
}

/** 价格显示：起价未公开（0）时显示「价格待询」，不编数字。 */
export function priceText(rm: number, lang: "en" | "zh"): string {
  if (!rm || rm <= 0) return lang === "zh" ? "价格待询" : "Price on request";
  return formatPrice(rm);
}

/**
 * 外国人购买资格标签（仿 KSL 官网：🌍 Foreigner Friendly / 🇲🇾 Bumi）。
 * 数据信号优先（很多房源 highlights 已写「外国人可购买 / Open to foreign buyers」或 bumi），
 * 没写的再兜底：高层公寓 / 有地≥RM100万 → 外国人可买；商铺工厂、低于百万的有地 → 不标。
 * 纯函数，之后若加 DB 旋钮可逐项覆盖。
 */
export function foreignerStatus(
  l: Pick<Listing, "slug" | "title" | "titleEn" | "highlights" | "highlightsEn" | "category" | "priceFrom">,
): "foreign" | "bumi" | null {
  const blob = [
    l.slug,
    l.title,
    l.titleEn,
    ...(l.highlights ?? []),
    ...(l.highlightsEn ?? []),
  ]
    .join(" ")
    .toLowerCase();
  if (blob.includes("bumi")) return "bumi";
  if (blob.includes("foreign") || blob.includes("外国人")) return "foreign";
  if (l.category === "high_rise") return "foreign";
  if (l.category === "landed" && l.priceFrom >= 1_000_000) return "foreign";
  return null;
}

/** 取某张图的元数据（没有就 undefined）。 */
export function metaFor(listing: Pick<Listing, "imageMeta">, url: string): ImageMeta | undefined {
  return listing.imageMeta?.find((m) => m.url === url);
}

/**
 * 渲染用：拿一张图最合适的 alt。
 * 优先用人工/AI 生成的 meta alt；没有则回退到「项目名 — 区域, 城市」。
 */
export function altFor(
  listing: Pick<Listing, "imageMeta" | "titleEn" | "title" | "area" | "city">,
  url: string,
  lang: "en" | "zh",
): string {
  const m = metaFor(listing, url);
  const metaAlt = lang === "zh" ? m?.altZh : m?.altEn;
  if (metaAlt) return metaAlt;
  const base = `${listing.titleEn || listing.title} — ${[listing.area, listing.city].filter(Boolean).join(", ")}`;
  return base;
}
