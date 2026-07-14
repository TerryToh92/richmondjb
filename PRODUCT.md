# Product

## Users
Richmond JBCC（新山市中心，Hyatt Place 管理）与 Richmond Mayor（Mount Austin，Capri by Fraser 管理，**抢先预览**）两个 Johor 永久地契酒店品牌项目的买家：本地华人买家、英文圈买家、新加坡跨境买家（RTS/JS-SEZ 题材主力）、海外投资客。多数在 Google 搜项目名或「新山 酒店式套房 / RTS 房产 / Mount Austin property」。语言：中（简）主 + 英并重。

## Product Purpose
richmondjohor.com —— Richmond Asia 在 **Johor** 的两大项目授权销售咨询站（域名就是 JOHOR，全站 Johor 聚焦；organic 打法照 ivygohproperty 引擎）。只有 2 个项目，organic 靠内容深度不靠页数：项目深页 + 每项目 FAQ schema + **自托管 360° 虚拟导览**（/tours/jbcc-hotel/，132MB 3DVista 镜像）+ 户型图（Mayor Type A/B）+ llms.txt。成功 = 高意向买家透过 WhatsApp 留资 / Mayor 预览登记。

## 铁律（继承自 ivygohproperty + 本站特有）
- **不假装发展商官网**：全站明示「授权销售咨询站，非官网」，订购付款走发展商官方渠道。
- **不编数据**：价格官方没公开就显示「价格待询」（priceText），不放假数字；收益/回酬不承诺。
- **无个人经纪品牌**：以 Richmond Johor Sales Team 名义对外，无 REN 个人叙事。

## ⚠️ 上线前 TODO（占位必须换真）
1. `src/lib/site.ts`：WhatsApp 号码（现 60100000000 占位）、电话、email。
2. `src/lib/site.ts` agency：确认运营主体（持牌公司？）填真实牌照，与 Google Ads 账号一字不差。
3. `src/lib/listings.ts`：两个项目的真实起价（priceFrom）、KPKT 发展商执照号 + APDL 广告准证（向发展商索取）。
4. 发展商销售授权书面文件（跑 Google Ads 前必须有）。
5. 图片：现用官方网站抓的效果图（各 3-4 张），要补齐正式 marketing kit 高清图。

## 架构（继承 ivygohproperty）
Next.js 16 App Router + Tailwind 4 + Supabase（未配 = 全静态吃 listings.ts 种子数据）+ Railway 部署 + Cloudflare（richmondjohor.com 已购）。
`[lang]` 双语路由 + hreflang + JsonLd + sitemap + llms.txt + WhatsApp 归因（gclid）+ /admin 后台（配 Supabase 后可用）。
