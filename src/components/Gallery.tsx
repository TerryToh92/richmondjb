"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

/** 相片廊：单行横向滑动缩略图 + lightbox（点开看大图，键盘 / 箭头切换）。 */
export default function Gallery({
  images,
  alt,
  alts,
  labels,
}: {
  images: string[];
  alt: string;
  alts?: string[]; // 每张图的 alt（按 images 对应）；缺则回退到 `${alt} N`
  labels: { close: string; prev: string; next: string };
}) {
  const [open, setOpen] = useState<number | null>(null);
  const altAt = (i: number) => alts?.[i] || `${alt} ${i + 1}`;
  const trackRef = useRef<HTMLUListElement>(null);

  function slideTrack(dir: 1 | -1) {
    const el = trackRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * Math.min(el.clientWidth * 0.9, 360), behavior: "smooth" });
  }

  const close = useCallback(() => setOpen(null), []);
  const step = useCallback(
    (dir: number) =>
      setOpen((i) => (i === null ? i : (i + dir + images.length) % images.length)),
    [images.length],
  );

  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      else if (e.key === "ArrowRight") step(1);
      else if (e.key === "ArrowLeft") step(-1);
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open, close, step]);

  return (
    <>
      {/* 单行横向滑动缩略图（手机原生触摸滑动，桌面加左右箭头） */}
      <div className="relative">
        <ul
          ref={trackRef}
          className="flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {images.map((src, i) => (
            <li key={src} className="w-[78vw] shrink-0 snap-start sm:w-[340px]">
              <button
                type="button"
                onClick={() => setOpen(i)}
                className="group relative block aspect-[4/3] w-full cursor-zoom-in overflow-hidden rounded-2xl bg-surface"
              >
                <Image
                  src={src}
                  alt={altAt(i)}
                  fill
                  priority={i === 0}
                  sizes="(max-width: 768px) 78vw, 340px"
                  className="object-cover transition duration-500 group-hover:scale-105"
                />
              </button>
            </li>
          ))}
        </ul>

        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={() => slideTrack(-1)}
              aria-label={labels.prev}
              className="absolute left-0 top-1/2 hidden h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-bg text-ink ring-1 ring-line transition hover:ring-fire/50 hover:text-fire sm:flex"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => slideTrack(1)}
              aria-label={labels.next}
              className="absolute right-0 top-1/2 hidden h-10 w-10 -translate-y-1/2 translate-x-1/2 items-center justify-center rounded-full bg-bg text-ink ring-1 ring-line transition hover:ring-fire/50 hover:text-fire sm:flex"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M9 6l6 6-6 6" />
              </svg>
            </button>
          </>
        )}
      </div>

      {open !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm"
          onClick={close}
          role="dialog"
          aria-modal="true"
        >
          <button
            type="button"
            onClick={close}
            aria-label={labels.close}
            className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>

          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); step(-1); }}
            aria-label={labels.prev}
            className="absolute left-3 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20 sm:left-6"
          >
            <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>

          <div
            className="relative h-[78vh] w-full max-w-5xl"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={images[open]}
              alt={altAt(open)}
              fill
              sizes="100vw"
              className="object-contain"
              priority
            />
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-black/50 px-3 py-1 text-xs font-medium text-white">
              {open + 1} / {images.length}
            </div>
          </div>

          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); step(1); }}
            aria-label={labels.next}
            className="absolute right-3 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20 sm:right-6"
          >
            <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
        </div>
      )}
    </>
  );
}
