"use client";

import { useEffect, useState, useCallback } from "react";
import { getSupabase } from "@/lib/supabase";
import type { QRCode } from "@/lib/supabase";

export default function Dashboard() {
  const [user, setUser] = useState<{ id: string; email?: string } | null>(null);
  const [qrCodes, setQrCodes] = useState<QRCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [newUrl, setNewUrl] = useState("");
  const [newLabel, setNewLabel] = useState("");
  const [creating, setCreating] = useState(false);

  const loadData = useCallback(async () => {
    const {
      data: { session },
    } = await getSupabase().auth.getSession();
    if (!session) {
      window.location.href = "/connexion";
      return;
    }
    setUser(session.user);

    const { data } = await getSupabase()
      .from("qr_codes")
      .select("*")
      .eq("user_id", session.user.id)
      .order("created_at", { ascending: false });

    setQrCodes(data || []);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

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
          <a href="/" className="text-xl font-extrabold text-gray-900">
            Le<span className="text-blue-600">QR</span>
            <span className="text-xs text-gray-400 ml-1">.fr</span>
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
