import Link from "next/link";
import { getLeads } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function LeadsInbox() {
  const leads = await getLeads();
  return (
    <main className="mx-auto min-h-screen max-w-4xl px-5 py-10">
      <Link href="/admin" className="text-sm text-muted hover:text-ink">
        ← 返回房源列表 Back
      </Link>
      <h1 className="font-display mt-3 mb-1 text-2xl font-extrabold text-ink">
        询盘 Enquiries
      </h1>
      <p className="mb-6 text-sm text-muted">网站表单收到的客户留资（最新在上）。</p>

      {leads.length === 0 ? (
        <p className="rounded-xl border border-line bg-surface/40 px-5 py-8 text-center text-muted">
          还没有询盘。No enquiries yet.
        </p>
      ) : (
        <div className="space-y-3">
          {leads.map((l) => (
            <div key={l.id} className="rounded-xl border border-line bg-surface p-5">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <div className="font-display text-lg font-bold text-ink">{l.name}</div>
                <a
                  href={`https://wa.me/${l.phone.replace(/[^0-9]/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-semibold text-fire hover:underline"
                >
                  {l.phone} · WhatsApp →
                </a>
              </div>
              <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-faint">
                {l.gclid && (
                  <span className="rounded bg-emerald-500/15 px-1.5 py-0.5 font-semibold text-emerald-400">
                    Google Ads
                  </span>
                )}
                <span>
                  {l.projectSlug ? `项目 ${l.projectSlug} · ` : ""}
                  {new Date(l.createdAt).toLocaleString("en-MY")}
                </span>
              </div>
              {l.gclid && (
                <div className="mt-1 truncate font-mono text-[11px] text-faint" title={l.gclid}>
                  gclid: {l.gclid}
                </div>
              )}
              {l.message && <p className="mt-2 text-sm text-muted">{l.message}</p>}
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
