"use client";

import type { SupabaseClient, User } from "@supabase/supabase-js";

export const ACQUISITION_STORAGE_KEY = "leqr-acquisition";

type AcquisitionData = {
  first_seen_at?: string;
  landing_path?: string;
  referrer?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
  gclid?: string;
  fbclid?: string;
  msclkid?: string;
};

function cleanValue(value: string | null | undefined) {
  if (!value) return undefined;
  const trimmed = value.trim();
  return trimmed ? trimmed.slice(0, 200) : undefined;
}

function pickAttributionFromWindow(): AcquisitionData {
  const params = new URLSearchParams(window.location.search);
  const landingPath = `${window.location.pathname}${window.location.search}`.slice(
    0,
    500
  );

  return {
    first_seen_at: new Date().toISOString(),
    landing_path: cleanValue(landingPath),
    referrer: cleanValue(document.referrer),
    utm_source: cleanValue(params.get("utm_source")),
    utm_medium: cleanValue(params.get("utm_medium")),
    utm_campaign: cleanValue(params.get("utm_campaign")),
    utm_term: cleanValue(params.get("utm_term")),
    utm_content: cleanValue(params.get("utm_content")),
    gclid: cleanValue(params.get("gclid")),
    fbclid: cleanValue(params.get("fbclid")),
    msclkid: cleanValue(params.get("msclkid")),
  };
}

export function getStoredAcquisition(): AcquisitionData | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = window.localStorage.getItem(ACQUISITION_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as AcquisitionData) : null;
  } catch {
    return null;
  }
}

export function captureAcquisitionTouchpoint() {
  if (typeof window === "undefined") return null;

  const existing = getStoredAcquisition() || {};
  const current = pickAttributionFromWindow();

  const merged: AcquisitionData = {
    first_seen_at: existing.first_seen_at || current.first_seen_at,
    landing_path: existing.landing_path || current.landing_path,
    referrer: existing.referrer || current.referrer,
    utm_source: existing.utm_source || current.utm_source,
    utm_medium: existing.utm_medium || current.utm_medium,
    utm_campaign: existing.utm_campaign || current.utm_campaign,
    utm_term: existing.utm_term || current.utm_term,
    utm_content: existing.utm_content || current.utm_content,
    gclid: existing.gclid || current.gclid,
    fbclid: existing.fbclid || current.fbclid,
    msclkid: existing.msclkid || current.msclkid,
  };

  try {
    window.localStorage.setItem(
      ACQUISITION_STORAGE_KEY,
      JSON.stringify(merged)
    );
  } catch {
    return merged;
  }

  return merged;
}

export function buildUserAcquisitionData() {
  const acquisition = captureAcquisitionTouchpoint() || getStoredAcquisition();
  if (!acquisition) return {};

  const payload = {
    acquisition_first_seen_at: acquisition.first_seen_at,
    acquisition_landing_path: acquisition.landing_path,
    acquisition_referrer: acquisition.referrer,
    acquisition_utm_source: acquisition.utm_source,
    acquisition_utm_medium: acquisition.utm_medium,
    acquisition_utm_campaign: acquisition.utm_campaign,
    acquisition_utm_term: acquisition.utm_term,
    acquisition_utm_content: acquisition.utm_content,
    acquisition_gclid: acquisition.gclid,
    acquisition_fbclid: acquisition.fbclid,
    acquisition_msclkid: acquisition.msclkid,
  };

  return Object.fromEntries(
    Object.entries(payload).filter(([, value]) => typeof value === "string" && value)
  );
}

export async function syncAcquisitionToUser(
  supabase: SupabaseClient,
  user: User
) {
  const acquisitionData = buildUserAcquisitionData();
  if (!Object.keys(acquisitionData).length) return;

  const hasExistingAttribution =
    !!user.user_metadata?.acquisition_utm_source ||
    !!user.user_metadata?.acquisition_gclid ||
    !!user.user_metadata?.acquisition_landing_path;

  if (hasExistingAttribution) return;

  await supabase.auth.updateUser({
    data: {
      ...user.user_metadata,
      ...acquisitionData,
      acquisition_synced_at: new Date().toISOString(),
    },
  });
}
