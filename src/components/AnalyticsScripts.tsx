"use client";

import { useEffect, useState } from "react";
import Script from "next/script";
import { COOKIE_CONSENT_KEY } from "@/components/CookieBanner";

export default function AnalyticsScripts() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const syncConsent = () => {
      setEnabled(window.localStorage.getItem(COOKIE_CONSENT_KEY) === "granted");
    };

    syncConsent();
    window.addEventListener("storage", syncConsent);
    window.addEventListener("leqr-cookie-consent-changed", syncConsent);

    return () => {
      window.removeEventListener("storage", syncConsent);
      window.removeEventListener("leqr-cookie-consent-changed", syncConsent);
    };
  }, []);

  if (!enabled) return null;

  return (
    <>
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=AW-18033544712"
        strategy="afterInteractive"
      />
      <Script id="google-ads-init" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'AW-18033544712');`}
      </Script>
    </>
  );
}
