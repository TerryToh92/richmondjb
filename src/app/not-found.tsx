import Link from "next/link";
import Image from "next/image";

/** 品牌化 404：logo + 双语引导回首页/项目页（root 层，中英通用所以双语并排） */
export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-bg px-6 text-center">
      <Image
        src="/brand/richmond-jbcc-logo.webp"
        alt="Richmond Johor"
        width={290}
        height={105}
        className="h-14 w-auto"
        priority
      />
      <p className="mt-10 font-display text-6xl text-fire">404</p>
      <h1 className="mt-4 font-display text-xl text-ink sm:text-2xl">
        页面不存在 · Page not found
      </h1>
      <p className="mt-3 max-w-md text-sm leading-relaxed text-muted">
        你要找的页面可能已移动或不存在。看看我们在新山的两个项目吧。
        <br />
        The page you&rsquo;re looking for doesn&rsquo;t exist — explore our two Johor Bahru projects instead.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/zh"
          className="rounded-sm bg-fire px-6 py-3 text-[15px] font-semibold text-bg transition hover:bg-fire-2"
        >
          回首页 · Home
        </Link>
        <Link
          href="/zh/projects"
          className="rounded-sm border border-line px-6 py-3 text-[15px] font-semibold text-ink transition hover:border-fire/60"
        >
          项目 · Projects
        </Link>
      </div>
    </main>
  );
}
