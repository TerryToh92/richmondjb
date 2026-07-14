import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const LOCALES = ["en", "zh"] as const;

/** /admin 登录保护（仅在 /admin 路径跑 Supabase） */
async function guardAdmin(request: NextRequest) {
  let response = NextResponse.next({ request });
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    },
  );
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const path = request.nextUrl.pathname;
  if (path.startsWith("/admin") && !path.startsWith("/admin/login") && !user) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin/login";
    return NextResponse.redirect(url);
  }
  if (path.startsWith("/admin/login") && user) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin";
    return NextResponse.redirect(url);
  }
  return response;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/admin")) {
    return guardAdmin(request);
  }

  const seg = pathname.split("/")[1];
  const locale = LOCALES.find((l) => l === seg);

  if (locale) {
    // 语言路径：透传，并把语言放进 header 供 layout / getLang 使用
    const headers = new Headers(request.headers);
    headers.set("x-lang", locale);
    return NextResponse.next({ request: { headers } });
  }

  // 无语言前缀的公开路径 → 按 Accept-Language 猜默认，再 301 到带前缀的 URL
  const al = request.headers.get("accept-language")?.toLowerCase() ?? "";
  const guess = /zh|cn|hans|hant|\bzh-/.test(al) ? "zh" : "en";
  const url = request.nextUrl.clone();
  url.pathname = `/${guess}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  // 跑在所有路径，但排除静态资源、api、带扩展名的文件（sitemap.xml/robots.txt 等）
  matcher: ["/((?!_next/static|_next/image|api|.*\\..*).*)"],
};
