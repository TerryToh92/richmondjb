/**
 * 每个项目的深度内容层（developer-microsite 式详情页 + SEO/GEO 弹药）。
 * 铁律：距离/数据只用官方公开的真实数字；没有数字就用定性描述（步行可达），不编；
 * 收益率/回酬承诺一律不放。
 * FAQ 会输出 FAQPage 结构化数据 —— 这是两项目站吃 GEO（AI 搜索）的主力。
 */
import type { Lang } from "./i18n";

export interface NearbyItem {
  nameEn: string;
  nameZh: string;
  /** 显示用距离；官网没给数字就写定性（"步行 / Walk"） */
  dist: string;
}

export interface ProjectFaq {
  qEn: string;
  aEn: string;
  qZh: string;
  aZh: string;
}

export interface LayoutPlan {
  img: string;
  nameEn: string;
  nameZh: string;
  /** 官方公开的尺寸；没公开就留空（显示上会隐藏，不编数字） */
  size: string;
}

/** 发展商奖项（Richmond Asia · 取自官方网站，档名即奖项全名） */
export interface Award {
  img: string;
  nameEn: string;
  nameZh: string;
}

export const AWARDS: Award[] = [
  {
    img: "/awards/propertyguru-asia-property-awards-2024-best-designed-development-malaysia.png",
    nameEn: "PropertyGuru Asia Property Awards 2024 — Best Designed Development (Malaysia) · Best Branded Residential Development (Asia)",
    nameZh: "PropertyGuru 亚洲房地产大奖 2024 · 马来西亚最佳设计发展项目 · 亚洲最佳品牌住宅发展项目",
  },
  {
    img: "/awards/asean-property-developer-awards-20232024-best-hotel-suites-development.png",
    nameEn: "ASEAN Property Developer Awards 2023/2024 — Best Hotel Suites Development",
    nameZh: "东盟房地产发展商大奖 2023/2024 · 最佳酒店套房发展项目",
  },
  {
    img: "/awards/asia-architecture-design-awards-2025.png",
    nameEn: "Asia Architecture Design Awards 2025",
    nameZh: "亚洲建筑设计大奖 2025",
  },
  {
    img: "/awards/starproperty-awards-2024-the-outstanding-award-honours.png",
    nameEn: "StarProperty Awards 2024 — The Outstanding Award & Distinctive Build Award (Honours)",
    nameZh: "StarProperty 大奖 2024 · 杰出奖与卓越建筑奖（荣誉）",
  },
  {
    img: "/awards/apea-award-2024-inspirational-brand-award.png",
    nameEn: "APEA 2024 — Inspirational Brand Award",
    nameZh: "亚太企业精神奖 APEA 2024 · 卓越品牌奖",
  },
  {
    img: "/awards/ksi-award-2023-malaysia-property-development-excellence-achievement-award.png",
    nameEn: "KSI Award 2023 — Malaysia Property Development Excellence Achievement",
    nameZh: "KSI 大奖 2023 · 马来西亚房产发展卓越成就奖",
  },
  {
    img: "/awards/opal-award-2023-outstanding-property-award.png",
    nameEn: "OPAL Award 2023 — Outstanding Property Award",
    nameZh: "OPAL 大奖 2023 · 杰出房产奖",
  },
  {
    img: "/awards/appa-award-2023-leisure-development-asia-pacific-nominee.png",
    nameEn: "APPA 2023 — Leisure Development, Asia Pacific (Nominee)",
    nameZh: "APPA 2023 · 亚太休闲发展项目（入围）",
  },
];

/**
 * 投资方案（数字全部来自项目公开行销资料·以发展商正式合约为准）。
 * 有 invest 的项目，详情页出「投资回报」区 + 回酬计算器（成交名单工具）。
 */
export interface InvestScheme {
  /** 保证回酬阶段：[起始年, 结束年, 年化 %] */
  grrPhases: { fromYear: number; toYear: number; ratePct: number }[];
  /** 保证期合计 %（如 5 年 32%） */
  grrTotalPct: number;
  grrTotalYears: number;
  /** 保证期后的分红结构 */
  profitShareEn: string;
  profitShareZh: string;
  perksEn: string[];
  perksZh: string[];
  disclaimerEn: string;
  disclaimerZh: string;
}

/**
 * 目标回酬模式（无公开 GRR 方案的预览期项目用）：
 * 官方只公开「目标年化回报」宣称 → 计算器让客户按目标利率+自己预算示算，
 * CTA 引导登记拿正式方案。数字永远标注来源与免责。
 */
export interface TargetYield {
  defaultPct: number;
  minPct: number;
  maxPct: number;
  defaultPrice: number;
  sourceNoteEn: string;
  sourceNoteZh: string;
  disclaimerEn: string;
  disclaimerZh: string;
}

export interface ProjectExtra {
  slug: string;
  /** 状态徽章（如 Exclusive Preview）；无则不显示 */
  badgeEn?: string;
  badgeZh?: string;
  taglineEn: string;
  taglineZh: string;
  /** 自托管 360 虚拟导览（相对路径，new tab 打开） */
  tourUrl?: string;
  /** 户型图（layout plans） */
  layouts?: LayoutPlan[];
  /** 管理方 / 合作品牌 logo（深色需在渲染处反白） */
  partnerLogos?: { img: string; alt: string }[];
  /** 投资方案（GRR 等）——有则详情页出投资回报区 + 计算器 */
  invest?: InvestScheme;
  /** 目标回酬模式（预览期项目）——invest 没有时用这个出计算器 */
  targetYield?: TargetYield;
  /** Google Maps 嵌入查询（地点名或坐标）——location 区出地图 */
  mapQuery?: string;
  /** 招牌特色区（大图 + 叙事） */
  signatureTitleEn: string;
  signatureTitleZh: string;
  signatureBodyEn: string;
  signatureBodyZh: string;
  /** 周边地标（官方真实数据） */
  nearbyTitleEn: string;
  nearbyTitleZh: string;
  nearby: NearbyItem[];
  faq: ProjectFaq[];
}

const EXTRAS: Record<string, ProjectExtra> = {
  "richmond-jbcc": {
    slug: "richmond-jbcc",
    taglineEn: "Freehold hotel suites managed by Hyatt Place, where city pulse meets heritage charm",
    taglineZh: "Hyatt Place 管理的永久地契酒店式套房，城市脉动与老街风华交汇",
    tourUrl: "/tours/jbcc-hotel/index.html",
    mapQuery: "Richmond JBCC, Jalan Tan Hiok Nee, Johor Bahru",
    partnerLogos: [
      { img: "/brand/hyatt-logo.svg", alt: "Hyatt Place — Hyatt Hotels Corporation" },
    ],
    invest: {
      grrPhases: [
        { fromYear: 1, toYear: 3, ratePct: 6 },
        { fromYear: 4, toYear: 5, ratePct: 7 },
      ],
      grrTotalPct: 32,
      grrTotalYears: 5,
      profitShareEn:
        "Years 6–15: net profit sharing — 70% to owners, 30% to the operator, with an option to renew for another 10 years.",
      profitShareZh:
        "第 6–15 年：净利分红 —— 业主 70%、运营方 30%，期满可续约 10 年。",
      perksEn: [
        "5 complimentary nights per year (first 5 years)",
        "Fully furnished — hotel-managed, hands-off ownership",
        "Developer buyback option after year 10 (at ~3% p.a. premium)",
      ],
      perksZh: [
        "首 5 年每年 5 晚免费住宿",
        "精装全家私 —— 酒店托管，业主零操心",
        "第 10 年后发展商买回选项（约 3% p.a. 溢价）",
      ],
      disclaimerEn:
        "*Figures from the project's published marketing materials. All returns, terms and eligibility are subject to the developer's official agreement (SPA & GRR contract). This is an illustration, not financial advice.",
      disclaimerZh:
        "*数字来自项目公开行销资料。所有回酬、条款与资格以发展商正式合约（SPA 与 GRR 合约）为准。本工具仅为示算，不构成投资建议。",
    },
    layouts: [
      {
        img: "/listings/richmond-jbcc-type-a.png",
        nameEn: "Type A · Hotel Rooms (Twin & King)",
        nameZh: "Type A · 酒店客房（双床 / 大床）",
        size: "",
      },
      {
        img: "/listings/richmond-jbcc-type-c.png",
        nameEn: "Type C · Suite with Living & Dining",
        nameZh: "Type C · 客厅餐区套房",
        size: "",
      },
    ],
    signatureTitleEn: "Johor's first Celestial Glass-Bottom Pool",
    signatureTitleZh: "柔佛首创玻璃底高空泳池",
    signatureBodyEn:
      "The Celestial Glass-Bottom Pool — the first in Johor — crowns a development managed under the Hyatt Place brand of Hyatt Hotels Corporation. Below it: a 280-pax ballroom, restaurant, gym and meeting spaces, all beside Tan Hiok Nee Heritage Street in the core of the Iskandar Special Economic Zone.",
    signatureBodyZh:
      "柔佛首创的玻璃底高空泳池，是这座由凯悦集团 Hyatt Place 品牌管理项目的封顶之作。楼下配 280 人宴会厅、餐厅、健身房与会议空间，项目紧邻陈旭年文化街，落在依斯干达经济特区的核心。",
    nearbyTitleEn: "The JB CBD at your doorstep",
    nearbyTitleZh: "新山市中心，出门即达",
    nearby: [
      { nameEn: "Tan Hiok Nee Heritage Street", nameZh: "陈旭年文化街", dist: "50m" },
      { nameEn: "JB City Square", nameZh: "JB City Square 商场", dist: "75m" },
      { nameEn: "Maria Hospital", nameZh: "Maria 医院", dist: "350m" },
      { nameEn: "R&F Marina Mall", nameZh: "R&F 码头商场", dist: "750m" },
      { nameEn: "Komtar JBCC", nameZh: "Komtar JBCC", dist: "1km" },
      { nameEn: "JB–Singapore RTS Link (2027)", nameZh: "新柔捷运 RTS（2027）", dist: "5 min crossing / 5 分钟过境" },
    ],
    faq: [
      {
        qEn: "What is Richmond JBCC?",
        aEn: "Richmond JBCC is a freehold hotel-suites development by Richmond Asia Group in the Johor Bahru Central Business District, managed under the Hyatt Place brand of Hyatt Hotels Corporation, beside Tan Hiok Nee Heritage Street and inside the Iskandar Special Economic Zone.",
        qZh: "Richmond JBCC 是什么项目？",
        aZh: "Richmond JBCC 是 Richmond Asia Group 在新山市中心商业区打造的永久地契酒店式套房项目，由凯悦集团 Hyatt Place 品牌管理，紧邻陈旭年文化街，落在依斯干达经济特区内。",
      },
      {
        qEn: "How close is Richmond JBCC to Singapore?",
        aEn: "The development sits near the upcoming JB–Singapore Rapid Transit System (RTS) Link. Once it opens (expected 2027), the crossing to Singapore takes about 5 minutes.",
        qZh: "Richmond JBCC 离新加坡多近？",
        aZh: "项目靠近未来的新柔捷运 RTS 站，通车后（预计 2027 年）约 5 分钟即可过境新加坡。",
      },
      {
        qEn: "What does Hyatt Place management mean for owners?",
        aEn: "Suites are operated under the Hyatt Place brand of Hyatt Hotels Corporation — fully furnished, professionally run, with owners able to participate in the rental income programme without self-managing. Ask the sales team for the current programme terms.",
        qZh: "Hyatt Place 管理对业主意味着什么？",
        aZh: "套房由凯悦集团 Hyatt Place 品牌运营 —— 精装全家私、专业管理，业主可参与租赁收益计划、不必自己打理。最新计划条款请向销售团队索取。",
      },
      {
        qEn: "Can Singaporeans buy Richmond JBCC?",
        aEn: "Yes. Richmond JBCC is open to foreign buyers including Singaporeans, subject to Johor's minimum purchase price for foreigners. WhatsApp the sales team to confirm eligibility and the buying process.",
        qZh: "新加坡人可以买 Richmond JBCC 吗？",
        aZh: "可以。Richmond JBCC 开放给包括新加坡人在内的外国买家，须符合柔佛州的外国人最低购买价门槛。WhatsApp 销售团队核对资格与购买流程。",
      },
      {
        qEn: "What is the Richmond JBCC guaranteed rental return (GRR)?",
        aEn: "Published marketing materials outline a 15-year programme: 32% guaranteed rental return over the first 5 years (6% p.a. for years 1–3, 7% p.a. for years 4–5), then net profit sharing of 70/30 in favour of owners for years 6–15, renewable for another 10 years — plus 5 complimentary nights yearly for the first 5 years. All terms are subject to the developer's official agreement.",
        qZh: "Richmond JBCC 的保证回酬（GRR）是怎么算的？",
        aZh: "根据项目公开行销资料：15 年方案 —— 首 5 年保证回酬共 32%（第 1–3 年每年 6%、第 4–5 年每年 7%），第 6–15 年净利分红业主 70% / 运营方 30%、期满可续约 10 年；首 5 年另享每年 5 晚免费住宿。所有条款以发展商正式合约为准。",
      },
      {
        qEn: "Can I view the Richmond JBCC hotel suites online?",
        aEn: "Yes — take the 360° virtual tour of the hotel suites and facilities right on this site, then WhatsApp the sales team to arrange an in-person gallery visit.",
        qZh: "可以在线看 Richmond JBCC 的套房吗？",
        aZh: "可以 —— 本站内置酒店套房与设施的 360° 虚拟导览，看完可 WhatsApp 销售团队预约实地参观展销厅。",
      },
    ],
  },
  "richmond-mayor": {
    slug: "richmond-mayor",
    badgeEn: "Exclusive Preview",
    badgeZh: "抢先预览",
    taglineEn: "Mount Austin's integrated landmark — hotel suites managed by Capri by Fraser, now in Exclusive Preview",
    taglineZh: "Mount Austin 混合地标 —— Capri by Fraser 管理酒店套房，抢先预览开放登记",
    mapQuery: "Mount Austin, Johor Bahru",
    targetYield: {
      defaultPct: 10,
      minPct: 8,
      maxPct: 12,
      defaultPrice: 600000,
      sourceNoteEn:
        "The developer's official materials cite attractive long-term returns exceeding 10% annually for Richmond Mayor.",
      sourceNoteZh:
        "发展商官方资料显示 Richmond Mayor 瞄准长期年化回报超过 10%。",
      disclaimerEn:
        "*Illustration only, based on the developer's published target-return claim. Pricing and the official return scheme are released to registered preview buyers first — register to receive the official terms. Not financial advice.",
      disclaimerZh:
        "*仅为按发展商公开目标回报宣称的示算。价目表与正式回酬方案将优先发放给预览登记买家 —— 登记即可获取正式条款。不构成投资建议。",
    },
    layouts: [
      { img: "/listings/richmond-mayor-type-a.png", nameEn: "Type A · Studio", nameZh: "Type A · Studio", size: "30 sqm / 323 sqft" },
      { img: "/listings/richmond-mayor-type-b.png", nameEn: "Type B · Suite", nameZh: "Type B · 套房", size: "40 sqm / 431 sqft" },
      {
        img: "/listings/richmond-mayor-floorplan-1.jpg",
        nameEn: "Hotel Suite Floor Plate · LVL 18–26 (Type A / A1 / B / B1)",
        nameZh: "酒店套房楼层平面 · 18–26 层（Type A / A1 / B / B1）",
        size: "",
      },
      {
        img: "/listings/richmond-mayor-floorplan-2.jpg",
        nameEn: "Hotel Suite Floor Plate · LVL 27–29 (Type C / C1 / D / D1)",
        nameZh: "酒店套房楼层平面 · 27–29 层（Type C / C1 / D / D1）",
        size: "",
      },
    ],
    partnerLogos: [
      { img: "/brand/frasers-hospitality.svg", alt: "Frasers Hospitality — Capri by Fraser" },
    ],
    signatureTitleEn: "Capri by Fraser — Frasers Hospitality's premium brand",
    signatureTitleZh: "Capri by Fraser —— Frasers Hospitality 高端品牌进驻",
    signatureBodyEn:
      "Richmond Asia Group has appointed Frasers Hospitality — operator in 70+ cities worldwide — to manage Richmond Mayor's hotel suites under the Capri by Fraser brand: 275 studio, one-bedroom and two-bedroom suites opening in 2030, served by an all-day dining restaurant, residents' lounge, pool, gym and meeting spaces. One address unites hotel suites, serviced suites, offices and a premium lifestyle mall.",
    signatureBodyZh:
      "Richmond Asia Group 委任遍布全球 70+ 城市的 Frasers Hospitality，以 Capri by Fraser 品牌管理 Richmond Mayor 酒店套房 —— 275 间 Studio、一房与两房套房，预计 2030 年开业，配全日餐厅、住户酒廊、泳池、健身房与会议空间。一个地址整合酒店套房、服务套房、办公与精品生活商场。",
    nearbyTitleEn: "The Mount Austin lifestyle hub",
    nearbyTitleZh: "Mount Austin 成熟生活圈",
    nearby: [
      { nameEn: "Mount Austin F&B district", nameZh: "Mount Austin 美食商圈", dist: "Doorstep / 门口" },
      { nameEn: "IKEA Tebrau & AEON", nameZh: "IKEA Tebrau & AEON", dist: "Short drive / 车程数分钟" },
      { nameEn: "Austin Heights Water & Adventure Park", nameZh: "Austin Heights 水上乐园", dist: "Short drive / 车程数分钟" },
      { nameEn: "Columbia Asia Hospital", nameZh: "Columbia Asia 医院", dist: "Short drive / 车程数分钟" },
      { nameEn: "Bukit Chagar RTS Station (2027)", nameZh: "Bukit Chagar 新柔捷运站（2027）", dist: "~20 min drive / 车程约 20 分钟" },
      { nameEn: "JB CIQ Checkpoint", nameZh: "新山关卡 CIQ", dist: "~20 min drive / 车程约 20 分钟" },
    ],
    faq: [
      {
        qEn: "What is Richmond Mayor?",
        aEn: "Richmond Mayor is a freehold mixed-use development by Richmond Asia Group in Mount Austin, Johor Bahru — hotel suites, serviced suites, offices and a premium lifestyle mall in one address, within the Johor–Singapore Special Economic Zone (JS-SEZ).",
        qZh: "Richmond Mayor 是什么项目？",
        aZh: "Richmond Mayor 是 Richmond Asia Group 在新山 Mount Austin 打造的永久地契混合开发项目 —— 酒店套房、服务套房、办公与精品生活商场整合在同一个地址，位于柔佛-新加坡经济特区（JS-SEZ）范围内。",
      },
      {
        qEn: "Who manages the Richmond Mayor hotel suites?",
        aEn: "Frasers Hospitality manages the hotel suites under its Capri by Fraser brand — 275 studio, one-bedroom and two-bedroom suites, expected to open in 2030, with an all-day dining restaurant, residents' lounge, pool, gym and meeting spaces.",
        qZh: "Richmond Mayor 的酒店套房由谁管理？",
        aZh: "由 Frasers Hospitality 以 Capri by Fraser 品牌管理 —— 共 275 间 Studio、一房与两房套房，预计 2030 年开业，配全日餐厅、住户酒廊、泳池、健身房与会议空间。",
      },
      {
        qEn: "What does 'Exclusive Preview' mean?",
        aEn: "Richmond Mayor is in its pre-launch preview stage. Registering your interest gives you early access to the price list, layout plans (Type A 30sqm studio, Type B 40sqm suite) and priority unit selection before the public launch.",
        qZh: "「抢先预览」是什么意思？",
        aZh: "Richmond Mayor 目前处于公开发售前的预览阶段。登记后可优先获取价目表与户型资料（Type A 30 平米 Studio、Type B 40 平米套房），并在公开发售前优先选购单位。",
      },
      {
        qEn: "What layouts does Richmond Mayor offer?",
        aEn: "Published layouts include Type A (30 sqm / 323 sqft studio) and Type B (40 sqm / 431 sqft suite); the Capri by Fraser inventory spans studios, one-bedroom and two-bedroom apartments. WhatsApp the sales team for the full layout set.",
        qZh: "Richmond Mayor 有哪些户型？",
        aZh: "已公开的户型有 Type A（30 平米 / 323 平方尺 Studio）与 Type B（40 平米 / 431 平方尺套房）；Capri by Fraser 管理的套房涵盖 Studio、一房与两房。完整户型请 WhatsApp 销售团队索取。",
      },
      {
        qEn: "What returns does Richmond Mayor target?",
        aEn: "The developer's official materials cite attractive long-term returns exceeding 10% annually, with hotel suites run by Frasers Hospitality's Capri by Fraser brand. Detailed return schemes are released to registered preview buyers first — register your interest for the official terms.",
        qZh: "Richmond Mayor 的目标回报是多少？",
        aZh: "发展商官方资料显示项目瞄准长期年化回报超过 10%，酒店套房由 Frasers Hospitality 旗下 Capri by Fraser 运营。详细回酬方案会优先发放给预览登记买家 —— 登记即可优先获取正式条款。",
      },
      {
        qEn: "Can foreigners and Singaporeans buy Richmond Mayor?",
        aEn: "Yes. Richmond Mayor is open to foreign buyers including Singaporeans, subject to Johor's minimum purchase price for foreigners. Mount Austin is about 20 minutes' drive from the CIQ checkpoint and the upcoming Bukit Chagar RTS station (2027).",
        qZh: "外国人 / 新加坡人可以买 Richmond Mayor 吗？",
        aZh: "可以。Richmond Mayor 开放给包括新加坡人在内的外国买家，须符合柔佛州的外国人最低购买价门槛。Mount Austin 距新山关卡 CIQ 与未来的 Bukit Chagar 新柔捷运站（2027）约 20 分钟车程。",
      },
    ],
  },
};

export function projectExtra(slug: string): ProjectExtra | null {
  return EXTRAS[slug] ?? null;
}

export function extraFaq(extra: ProjectExtra, lang: Lang) {
  return extra.faq.map((f) => ({
    q: lang === "zh" ? f.qZh : f.qEn,
    a: lang === "zh" ? f.aZh : f.aEn,
  }));
}
