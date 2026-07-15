"use client";

import { useState } from "react";
import Link from "next/link";
import { DICT, lp, type Lang } from "@/lib/i18n";
import { waLink } from "@/lib/site";
import { track } from "@/lib/track";
import { getAttribution } from "@/lib/attribution";

/**
 * 询盘表单 = WhatsApp 组装器（零后端，同计算器路数）：
 * 提交 → 把姓名/电话/项目/留言组成预填消息直开 WhatsApp。
 * 配了 Supabase env 时才顺手存一份 lead（fire-and-forget，不挡 WhatsApp）。
 * 视觉：浮动标签下划线字段 + 项目选择改成实体 chip（不用原生 select），
 * 呼应品牌"不做卡片堆叠"的细线条语言，比方框输入框更精品。
 */

export default function InquiryForm({
  lang,
  projects,
  defaultProject,
}: {
  lang: Lang;
  projects: { slug: string; title: string }[];
  defaultProject?: string;
}) {
  const d = DICT[lang].inquiry;
  const zh = lang === "zh";
  const [state, setState] = useState<"idle" | "done">("idle");
  const [lastLink, setLastLink] = useState("");
  const [project, setProject] = useState(defaultProject ?? "");

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const name = String(form.get("name") || "").trim();
    const phone = String(form.get("phone") || "").trim();
    if (!name || !phone) return;
    const slug = project;
    const message = String(form.get("message") || "").trim();
    const projectTitle = projects.find((p) => p.slug === slug)?.title;
    const attr = getAttribution();
    const ref = attr.gclid || attr.gbraid || attr.wbraid || "";

    const lines = zh
      ? [
          `[询盘${projectTitle ? `·${projectTitle}` : ""}] 你好，我想了解${projectTitle ? ` ${projectTitle}` : " Richmond JBCC / Richmond Mayor"}（价目表 & 看房）。`,
          `姓名：${name}`,
          `电话：${phone}`,
          message ? `留言：${message}` : "",
          ref ? `ref: ${ref}` : "",
        ]
      : [
          `[Enquiry${projectTitle ? ` · ${projectTitle}` : ""}] Hi, I'd like to know more about${projectTitle ? ` ${projectTitle}` : " Richmond JBCC / Richmond Mayor"} (price list & viewing).`,
          `Name: ${name}`,
          `Phone: ${phone}`,
          message ? `Message: ${message}` : "",
          ref ? `ref: ${ref}` : "",
        ];
    const link = waLink(lines.filter(Boolean).join("\n"));

    track("lead_submit", { project: slug || "general" });

    // 配了 Supabase 才顺手存 lead —— 绝不挡 WhatsApp 打开
    if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      import("@/lib/supabase/client")
        .then(({ createClient }) =>
          createClient().from("leads").insert({
            name,
            phone,
            project_slug: slug || null,
            message,
            source: ref ? "google_ads" : "website",
            gclid: ref || null,
            attribution: attr,
          }),
        )
        .catch(() => {});
    }

    setLastLink(link);
    // 用户手势内同步打开；被拦就整页跳转兜底
    const w = window.open(link, "_blank");
    if (!w) window.location.href = link;
    setState("done");
  }

  if (state === "done") {
    return (
      <div className="glass flex h-full min-h-[18rem] flex-col items-center justify-center border border-fire/40 bg-fire/10 p-7 text-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-full ring-1 ring-fire/40">
          <svg viewBox="0 0 24 24" className="h-6 w-6 text-fire" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M20 6L9 17l-5-5" />
          </svg>
        </span>
        <p className="mt-4 font-display text-lg text-ink">{d.success}</p>
        <a
          href={lastLink}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 text-sm text-muted underline underline-offset-2 transition hover:text-ink"
        >
          {d.reopen}
        </a>
      </div>
    );
  }

  const field =
    "peer w-full border-0 border-b border-line bg-transparent px-0.5 pb-2.5 pt-6 text-ink placeholder-transparent transition-colors focus:border-fire focus:outline-none";
  const label =
    "pointer-events-none absolute left-0.5 top-6 text-[15px] text-faint transition-all duration-200 peer-focus:top-0 peer-focus:text-[11px] peer-focus:tracking-wide peer-focus:text-fire peer-focus:uppercase peer-[:not(:placeholder-shown)]:top-0 peer-[:not(:placeholder-shown)]:text-[11px] peer-[:not(:placeholder-shown)]:tracking-wide peer-[:not(:placeholder-shown)]:uppercase";

  return (
    <form onSubmit={onSubmit} className="glass p-7 sm:p-8">
      <h3 className="font-display text-2xl text-ink">{d.title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-muted">{d.sub}</p>

      <div className="mt-8 space-y-6">
        <div className="grid gap-x-6 gap-y-6 sm:grid-cols-2">
          <div className="relative">
            <input id="f-name" name="name" required placeholder=" " aria-label={d.name} className={field} />
            <label htmlFor="f-name" className={label}>{d.name}</label>
          </div>

          <div className="relative">
            <input
              id="f-phone"
              name="phone"
              required
              type="tel"
              inputMode="tel"
              placeholder=" "
              aria-label={d.phone}
              className={field}
            />
            <label htmlFor="f-phone" className={label}>{d.phone}</label>
          </div>
        </div>

        <div>
          <div className="mb-3 text-[11px] font-medium uppercase tracking-wide text-faint">{d.project}</div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              aria-pressed={project === ""}
              onClick={() => setProject("")}
              className={`rounded-full px-4 py-2 text-[13px] font-medium transition ${
                project === "" ? "bg-fire text-bg" : "ring-1 ring-line text-muted hover:ring-fire/50 hover:text-ink"
              }`}
            >
              {d.projectAny}
            </button>
            {projects.map((p) => (
              <button
                key={p.slug}
                type="button"
                aria-pressed={project === p.slug}
                onClick={() => setProject(p.slug)}
                className={`rounded-full px-4 py-2 text-[13px] font-medium transition ${
                  project === p.slug ? "bg-fire text-bg" : "ring-1 ring-line text-muted hover:ring-fire/50 hover:text-ink"
                }`}
              >
                {p.title.split(/[—｜|·]/)[0].trim()}
              </button>
            ))}
          </div>
        </div>

        <div className="relative">
          <textarea
            id="f-message"
            name="message"
            rows={3}
            placeholder=" "
            aria-label={d.message}
            className={`${field} resize-none`}
          />
          <label htmlFor="f-message" className={label}>{d.message}</label>
        </div>
      </div>

      <button
        type="submit"
        className="mt-8 inline-flex w-full items-center justify-center gap-2.5 rounded-sm bg-fire px-6 py-3.5 text-[15px] font-semibold text-bg transition hover:bg-fire-2"
      >
        <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" aria-hidden>
          <path d="M.057 24l1.687-6.163a11.867 11.867 0 01-1.587-5.946C.157 5.335 5.493 0 12.05 0a11.82 11.82 0 018.413 3.488 11.82 11.82 0 013.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 01-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884a9.86 9.86 0 001.51 5.26l-.999 3.648 3.477-.911z" />
        </svg>
        {d.submit}
      </button>
      <p className="mt-4 text-center text-xs leading-relaxed text-faint">
        {d.consent}{" "}
        <Link
          href={lp(lang, "/privacy")}
          className="underline underline-offset-2 hover:text-ink"
        >
          {d.consentLink}
        </Link>
        {lang === "zh" ? "。" : "."}
      </p>
    </form>
  );
}
