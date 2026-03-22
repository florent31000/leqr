"use client";

import { useEffect, useState, useCallback } from "react";
import { getSupabase } from "@/lib/supabase";
import type { QRCode, Scan } from "@/lib/supabase";

interface StatsData {
  qr: QRCode;
  totalScans: number;
  recentScans: Scan[];
  deviceBreakdown: Record<string, number>;
}

export default function QRDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [qrId, setQrId] = useState<string | null>(null);
  const [stats, setStats] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editUrl, setEditUrl] = useState("");
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [subscription, setSubscription] = useState<{
    plan: string;
    status: string;
  } | null>(null);

  useEffect(() => {
    params.then((p) => setQrId(p.id));
  }, [params]);

  const loadStats = useCallback(async () => {
    if (!qrId) return;
    const {
      data: { session },
    } = await getSupabase().auth.getSession();
    if (!session) {
      window.location.href = "/connexion";
      return;
    }

    const [statsRes, subRes] = await Promise.all([
      fetch(`/api/qr/${qrId}/stats`, {
        headers: { Authorization: `Bearer ${session.access_token}` },
      }),
      getSupabase()
        .from("subscriptions")
        .select("plan, status")
        .eq("user_id", session.user.id)
        .single(),
    ]);

    if (!statsRes.ok) {
      setError("QR code non trouvé ou accès refusé.");
      setLoading(false);
      return;
    }

    const data = await statsRes.json();
    setStats(data);
    setEditUrl(data.qr.target_url);
    if (subRes.data) setSubscription(subRes.data);
    setLoading(false);
  }, [qrId]);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  const saveUrl = async () => {
    if (!stats || !editUrl || editUrl === stats.qr.target_url) return;
    setSaving(true);
    const {
      data: { session },
    } = await getSupabase().auth.getSession();
    if (!session) return;

    const res = await fetch(`/api/qr/${qrId}/update`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.access_token}`,
      },
      body: JSON.stringify({ target_url: editUrl }),
    });

    if (res.ok) {
      setEditing(false);
      loadStats();
    } else {
      const err = await res.json();
      alert(err.error || "Erreur lors de la mise à jour");
    }
    setSaving(false);
  };

  const handleDelete = async () => {
    if (!confirm("Supprimer ce QR code ? Cette action est irréversible. Les statistiques seront perdues.")) return;
    const {
      data: { session },
    } = await getSupabase().auth.getSession();
    if (!session) return;
    const res = await fetch(`/api/qr/${qrId}/delete`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${session.access_token}` },
    });
    if (res.ok) {
      window.location.href = "/dashboard";
    } else {
      alert("Erreur lors de la suppression");
    }
  };

  const isPro =
    subscription &&
    (subscription.plan === "pro" || subscription.plan === "business") &&
    subscription.status === "active";

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-400">Chargement...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 mb-4">{error}</div>
          <a href="/dashboard" className="text-blue-600 hover:underline">
            Retour au dashboard
          </a>
        </div>
      </div>
    );
  }

  if (!stats) return null;

  const { qr, totalScans, recentScans, deviceBreakdown } = stats;

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="border-b border-gray-100 bg-white">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <a href="/" className="text-xl font-extrabold text-gray-900">
            Le<span className="text-blue-600">QR</span>
            <span className="text-xs text-gray-400 ml-1">.fr</span>
          </a>
          <a
            href="/dashboard"
            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            ← Mes QR Codes
          </a>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* QR Info Header */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6 mb-6 shadow-sm">
          <div className="flex items-start gap-6 flex-wrap">
            {/* QR Code Image */}
            <div className="shrink-0 flex flex-col items-center gap-3">
              <div className="w-48 h-48 bg-white border-2 border-gray-200 rounded-xl overflow-hidden flex items-center justify-center shadow-sm">
                <img
                  src={`/api/qr/${qr.id}/image?size=400`}
                  alt={`QR ${qr.label || qr.short_code}`}
                  className="w-full h-full object-contain p-1"
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={async () => {
                    const res = await fetch(`/api/qr/${qr.id}/image?size=1000`);
                    const blob = await res.blob();
                    const link = document.createElement("a");
                    link.download = `leqr-${qr.short_code}.png`;
                    link.href = URL.createObjectURL(blob);
                    link.click();
                  }}
                  className="text-xs bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  PNG
                </button>
                <button
                  onClick={async () => {
                    const res = await fetch("/api/qr/generate", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        data: `https://leqr.fr/r/${qr.short_code}`,
                        fgColor: qr.fg_color || "#000000",
                        bgColor: qr.bg_color || "#ffffff",
                        format: "svg",
                        tracked: false,
                      }),
                    });
                    const json = await res.json();
                    if (!json.svg) return;
                    const blob = new Blob([json.svg], { type: "image/svg+xml" });
                    const link = document.createElement("a");
                    link.download = `leqr-${qr.short_code}.svg`;
                    link.href = URL.createObjectURL(blob);
                    link.click();
                  }}
                  className="text-xs bg-gray-800 text-white px-3 py-1.5 rounded-lg hover:bg-gray-900 transition-colors font-medium"
                >
                  SVG
                </button>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(`https://leqr.fr/r/${qr.short_code}`);
                    alert("Lien copié !");
                  }}
                  className="text-xs bg-gray-100 text-gray-700 px-3 py-1.5 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                >
                  Copier le lien
                </button>
                <button
                  onClick={handleDelete}
                  className="text-xs bg-red-50 text-red-600 px-3 py-1.5 rounded-lg hover:bg-red-100 transition-colors font-medium"
                >
                  Supprimer
                </button>
              </div>
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-3">
                <h1 className="text-xl font-bold truncate">
                  {qr.label || "Sans nom"}
                </h1>
                <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-green-50 text-green-700">
                  {isPro ? "Modifiable" : "Via LeQR"}
                </span>
              </div>

              <div className="space-y-2 text-sm text-gray-500">
                <p>
                  <span className="font-medium text-gray-700">URL courte :</span>{" "}
                  <a
                    href={`https://leqr.fr/r/${qr.short_code}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    leqr.fr/r/{qr.short_code}
                  </a>
                </p>
                <p>
                  <span className="font-medium text-gray-700">Destination :</span>{" "}
                  {editing ? (
                    <span className="inline-flex items-center gap-2 mt-1">
                      <input
                        type="url"
                        value={editUrl}
                        onChange={(e) => setEditUrl(e.target.value)}
                        className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none w-80"
                      />
                      <button
                        onClick={saveUrl}
                        disabled={saving}
                        className="text-xs bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                      >
                        {saving ? "..." : "Enregistrer"}
                      </button>
                      <button
                        onClick={() => {
                          setEditing(false);
                          setEditUrl(qr.target_url);
                        }}
                        className="text-xs text-gray-500 hover:text-gray-700"
                      >
                        Annuler
                      </button>
                    </span>
                  ) : (
                    <span>
                      <a
                        href={isPro ? qr.target_url : qr.initial_target_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        {isPro ? qr.target_url : qr.initial_target_url}
                      </a>
                      {isPro && (
                        <button
                          onClick={() => setEditing(true)}
                          className="ml-2 text-xs text-blue-600 hover:underline"
                        >
                          Modifier
                        </button>
                      )}
                      {!isPro && (
                        <span className="ml-2 text-xs text-amber-600">
                          (Passez en Pro pour modifier)
                        </span>
                      )}
                    </span>
                  )}
                </p>
                <p>
                  <span className="font-medium text-gray-700">Créé le :</span>{" "}
                  {new Date(qr.created_at).toLocaleDateString("fr-FR", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>

              <div className="mt-4 inline-flex items-center gap-2 bg-blue-50 rounded-xl px-4 py-3">
                <div className="text-2xl font-extrabold text-blue-600">
                  {totalScans}
                </div>
                <div className="text-xs text-blue-500 font-medium">
                  scans totaux
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {/* Device Breakdown */}
          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
            <h2 className="font-semibold mb-4">Appareils</h2>
            {Object.keys(deviceBreakdown).length === 0 ? (
              <p className="text-sm text-gray-400">Aucun scan pour le moment</p>
            ) : (
              <div className="space-y-3">
                {Object.entries(deviceBreakdown)
                  .sort(([, a], [, b]) => b - a)
                  .map(([device, count]) => {
                    const pct =
                      totalScans > 0
                        ? Math.round((count / totalScans) * 100)
                        : 0;
                    const icon =
                      device === "mobile"
                        ? "📱"
                        : device === "tablet"
                          ? "📲"
                          : "💻";
                    return (
                      <div key={device}>
                        <div className="flex justify-between text-sm mb-1">
                          <span>
                            {icon}{" "}
                            {device.charAt(0).toUpperCase() + device.slice(1)}
                          </span>
                          <span className="font-medium">
                            {count} ({pct}%)
                          </span>
                        </div>
                        <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-blue-500 rounded-full transition-all"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
              </div>
            )}
          </div>

          {/* Scan Timeline */}
          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
            <h2 className="font-semibold mb-4">Lien court</h2>
            <div className="bg-gray-50 rounded-xl p-4 text-center">
              <p className="text-lg font-mono font-semibold text-blue-600 mb-2">
                leqr.fr/r/{qr.short_code}
              </p>
              <p className="text-xs text-gray-400 mb-3">
                Redirige actuellement vers : <span className="text-gray-600">{isPro ? qr.target_url : qr.initial_target_url}</span>
              </p>
              <a
                href={`https://leqr.fr/r/${qr.short_code}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block text-xs bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Tester la redirection
              </a>
            </div>
            {!isPro && qr.is_dynamic && (
              <div className="mt-4 bg-amber-50 border border-amber-200 rounded-xl p-3 text-center">
                <p className="text-xs text-amber-700">
                  Passez en Pro pour modifier l&apos;URL de destination apres impression
                </p>
                <a
                  href="/dashboard"
                  className="inline-block mt-2 text-xs bg-amber-600 text-white px-4 py-1.5 rounded-lg hover:bg-amber-700 font-medium"
                >
                  Voir les offres
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Recent Scans */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
          <h2 className="font-semibold mb-4">
            Scans récents{" "}
            <span className="text-sm font-normal text-gray-400">
              (100 derniers)
            </span>
          </h2>
          {recentScans.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-8">
              Aucun scan enregistré pour ce QR code.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 text-left text-gray-500">
                    <th className="pb-2 font-medium">Date</th>
                    <th className="pb-2 font-medium">Appareil</th>
                    <th className="pb-2 font-medium">Pays</th>
                    <th className="pb-2 font-medium">Ville</th>
                    <th className="pb-2 font-medium">Referer</th>
                  </tr>
                </thead>
                <tbody>
                  {recentScans.map((scan) => (
                    <tr
                      key={scan.id}
                      className="border-b border-gray-50 hover:bg-gray-50"
                    >
                      <td className="py-2.5 text-gray-700">
                        {new Date(scan.scanned_at).toLocaleDateString("fr-FR", {
                          day: "2-digit",
                          month: "2-digit",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>
                      <td className="py-2.5">
                        {scan.device === "mobile"
                          ? "📱"
                          : scan.device === "tablet"
                            ? "📲"
                            : "💻"}{" "}
                        {scan.device || "—"}
                      </td>
                      <td className="py-2.5">{scan.country || "—"}</td>
                      <td className="py-2.5">{scan.city || "—"}</td>
                      <td className="py-2.5 truncate max-w-[150px] text-gray-400">
                        {scan.referer || "Direct"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
