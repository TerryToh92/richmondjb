import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { SITE } from "@/lib/site";
import { resolveLang, LANGS } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "使用条款 Terms of Use",
  robots: { index: false, follow: true },
};

export function generateStaticParams() {
  return LANGS.map((lang) => ({ lang }));
}

export default async function Terms({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const lang = resolveLang((await params).lang);
  const zh = lang === "zh";
  return (
    <>
      <Header lang={lang} />
      <main className="mx-auto max-w-3xl flex-1 px-5 py-12 text-ink/85">
        <h1 className="text-3xl font-extrabold text-ink">
          {zh ? "使用条款 Terms of Use" : "Terms of Use"}
        </h1>
        <p className="mt-2 text-sm text-muted">
          {zh ? "最后更新：2026 年 6 月" : "Last updated: June 2026"}
        </p>

        {zh ? (
          <div className="mt-6 space-y-5 leading-relaxed">
            <p>
              本网站（{SITE.brand}）为 Richmond JBCC 与 Richmond Mayor 的授权销售咨询网站，
              两个项目均由 {SITE.developer.legalName} 发展。
            </p>
            <h2 className="text-xl font-bold text-ink">网站性质</h2>
            <p>
              本网站为获发展商销售授权之行销网站，<strong>并非发展商官方网站</strong>。
              所有项目资讯（价格、面积、规格、效果图）以发展商与官方文件为准，可能随时调整，恕不另行通知；
              订购与付款一律经由发展商官方渠道。
            </p>
            <h2 className="text-xl font-bold text-ink">资讯准确性</h2>
            <p>
              我们尽力确保资讯准确，但不对任何因资讯变动而产生的损失负责。最终价格、单位供应与条款
              以发展商正式销售文件及买卖合约为准。
            </p>
            <h2 className="text-xl font-bold text-ink">联系</h2>
            <p>
              如对本条款有任何疑问，请透过 {SITE.agent.email} 或 {SITE.agent.phoneDisplay} 联系我们。
            </p>
          </div>
        ) : (
          <div className="mt-6 space-y-5 leading-relaxed">
            <p>
              This website ({SITE.brand}) is the authorized sales enquiry site for Richmond JBCC and Richmond Mayor, both developed by {SITE.developer.legalName}.
            </p>
            <h2 className="text-xl font-bold text-ink">Nature of this website</h2>
            <p>
              This is a marketing site operating under the developer&apos;s sales
              authorization, and is <strong>not the developer&apos;s official website</strong>.
              All project information (prices, sizes, specifications, renders) is subject to the
              developer and official documents and may change at any time without notice.
              Bookings and payments always go through official developer channels.
            </p>
            <h2 className="text-xl font-bold text-ink">Accuracy of information</h2>
            <p>
              We strive to ensure accuracy but are not liable for any loss arising from changes
              in information. Final pricing, unit availability and terms are subject to the
              developer&apos;s official sales documents and the sale and purchase agreement.
            </p>
            <h2 className="text-xl font-bold text-ink">Contact</h2>
            <p>
              For any questions about these terms, contact us at {SITE.agent.email} or{" "}
              {SITE.agent.phoneDisplay}.
            </p>
          </div>
        )}
      </main>
      <Footer lang={lang} />
    </>
  );
}
