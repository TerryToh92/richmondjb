import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { openrouterJSON, type ChatPart } from "@/lib/openrouter";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * AI 看图生描述：给一组房源图片 + 房源上下文 → 视觉模型判断每张图类型(kind)
 * 并产出双语 alt + caption，用于 Google 图片 SEO / GEO / 结构化数据。
 * 走 OpenRouter（OpenAI 兼容）；模型 env IMAGE_CAPTION_MODEL（默认 anthropic/claude-sonnet-4.6）。
 * 需登录（AI 调用花钱）。结果返回给后台，由 Ivy 审核/修改后保存（人来把关）。
 */

const KINDS = [
  "facade", "living", "bedroom", "kitchen", "pool",
  "facility", "view", "floorplan", "location", "other",
] as const;

const SYSTEM = `你是房地产图片标注助手，服务 Richmond Johor 项目行销网站。
用户会给你一个房源的若干张图片（按顺序）+ 房源上下文（项目名/区域/城市/发展商/类别）。
你的任务：逐张看图，判断图片类型 kind，并写出对 SEO/GEO 有帮助的双语 alt 与 caption。

规则：
- 严格按图片出现的顺序，每张图输出一个对象，数量与图片数一致。
- kind 从这些里选：facade(外观/建筑) living(客厅/示范单位) bedroom(睡房) kitchen(厨房/餐厅) pool(泳池) facility(健身房/大堂/设施) view(景观/外望) floorplan(平面图/户型图) location(位置/地图/周边) other。
- alt：简短描述「图里是什么」+ 自然带上项目名与区域（利于 Google 图片搜索）。如 "RiverHaus living room show unit, Horizon Hills Johor Bahru"。中文 altZh 同理用马来西亚华语白话。
- caption：比 alt 稍丰富一句，可点出卖点/特征，但只描述图中真实可见的内容。
- 只描述图中真实可见的东西，不要编造楼层/面积/价格/设施。看不清就用保守描述 + kind=other。
- 不要夸大或用"保证/稳赚/限时"等违禁广告词。
- 只输出 JSON，不要任何额外文字。`;

const SCHEMA = {
  type: "object",
  additionalProperties: false,
  properties: {
    items: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          kind: { type: "string", enum: KINDS as unknown as string[] },
          altEn: { type: "string" },
          altZh: { type: "string" },
          captionEn: { type: "string" },
          captionZh: { type: "string" },
        },
        required: ["kind", "altEn", "altZh", "captionEn", "captionZh"],
      },
    },
  },
  required: ["items"],
};

export async function POST(req: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "请先登录" }, { status: 401 });
  if (!process.env.OPENROUTER_API_KEY) {
    return NextResponse.json({ error: "服务端未配置 OPENROUTER_API_KEY" }, { status: 500 });
  }

  const body = await req.json().catch(() => ({}));
  const images: string[] = Array.isArray(body.images) ? body.images.slice(0, 12) : [];
  const ctx = (body.context ?? {}) as Record<string, string>;
  if (images.length === 0) {
    return NextResponse.json({ error: "没有图片" }, { status: 400 });
  }

  const parts: ChatPart[] = [];
  images.forEach((url, i) => {
    parts.push({ type: "text", text: `图片 ${i + 1}：` });
    parts.push({ type: "image_url", image_url: { url } });
  });
  parts.push({
    type: "text",
    text: `房源上下文：项目「${ctx.titleEn || ctx.title || ""}」/ ${ctx.title || ""}，区域 ${ctx.area || ""}，${ctx.city || "Johor Bahru"}，发展商 ${ctx.developer || ""}，类别 ${ctx.category || ""}。\n请为以上 ${images.length} 张图按顺序各输出一个标注对象。`,
  });

  try {
    const parsed = (await openrouterJSON({
      system: SYSTEM,
      parts,
      schema: SCHEMA,
      schemaName: "image_meta",
      model: process.env.IMAGE_CAPTION_MODEL || "anthropic/claude-sonnet-4.6",
    })) as { items?: Array<Record<string, string>> };

    const items = parsed.items ?? [];
    const meta = images.map((url, i) => {
      const it = items[i] ?? {};
      return {
        url,
        kind: (KINDS as readonly string[]).includes(it.kind) ? it.kind : "other",
        altEn: it.altEn ?? "",
        altZh: it.altZh ?? "",
        captionEn: it.captionEn ?? "",
        captionZh: it.captionZh ?? "",
      };
    });
    return NextResponse.json({ meta });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "AI 标注失败";
    return NextResponse.json({ error: msg }, { status: 502 });
  }
}
