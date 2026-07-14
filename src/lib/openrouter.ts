import "server-only";

/**
 * OpenRouter 调用层（OpenAI 兼容接口）。
 * 统一所有 AI 产品走 OpenRouter——一个 key、一个余额、随时换模型。
 * 需要 env：OPENROUTER_API_KEY（在 Railway 设）。
 */

export type ChatPart =
  | { type: "text"; text: string }
  | { type: "image_url"; image_url: { url: string } };

export function openrouterConfigured(): boolean {
  return !!process.env.OPENROUTER_API_KEY;
}

/**
 * 让模型按 JSON schema 返回结构化结果。
 * 经 OpenRouter 转一手，response_format 不一定完全可靠，所以再做一次容错解析。
 */
export async function openrouterJSON(opts: {
  system: string;
  parts: ChatPart[];
  schema: Record<string, unknown>;
  schemaName: string;
  model: string;
  maxTokens?: number;
}): Promise<unknown> {
  const key = process.env.OPENROUTER_API_KEY;
  if (!key) throw new Error("服务端未配置 OPENROUTER_API_KEY");

  const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      // OpenRouter 排名/统计用，非必填
      "HTTP-Referer": process.env.NEXT_PUBLIC_SITE_URL || "https://ivygohproperty.com",
      "X-Title": "Richmond Johor",
    },
    body: JSON.stringify({
      model: opts.model,
      max_tokens: opts.maxTokens ?? 4000,
      messages: [
        { role: "system", content: opts.system },
        { role: "user", content: opts.parts },
      ],
      response_format: {
        type: "json_schema",
        json_schema: { name: opts.schemaName, strict: true, schema: opts.schema },
      },
    }),
  });

  if (!res.ok) {
    const t = await res.text().catch(() => "");
    throw new Error(`OpenRouter ${res.status}: ${t.slice(0, 300)}`);
  }

  const data = await res.json();
  const content: string = data?.choices?.[0]?.message?.content ?? "";
  return parseJsonLoose(content);
}

/** 容错解析：去掉 ``` 围栏、截取第一个完整 {...}。 */
function parseJsonLoose(s: string): unknown {
  const cleaned = s
    .trim()
    .replace(/^```(?:json)?/i, "")
    .replace(/```$/, "")
    .trim();
  try {
    return JSON.parse(cleaned);
  } catch {
    const a = cleaned.indexOf("{");
    const b = cleaned.lastIndexOf("}");
    if (a >= 0 && b > a) return JSON.parse(cleaned.slice(a, b + 1));
    throw new Error("AI 返回的不是有效 JSON");
  }
}
