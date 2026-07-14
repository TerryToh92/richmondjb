"use client";

import { usePathname, useRouter } from "next/navigation";
import { useTransition } from "react";
import type { Lang } from "@/lib/i18n";

export default function LangToggle({ lang }: { lang: Lang }) {
  const router = useRouter();
  const pathname = usePathname();
  const [pending, start] = useTransition();

  function set(next: Lang) {
    if (next === lang) return;
    // 把路径里的 /en|/zh 前缀换成目标语言，跳到对应 URL
    const rest = pathname.replace(/^\/(en|zh)(?=\/|$)/, "");
    const target = `/${next}${rest || ""}`;
    document.cookie = `lang=${next}; path=/; max-age=31536000; samesite=lax`;
    start(() => router.push(target));
  }

  return (
    <div
      className="inline-flex items-center rounded-full border border-line bg-surface p-0.5 text-xs font-semibold"
      data-pending={pending}
    >
      {(["en", "zh"] as const).map((l) => (
        <button
          key={l}
          onClick={() => set(l)}
          aria-pressed={lang === l}
          className={`rounded-full px-2.5 py-1 transition ${
            lang === l ? "bg-fire text-white" : "text-muted hover:text-ink"
          }`}
        >
          {l === "en" ? "EN" : "中"}
        </button>
      ))}
    </div>
  );
}
