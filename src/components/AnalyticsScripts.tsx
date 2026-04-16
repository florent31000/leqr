"use client";

import { useEffect } from "react";
import Script from "next/script";
import { COOKIE_CONSENT_KEY } from "@/components/CookieBanner";

export default function AnalyticsScripts() {
  useEffect(() => {
    const syncConsent = () => {
      const granted =
        window.localStorage.getItem(COOKIE_CONSENT_KEY) === "granted";
      if (typeof window.gtag === "function") {
        window.gtag("consent", "update", {
          ad_storage: granted ? "granted" : "denied",
          ad_user_data: granted ? "granted" : "denied",
          ad_personalization: granted ? "granted" : "denied",
          analytics_storage: granted ? "granted" : "denied",
        });
      }
    };

    syncConsent();
    window.addEventListener("storage", syncConsent);
    window.addEventListener("leqr-cookie-consent-changed", syncConsent);

    return () => {
      window.removeEventListener("storage", syncConsent);
      window.removeEventListener("leqr-cookie-consent-changed", syncConsent);
    };
  }, []);

  return (
    <>
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=AW-18033544712"
        strategy="afterInteractive"
      />
      <Script id="google-ads-init" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
window.gtag = gtag;
gtag('consent', 'default', {
  ad_storage: 'denied',
  ad_user_data: 'denied',
  ad_personalization: 'denied',
  analytics_storage: 'denied',
  wait_for_update: 500,
});
gtag('set', 'url_passthrough', true);
gtag('set', 'ads_data_redaction', true);
gtag('js', new Date());
gtag('config', 'AW-18033544712');`}
      </Script>
    </>
  );
}
