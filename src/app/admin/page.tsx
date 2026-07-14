import Link from "next/link";
import { getAllListings } from "@/lib/data";
import { formatPrice } from "@/lib/listings";
import LogoutButton from "@/components/admin/LogoutButton";

export const dynamic = "force-dynamic";

const STATUS: Record<string, { label: string; cls: string }> = {
  draft: { label: "草稿 Draft", cls: "bg-faint/15 text-muted" },
  pending_approval: {
    label: "待发展商批 Pending",
    cls: "bg-amber-500/15 text-amber-400",
  },
  approved: { label: "已上线 Live", cls: "bg-emerald-500/15 text-emerald-400" },
  sold: { label: "已售 Sold", cls: "bg-fire/15 text-fire" },
};

export default async function AdminHome() {
  const listings = await getAllListings();

  return (
    <main className="mx-auto min-h-screen max-w-5xl px-5 py-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-extrabold text-ink">
            房源管理 Listings
          </h1>
          <p className="text-sm text-muted">
            共 {listings.length} 个房源 · 加新房 / 编辑 / 改上线状态
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/admin/leads"
            className="rounded-full border border-line px-5 py-2.5 text-sm font-semibold text-ink transition hover:border-fire"
          >
            询盘 Enquiries
          </Link>
          <Link
            href="/admin/ai"
            className="rounded-full bg-fire px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-fire-2"
          >
            ✦ AI 加房
          </Link>
          <Link
            href="/admin/caption"
            className="rounded-full border border-line px-5 py-2.5 text-sm font-semibold text-ink transition hover:border-fire"
          >
            🖼️ AI 描述图片
          </Link>
          <Link
            href="/admin/new"
            className="rounded-full border border-line px-5 py-2.5 text-sm font-semibold text-ink transition hover:border-fire"
          >
            ＋ 手动加房
          </Link>
          <LogoutButton />
        </div>
      </div>

      <div className="mt-8 overflow-hidden rounded-xl border border-line">
        {listings.length === 0 && (
          <div className="p-8 text-center text-muted">
            还没有房源。点右上「加新房」开始，或确认已在 Supabase 跑过 schema.sql。
          </div>
        )}
        {listings.map((l) => {
          const st = STATUS[l.status] ?? STATUS.draft;
          return (
            <Link
              key={l.id ?? l.slug}
              href={`/admin/edit/${l.id}`}
              className="flex items-center justify-between gap-4 border-b border-line px-5 py-4 transition last:border-0 hover:bg-surface"
            >
              <div className="min-w-0">
                <div className="truncate font-medium text-ink">{l.title}</div>
                <div className="truncate text-sm text-muted">
                  {l.area}, {l.city} · {formatPrice(l.priceFrom)} 起
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-3">
                {!l.kpkt.filled && (
                  <span className="rounded-full bg-fire/12 px-2.5 py-1 text-xs text-fire">
                    KPKT 待补
                  </span>
                )}
                <span
                  className={`rounded-full px-2.5 py-1 text-xs font-medium ${st.cls}`}
                >
                  {st.label}
                </span>
                <span className="text-muted">→</span>
              </div>
            </Link>
          );
        })}
      </div>

      <p className="mt-6 text-xs text-faint">
        提示：状态设为「已上线 Live (approved)」公开页才看得到。改项目内容前，记得先取得发展商 marketing 批准。
      </p>
    </main>
  );
}
