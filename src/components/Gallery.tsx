"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";

/** 相片廊 + lightbox（点开看大图，键盘 / 箭头切换）。 */
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

  const n = images.length;
  // 缩略图一行最多 4 格；超过则最后一格变「+N / 看全部」
  const MAX_TILES = 4;
  const thumbs = images.slice(1);
  const overflow = thumbs.length > MAX_TILES;
  const visibleThumbs = overflow ? thumbs.slice(0, MAX_TILES - 1) : thumbs;
  const moreCount = n - (1 + visibleThumbs.length);

  return (
    <>
      {/* 紧凑拼贴：大图 + 一行缩略图（手机不用滑很久就到详情） */}
      <button
        type="button"
        onClick={() => setOpen(0)}
        className="group relative block w-full cursor-zoom-in overflow-hidden rounded-2xl bg-surface aspect-[16/10] sm:aspect-[16/8]"
      >
        <Image
          src={images[0]}
          alt={altAt(0)}
          fill
          priority
          sizes="(max-width: 768px) 100vw, 1000px"
          className="object-cover transition duration-500 group-hover:scale-[1.03]"
        />
      </button>

      {thumbs.length > 0 && (
        <div className="mt-2 grid grid-cols-4 gap-2">
          {visibleThumbs.map((src, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setOpen(i + 1)}
              className="group relative aspect-square cursor-zoom-in overflow-hidden rounded-xl bg-surface"
            >
              <Image
                src={src}
                alt={altAt(i + 1)}
                fill
                sizes="(max-width: 768px) 25vw, 240px"
                className="object-cover transition duration-500 group-hover:scale-105"
              />
            </button>
          ))}
          {overflow && (
            <button
              type="button"
              onClick={() => setOpen(0)}
              aria-label={`+${moreCount}`}
              className="group relative aspect-square cursor-zoom-in overflow-hidden rounded-xl bg-surface"
            >
              <Image
                src={images[MAX_TILES - 1]}
                alt={altAt(MAX_TILES - 1)}
                fill
                sizes="(max-width: 768px) 25vw, 240px"
                className="object-cover brightness-[0.4]"
              />
              <span className="absolute inset-0 flex flex-col items-center justify-center text-white">
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden>
                  <rect x="3" y="3" width="7" height="7" rx="1.5" />
                  <rect x="14" y="3" width="7" height="7" rx="1.5" />
                  <rect x="3" y="14" width="7" height="7" rx="1.5" />
                  <rect x="14" y="14" width="7" height="7" rx="1.5" />
                </svg>
                <span className="mt-1 font-display text-lg font-bold leading-none">+{moreCount}</span>
              </span>
            </button>
          )}
        </div>
      )}

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
