"use client";

import { useEffect, useState } from "react";
import { getSupabase } from "@/lib/supabase";

interface SupportMessage {
  id: string;
  role: "user" | "assistant" | "admin" | "system";
  content: string;
  created_at: string;
}

interface SupportConversation {
  id: string;
  visitor_email: string | null;
  status: string;
  created_at: string;
}

export default function SupportConversationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [conversation, setConversation] = useState<SupportConversation | null>(null);
  const [messages, setMessages] = useState<SupportMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    params.then((p) => setConversationId(p.id));
  }, [params]);

  useEffect(() => {
    if (!conversationId) return;

    const load = async () => {
      const {
        data: { session },
      } = await getSupabase().auth.getSession();
      if (!session) {
        window.location.href = `/connexion?next=/admin/support/${conversationId}`;
        return;
      }

      const res = await fetch(`/api/admin/support/${conversationId}`, {
        headers: { Authorization: `Bearer ${session.access_token}` },
      });

      if (!res.ok) {
        setError("Conversation introuvable ou accès refusé.");
        setLoading(false);
        return;
      }

      const data = await res.json();
      setConversation(data.conversation);
      setMessages(data.messages || []);
      setLoading(false);
    };

    load();
  }, [conversationId]);

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
          <a href="/admin" className="text-blue-600 hover:underline">
            Retour à l&apos;admin
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="border-b border-gray-100 bg-white">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <a href="/admin" className="text-sm text-blue-600 hover:underline">
            ← Retour admin
          </a>
          <span className="text-sm text-gray-400">
            {conversation?.visitor_email || "Visiteur anonyme"}
          </span>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h1 className="text-xl font-bold">Conversation support</h1>
            <p className="text-sm text-gray-500 mt-1">
              {conversation?.status} — démarrée le{" "}
              {conversation?.created_at
                ? new Date(conversation.created_at).toLocaleString("fr-FR")
                : "—"}
            </p>
          </div>

          <div className="p-6 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                    message.role === "user"
                      ? "bg-blue-600 text-white"
                      : message.role === "assistant"
                        ? "bg-gray-100 text-gray-800"
                        : "bg-amber-50 text-amber-900"
                  }`}
                >
                  <div className="text-[11px] opacity-70 mb-1 uppercase tracking-wide">
                    {message.role}
                  </div>
                  <div>{message.content}</div>
                  <div className="text-[11px] opacity-60 mt-2">
                    {new Date(message.created_at).toLocaleString("fr-FR")}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
