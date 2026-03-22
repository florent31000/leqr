"use client";

import { useState, useCallback, useEffect } from "react";
import { getSupabase } from "@/lib/supabase";

const PRESETS = [
  { label: "URL", icon: "🔗", placeholder: "https://exemple.fr" },
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
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [fgColor, setFgColor] = useState("#000000");
  const [bgColor, setBgColor] = useState("#ffffff");
  const [qrDataURL, setQrDataURL] = useState<string | null>(null);
  const [shortCode, setShortCode] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
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
        return `mailto:${email}`;
      case 2:
        return `tel:${phone}`;
      default:
        return url;
    }
  }, [activeTab, url, email, phone]);

  const isInputValid = useCallback((): boolean => {
    const data = getQRData();
    if (!data) return false;
    if (activeTab === 0 && (data === "https://" || data.length < 10)) return false;
    if (activeTab === 1 && (data === "mailto:" || !email)) return false;
    if (activeTab === 2 && (data === "tel:" || !phone)) return false;
    return true;
  }, [getQRData, activeTab, email, phone]);

  useEffect(() => {
    setQrDataURL(null);
    setShortCode(null);
  }, [activeTab, url, email, phone, fgColor, bgColor]);

  const buildTrackedHeaders = (): HeadersInit => ({
    "Content-Type": "application/json",
    ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
  });

  const createTrackedQR = async () => {
    if (!isInputValid()) return;

    if (!accessToken) {
      window.location.href = "/connexion?signup=true";
      return;
    }

    setGenerating(true);
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

      setQrDataURL(json.dataURL);
      setShortCode(json.shortCode);
    } catch {
      alert("Erreur lors de la génération du QR code.");
    } finally {
      setGenerating(false);
    }
  };

  const downloadPNG = () => {
    if (!qrDataURL) return;
    const link = document.createElement("a");
    link.download = "leqr-code.png";
    link.href = qrDataURL;
    link.click();
  };

  const downloadSVG = async () => {
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
      link.download = "leqr-code.svg";
      link.href = URL.createObjectURL(blob);
      link.click();
    } finally {
      setDownloadingSvg(false);
    }
  };

  const handlePrimaryAction = async () => {
    await createTrackedQR();
  };

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
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="contact@exemple.fr"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-lg"
                />
              )}
              {activeTab === 2 && (
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
              <button
                onClick={handlePrimaryAction}
                disabled={!isInputValid() || generating}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white font-semibold py-3 px-4 rounded-xl transition-all shadow-md hover:shadow-lg"
              >
                {generating ? "Génération..." : "Générer mon QR code"}
              </button>
              {accessToken && qrDataURL && (
                <div className="flex gap-3">
                  <button
                    onClick={downloadPNG}
                    className="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold py-3 px-4 rounded-xl transition-all"
                  >
                    Télécharger PNG
                  </button>
                  <button
                    onClick={downloadSVG}
                    disabled={downloadingSvg}
                    className="flex-1 bg-gray-800 hover:bg-gray-900 disabled:bg-gray-300 text-white font-semibold py-3 px-4 rounded-xl transition-all"
                  >
                    {downloadingSvg ? "Export..." : "Télécharger SVG"}
                  </button>
                </div>
              )}
            </div>

            <p className="text-xs text-gray-400 mt-3 text-center">
              10 QR codes gratuits, haute résolution, usage commercial autorisé
            </p>
            <p className="text-xs text-gray-500 mt-1 text-center">
              Vos QR sont enregistrés dans votre espace pour être retrouvés et suivis.
            </p>
          </div>

          <div className="p-6 md:p-8 flex flex-col items-center justify-center bg-gray-50/50">
            <div
              className="w-64 h-64 rounded-2xl flex items-center justify-center bg-white shadow-inner border border-gray-100"
              style={{ backgroundColor: bgColor }}
            >
              {qrDataURL ? (
                <img
                  src={qrDataURL}
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
                    {generating ? "Génération..." : "Votre QR code apparaîtra ici"}
                  </p>
                  <p className="text-xs text-gray-400 mt-2">
                    Personnalisez-le puis cliquez sur « Générer mon QR code ».
                  </p>
                </div>
              )}
            </div>

            {shortCode ? (
              <div className="mt-6 text-center">
                <div className="inline-flex items-center gap-2 bg-green-50 text-green-800 px-4 py-2 rounded-full text-sm font-medium border border-green-200">
                  ✓ QR code créé
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
                <p className="text-xs text-gray-400 mt-1">
                  Besoin de modifier l&apos;URL après impression ?{" "}
                  <a href="#pricing" className="text-blue-600 hover:underline">
                    Passez en Pro
                  </a>
                </p>
              </div>
            ) : (
              <div className="mt-6 text-center">
                <div className="inline-flex items-center gap-2 bg-amber-50 text-amber-800 px-4 py-2 rounded-full text-sm font-medium border border-amber-200">
                  {accessToken ? "10 QR codes gratuits inclus" : "PNG HD, SVG et suivi inclus"}
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  {accessToken ? (
                    <>
                      <a href="#pricing" className="text-blue-600 hover:underline">
                        Passez en Pro
                      </a>{" "}
                      pour modifier l&apos;URL après impression et retirer l&apos;overlay.
                    </>
                  ) : (
                    <>
                      Générez votre QR en 1 clic puis retrouvez-le dans votre espace.
                    </>
                  )}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
