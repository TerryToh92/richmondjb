import "server-only";
import { headers } from "next/headers";
import { resolveLang, type Lang } from "@/lib/i18n";

/** 从 middleware 设的 x-lang header 读语言（页面优先用 params.lang） */
export async function getLang(): Promise<Lang> {
  const h = await headers();
  return resolveLang(h.get("x-lang") ?? undefined);
}
