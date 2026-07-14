import Link from "next/link";
import AiComposer from "@/components/admin/AiComposer";

export const dynamic = "force-dynamic";

export default function AiAddListing() {
  return (
    <main className="mx-auto min-h-screen max-w-3xl px-5 py-10">
      <Link href="/admin" className="text-sm text-muted hover:text-ink">
        ← 返回房源列表 Back
      </Link>
      <h1 className="font-display mt-3 text-2xl font-extrabold text-ink">
        ✦ AI 加房 AI Add Listing
      </h1>
      <p className="mb-6 mt-1 text-sm text-muted">
        把楼盘资料（文字 / 图片）丢给 AI，它自动整理成房源栏位（中英双语），你核对后一键上线。
      </p>
      <AiComposer />
    </main>
  );
}
