import type { Listing } from "@/lib/listings";

export type Lang = "en" | "zh";
export const LANGS: Lang[] = ["en", "zh"];
export const DEFAULT_LANG: Lang = "en";

/** 校验路由里的 lang 参数 */
export function resolveLang(raw: string | undefined): Lang {
  return raw === "zh" ? "zh" : "en";
}

/** 给链接加语言前缀：lp("zh","/projects") → "/zh/projects"，lp("en","/") → "/en" */
export function lp(lang: Lang, path: string): string {
  if (path.startsWith("http") || path.startsWith("mailto:") || path.startsWith("tel:")) {
    return path;
  }
  if (path.startsWith("#")) return `/${lang}${path}`;
  const clean = path === "/" ? "" : path;
  return `/${lang}${clean}`;
}

/** 按语言取房源的对应中/英内容（英文缺失时回退中文） */
export function pickListing(l: Listing, lang: Lang) {
  const zh = lang === "zh";
  return {
    title: zh ? l.title : l.titleEn || l.title,
    description: zh ? l.description : l.descriptionEn || l.description,
    highlights: zh
      ? l.highlights
      : l.highlightsEn.length
        ? l.highlightsEn
        : l.highlights,
    amenities: zh
      ? l.amenities
      : l.amenitiesEn.length
        ? l.amenitiesEn
        : l.amenities,
  };
}

type Dict = typeof DICT.en;
export function t(lang: Lang): Dict {
  return DICT[lang];
}

export const DICT = {
  en: {
    nav: { projects: "Projects", services: "How We Help", about: "Developer", contact: "Contact" },
    badge: "Authorized Sales · Richmond JBCC & Richmond Mayor · Johor",
    agentRole: "Authorized Sales Team",
    sticky: { wa: "WhatsApp Us", call: "Call" },
    view: { grid: "Grid", list: "List", label: "View" },
    lightbox: { close: "Close", prev: "Previous", next: "Next" },
    seg: {
      faqTitle: "Frequently asked",
      popular: "Browse by",
      byArea: "By location",
      byDeveloper: "By developer",
      byType: "By type",
    },
    hero: {
      pre: "Johor's freehold ",
      hi: "hotel-branded landmarks",
      post: " — JB City Centre & Mount Austin.",
      intro:
        "Richmond JBCC (hotel suites managed by Hyatt Place, minutes from the upcoming JB–Singapore RTS Link — take the 360° virtual tour on this site) and Richmond Mayor (Mount Austin's integrated landmark managed by Capri by Fraser, now in Exclusive Preview). Both freehold and professionally managed — WhatsApp us for pricing, layouts and viewings.",
      cta1: "WhatsApp for Price & Info",
      cta2: "View Both Projects",
      trust: ["Freehold · hotel-branded", "Developer: Richmond Asia Group", "Open to foreign & Singaporean buyers"],
    },
    services: {
      kicker: "How we help",
      title: "From enquiry to keys — one team",
      sub: "Ask anything about either project. We reply on WhatsApp with real numbers, not brochure-speak.",
      items: [
        ["Pricing & Availability", "Latest price list, available units and current developer packages for JBCC and Mayor."],
        ["Viewings & Virtual Tours", "Walk the JBCC hotel suites in the 360° virtual tour on this site, or book a gallery visit in JB."],
        ["Loans, Docs & Foreign Buyers", "Financing assessment, SPA paperwork and foreign-buyer / Singaporean-buyer eligibility, end to end."],
      ],
    },
    projects: {
      kicker: "The two projects",
      title: "Richmond JBCC · Richmond Mayor",
      sub: "Two freehold hotel-branded developments by Richmond Asia in Johor Bahru — one at the doorstep of the JB–Singapore RTS Link, one in the Mount Austin lifestyle hub (Exclusive Preview).",
      viewAll: "Compare both projects",
    },
    authStrip: {
      text: "Authorized sales enquiry site — both projects are developed by Richmond Asia Group Sdn Bhd and marketed under the developer's sales authorization. This is not the developer's official website.",
      verify: "Developer info →",
    },
    about: {
      kicker: "About the developer",
      title: "Built by Richmond Asia — hotel-branded living, freehold on the title.",
      p1: "Richmond Asia Group Sdn Bhd develops hospitality-led freehold landmarks in Johor Bahru. Richmond JBCC brings Hyatt Place-managed suites to the JB CBD inside the Iskandar Special Economic Zone; Richmond Mayor unites Capri by Fraser-managed hotel suites, serviced suites, offices and a premium lifestyle mall in Mount Austin, within the Johor–Singapore SEZ.",
      p2: "Want the price list, floor plans or a gallery visit? WhatsApp us — quick, direct answers.",
      stats: [["Tenure", "Freehold"], ["Developer", "Richmond Asia Group"], ["JBCC", "JB CBD · Hyatt Place"], ["Mayor", "Mount Austin · Capri by Fraser"]],
    },
    awards: {
      title: "Awards & Recognition",
      sub: "Richmond Asia's developments have been recognised across Asia's leading property and design awards.",
    },
    why: {
      kicker: "Why these two",
      title: "Why buyers pick JBCC & Mayor",
      sub: "Freehold, hotel-managed, and Johor locations riding the RTS and JS-SEZ wave.",
      items: [
        ["Freehold & Hotel-Managed", "Both titles are freehold, with global operators running the suites — Hyatt Place at JBCC, Capri by Fraser (Frasers Hospitality) at Mayor. Hands-off ownership."],
        ["The Singapore Catalyst", "JBCC: 5-minute crossing once the RTS Link opens (expected 2027). Mayor: inside the Johor–Singapore Special Economic Zone, ~20 minutes from the CIQ."],
        ["Two Johor Growth Poles", "JBCC anchors the heritage-rich city centre; Mayor anchors the Mount Austin lifestyle hub — now in Exclusive Preview with early-bird registration open."],
      ],
    },
    homeFaq: {
      title: "Richmond JBCC & Mayor — FAQ",
      sub: "Quick answers for buyers from Malaysia, Singapore and abroad.",
      items: [
        ["Can foreigners or Singaporeans buy these projects?", "Yes. Both Richmond JBCC and Richmond Mayor are open to foreign buyers, subject to Johor's minimum purchase price for foreigners. WhatsApp us to confirm eligibility and the process for your nationality."],
        ["What does 'hotel-branded' actually mean here?", "Your suite is fully furnished and professionally managed as part of a hotel operation — Richmond JBCC under Hyatt Hotels Corporation's Hyatt Place brand, Richmond Mayor under Frasers Hospitality's Capri by Fraser brand (275 suites, opening 2030). Owners can join the rental income programme without self-managing."],
        ["Where exactly are the two projects?", "Richmond JBCC is in the Johor Bahru CBD next to Tan Hiok Nee Heritage Street, near the upcoming JB–Singapore RTS Link station. Richmond Mayor is in Mount Austin — JB's lifestyle hub with IKEA Tebrau, food streets and international schools — about 20 minutes' drive from the CIQ."],
        ["Is this the developer's official website?", "No — this is an independent, authorized sales enquiry site. Both projects are developed by Richmond Asia Group Sdn Bhd and we market them under the developer's sales authorization. Bookings and payments always go through official developer channels."],
      ],
    },
    contact: {
      title: "Get the price list & book a viewing",
      sub: "Tell us which project you're eyeing — we'll send the latest pricing, layouts and gallery viewing slots on WhatsApp.",
      cta: "WhatsApp the sales team",
    },
    card: {
      newLaunch: "New Launch",
      subsale: "Subsale",
      rent: "For Rent",
      from: "From",
      beds: "Beds",
      baths: "Baths",
      viewDetails: "View details",
    },
    detail: {
      home: "Home",
      projects: "Projects",
      gallery: "Gallery",
      galleryTitle: "Take a tour",
      about: "About",
      highlights: "Highlights",
      details: "Details",
      facilities: "Facilities",
      specs: { beds: "Bedrooms", baths: "Bathrooms", size: "Built-up", tenure: "Tenure", built: "Completion", parking: "Parking", furnishing: "Furnishing", view: "View" },
      kpktTitle: "Developer advertising info · KPKT",
      kpkt: { license: "Developer License No.", permit: "Ad & Sale Permit (APDL)", valid: "Valid until" },
      kpktVerify: "Approved development & advertising details can be verified at",
      kpktWarn: "⚠️ Before going live, obtain and fill the real developer license & ad permit numbers from the developer (KPKT requirement).",
      agentLabel: "Authorized Sales",
      from: "From",
      enquireBtn: "WhatsApp about this project",
      enquireNote: "Price list · floor plans · viewing slots — quick reply",
      location: "Location & Surroundings",
      faqTitle: "Frequently Asked Questions",
      register: "Register Your Interest",
      registerSub: "Leave your details for the latest price list, floor plans and viewing appointments.",
      otherProject: "The other Richmond project",
      layouts: "Layout Plans",
      tour: "360° Virtual Tour",
      invest: "Investment Returns",
    },
    projectsPage: {
      title: "The Projects · Richmond JBCC & Mayor",
      sub: "Two freehold hotel-branded developments by Richmond Asia in Johor Bahru — compare locations, features and management.",
      filterType: "Type",
      all: "All",
      highRise: "High-rise",
      landed: "Landed",
      commercial: "Commercial",
      filterPrice: "Price",
      priceAll: "Any price",
      under400: "Under RM400k",
      p400to700: "RM400k–700k",
      over700: "Above RM700k",
      count: (n: number) => `${n} project${n === 1 ? "" : "s"}`,
      none: "No projects match — try adjusting the filters.",
    },
    inquiry: {
      title: "Enquire / Book a viewing",
      sub: "Leave your details and our sales team will get back to you on WhatsApp.",
      name: "Name",
      phone: "Phone / WhatsApp",
      project: "Interested project",
      projectAny: "General enquiry",
      message: "Message (optional)",
      submit: "Send enquiry via WhatsApp",
      success: "WhatsApp is open — just hit Send to complete your enquiry.",
      reopen: "Didn't open? Tap here for WhatsApp",
      consent:
        "By submitting, you agree to be contacted about your enquiry and to the processing of your details under Malaysia's Personal Data Protection Act 2010 (PDPA). See our",
      consentLink: "Privacy Policy",
    },
    footer: {
      agentLabel: "Sales Enquiry",
      agencyLabel: "Developer",
      lpeph: "LPEPH official registry →",
      disclaimer:
        "Independent authorized sales enquiry site for Richmond JBCC and Richmond Mayor, developed by Richmond Asia Group Sdn Bhd (202501024217 (1625630-W)). Marketed under the developer's sales authorization — this is not the developer's official website. All renders, prices and details are indicative and subject to change; confirm with the sales team before transacting.",
      privacy: "Privacy",
      terms: "Terms",
    },
    waMsgGeneric: "Hi, I'd like to know more about Richmond JBCC / Richmond Mayor (price list & viewing).",
  },
  zh: {
    nav: { projects: "项目", services: "服务", about: "发展商", contact: "联系" },
    badge: "授权销售 · Richmond JBCC & Richmond Mayor · 新山",
    agentRole: "授权销售团队",
    sticky: { wa: "WhatsApp 咨询", call: "致电" },
    view: { grid: "网格", list: "列表", label: "视图" },
    lightbox: { close: "关闭", prev: "上一张", next: "下一张" },
    seg: {
      faqTitle: "常见问题",
      popular: "快速浏览",
      byArea: "按地点",
      byDeveloper: "按发展商",
      byType: "按类型",
    },
    hero: {
      pre: "新山两大永久地契",
      hi: "酒店品牌地标",
      post: "，市中心 & Mount Austin",
      intro:
        "Richmond JBCC（Hyatt Place 凯悦品牌管理酒店式套房，毗邻新柔捷运 RTS，本站可 360° 虚拟导览）与 Richmond Mayor（Mount Austin 混合地标，Capri by Fraser 管理，抢先预览开放登记）。两案皆永久地契、专业托管 —— WhatsApp 咨询价格、户型与看房预约。",
      cta1: "WhatsApp 询价",
      cta2: "看两个项目",
      trust: ["永久地契 · 酒店品牌", "发展商：Richmond Asia Group", "外国人 / 新加坡人可购买"],
    },
    services: {
      kicker: "我们能帮你",
      title: "从询价到拿钥匙，一个团队搞定",
      sub: "两个项目任何问题都可以问，WhatsApp 直接给你真实数字，不讲空话。",
      items: [
        ["价格与单位", "JBCC 与 Mayor 最新价目表、可售单位与发展商配套。"],
        ["看房与线上导览", "本站内置 JBCC 酒店套房 360° 虚拟导览，也可预约新山展销厅实地看房。"],
        ["贷款文件与外国买家", "贷款评估、SPA 文件流程，以及外国人 / 新加坡买家购买资格，一站式协助。"],
      ],
    },
    projects: {
      kicker: "两大项目",
      title: "Richmond JBCC · Richmond Mayor",
      sub: "Richmond Asia 在新山的两大永久地契酒店品牌项目 —— 一个在新柔捷运 RTS 门口，一个在 Mount Austin 生活圈核心（抢先预览）。",
      viewAll: "对比两个项目",
    },
    authStrip: {
      text: "授权销售咨询网站 —— 两个项目均由 Richmond Asia Group Sdn Bhd 发展，本站获发展商销售授权代理行销，非发展商官方网站。",
      verify: "发展商资料 →",
    },
    about: {
      kicker: "关于发展商",
      title: "Richmond Asia 出品 —— 酒店品牌生活，地契写着 Freehold",
      p1: "Richmond Asia Group Sdn Bhd 专注在新山打造酒店品牌永久地契地标：Richmond JBCC 把 Hyatt Place 品牌管理的酒店式套房带进新山市中心商业区、依斯干达经济特区核心；Richmond Mayor 则在 Mount Austin 把 Capri by Fraser 管理的酒店套房、服务套房、办公与精品生活商场整合在同一个地址，落在柔佛-新加坡经济特区（JS-SEZ）内。",
      p2: "想要价目表、户型图或预约展销厅？WhatsApp 我们，直接快速回复。",
      stats: [["地契", "永久地契 Freehold"], ["发展商", "Richmond Asia Group"], ["JBCC", "新山 CBD · Hyatt Place"], ["Mayor", "Mount Austin · Capri by Fraser"]],
    },
    awards: {
      title: "荣誉与奖项",
      sub: "Richmond Asia 的项目屡获亚洲主流房地产与设计大奖肯定。",
    },
    why: {
      kicker: "为什么是这两个",
      title: "买家为什么选 JBCC 与 Mayor",
      sub: "永久地契、酒店托管，加上吃到 RTS 与 JS-SEZ 红利的新山地段。",
      items: [
        ["永久地契 · 酒店托管", "两案地契皆为 Freehold，套房由国际集团运营 —— JBCC 是凯悦 Hyatt Place，Mayor 是 Frasers Hospitality 的 Capri by Fraser。业主当甩手掌柜。"],
        ["新加坡催化剂", "JBCC：新柔捷运 RTS 通车后（预计 2027 年）5 分钟过境新加坡。Mayor：位于柔佛-新加坡经济特区内，距关卡约 20 分钟车程。"],
        ["新山双增长极", "JBCC 扎根老城文化街区的市中心；Mayor 扎根 Mount Austin 生活圈 —— 现处抢先预览阶段，开放优先登记。"],
      ],
    },
    homeFaq: {
      title: "Richmond JBCC & Mayor —— 常见问题",
      sub: "给大马、新加坡与海外买家的快速解答。",
      items: [
        ["外国人 / 新加坡人可以买这两个项目吗？", "可以。Richmond JBCC 与 Richmond Mayor 都开放给外国买家，须符合柔佛州的外国人最低购买价门槛。WhatsApp 我们核对你的国籍所适用的资格与流程。"],
        ["「酒店品牌」到底是什么意思？", "你的套房精装全家私，并纳入酒店体系专业托管 —— Richmond JBCC 由凯悦集团 Hyatt Place 品牌管理，Richmond Mayor 由 Frasers Hospitality 的 Capri by Fraser 品牌管理（275 间套房，预计 2030 年开业）。业主可参与租赁收益计划，不必自己管理。"],
        ["两个项目分别在哪里？", "Richmond JBCC 在新山市中心商业区、紧邻陈旭年文化街，靠近未来的新柔捷运 RTS 站；Richmond Mayor 在 Mount Austin —— 新山生活商圈，IKEA Tebrau、美食街、国际学校环绕，距关卡约 20 分钟车程。"],
        ["这是发展商官网吗？", "不是 —— 本站是独立的授权销售咨询网站。两个项目均由 Richmond Asia Group Sdn Bhd 发展，本站获发展商销售授权行销；订购与付款一律经由发展商官方渠道。"],
      ],
    },
    contact: {
      title: "拿价目表、预约看房",
      sub: "告诉我们你在看哪个项目，最新价格、户型与展销厅时段直接 WhatsApp 给你。",
      cta: "WhatsApp 销售团队",
    },
    card: {
      newLaunch: "新盘",
      subsale: "转售",
      rent: "出租",
      from: "起",
      beds: "房",
      baths: "卫",
      viewDetails: "查看详情",
    },
    detail: {
      home: "首页",
      projects: "项目",
      gallery: "相册",
      galleryTitle: "项目相片",
      about: "项目介绍",
      highlights: "项目卖点",
      details: "单位规格",
      facilities: "设施",
      specs: { beds: "房间", baths: "浴室", size: "建筑面积", tenure: "地契", built: "落成", parking: "车位", furnishing: "家具", view: "朝向 / 景观" },
      kpktTitle: "发展商广告资料 · KPKT 合规",
      kpkt: { license: "发展商执照号", permit: "广告与销售准证 (APDL)", valid: "准证有效期" },
      kpktVerify: "已批准的发展与广告资料，可在此查核：",
      kpktWarn: "⚠️ 上线前请向发展商索取并填入真实发展商执照号与广告准证号（KPKT 法律要求）。",
      agentLabel: "授权销售",
      from: "起价",
      enquireBtn: "WhatsApp 咨询这个项目",
      enquireNote: "价目表 · 户型图 · 看房时段，即时回复",
      location: "位置与周边",
      faqTitle: "常见问题",
      register: "登记咨询",
      registerSub: "留下资料，最新价目表、户型图与看房时段直接给你。",
      otherProject: "另一个 Richmond 项目",
      layouts: "户型图",
      tour: "360° 虚拟导览",
      invest: "投资回报",
    },
    projectsPage: {
      title: "两大项目 · Richmond JBCC & Mayor",
      sub: "Richmond Asia 在新山的两个永久地契酒店品牌项目 —— 对比地段、特色与管理配套。",
      filterType: "类型",
      all: "全部",
      highRise: "高层公寓",
      landed: "有地排屋",
      commercial: "商业店铺",
      filterPrice: "价格",
      priceAll: "不限价格",
      under400: "RM40万以下",
      p400to700: "RM40万–70万",
      over700: "RM70万以上",
      count: (n: number) => `${n} 个项目`,
      none: "没有符合的项目 —— 调整一下筛选条件。",
    },
    inquiry: {
      title: "询盘 / 预约看房",
      sub: "留下联系方式，销售团队会用 WhatsApp 尽快回复你。",
      name: "姓名",
      phone: "电话 / WhatsApp",
      project: "感兴趣的项目",
      projectAny: "一般咨询",
      message: "留言（选填）",
      submit: "WhatsApp 送出询盘",
      success: "已为你打开 WhatsApp，按「发送」就完成询盘。",
      reopen: "没打开？点这里直达 WhatsApp",
      consent:
        "提交即表示你同意我们就此咨询与你联系，并依据马来西亚《2010 年个人资料保护法令（PDPA）》处理你的个人资料。详见",
      consentLink: "隐私政策",
    },
    footer: {
      agentLabel: "销售咨询",
      agencyLabel: "发展商",
      lpeph: "LPEPH 官方注册查询 →",
      disclaimer:
        "本站为 Richmond JBCC 与 Richmond Mayor 的独立授权销售咨询网站，两个项目均由 Richmond Asia Group Sdn Bhd（202501024217 (1625630-W)）发展，本站获发展商销售授权行销，非发展商官方网站。所有效果图、价格与资料仅供参考、随时更新，交易前请与销售团队确认。",
      privacy: "隐私政策",
      terms: "使用条款",
    },
    waMsgGeneric: "你好，我想了解 Richmond JBCC / Richmond Mayor（价目表 & 看房）。",
  },
};
