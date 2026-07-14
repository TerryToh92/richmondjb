"use client";

import { SITE, waLink } from "@/lib/site";
import { track } from "@/lib/track";

/** 两个小圆按钮：电话 + WhatsApp（带事件追踪）。 */
export default function RoundContact({ message }: { message?: string }) {
  return (
    <div className="flex shrink-0 gap-2">
      <a
        href={`tel:+${SITE.agent.whatsapp}`}
        onClick={() => track("call_click", { source: "agent_card" })}
        aria-label="Call"
        className="glass-pill flex h-11 w-11 items-center justify-center rounded-full text-ink transition hover:text-fire"
      >
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M3 5a2 2 0 0 1 2-2h2.3a1 1 0 0 1 1 .76l1 4a1 1 0 0 1-.3 1L7.6 10.6a13 13 0 0 0 5.8 5.8l1.8-1.4a1 1 0 0 1 1-.3l4 1a1 1 0 0 1 .8 1V19a2 2 0 0 1-2 2A16 16 0 0 1 3 5z" />
        </svg>
      </a>
      <a
        href={waLink(message)}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => track("whatsapp_click", { message, source: "agent_card" })}
        aria-label="WhatsApp"
        className="flex h-11 w-11 items-center justify-center rounded-full bg-[#2DD4BF] text-[#06231d] shadow-sm transition hover:brightness-105"
      >
        <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" aria-hidden>
          <path d="M.057 24l1.687-6.163a11.867 11.867 0 01-1.587-5.946C.157 5.335 5.493 0 12.05 0a11.82 11.82 0 018.413 3.488 11.82 11.82 0 013.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 01-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884a9.86 9.86 0 001.51 5.26l-.999 3.648 3.477-.911zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
        </svg>
      </a>
    </div>
  );
}
