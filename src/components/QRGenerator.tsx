"use client";

import { useState, useCallback, useEffect } from "react";

const PRESETS = [
  { label: "URL", icon: "🔗", placeholder: "https://exemple.fr" },
  { label: "WiFi", icon: "📶", placeholder: "" },
  { label: "Texte", icon: "📝", placeholder: "Votre texte ici..." },
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

interface WiFiData {
  ssid: string;
  password: string;
  encryption: "WPA" | "WEP" | "nopass";
}

export default function QRGenerator() {
  const [activeTab, setActiveTab] = useState(0);
  const [url, setUrl] = useState("https://");
  const [text, setText] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [wifi, setWifi] = useState<WiFiData>({
    ssid: "",
    password: "",
    encryption: "WPA",
  });
  const [fgColor, setFgColor] = useState("#000000");
  const [bgColor, setBgColor] = useState("#ffffff");
  const [qrDataURL, setQrDataURL] = useState<string | null>(null);
  const [shortCode, setShortCode] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);

  const getQRData = useCallback((): string => {
    switch (activeTab) {
      case 0:
        return url;
      case 1:
        return `WIFI:T:${wifi.encryption};S:${wifi.ssid};P:${wifi.password};;`;
      case 2:
        return text;
      case 3:
        return `mailto:${email}`;
      case 4:
        return `tel:${phone}`;
      default:
        return url;
    }
  }, [activeTab, url, wifi, text, email, phone]);

  const isInputValid = useCallback((): boolean => {
    const data = getQRData();
    if (!data) return false;
    if (activeTab === 0 && (data === "https://" || data.length < 10)) return false;
    if (activeTab === 1 && !wifi.ssid) return false;
    if (activeTab === 2 && !text) return false;
    if (activeTab === 3 && (data === "mailto:" || !email)) return false;
    if (activeTab === 4 && (data === "tel:" || !phone)) return false;
    return true;
  }, [getQRData, activeTab, wifi.ssid, text, email, phone]);

  // Live preview: generate a non-tracked QR for instant feedback
  const generatePreview = useCallback(async () => {
    if (!isInputValid()) {
      setQrDataURL(null);
      setShortCode(null);
      return;
    }
    setGenerating(true);
    try {
      const res = await fetch("/api/qr/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          data: getQRData(),
          fgColor,
          bgColor,
          size: 400,
          tracked: false,
        }),
      });
      const json = await res.json();
      if (json.dataURL) setQrDataURL(json.dataURL);
    } catch {
      // silently fail
    } finally {
      setGenerating(false);
    }
  }, [isInputValid, getQRData, fgColor, bgColor]);

  useEffect(() => {
    const timer = setTimeout(() => {
      generatePreview();
    }, 400);
    return () => clearTimeout(timer);
  }, [generatePreview]);

  // Download: generate a tracked QR (goes through our servers)
  const downloadPNG = async () => {
    if (!isInputValid()) return;
    const res = await fetch("/api/qr/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
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
    if (!json.dataURL) return;
    if (json.shortCode) setShortCode(json.shortCode);
    const link = document.createElement("a");
    link.download = "leqr-code.png";
    link.href = json.dataURL;
    link.click();
  };

  const downloadSVG = async () => {
    if (!isInputValid()) return;
    const res = await fetch("/api/qr/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        data: getQRData(),
        fgColor,
        bgColor,
        format: "svg",
        tracked: true,
      }),
    });
    const json = await res.json();
    if (!json.svg) return;
    if (json.shortCode) setShortCode(json.shortCode);
    const blob = new Blob([json.svg], { type: "image/svg+xml" });
    const link = document.createElement("a");
    link.download = "leqr-code.svg";
    link.href = URL.createObjectURL(blob);
    link.click();
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="grid md:grid-cols-2 gap-0">
          {/* Left: Controls */}
          <div className="p-6 md:p-8 border-r border-gray-100">
            {/* Tabs */}
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

            {/* Input fields per tab */}
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
                    value={wifi.ssid}
                    onChange={(e) => setWifi({ ...wifi, ssid: e.target.value })}
                    placeholder="Nom du réseau (SSID)"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  />
                  <input
                    type="password"
                    value={wifi.password}
                    onChange={(e) => setWifi({ ...wifi, password: e.target.value })}
                    placeholder="Mot de passe"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  />
                  <select
                    value={wifi.encryption}
                    onChange={(e) =>
                      setWifi({
                        ...wifi,
                        encryption: e.target.value as WiFiData["encryption"],
                      })
                    }
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option value="WPA">WPA/WPA2</option>
                    <option value="WEP">WEP</option>
                    <option value="nopass">Pas de mot de passe</option>
                  </select>
                </div>
              )}
              {activeTab === 2 && (
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Votre texte ici..."
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
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

            {/* Color controls */}
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

            {/* Download buttons */}
            <div className="flex gap-3">
              <button
                onClick={downloadPNG}
                disabled={!isInputValid()}
                className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white font-semibold py-3 px-4 rounded-xl transition-all shadow-md hover:shadow-lg"
              >
                Télécharger PNG
              </button>
              <button
                onClick={downloadSVG}
                disabled={!isInputValid()}
                className="flex-1 bg-gray-800 hover:bg-gray-900 disabled:bg-gray-300 text-white font-semibold py-3 px-4 rounded-xl transition-all shadow-md hover:shadow-lg"
              >
                Télécharger SVG
              </button>
            </div>

            <p className="text-xs text-gray-400 mt-3 text-center">
              Haute résolution, sans filigrane, usage commercial autorisé
            </p>
          </div>

          {/* Right: QR Preview */}
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
                  <div className="text-5xl mb-3">⬜</div>
                  <p className="text-sm">
                    {generating
                      ? "Génération..."
                      : "Entrez une URL pour générer votre QR code"}
                  </p>
                </div>
              )}
            </div>

            {/* Post-download info */}
            {shortCode ? (
              <div className="mt-6 text-center">
                <div className="inline-flex items-center gap-2 bg-green-50 text-green-800 px-4 py-2 rounded-full text-sm font-medium border border-green-200">
                  ✓ QR code téléchargé
                </div>
                <p className="text-sm text-gray-600 mt-3">
                  <a
                    href="/connexion?signup=true"
                    className="text-blue-600 hover:underline font-medium"
                  >
                    Créez un compte gratuit
                  </a>{" "}
                  pour suivre les scans et gérer vos QR codes
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
                  ⚡ Tous les QR passent par LeQR
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  <a href="#pricing" className="text-blue-600 hover:underline">
                    Passez en Pro
                  </a>{" "}
                  pour modifier l&apos;URL après impression et retirer l&apos;overlay
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
