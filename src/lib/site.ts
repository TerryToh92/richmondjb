/**
 * 全站配置 + 合规信息（NAP / 牌照 / 授权）。
 * 这里改一处，全站页脚、schema、联系方式同步更新。
 * ⚠️ 上线前必核对（TODO）：
 *   1. agent.whatsapp / phoneDisplay / email —— 现在是占位，要换成真实销售团队号码。
 *   2. agency —— 若由持牌地产公司运营，填真实公司牌照；与 Google Ads 账号、SSM 一字不差。
 *   3. 项目价格与 KPKT 准证号 —— 见 listings.ts 各项目的 TODO。
 */

export const SITE = {
  // 域名（Cloudflare 已购，Railway 部署）
  url: "https://richmondjb.com",
  brand: "Richmond Johor",
  tagline: "Richmond JBCC 与 Richmond Mayor（抢先预览）· 新山授权销售咨询",
  taglineEn: "Richmond JBCC & Richmond Mayor (Exclusive Preview) · Johor Authorized Sales Enquiry",
  description:
    "Richmond Johor 专注 Richmond Asia 在新山的两大永久地契（Freehold）酒店品牌项目：新山市中心 Richmond JBCC（Hyatt Place 酒店管理，毗邻新柔捷运 RTS，站内 360° 虚拟导览）与 Mount Austin 的 Richmond Mayor（Capri by Fraser 管理，275 间套房，抢先预览开放登记）。价格、户型、看房预约，WhatsApp 即时回复。",
  descriptionEn:
    "Richmond Johor is the authorized sales enquiry site for Richmond Asia's two freehold hotel-branded developments in Johor Bahru: Richmond JBCC in the JB city centre (managed under Hyatt Place, minutes from the upcoming JB–Singapore RTS Link, 360° virtual tour on site) and Richmond Mayor in Mount Austin (managed by Capri by Fraser, 275 suites, now in Exclusive Preview). Pricing, layouts and viewings — quick WhatsApp replies.",

  // 联系人 / 销售团队（无个人经纪品牌 —— 以团队名义对外）
  agent: {
    name: "Richmond Johor Sales Team",
    legalName: "",
    renNo: "77548",
    renActiveYear: "",
    title: "Sales Consultant",
    titleZh: "销售顾问",
    photo: "", // 不用个人照片
    lpephUrl: "https://lpeph.gov.my",
    phoneDisplay: "+60 12-568 6285",
    // WhatsApp 国际格式（无 + 无空格）
    whatsapp: "60125686285",
    email: "hello@richmondjb.com", // TODO: 确认这是真实可收信邮箱
  },

  // 运营方（页脚法定信息）。TODO: 确认由哪家持牌公司运营并填真实牌照
  agency: {
    name: "Richmond Johor Marketing Team",
    eNo: "",
    regNo: "",
    sst: "",
    address: "",
    tel: "",
    website: "https://richmondjb.com",
  },

  // 销售授权（合规依据）：本站为授权行销站，非发展商官网
  authorization: {
    by: "Richmond Asia Group Sdn Bhd (developer)",
    eNo: "",
    note: "Independent marketing site. Both projects are marketed under the developer's sales authorization — this is not the developer's official website.",
    noteZh: "本站为独立授权行销网站，所列两个项目均获发展商销售授权代理销售，非发展商官方网站。",
  },

  // 发展商
  developer: {
    name: "Richmond Asia",
    legalName: "Richmond Asia Group Sdn Bhd (202501024217 (1625630-W))",
    authorized: true,
    authNote: "Both projects are developed by Richmond Asia Group and marketed under sales authorization.",
  },

  // 服务区域（本地 SEO / GEO：areaServed）—— Johor 聚焦
  areaServed: ["Johor Bahru", "JB City Centre", "Mount Austin", "Johor", "Singapore"],
} as const;

export function waLink(message?: string) {
  const base = `https://wa.me/${SITE.agent.whatsapp}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}
