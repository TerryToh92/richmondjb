/** 顶部淡紫色光 ray（放在 relative isolate overflow-hidden 的区块里）。 */
export default function TopRay() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute -top-32 left-[10%] -z-10 h-[55vh] w-[42vw] -rotate-[20deg] rounded-full blur-[80px]"
      style={{
        background:
          "linear-gradient(to bottom, oklch(0.62 0.2 300 / 0.18), oklch(0.62 0.2 300 / 0.05) 45%, transparent 80%)",
      }}
    />
  );
}
