import { createBrowserClient } from "@supabase/ssr";

/** 浏览器端 Supabase client（用 publishable key，安全公开） */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
