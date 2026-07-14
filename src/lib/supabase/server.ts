import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/** 服务端 Supabase client（读 session cookie，用于 SSR 读取 + 鉴权） */
export async function createClient() {
  const cookieStore = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // 在 Server Component 里 set 会抛错；有 middleware 刷新即可忽略
          }
        },
      },
    },
  );
}
