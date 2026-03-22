"use client";

import { useEffect, useState, useCallback } from "react";
import { getSupabase } from "@/lib/supabase";
import type { QRCode } from "@/lib/supabase";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

interface Subscription {
  plan: string;
  status: string;
  current_period_end: string | null;
}

export default function Dashboard() {
  const [user, setUser] = useState<{ id: string; email?: string } | null>(null);
  const [qrCodes, setQrCodes] = useState<QRCode[]>([]);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [newUrl, setNewUrl] = useState("");
  const [newLabel, setNewLabel] = useState("");
  const [creating, setCreating] = useState(false);
  const [upgrading, setUpgrading] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  const loadData = useCallback(async () => {
    const {
      data: { session },
    } = await getSupabase().auth.getSession();
    if (!session) {
      window.location.href = "/connexion";
      return;
    }
    setUser(session.user);

    const [qrRes, subRes] = await Promise.all([
      getSupabase()
        .from("qr_codes")
        .select("*")
        .eq("user_id", session.user.id)
        .order("created_at", { ascending: false }),
      getSupabase()
        .from("subscriptions")
        .select("plan, status, current_period_end")
        .eq("user_id", session.user.id)
        .single(),
    ]);

    setQrCodes(qrRes.data || []);
    if (subRes.data) setSubscription(subRes.data);
    setLoading(false);

    if (
      typeof window !== "undefined" &&
      new URLSearchParams(window.location.search).get("upgraded") === "true"
    ) {
      if (typeof window.gtag === "function") {
        window.gtag("event", "conversion", {
          send_to: "AW-18033544712/purchase",
          value: 14.9,
          currency: "EUR",
        });
      }
      window.history.replaceState({}, "", "/dashboard");
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleUpgrade = async (billing: "monthly" | "annual") => {
    setUpgrading(true);
    const {
      data: { session },
    } = await getSupabase().auth.getSession();
    if (!session) return;

    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.access_token}`,
      },
      body: JSON.stringify({ plan: "pro", billing }),
    });

    if (res.ok) {
      const { url } = await res.json();
      window.location.href = url;
    } else {
      alert("Erreur lors de la redirection vers le paiement.");
    }
    setUpgrading(false);
  };

  const createDynamic = async () => {
    if (!newUrl) return;
    setCreating(true);
    const {
      data: { session },
    } = await getSupabase().auth.getSession();
    if (!session) return;

    const res = await fetch("/api/qr/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.access_token}`,
      },
      body: JSON.stringify({
        target_url: newUrl,
        label: newLabel || null,
        is_dynamic: true,
      }),
    });

    if (res.ok) {
      setNewUrl("");
      setNewLabel("");
      setShowCreate(false);
      loadData();
    } else {
      const err = await res.json();
      alert(err.error || "Erreur");
    }
    setCreating(false);
  };

  const deleteQR = async (qrId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!confirm("Supprimer ce QR code ? Cette action est irréversible.")) return;
    const {
      data: { session },
    } = await getSupabase().auth.getSession();
    if (!session) return;
    const res = await fetch(`/api/qr/${qrId}/delete`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${session.access_token}` },
    });
    if (res.ok) loadData();
    else alert("Erreur lors de la suppression");
  };

  const logout = async () => {
    await getSupabase().auth.signOut();
    window.location.href = "/";
  };

  const plan = subscription?.plan || "free";
  const isActive = subscription?.status === "active";
  const isPaid = isActive && plan !== "free";
  const qrCount = qrCodes.length;
  const qrLimit = plan === "business" ? 9999 : plan === "pro" ? 50 : 10;
  const canModify = isActive && (plan === "pro" || plan === "business");

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-400">Chargement...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <nav className="border-b border-gray-100 bg-white">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2">
            <img src="/logo.png" alt="LeQR" className="h-8 w-8 rounded-lg" />
            <span className="text-xl font-extrabold text-gray-900">
              Le<span className="text-blue-600">QR</span>
              <span className="text-xs text-gray-400 ml-1">.fr</span>
            </span>
          </a>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500">{user?.email}</span>
            <button
              onClick={logout}
              className="text-sm text-gray-400 hover:text-gray-600"
            >
              Déconnexion
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Subscription banner */}
        {(!subscription || subscription.plan === "free" || subscription.status !== "active") && (
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-2xl p-6 mb-6 flex items-center justify-between flex-wrap gap-4">
            <div>
              <h2 className="font-bold text-lg">Passez en Pro</h2>
              <p className="text-blue-100 text-sm">
                10 QR gratuits dans votre espace. Passez en Pro pour 50 QR modifiables, analytics détaillés et redirection instantanée.
              </p>
            </div>
            <button
              onClick={() => setShowUpgradeModal(true)}
              className="bg-white text-blue-600 font-bold px-6 py-2.5 rounded-xl hover:shadow-lg transition-all text-sm"
            >
              Voir les offres →
            </button>
          </div>
        )}

        {subscription && subscription.plan !== "free" && subscription.status === "active" && (
          <div className="bg-green-50 border border-green-200 rounded-2xl p-4 mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-green-600 text-lg">✓</span>
              <div>
                <span className="font-semibold text-green-800">
                  Plan {subscription.plan.charAt(0).toUpperCase() + subscription.plan.slice(1)} actif
                </span>
                {subscription.current_period_end && (
                  <span className="text-sm text-green-600 ml-2">
                    — renouvellement le{" "}
                    {new Date(subscription.current_period_end).toLocaleDateString("fr-FR")}
                  </span>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Upgrade Modal */}
        {showUpgradeModal && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-2xl w-full p-8 relative">
              <button
                onClick={() => setShowUpgradeModal(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-xl"
              >
                ✕
              </button>
              <h2 className="text-2xl font-bold mb-6 text-center">Passer en Pro</h2>
              <div className="max-w-md mx-auto">
                <div className="border-2 border-blue-600 rounded-2xl p-6">
                  <h3 className="text-lg font-bold mb-1">Pro</h3>
                  <div className="text-3xl font-extrabold mb-1">
                    14,90€<span className="text-base font-normal text-gray-400">/mois</span>
                  </div>
                  <p className="text-xs text-gray-400 mb-4">ou 149€/an (2 mois offerts)</p>
                  <ul className="space-y-2 text-sm text-gray-600 mb-6">
                    <li>✓ 50 QR modifiables</li>
                    <li>✓ Modifier l&apos;URL après impression</li>
                    <li>✓ Analytics détaillés (appareil, source, historique)</li>
                    <li>✓ Redirection instantanée sans overlay</li>
                    <li>✓ Support prioritaire</li>
                  </ul>
                  <div className="space-y-2">
                    <button
                      onClick={() => handleUpgrade("monthly")}
                      disabled={upgrading}
                      className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold py-2.5 rounded-xl transition-all text-sm"
                    >
                      {upgrading ? "Redirection..." : "14,90€/mois"}
                    </button>
                    <button
                      onClick={() => handleUpgrade("annual")}
                      disabled={upgrading}
                      className="w-full bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold py-2.5 rounded-xl transition-all text-sm"
                    >
                      {upgrading ? "Redirection..." : "149€/an (2 mois offerts)"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold">Mes QR Codes</h1>
            <p className="text-sm text-gray-400 mt-1">
              {qrCount}/{qrLimit === 9999 ? "∞" : qrLimit}{" "}
              {canModify ? "QR modifiables" : "QR dans votre espace gratuit"}
              {isPaid && subscription?.current_period_end && (
                <> — Plan {plan.charAt(0).toUpperCase() + plan.slice(1)}</>
              )}
            </p>
          </div>
          <div className="flex items-center gap-3">
            {isPaid && (
              <button
                onClick={async () => {
                  const { data: { session } } = await getSupabase().auth.getSession();
                  if (!session) return;
                  const res = await fetch("/api/stripe-portal", {
                    method: "POST",
                    headers: { Authorization: `Bearer ${session.access_token}` },
                  });
                  if (res.ok) {
                    const { url } = await res.json();
                    window.location.href = url;
                  }
                }}
                className="text-xs text-gray-500 hover:text-gray-700 border border-gray-200 px-3 py-2 rounded-lg"
              >
                Gérer mon abonnement
              </button>
            )}
            {qrCount < qrLimit ? (
              <button
                onClick={() => setShowCreate(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg text-sm transition-all"
              >
                + Nouveau QR
              </button>
            ) : !isPaid ? (
              <button
                onClick={() => setShowUpgradeModal(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg text-sm transition-all"
              >
                Passer en Pro pour plus de QR
              </button>
            ) : (
              <button
                disabled
                className="bg-gray-200 text-gray-500 font-semibold px-4 py-2 rounded-lg text-sm cursor-not-allowed"
              >
                Limite atteinte
              </button>
            )}
          </div>
        </div>

        {/* Create modal */}
        {showCreate && (
          <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6 shadow-lg">
            <h2 className="font-semibold mb-2">Nouveau QR code</h2>
            <p className="text-sm text-gray-500 mb-4">
              {canModify
                ? "Créez un QR modifiable et changez son URL plus tard si besoin."
                : "Ce QR sera enregistré dans votre espace gratuit. Passez en Pro pour modifier l'URL après impression."}
            </p>
            <div className="space-y-3">
              <input
                type="url"
                value={newUrl}
                onChange={(e) => setNewUrl(e.target.value)}
                placeholder="https://votre-url.fr"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
              <input
                type="text"
                value={newLabel}
                onChange={(e) => setNewLabel(e.target.value)}
                placeholder="Nom (optionnel) — ex: Menu restaurant, Carte visite..."
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
              <div className="flex gap-3">
                <button
                  onClick={createDynamic}
                  disabled={creating || !newUrl}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-semibold px-6 py-2 rounded-lg transition-all"
                >
                  {creating ? "Création..." : "Créer"}
                </button>
                <button
                  onClick={() => setShowCreate(false)}
                  className="text-gray-500 hover:text-gray-700 px-4 py-2"
                >
                  Annuler
                </button>
              </div>
            </div>
          </div>
        )}

        {/* QR list */}
        {qrCodes.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-5xl mb-4">📱</div>
            <h2 className="text-xl font-semibold mb-2">
              Aucun QR code pour le moment
            </h2>
            <p className="text-gray-500 mb-6">
              Créez jusqu&apos;à 10 QR gratuitement, puis passez en Pro pour en gérer 50 et modifier leur destination.
            </p>
            <button
              onClick={() => (qrCount < qrLimit ? setShowCreate(true) : setShowUpgradeModal(true))}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg"
            >
              {qrCount < qrLimit ? "Créer mon premier QR" : "Voir les offres"}
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {qrCodes.map((qr) => (
              <a
                key={qr.id}
                href={`/dashboard/qr/${qr.id}`}
                className="bg-white border border-gray-100 rounded-xl p-5 flex items-center gap-5 hover:shadow-md transition-all block"
              >
                <div className="shrink-0 w-20 h-20 bg-white border border-gray-200 rounded-lg overflow-hidden flex items-center justify-center">
                  <img
                    src={`/api/qr/${qr.id}/image?size=160`}
                    alt={`QR ${qr.label || qr.short_code}`}
                    className="w-full h-full object-contain"
                    loading="lazy"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-sm truncate">
                      {qr.label || qr.target_url}
                    </h3>
                    <span
                      className="text-[10px] px-1.5 py-0.5 rounded-full font-medium shrink-0 bg-green-50 text-green-700"
                    >
                      {canModify ? "Modifiable" : "Gratuit"}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 truncate">
                    leqr.fr/r/{qr.short_code}
                  </p>
                </div>
                <div className="text-center shrink-0">
                  <div className="text-lg font-bold text-blue-600">
                    {qr.scan_count}
                  </div>
                  <div className="text-xs text-gray-400">scans</div>
                </div>
                <button
                  onClick={(e) => deleteQR(qr.id, e)}
                  className="shrink-0 text-gray-300 hover:text-red-500 transition-colors p-1"
                  title="Supprimer"
                >
                  ✕
                </button>
                <div className="shrink-0 text-gray-300">
                  →
                </div>
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
