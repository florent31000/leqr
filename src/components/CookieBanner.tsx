"use client";

import { useEffect, useState } from "react";

export const COOKIE_CONSENT_KEY = "leqr-cookie-consent";

export default function CookieBanner() {
  const [choice, setChoice] = useState<string | null>(null);

  useEffect(() => {
    setChoice(window.localStorage.getItem(COOKIE_CONSENT_KEY));
  }, []);

  const saveChoice = (value: "granted" | "denied") => {
    window.localStorage.setItem(COOKIE_CONSENT_KEY, value);
    setChoice(value);
    window.dispatchEvent(new Event("leqr-cookie-consent-changed"));
  };

  if (choice) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-3xl rounded-2xl border border-gray-200 bg-white p-4 shadow-2xl">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-semibold text-gray-900">
            Cookies et mesure d&apos;audience
          </p>
          <p className="mt-1 text-sm text-gray-600">
            Nous utilisons des cookies techniques pour le compte et, avec votre
            accord, des cookies de mesure publicitaire Google pour améliorer nos
            campagnes.
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => saveChoice("denied")}
            className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Refuser
          </button>
          <button
            onClick={() => saveChoice("granted")}
            className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
          >
            Accepter
          </button>
        </div>
      </div>
    </div>
  );
}
