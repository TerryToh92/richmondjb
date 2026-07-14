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

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const name = String(form.get("name") || "").trim();
    const phone = String(form.get("phone") || "").trim();
    if (!name || !phone) return;
    const slug = String(form.get("project") || "");
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
        <div className="text-3xl text-fire">✓</div>
        <p className="mt-3 font-display text-lg text-ink">{d.success}</p>
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
    "w-full rounded-sm border border-line bg-bg px-4 py-3 text-ink placeholder:text-faint transition focus:border-fire focus:outline-none focus:ring-2 focus:ring-fire/25";

  return (
    <form onSubmit={onSubmit} className="glass p-7">
      <h3 className="font-display text-lg text-ink">{d.title}</h3>
      <p className="mt-1 text-sm text-muted">{d.sub}</p>
      <div className="mt-5 space-y-3">
        <input name="name" required placeholder={d.name} aria-label={d.name} className={field} />
        <input
          name="phone"
          required
          type="tel"
          inputMode="tel"
          placeholder={d.phone}
          aria-label={d.phone}
          className={field}
        />
        <select name="project" defaultValue={defaultProject ?? ""} aria-label={d.project} className={field}>
          <option value="">{d.projectAny}</option>
          {projects.map((p) => (
            <option key={p.slug} value={p.slug}>
              {p.title}
            </option>
          ))}
        </select>
        <textarea name="message" rows={3} placeholder={d.message} aria-label={d.message} className={field} />
      </div>
      <button
        type="submit"
        className="mt-5 inline-flex w-full items-center justify-center gap-2.5 rounded-sm bg-fire px-6 py-3.5 text-[15px] font-semibold text-bg transition hover:bg-fire-2"
      >
        <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" aria-hidden>
          <path d="M.057 24l1.687-6.163a11.867 11.867 0 01-1.587-5.946C.157 5.335 5.493 0 12.05 0a11.82 11.82 0 018.413 3.488 11.82 11.82 0 013.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 01-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884a9.86 9.86 0 001.51 5.26l-.999 3.648 3.477-.911z" />
        </svg>
        {d.submit}
      </button>
      <p className="mt-3 text-center text-xs leading-relaxed text-faint">
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
