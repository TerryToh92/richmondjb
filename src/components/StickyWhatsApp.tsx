"use client";

import { useEffect, useState } from "react";
import { SITE } from "@/lib/site";
import RoundContact from "./RoundContact";

/** 手机端常驻底部咨询条：滚动后浮现——品牌标 + 团队名 + 圆钮(电话/WhatsApp)。桌面隐藏。 */
export default function StickyWhatsApp({
  message,
}: {
  message?: string;
  waLabel?: string;
  callLabel?: string;
}) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 480);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-40 transition-transform duration-300 lg:hidden ${
        show ? "translate-y-0" : "translate-y-[160%]"
      }`}
      style={{ paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))" }}
    >
      <div className="glass-strong mx-3 flex items-center gap-3 rounded-[1.75rem] p-2.5 pl-3 shadow-[0_16px_44px_-12px_rgba(0,0,0,0.75)]">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-fire font-display text-sm font-extrabold text-white ring-2 ring-fire/40">
          RJ
        </span>
        <div className="min-w-0 flex-1">
          {SITE.agent.name ? (
            <>
              <div className="font-display text-sm font-extrabold leading-tight text-ink">
                {SITE.agent.name}
              </div>
              <div className="truncate text-xs text-muted">Richmond JBCC · Richmond Mayor</div>
            </>
          ) : (
            <div className="font-display text-sm font-extrabold leading-tight text-ink">
              Richmond JBCC · Richmond Mayor
            </div>
          )}
        </div>
        <RoundContact message={message} />
      </div>
    </div>
  );
}
