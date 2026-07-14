# Design

## Theme
奢牌发展商网站（跟 Richmond 官网视觉基因走，非 agent-listing 风）。**Drenched 深暖炭黑**承载全站，香槟金属是唯一强调色。参照：richmondestelar.com（#1D171B 暖炭 + #D0CBC3/#BBB2A7 香槟银 + Bebas Neue）与 richmondjbcc.com（#f5c891 香槟金 + 米白）。identity-preservation：这是既有品牌的延伸站，不做二次发明。

## Color (OKLCH)
颜色策略：**Drenched**。深暖炭是场，香槟金属点睛（CTA/强调/hairline ≤10%）。

- `--bg`: oklch(0.20 0.012 340) 深暖炭 #1D171B 系（全站底）
- `--surface`: oklch(0.24 0.014 340) / `--surface-2`: oklch(0.29 0.016 340) 分区层
- `--ink`: oklch(0.96 0.008 80) 暖白正文（vs bg >13:1）
- `--muted`: oklch(0.76 0.02 75) 香槟灰次要文字（vs bg ≥4.5:1）
- `--fire`: oklch(0.83 0.075 80) 香槟金 —— 唯一强调（CTA/kicker/hairline/数字）。**浅金填充一律配深字 text-bg**
- `--line`: oklch(0.34 0.014 340) 细描边

token 名沿用引擎（`fire` = 品牌强调），别按字面理解。

## Typography
- 显示 `--font-display`: **Bebas Neue**（官网同款）——全大写 condensed，正 tracking +0.035em；中文回退系统黑体（`:lang(zh)` 行高 1.16、700 黑）。
- 正文 `--font-sans`: Geist → CJK 回退 PingFang SC。
- 中文大标题用小一级 clamp（黑体视觉密度高 + CJK 任意断行，字阶太大会拆词难看）。

## 版式语言（developer microsite 式）
- **不用卡片堆叠**：分区靠 border-line 细分隔、divide-y 规格表、`.hairline` 香槟渐隐线。
- 全幅项目摄影 hero（items-end 文字压底 + bg 渐变）；详情页 hero 下挂**锚点导航条**（ABOUT / FACILITIES / LOCATION / GALLERY / REGISTER，官网式全大写 tracking）。
- 首页两项目 = 编辑式交错大区块（7/5 栅格、hairline + Bebas 项目名 + 3 卖点 + CTA），不是 ProjectCard 网格。
- `.glass` 类名保留但已改为哑光面板（surface + 香槟细边，无 blur）。
- `.kicker`：香槟金全大写小字 tracking 0.22em，一页最多一两处。

## 结构（SEO/GEO 聚焦两项目）
- 分面页（areas/developers/type）已删——链接权重全给项目深页；sitemap 只有 home/projects/2 项目/privacy/terms。
- 详情页 = developer microsite：Overview（描述+divide-y 规格）→ 招牌特色（全幅图叠字）→ Facilities → Location（官网真实距离表）→ Gallery → **每项目 FAQ（FAQPage schema，GEO 主力）**→ Register Your Interest。内容源 `src/lib/projectContent.ts`。
- /projects = 双项目并排 + 对比表（Side by side）。

## Components
- CTA：`rounded-sm`（方角奢牌感）香槟金底深字；WhatsApp 钮同样式带 icon。
- 联系卡/底部条：RJ 圆标（香槟底深字），无个人照片。
- Motion：入场 rise 编排保留（reveal-1..5），prefers-reduced-motion 直接显示。

## Accessibility
WCAG AA：暖白正文 vs 深炭 >13:1；muted ≥4.5:1；香槟金大字/图标 vs 深炭 ≥3:1；香槟填充钮配深字。
