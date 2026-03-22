import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const ADMIN_EMAILS = ["flo.bolzinger@gmail.com"];

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  if (!authHeader) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey);
  const token = authHeader.replace("Bearer ", "");
  const {
    data: { user },
  } = await supabase.auth.getUser(token);

  if (!user || !ADMIN_EMAILS.includes(user.email || "")) {
    return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
  }

  const {
    data: { users: authUsers },
  } = await supabase.auth.admin.listUsers({ perPage: 1000 });

  const { data: allQR } = await supabase
    .from("qr_codes")
    .select("id, user_id, is_dynamic, scan_count");

  const { data: allSubs } = await supabase
    .from("subscriptions")
    .select("user_id, plan, status, stripe_customer_id");

  const { data: supportConversations } = await supabase
    .from("support_conversations")
    .select("id, user_id, visitor_email, status, created_at, last_message_at")
    .order("last_message_at", { ascending: false })
    .limit(100);

  const conversationIds = (supportConversations || []).map((c) => c.id);
  const { data: supportMessages } = conversationIds.length
    ? await supabase
        .from("support_messages")
        .select("conversation_id, role, content, created_at")
        .in("conversation_id", conversationIds)
        .order("created_at", { ascending: false })
    : { data: [] };

  const subMap = new Map(
    (allSubs || []).map((s) => [s.user_id, s])
  );

  const users = (authUsers || []).map((u) => {
    const userQR = (allQR || []).filter((q) => q.user_id === u.id);
    const sub = subMap.get(u.id);
    return {
      id: u.id,
      email: u.email || "",
      created_at: u.created_at,
      qr_count: userQR.length,
      dynamic_count: userQR.filter((q) => q.is_dynamic).length,
      total_scans: userQR.reduce(
        (sum, q) => sum + (q.scan_count || 0),
        0
      ),
      plan: sub?.plan || "free",
      sub_status: sub?.status || "none",
      stripe_customer_id: sub?.stripe_customer_id || null,
    };
  });

  users.sort(
    (a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  const totalQRCodes = (allQR || []).length;
  const totalScans = (allQR || []).reduce(
    (sum, q) => sum + (q.scan_count || 0),
    0
  );
  const proUsers = users.filter(
    (u) => u.plan === "pro" && u.sub_status === "active"
  ).length;
  const businessUsers = users.filter(
    (u) => u.plan === "business" && u.sub_status === "active"
  ).length;

  const authUserMap = new Map((authUsers || []).map((u) => [u.id, u]));
  const supportItems = (supportConversations || []).map((conversation) => {
    const owner = conversation.user_id ? authUserMap.get(conversation.user_id) : null;
    const sub = conversation.user_id ? subMap.get(conversation.user_id) : null;
    const messages = (supportMessages || []).filter(
      (message) => message.conversation_id === conversation.id
    );
    const lastMessage = messages[0];

    return {
      id: conversation.id,
      email: conversation.visitor_email || owner?.email || "Visiteur anonyme",
      status: conversation.status,
      plan: sub?.plan || "free",
      message_count: messages.length,
      last_message_at: conversation.last_message_at,
      last_message_preview: lastMessage?.content?.slice(0, 120) || "",
    };
  });

  return NextResponse.json({
    users,
    supportConversations: supportItems,
    stats: {
      totalUsers: users.length,
      totalQRCodes,
      totalScans,
      proUsers,
      businessUsers,
      freeUsers: users.length - proUsers - businessUsers,
      supportOpen: supportItems.filter((c) => c.status !== "closed").length,
    },
  });
}
