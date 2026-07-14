"use client";

import { useState } from "react";
import Link from "next/link";
import { waLink } from "@/lib/site";

/**
 * 手机汉堡导航（lg 以下）：Header 的 4 个链接在手机上原本完全不可达（评审 P1）。
 * 点开 = header 下方全宽抽屉；点链接即收合。
 */

export default function MobileNav({
  links,
  waLabel,
  waMessage,
}: {
  links: { href: string; label: string }[];
  waLabel: string;
  waMessage: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="lg:hidden">
      <button
        type="button"
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="flex h-10 w-10 items-center justify-center rounded-sm border border-line text-ink transition hover:border-fire/50"
      >
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
          {open ? (
            <path strokeLinecap="round" d="M6 6l12 12M18 6L6 18" />
          ) : (
            <path strokeLinecap="round" d="M4 7h16M4 12h16M4 17h16" />
          )}
        </svg>
      </button>

      {open && (
        <div className="absolute inset-x-0 top-full border-b border-white/10 bg-surface/95 backdrop-blur-xl">
          <nav className="mx-auto max-w-6xl px-5 py-4">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="block border-b border-line/60 py-3.5 font-display text-lg text-ink transition hover:text-fire last:border-b-0"
              >
                {l.label}
              </Link>
            ))}
            <a
              href={waLink(waMessage)}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setOpen(false)}
              className="mt-4 inline-flex w-full items-center justify-center gap-2.5 rounded-sm bg-fire px-6 py-3.5 text-[15px] font-semibold text-bg transition hover:bg-fire-2"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" aria-hidden>
                <path d="M.057 24l1.687-6.163a11.867 11.867 0 01-1.587-5.946C.157 5.335 5.493 0 12.05 0a11.82 11.82 0 018.413 3.488 11.82 11.82 0 013.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 01-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884a9.86 9.86 0 001.51 5.26l-.999 3.648 3.477-.911z" />
              </svg>
              {waLabel}
            </a>
          </nav>
        </div>
      )}
    </div>
  );
}
