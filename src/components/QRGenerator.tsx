"use client";

import { useState, useCallback, useEffect } from "react";
import { getSupabase } from "@/lib/supabase";

const PRESETS = [
  { label: "URL", icon: "🔗", placeholder: "https://exemple.fr" },
  { label: "WiFi", icon: "📶", placeholder: "Nom du réseau" },
  { label: "Texte", icon: "📝", placeholder: "Votre texte" },
  { label: "Email", icon: "✉️", placeholder: "contact@exemple.fr" },
  { label: "Téléphone", icon: "📞", placeholder: "+33 6 12 34 56 78" },
];

const COLORS = [
  "#000000",
  "#1e3a5f",
  "#1d4ed8",
  "#7c3aed",
  "#dc2626",
  "#059669",
  "#d97706",
  "#be185d",
];

export default function QRGenerator() {
  const [activeTab, setActiveTab] = useState(0);
  const [url, setUrl] = useState("https://");
  const [wifiName, setWifiName] = useState("");
  const [wifiPassword, setWifiPassword] = useState("");
  const [wifiSecurity, setWifiSecurity] = useState("WPA");
  const [text, setText] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [fgColor, setFgColor] = useState("#000000");
  const [bgColor, setBgColor] = useState("#ffffff");
  const [previewDataURL, setPreviewDataURL] = useState<string | null>(null);
  const [dynamicDataURL, setDynamicDataURL] = useState<string | null>(null);
  const [shortCode, setShortCode] = useState<string | null>(null);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [creatingTracked, setCreatingTracked] = useState(false);
  const [downloadingPng, setDownloadingPng] = useState(false);
  const [downloadingSvg, setDownloadingSvg] = useState(false);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  useEffect(() => {
    getSupabase()
      .auth.getSession()
      .then(({ data: { session } }) => {
        setAccessToken(session?.access_token || null);
      })
      .catch(() => {
        setAccessToken(null);
      });
  }, []);

  const getQRData = useCallback((): string => {
    switch (activeTab) {
      case 0:
        return url;
      case 1:
        return `WIFI:T:${wifiSecurity};S:${wifiName};P:${wifiPassword};;`;
      case 2:
        return text;
      case 3:
        return `mailto:${email}`;
      case 4:
        return `tel:${phone}`;
      default:
        return url;
    }
  }, [activeTab, url, wifiSecurity, wifiName, wifiPassword, text, email, phone]);

  const isInputValid = useCallback((): boolean => {
    const data = getQRData();
    if (!data) return false;
    if (activeTab === 0 && (data === "https://" || data.length < 10)) return false;
    if (activeTab === 1 && !wifiName) return false;
    if (activeTab === 2 && !text.trim()) return false;
    if (activeTab === 3 && (data === "mailto:" || !email)) return false;
    if (activeTab === 4 && (data === "tel:" || !phone)) return false;
    return true;
  }, [getQRData, activeTab, wifiName, text, email, phone]);

  useEffect(() => {
    setDynamicDataURL(null);
    setShortCode(null);
  }, [
    activeTab,
    url,
    wifiName,
    wifiPassword,
    wifiSecurity,
    text,
    email,
    phone,
    fgColor,
    bgColor,
  ]);

  const buildTrackedHeaders = (): HeadersInit => ({
    "Content-Type": "application/json",
    ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
  });

  const generatePreview = useCallback(async () => {
    if (!isInputValid()) {
      setPreviewDataURL(null);
      return;
    }

    setPreviewLoading(true);
    try {
      const res = await fetch("/api/qr/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          data: getQRData(),
          fgColor,
          bgColor,
          size: 600,
          format: "png",
          tracked: false,
        }),
      });
      const json = await res.json();
      if (res.ok && json.dataURL) {
        setPreviewDataURL(json.dataURL);
      }
    } finally {
      setPreviewLoading(false);
    }
  }, [isInputValid, getQRData, fgColor, bgColor]);

  useEffect(() => {
    if (!isInputValid()) {
      setPreviewDataURL(null);
      return;
    }

    const timer = window.setTimeout(() => {
      generatePreview();
    }, 250);

    return () => window.clearTimeout(timer);
  }, [generatePreview, isInputValid]);

  const createTrackedQR = async () => {
    if (!isInputValid()) return;

    if (!accessToken) {
      window.location.href = "/connexion?signup=true";
      return;
    }

    setCreatingTracked(true);
    try {
      const res = await fetch("/api/qr/generate", {
        method: "POST",
        headers: buildTrackedHeaders(),
        body: JSON.stringify({
          data: getQRData(),
          fgColor,
          bgColor,
          size: 1000,
          format: "png",
          tracked: true,
        }),
      });
      const json = await res.json();

      if (!res.ok || !json.dataURL || !json.shortCode) {
        alert(json.error || "Erreur lors de la génération du QR code.");
        return;
      }

      setDynamicDataURL(json.dataURL);
      setShortCode(json.shortCode);
    } catch {
      alert("Erreur lors de la génération du QR code.");
    } finally {
      setCreatingTracked(false);
    }
  };

  const downloadStatic = async (format: "png" | "svg") => {
    if (!isInputValid()) return;
    if (format === "png") setDownloadingPng(true);
    if (format === "svg") setDownloadingSvg(true);

    try {
      const res = await fetch("/api/qr/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          data: getQRData(),
          fgColor,
          bgColor,
          size: 1000,
          format,
          tracked: false,
        }),
      });
      const json = await res.json();
      if (!res.ok) {
        alert(json.error || "Erreur lors du téléchargement.");
        return;
      }

      if (format === "png" && json.dataURL) {
        const link = document.createElement("a");
        link.download = "leqr-statique.png";
        link.href = json.dataURL;
        link.click();
      }

      if (format === "svg" && json.svg) {
        const blob = new Blob([json.svg], { type: "image/svg+xml" });
        const link = document.createElement("a");
        link.download = "leqr-statique.svg";
        link.href = URL.createObjectURL(blob);
        link.click();
      }
    } finally {
      if (format === "png") setDownloadingPng(false);
      if (format === "svg") setDownloadingSvg(false);
    }
  };

  const downloadDynamicSVG = async () => {
    if (!shortCode) return;

    setDownloadingSvg(true);
    try {
      const res = await fetch("/api/qr/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          data: `${window.location.origin}/r/${shortCode}`,
          fgColor,
          bgColor,
          format: "svg",
          tracked: false,
        }),
      });
      const json = await res.json();
      if (!res.ok || !json.svg) {
        alert(json.error || "Erreur lors de l'export SVG.");
        return;
      }
      const blob = new Blob([json.svg], { type: "image/svg+xml" });
      const link = document.createElement("a");
      link.download = "leqr-modifiable.svg";
      link.href = URL.createObjectURL(blob);
      link.click();
    } finally {
      setDownloadingSvg(false);
    }
  };

  const downloadDynamicPNG = () => {
    if (!dynamicDataURL) return;
    const link = document.createElement("a");
    link.download = "leqr-modifiable.png";
    link.href = dynamicDataURL;
    link.click();
  };

  const displayedQRCode = dynamicDataURL || previewDataURL;

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="grid md:grid-cols-2 gap-0">
          {/* Left: Controls */}
          <div className="p-6 md:p-8 border-r border-gray-100">
            <div className="flex gap-1 mb-6 flex-wrap">
              {PRESETS.map((preset, i) => (
                <button
                  key={preset.label}
                  onClick={() => setActiveTab(i)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    activeTab === i
                      ? "bg-blue-600 text-white shadow-md"
                      : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  {preset.icon} {preset.label}
                </button>
              ))}
            </div>

            <div className="mb-6">
              {activeTab === 0 && (
                <input
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://exemple.fr"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-lg"
                />
              )}
              {activeTab === 1 && (
                <div className="space-y-3">
                  <input
                    type="text"
                    value={wifiName}
                    onChange={(e) => setWifiName(e.target.value)}
                    placeholder="Nom du réseau"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-lg"
                  />
                  <input
                    type="text"
                    value={wifiPassword}
                    onChange={(e) => setWifiPassword(e.target.value)}
                    placeholder="Mot de passe"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-lg"
                  />
                  <select
                    value={wifiSecurity}
                    onChange={(e) => setWifiSecurity(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-lg bg-white"
                  >
                    <option value="WPA">WPA / WPA2</option>
                    <option value="WEP">WEP</option>
                    <option value="nopass">Aucun mot de passe</option>
                  </select>
                </div>
              )}
              {activeTab === 2 && (
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Votre texte"
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-lg resize-none"
                />
              )}
              {activeTab === 3 && (
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="contact@exemple.fr"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-lg"
                />
              )}
              {activeTab === 4 && (
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+33 6 12 34 56 78"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-lg"
                />
              )}
            </div>

            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Couleur du QR code
              </label>
              <div className="flex gap-2 flex-wrap">
                {COLORS.map((c) => (
                  <button
                    key={c}
                    onClick={() => setFgColor(c)}
                    className={`w-8 h-8 rounded-full border-2 transition-all ${
                      fgColor === c
                        ? "border-blue-500 scale-110 shadow-md"
                        : "border-gray-200 hover:scale-105"
                    }`}
                    style={{ backgroundColor: c }}
                  />
                ))}
                <input
                  type="color"
                  value={fgColor}
                  onChange={(e) => setFgColor(e.target.value)}
                  className="w-8 h-8 rounded-full cursor-pointer"
                  title="Couleur personnalisée"
                />
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex gap-3">
                <button
                  onClick={() => downloadStatic("png")}
                  disabled={!isInputValid() || downloadingPng}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white font-semibold py-3 px-4 rounded-xl transition-all shadow-md"
                >
                  {downloadingPng ? "Export..." : "Télécharger PNG"}
                </button>
                <button
                  onClick={() => downloadStatic("svg")}
                  disabled={!isInputValid() || downloadingSvg}
                  className="flex-1 bg-gray-800 hover:bg-gray-900 disabled:bg-gray-300 text-white font-semibold py-3 px-4 rounded-xl transition-all"
                >
                  {downloadingSvg ? "Export..." : "Télécharger SVG"}
                </button>
              </div>

              <div className="rounded-2xl border border-blue-100 bg-blue-50 p-4">
                <p className="text-sm font-semibold text-blue-900">
                  Besoin de suivre les scans ou de modifier le lien plus tard ?
                </p>
                <p className="mt-1 text-xs text-blue-800/80">
                  Créez un compte pour obtenir votre premier QR modifiable offert.
                </p>
                <button
                  onClick={createTrackedQR}
                  disabled={!isInputValid() || creatingTracked}
                  className="mt-3 w-full bg-white hover:bg-blue-100 disabled:bg-gray-100 disabled:text-gray-400 text-blue-700 font-semibold py-3 px-4 rounded-xl transition-all border border-blue-200"
                >
                  {creatingTracked ? "Création..." : "Créer mon QR modifiable"}
                </button>
                <p className="mt-2 text-center text-xs text-gray-500">
                  {accessToken
                    ? "Le premier est offert avec votre compte. À partir du deuxième, passez en Pro."
                    : "Création de compte gratuite."}
                </p>
              </div>
            </div>

            <p className="text-xs text-gray-400 mt-3 text-center">
              PNG et SVG haute résolution, usage commercial autorisé
            </p>
          </div>

          <div className="p-6 md:p-8 flex flex-col items-center justify-center bg-gray-50/50">
            <div
              className="w-64 h-64 rounded-2xl flex items-center justify-center bg-white shadow-inner border border-gray-100"
              style={{ backgroundColor: bgColor }}
            >
              {displayedQRCode ? (
                <img
                  src={displayedQRCode}
                  alt="QR Code"
                  className="w-full h-full rounded-2xl object-contain p-2"
                />
              ) : (
                <div className="text-gray-300 text-center p-8">
                  <div className="mx-auto mb-4 grid grid-cols-5 gap-1 w-24 h-24 opacity-60">
                    {Array.from({ length: 25 }).map((_, index) => (
                      <div
                        key={index}
                        className={index % 2 === 0 ? "bg-gray-300 rounded-sm" : "bg-gray-100 rounded-sm"}
                      />
                    ))}
                  </div>
                  <p className="text-sm font-medium text-gray-500">
                    {previewLoading ? "Préparation..." : "Votre QR code apparaîtra ici"}
                  </p>
                  <p className="text-xs text-gray-400 mt-2">
                    Saisissez votre contenu pour afficher l&apos;aperçu.
                  </p>
                </div>
              )}
            </div>

            {shortCode ? (
              <div className="mt-6 text-center">
                <div className="inline-flex items-center gap-2 bg-green-50 text-green-800 px-4 py-2 rounded-full text-sm font-medium border border-green-200">
                  ✓ QR modifiable créé
                </div>
                <p className="text-sm text-gray-600 mt-3">
                  Retrouvez ce QR dans{" "}
                  <a
                    href="/dashboard"
                    className="text-blue-600 hover:underline font-medium"
                  >
                    votre dashboard
                  </a>
                  .
                </p>
                <div className="mt-4 flex flex-wrap justify-center gap-3">
                  <button
                    onClick={downloadDynamicPNG}
                    className="rounded-xl bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700 transition-all hover:bg-blue-100"
                  >
                    PNG
                  </button>
                  <button
                    onClick={downloadDynamicSVG}
                    disabled={downloadingSvg}
                    className="rounded-xl bg-gray-800 px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-gray-900 disabled:bg-gray-300"
                  >
                    {downloadingSvg ? "Export..." : "SVG"}
                  </button>
                </div>
                <p className="text-xs text-gray-400 mt-3">
                  Besoin de modifier l&apos;URL après impression ?{" "}
                  <a href="#pricing" className="text-blue-600 hover:underline">
                    Passez en Pro
                  </a>
                  .
                </p>
              </div>
            ) : (
              <div className="mt-6 text-center">
                <div className="inline-flex items-center gap-2 bg-amber-50 text-amber-800 px-4 py-2 rounded-full text-sm font-medium border border-amber-200">
                  {previewDataURL ? "Votre QR est prêt" : "Gratuit sans compte"}
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Téléchargez-le tout de suite ou créez une version modifiable.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
