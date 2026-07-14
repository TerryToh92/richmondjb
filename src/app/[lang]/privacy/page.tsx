import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { SITE } from "@/lib/site";
import { resolveLang, LANGS } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "隐私政策 Privacy Policy",
  robots: { index: false, follow: true },
};

export function generateStaticParams() {
  return LANGS.map((lang) => ({ lang }));
}

export default async function Privacy({
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
          {zh ? "隐私政策 Privacy Policy" : "Privacy Policy"}
        </h1>
        <p className="mt-2 text-sm text-muted">
          {zh ? "最后更新：2026 年 6 月" : "Last updated: June 2026"}
        </p>

        {zh ? (
          <div className="mt-6 space-y-5 leading-relaxed">
            <p>
              本网站（{SITE.brand}）为 Richmond JBCC 与 Richmond Mayor 的授权销售咨询网站。
              我们重视您的个人资料隐私，并遵守马来西亚《2010 年个人资料保护法令（PDPA）》。
            </p>
            <h2 className="text-xl font-bold text-ink">我们收集的资料</h2>
            <p>
              当您透过 WhatsApp、表单或电话联系我们咨询房产时，我们可能收集您的姓名、联络电话、
              电邮及购房需求（如预算、偏好地区）。这些资料仅用于回应您的咨询、安排看房及提供房产服务。
            </p>
            <h2 className="text-xl font-bold text-ink">资料用途</h2>
            <p>
              您的资料仅用于：(1) 回复咨询与跟进；(2) 安排看房与房产交易协助；
              (3) 在您同意下，发送相关房产资讯。我们不会在未经您同意下将资料出售或转让给无关第三方。
            </p>
            <h2 className="text-xl font-bold text-ink">Cookie 与广告</h2>
            <p>
              本网站可能使用 Google 等第三方工具进行流量分析与广告衡量。您可透过浏览器设定管理 Cookie。
            </p>
            <h2 className="text-xl font-bold text-ink">您的权利</h2>
            <p>
              您有权查阅、更正或要求删除您的个人资料。如需行使权利或有任何疑问，请透过 {SITE.agent.email}
              或电话 {SITE.agent.phoneDisplay} 联系我们。
            </p>
          </div>
        ) : (
          <div className="mt-6 space-y-5 leading-relaxed">
            <p>
              This website ({SITE.brand}) is the authorized sales enquiry site for Richmond JBCC and Richmond Mayor. We respect your personal data privacy and comply with
              Malaysia&apos;s Personal Data Protection Act 2010 (PDPA).
            </p>
            <h2 className="text-xl font-bold text-ink">Information we collect</h2>
            <p>
              When you contact us about property via WhatsApp, the enquiry form or phone,
              we may collect your name, contact number, email and property requirements
              (such as budget and preferred areas). This information is used only to respond
              to your enquiry, arrange viewings and provide property services.
            </p>
            <h2 className="text-xl font-bold text-ink">How we use your data</h2>
            <p>
              Your data is used only to: (1) reply to and follow up on enquiries;
              (2) arrange viewings and assist with property transactions; and
              (3) with your consent, send relevant property information. We do not sell or
              transfer your data to unrelated third parties without your consent.
            </p>
            <h2 className="text-xl font-bold text-ink">Cookies &amp; advertising</h2>
            <p>
              This website may use third-party tools such as Google for traffic analysis and
              advertising measurement. You can manage cookies through your browser settings.
            </p>
            <h2 className="text-xl font-bold text-ink">Your rights</h2>
            <p>
              You have the right to access, correct or request deletion of your personal data.
              To exercise these rights or for any questions, contact us at {SITE.agent.email}{" "}
              or {SITE.agent.phoneDisplay}.
            </p>
          </div>
        )}
      </main>
      <Footer lang={lang} />
    </>
  );
}
