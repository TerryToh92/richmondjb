"use client";

import { useRef } from "react";
import Image from "next/image";

/**
 * 荣誉墙：单行横向滑动（1x8），而非 2x4 网格换行。
 * 手机端原生触摸滑动即可；桌面加左右箭头按钮，点击整段平移。
 */
export default function AwardsCarousel({
  items,
}: {
  items: { img: string; label: string }[];
}) {
  const trackRef = useRef<HTMLUListElement>(null);

  function slide(dir: 1 | -1) {
    const el = trackRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * Math.min(el.clientWidth * 0.8, 320), behavior: "smooth" });
  }

  return (
    <div className="relative mt-14">
      <ul
        ref={trackRef}
        className="flex snap-x snap-mandatory gap-10 overflow-x-auto scroll-smooth pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {items.map((a) => (
          <li key={a.img} className="flex w-28 shrink-0 snap-start flex-col items-center text-center sm:w-32">
            <div className="relative h-28 w-24">
              <Image src={a.img} alt={a.label} fill sizes="96px" className="object-contain" />
            </div>
            <p className="mt-4 max-w-[22ch] text-xs leading-relaxed text-muted">{a.label}</p>
          </li>
        ))}
      </ul>

      <button
        type="button"
        onClick={() => slide(-1)}
        aria-label="Scroll left"
        className="absolute left-0 top-14 hidden h-10 w-10 -translate-x-1/2 items-center justify-center rounded-full bg-bg text-ink ring-1 ring-line transition hover:ring-fire/50 hover:text-fire sm:flex"
      >
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M15 18l-6-6 6-6" />
        </svg>
      </button>
      <button
        type="button"
        onClick={() => slide(1)}
        aria-label="Scroll right"
        className="absolute right-0 top-14 hidden h-10 w-10 translate-x-1/2 items-center justify-center rounded-full bg-bg text-ink ring-1 ring-line transition hover:ring-fire/50 hover:text-fire sm:flex"
      >
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M9 6l6 6-6 6" />
        </svg>
      </button>
    </div>
  );
}
