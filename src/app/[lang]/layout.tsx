// 整个 [lang] 子树强制动态渲染（SSR）：
// 站点按 cookie/header 决定语言、且实时读 Supabase，
// 所以不能静态预渲染（否则运行时 headers()/cookies() 触发 DYNAMIC_SERVER_USAGE 500）。
export const dynamic = "force-dynamic";

export default function LangLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
