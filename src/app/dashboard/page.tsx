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
          value: 9.99,
          currency: "EUR",
        });
      }
      window.history.replaceState({}, "", "/dashboard");
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleUpgrade = async (plan: "pro" | "business", billing: "monthly" | "annual") => {
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
      body: JSON.stringify({ plan, billing }),
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

  const logout = async () => {
    await getSupabase().auth.signOut();
    window.location.href = "/";
  };

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
                QR dynamiques, analytics complets, modification d&apos;URL après impression.
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
              <h2 className="text-2xl font-bold mb-6 text-center">Choisir un plan</h2>
              <div className="grid md:grid-cols-2 gap-6">
                {/* Pro */}
                <div className="border-2 border-blue-600 rounded-2xl p-6">
                  <h3 className="text-lg font-bold mb-1">Pro</h3>
                  <div className="text-3xl font-extrabold mb-1">
                    9,99€<span className="text-base font-normal text-gray-400">/mois</span>
                  </div>
                  <p className="text-xs text-gray-400 mb-4">ou 89,91€/an (3 mois offerts)</p>
                  <ul className="space-y-2 text-sm text-gray-600 mb-6">
                    <li>✓ 50 QR dynamiques</li>
                    <li>✓ Modifier l&apos;URL après impression</li>
                    <li>✓ Analytics complets</li>
                    <li>✓ Sans overlay à la redirection</li>
                    <li>✓ Support prioritaire</li>
                  </ul>
                  <div className="space-y-2">
                    <button
                      onClick={() => handleUpgrade("pro", "monthly")}
                      disabled={upgrading}
                      className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold py-2.5 rounded-xl transition-all text-sm"
                    >
                      {upgrading ? "Redirection..." : "9,99€/mois"}
                    </button>
                    <button
                      onClick={() => handleUpgrade("pro", "annual")}
                      disabled={upgrading}
                      className="w-full bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold py-2.5 rounded-xl transition-all text-sm"
                    >
                      {upgrading ? "Redirection..." : "89,91€/an (-25%)"}
                    </button>
                  </div>
                </div>
                {/* Business */}
                <div className="border border-gray-200 rounded-2xl p-6">
                  <h3 className="text-lg font-bold mb-1">Business</h3>
                  <div className="text-3xl font-extrabold mb-1">
                    29,99€<span className="text-base font-normal text-gray-400">/mois</span>
                  </div>
                  <p className="text-xs text-gray-400 mb-4">ou 269,91€/an (3 mois offerts)</p>
                  <ul className="space-y-2 text-sm text-gray-600 mb-6">
                    <li>✓ QR dynamiques illimités</li>
                    <li>✓ Tout du plan Pro</li>
                    <li>✓ Domaine court personnalisé</li>
                    <li>✓ Création en masse (CSV)</li>
                    <li>✓ Support dédié</li>
                  </ul>
                  <div className="space-y-2">
                    <button
                      onClick={() => handleUpgrade("business", "monthly")}
                      disabled={upgrading}
                      className="w-full bg-gray-900 hover:bg-gray-800 disabled:opacity-50 text-white font-semibold py-2.5 rounded-xl transition-all text-sm"
                    >
                      {upgrading ? "Redirection..." : "29,99€/mois"}
                    </button>
                    <button
                      onClick={() => handleUpgrade("business", "annual")}
                      disabled={upgrading}
                      className="w-full bg-gray-50 hover:bg-gray-100 text-gray-700 font-semibold py-2.5 rounded-xl transition-all text-sm"
                    >
                      {upgrading ? "Redirection..." : "269,91€/an (-25%)"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold">Mes QR Codes</h1>
          <button
            onClick={() => setShowCreate(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg text-sm transition-all"
          >
            + Nouveau QR dynamique
          </button>
        </div>

        {/* Create modal */}
        {showCreate && (
          <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6 shadow-lg">
            <h2 className="font-semibold mb-4">Nouveau QR code dynamique</h2>
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
              Créez votre premier QR code dynamique pour suivre vos scans.
            </p>
            <button
              onClick={() => setShowCreate(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg"
            >
              Créer mon premier QR
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {qrCodes.map((qr) => (
              <div
                key={qr.id}
                className="bg-white border border-gray-100 rounded-xl p-5 flex items-center justify-between hover:shadow-md transition-all"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      qr.is_dynamic ? "bg-green-400" : "bg-gray-300"
                    }`}
                  />
                  <div>
                    <h3 className="font-semibold text-sm">
                      {qr.label || qr.target_url}
                    </h3>
                    <p className="text-xs text-gray-400">
                      {qr.is_dynamic ? "Dynamique" : "Statique"} — leqr.fr/r/
                      {qr.short_code}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <div className="text-lg font-bold text-blue-600">
                      {qr.scan_count}
                    </div>
                    <div className="text-xs text-gray-400">scans</div>
                  </div>
                  <a
                    href={`/dashboard/qr/${qr.id}`}
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Détails →
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
