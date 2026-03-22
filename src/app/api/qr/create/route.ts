import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { nanoid } from "nanoid";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

export async function POST(req: NextRequest) {
  try {
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

    const body = await req.json();
    const { target_url, label, fg_color, bg_color, is_dynamic } = body;

    if (!target_url) {
      return NextResponse.json({ error: "URL requise" }, { status: 400 });
    }

    if (is_dynamic) {
      const { count } = await supabase
        .from("qr_codes")
        .select("id", { count: "exact", head: true })
        .eq("user_id", user.id)
        .eq("is_dynamic", true);

      const { data: sub } = await supabase
        .from("subscriptions")
        .select("plan")
        .eq("user_id", user.id)
        .single();

      const plan = sub?.plan || "free";
      const limits: Record<string, number> = { free: 0, pro: 50, business: 9999 };
      const limit = limits[plan] ?? 3;

      if ((count ?? 0) >= limit) {
        return NextResponse.json(
          {
            error: `Limite de QR dynamiques atteinte (${limit}). Passez au plan supérieur.`,
          },
          { status: 403 }
        );
      }
    }

    const shortCode = nanoid(8);

    const { data, error } = await supabase
      .from("qr_codes")
      .insert({
        user_id: user.id,
        short_code: shortCode,
        target_url,
        label: label || null,
        fg_color: fg_color || "#000000",
        bg_color: bg_color || "#ffffff",
        is_dynamic: is_dynamic || false,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      ...data,
      redirect_url: `https://leqr.fr/r/${shortCode}`,
    });
  } catch {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
