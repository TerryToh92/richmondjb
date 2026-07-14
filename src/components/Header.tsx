import Link from "next/link";
import Image from "next/image";
import { type Lang, t, lp } from "@/lib/i18n";
import WhatsAppButton from "./WhatsAppButton";
import LangToggle from "./LangToggle";
import MobileNav from "./MobileNav";

export default function Header({ lang }: { lang: Lang }) {
  const d = t(lang);
  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-surface/45 backdrop-blur-xl backdrop-saturate-150">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3">
        <Link href={lp(lang, "/")} className="group flex min-w-0 items-center">
          <Image
            src="/brand/richmond-jbcc-logo.webp"
            alt="Richmond Johor — Richmond JBCC & Richmond Mayor"
            width={290}
            height={105}
            priority
            className="h-11 w-auto sm:h-12"
          />
        </Link>
        <nav className="hidden items-center gap-7 text-sm font-medium text-muted lg:flex">
          <Link href={lp(lang, "/projects")} className="transition hover:text-ink">
            {d.nav.projects}
          </Link>
          <Link href={lp(lang, "/#services")} className="transition hover:text-ink">
            {d.nav.services}
          </Link>
          <Link href={lp(lang, "/#about")} className="transition hover:text-ink">
            {d.nav.about}
          </Link>
          <Link href={lp(lang, "/#contact")} className="transition hover:text-ink">
            {d.nav.contact}
          </Link>
        </nav>
        <div className="flex shrink-0 items-center gap-3">
          <LangToggle lang={lang} />
          {/* 手机上隐藏——hero 与底部常驻条已有 WhatsApp，避免顶部拥挤 */}
          <span className="hidden sm:block">
            <WhatsAppButton
              label="WhatsApp"
              className="!px-4 !py-2 text-sm"
              message={d.waMsgGeneric}
            />
          </span>
          <MobileNav
            links={[
              { href: lp(lang, "/projects"), label: d.nav.projects },
              { href: lp(lang, "/#services"), label: d.nav.services },
              { href: lp(lang, "/#about"), label: d.nav.about },
              { href: lp(lang, "/#contact"), label: d.nav.contact },
            ]}
            waLabel="WhatsApp"
            waMessage={d.waMsgGeneric}
          />
        </div>
      </div>
    </header>
  );
}
