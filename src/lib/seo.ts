import { SITE } from "./site";
import type { Lang } from "./i18n";

/**
 * 生成 canonical + hreflang alternates。
 * rest = 语言前缀之后的路径（首页为 ""，例如 "/projects/abc"）。
 * canonical 指向当前语言版本自身，languages 列出 en / zh-MY / x-default。
 */
export function hreflang(rest: string, lang: Lang = "en") {
  return {
    canonical: `${SITE.url}/${lang}${rest}`,
    languages: {
      en: `${SITE.url}/en${rest}`,
      "zh-MY": `${SITE.url}/zh${rest}`,
      "x-default": `${SITE.url}/en${rest}`,
    },
  };
}
