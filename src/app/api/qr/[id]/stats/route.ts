import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const authHeader = req.headers.get("authorization");
  if (!authHeader) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey);
  const token = authHeader.replace("Bearer ", "");
  const {
    data: { user },
  } = await supabase.auth.getUser(token);

  if (!user) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const { data: qr } = await supabase
    .from("qr_codes")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (!qr) {
    return NextResponse.json({ error: "QR code non trouvé" }, { status: 404 });
  }

  const { data: sub } = await supabase
    .from("subscriptions")
    .select("plan, status")
    .eq("user_id", user.id)
    .single();

  const hasDetailedAnalytics =
    !!sub &&
    sub.status === "active" &&
    (sub.plan === "pro" || sub.plan === "business");

  const { data: scans } = await supabase
    .from("scans")
    .select("*")
    .eq("qr_id", id)
    .order("scanned_at", { ascending: false })
    .limit(100);

  const { count: totalScans } = await supabase
    .from("scans")
    .select("id", { count: "exact", head: true })
    .eq("qr_id", id);

  const deviceBreakdown: Record<string, number> = {};
  if (hasDetailedAnalytics) {
    scans?.forEach((s) => {
      const d = s.device || "unknown";
      deviceBreakdown[d] = (deviceBreakdown[d] || 0) + 1;
    });
  }

  return NextResponse.json({
    qr,
    totalScans: totalScans || 0,
    recentScans: hasDetailedAnalytics ? scans || [] : [],
    deviceBreakdown,
    hasDetailedAnalytics,
  });
}
