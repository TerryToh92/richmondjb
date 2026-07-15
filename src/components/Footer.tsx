import Link from "next/link";
import Image from "next/image";
import { SITE, waLink } from "@/lib/site";
import { type Lang, t, lp } from "@/lib/i18n";

/** 页脚 = 业务透明合规核心。联系资料要和 Google Ads 账号、注册资料一字不差。 */
export default function Footer({ lang }: { lang: Lang }) {
  const d = t(lang).footer;
  const zh = lang === "zh";
  return (
    <footer className="border-t border-line bg-surface/60 pb-16 text-muted lg:pb-0">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 md:grid-cols-3">
        <div>
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-fire font-display text-base font-extrabold text-white">
              RJ
            </span>
            <span className="font-display text-lg font-extrabold text-ink">
              {SITE.brand}
            </span>
          </div>
          <p className="mt-4 text-sm leading-relaxed">
            {zh ? SITE.description : SITE.descriptionEn}
          </p>
        </div>

        <div className="text-sm leading-relaxed">
          <div className="mb-3 text-xs font-semibold uppercase tracking-wide text-faint">{d.agentLabel}</div>
          <p>
            {SITE.agent.name}
            {SITE.agent.renNo && <> · REN {SITE.agent.renNo}</>}
            <br />
            {zh ? "价目表 · 户型图 · 看房预约" : "Price list · floor plans · viewings"}
            <br />
            <a
              href={waLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="text-fire underline underline-offset-2 hover:text-ink"
            >
              WhatsApp {SITE.agent.phoneDisplay}
            </a>
          </p>
        </div>

        <div className="text-sm leading-relaxed">
          <div className="mb-3 text-xs font-semibold uppercase tracking-wide text-faint">{d.agencyLabel}</div>
          <Image
            src="/brand/richmond-asia-logo.svg"
            alt="Richmond Asia Group"
            width={238}
            height={84}
            unoptimized
            className="mb-4 h-8 w-auto opacity-80"
          />
          <p>
            <span className="font-medium text-ink">{SITE.developer.legalName}</span>
            <br />
            Richmond JBCC — Johor Bahru City Centre
            <br />
            Richmond Mayor — Mount Austin, Johor Bahru
            <br />
            {zh
              ? "两案均为永久地契酒店品牌项目"
              : "Both freehold, hotel-branded developments"}
          </p>
        </div>
      </div>

      <div className="border-t border-line">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-5 py-5 text-xs text-faint md:flex-row md:items-center md:justify-between">
          <p className="max-w-2xl">{d.disclaimer}</p>
          <div className="flex gap-5">
            <Link href={lp(lang, "/privacy")} className="hover:text-ink">
              {d.privacy}
            </Link>
            <Link href={lp(lang, "/terms")} className="hover:text-ink">
              {d.terms}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
