"use client";

import { useEffect, useState, useCallback } from "react";
import { getSupabase } from "@/lib/supabase";

const ADMIN_EMAILS = ["flo.bolzinger@gmail.com"];

interface UserRow {
  id: string;
  email: string;
  created_at: string;
  qr_count: number;
  dynamic_count: number;
  total_scans: number;
  plan: string;
  sub_status: string;
  stripe_customer_id: string | null;
}

interface DashboardStats {
  totalUsers: number;
  totalQRCodes: number;
  totalScans: number;
  proUsers: number;
  businessUsers: number;
  freeUsers: number;
  supportOpen: number;
}

interface SupportConversationRow {
  id: string;
  email: string;
  status: string;
  plan: string;
  message_count: number;
  last_message_at: string;
  last_message_preview: string;
}

export default function AdminPage() {
  const [authorized, setAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<UserRow[]>([]);
  const [supportConversations, setSupportConversations] = useState<
    SupportConversationRow[]
  >([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [search, setSearch] = useState("");

  const loadAdmin = useCallback(async () => {
    const {
      data: { session },
    } = await getSupabase().auth.getSession();
    if (!session) {
      window.location.href = "/connexion";
      return;
    }

    if (!ADMIN_EMAILS.includes(session.user.email || "")) {
      setAuthorized(false);
      setLoading(false);
      return;
    }

    setAuthorized(true);

    const res = await fetch("/api/admin/dashboard", {
      headers: { Authorization: `Bearer ${session.access_token}` },
    });

    if (res.ok) {
      const data = await res.json();
      setUsers(data.users);
      setSupportConversations(data.supportConversations || []);
      setStats(data.stats);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    loadAdmin();
  }, [loadAdmin]);

  const handleRefund = async (stripeCustomerId: string, userEmail: string) => {
    if (
      !confirm(
        `Rembourser et annuler l'abonnement de ${userEmail} ?`
      )
    )
      return;

    const {
      data: { session },
    } = await getSupabase().auth.getSession();
    if (!session) return;

    const res = await fetch("/api/admin/refund", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.access_token}`,
      },
      body: JSON.stringify({ stripe_customer_id: stripeCustomerId }),
    });

    if (res.ok) {
      alert("Remboursement effectué.");
      loadAdmin();
    } else {
      const err = await res.json();
      alert(err.error || "Erreur lors du remboursement");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-400">Chargement...</div>
      </div>
    );
  }

  if (!authorized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">🔒</div>
          <h1 className="text-xl font-bold mb-2">Accès refusé</h1>
          <p className="text-gray-500">
            Cette page est réservée aux administrateurs.
          </p>
          <a href="/" className="text-blue-600 hover:underline text-sm mt-4 block">
            Retour à l&apos;accueil
          </a>
        </div>
      </div>
    );
  }

  const filteredUsers = users.filter(
    (u) =>
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="border-b border-gray-100 bg-white">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <a href="/" className="text-xl font-extrabold text-gray-900">
              Le<span className="text-blue-600">QR</span>
              <span className="text-xs text-gray-400 ml-1">.fr</span>
            </a>
            <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-semibold">
              ADMIN
            </span>
          </div>
          <a
            href="/dashboard"
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            Mon dashboard →
          </a>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-8">Tableau de bord admin</h1>

        {/* KPIs */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-4 mb-8">
            {[
              { label: "Utilisateurs", value: stats.totalUsers, color: "blue" },
              { label: "QR Codes", value: stats.totalQRCodes, color: "indigo" },
              { label: "Scans totaux", value: stats.totalScans, color: "green" },
              { label: "Pro", value: stats.proUsers, color: "violet" },
              { label: "Business", value: stats.businessUsers, color: "purple" },
              { label: "Gratuits", value: stats.freeUsers, color: "gray" },
              { label: "SAV ouverts", value: stats.supportOpen, color: "amber" },
            ].map((kpi) => (
              <div
                key={kpi.label}
                className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm"
              >
                <div className="text-2xl font-extrabold text-gray-900">
                  {kpi.value.toLocaleString("fr-FR")}
                </div>
                <div className="text-xs text-gray-500 mt-1">{kpi.label}</div>
              </div>
            ))}
          </div>
        )}

        {/* Search */}
        <div className="mb-6">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher par email ou ID..."
            className="w-full max-w-md px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        {/* Users table */}
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-left text-gray-500 border-b border-gray-100">
                  <th className="px-4 py-3 font-medium">Email</th>
                  <th className="px-4 py-3 font-medium">Inscription</th>
                  <th className="px-4 py-3 font-medium">Plan</th>
                  <th className="px-4 py-3 font-medium">QR codes</th>
                  <th className="px-4 py-3 font-medium">Modifiables</th>
                  <th className="px-4 py-3 font-medium">Scans</th>
                  <th className="px-4 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((u) => (
                  <tr
                    key={u.id}
                    className="border-b border-gray-50 hover:bg-gray-50"
                  >
                    <td className="px-4 py-3 font-medium text-gray-900">
                      {u.email}
                    </td>
                    <td className="px-4 py-3 text-gray-500">
                      {new Date(u.created_at).toLocaleDateString("fr-FR")}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                          u.plan === "business"
                            ? "bg-purple-100 text-purple-700"
                            : u.plan === "pro"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {u.plan.charAt(0).toUpperCase() + u.plan.slice(1)}
                        {u.sub_status === "cancelled" && " (annulé)"}
                      </span>
                    </td>
                    <td className="px-4 py-3">{u.qr_count}</td>
                    <td className="px-4 py-3">{u.dynamic_count}</td>
                    <td className="px-4 py-3 font-semibold">{u.total_scans}</td>
                    <td className="px-4 py-3">
                      {u.stripe_customer_id &&
                        u.plan !== "free" &&
                        u.sub_status === "active" && (
                          <button
                            onClick={() =>
                              handleRefund(u.stripe_customer_id!, u.email)
                            }
                            className="text-xs text-red-600 hover:text-red-700 font-medium hover:underline"
                          >
                            Rembourser
                          </button>
                        )}
                    </td>
                  </tr>
                ))}
                {filteredUsers.length === 0 && (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-4 py-8 text-center text-gray-400"
                    >
                      Aucun utilisateur trouvé
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-8 bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="text-lg font-bold">Conversations SAV</h2>
            <p className="text-sm text-gray-500">
              Historique du chatbot visible côté admin
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-left text-gray-500 border-b border-gray-100">
                  <th className="px-4 py-3 font-medium">Client</th>
                  <th className="px-4 py-3 font-medium">Plan</th>
                  <th className="px-4 py-3 font-medium">Statut</th>
                  <th className="px-4 py-3 font-medium">Messages</th>
                  <th className="px-4 py-3 font-medium">Dernier message</th>
                  <th className="px-4 py-3 font-medium">Action</th>
                </tr>
              </thead>
              <tbody>
                {supportConversations.map((conversation) => (
                  <tr
                    key={conversation.id}
                    className="border-b border-gray-50 hover:bg-gray-50"
                  >
                    <td className="px-4 py-3 font-medium text-gray-900">
                      {conversation.email}
                    </td>
                    <td className="px-4 py-3">{conversation.plan}</td>
                    <td className="px-4 py-3">
                      <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-amber-50 text-amber-700">
                        {conversation.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">{conversation.message_count}</td>
                    <td className="px-4 py-3 text-gray-500 max-w-[360px] truncate">
                      {conversation.last_message_preview || "—"}
                    </td>
                    <td className="px-4 py-3">
                      <a
                        href={`/admin/support/${conversation.id}`}
                        className="text-blue-600 hover:underline font-medium"
                      >
                        Ouvrir
                      </a>
                    </td>
                  </tr>
                ))}
                {supportConversations.length === 0 && (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-4 py-8 text-center text-gray-400"
                    >
                      Aucune conversation SAV pour le moment
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
