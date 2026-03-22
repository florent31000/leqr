import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

export async function PATCH(
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
    .select("id, user_id, is_dynamic")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (!qr) {
    return NextResponse.json({ error: "QR code non trouvé" }, { status: 404 });
  }

  if (!qr.is_dynamic) {
    return NextResponse.json(
      { error: "Seuls les QR dynamiques peuvent être modifiés" },
      { status: 403 }
    );
  }

  const { data: sub } = await supabase
    .from("subscriptions")
    .select("plan, status")
    .eq("user_id", user.id)
    .single();

  const isPro =
    sub &&
    (sub.plan === "pro" || sub.plan === "business") &&
    sub.status === "active";

  if (!isPro) {
    return NextResponse.json(
      { error: "Abonnement Pro requis pour modifier un QR dynamique" },
      { status: 403 }
    );
  }

  const body = await req.json();
  const { target_url } = body;

  if (!target_url || typeof target_url !== "string") {
    return NextResponse.json({ error: "URL invalide" }, { status: 400 });
  }

  const { error } = await supabase
    .from("qr_codes")
    .update({ target_url, updated_at: new Date().toISOString() })
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
