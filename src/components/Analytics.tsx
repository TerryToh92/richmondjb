import Script from "next/script";

/**
 * GA4 + Meta Pixel 装载器。env 没设就什么都不渲染（默认静默）。
 * 上线后在 Railway 设 NEXT_PUBLIC_GA_ID / NEXT_PUBLIC_FB_PIXEL_ID 即生效。
 */
const GA = process.env.NEXT_PUBLIC_GA_ID;
const FB = process.env.NEXT_PUBLIC_FB_PIXEL_ID;

export default function Analytics() {
  return (
    <>
      {GA && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${GA}`}
            strategy="lazyOnload"
          />
          <Script id="ga4-init" strategy="lazyOnload">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${GA}');`}
          </Script>
        </>
      )}
      {FB && (
        <Script id="fb-pixel" strategy="afterInteractive">
          {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${FB}');fbq('track','PageView');`}
        </Script>
      )}
    </>
  );
}
