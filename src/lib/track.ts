/**
 * 极简前端事件追踪：有就发，没有就静默。
 * GA4 (gtag) / GTM (dataLayer) / Meta Pixel (fbq) 任一存在即上报。
 */
type Params = Record<string, unknown>;

export function track(event: string, params: Params = {}): void {
  if (typeof window === "undefined") return;
  const w = window as unknown as {
    gtag?: (...a: unknown[]) => void;
    dataLayer?: unknown[];
    fbq?: (...a: unknown[]) => void;
  };
  w.gtag?.("event", event, params);
  w.dataLayer?.push({ event, ...params });
  if (w.fbq) {
    if (event === "lead_submit") w.fbq("track", "Lead", params);
    else if (event === "whatsapp_click") w.fbq("track", "Contact", params);
  }
}
