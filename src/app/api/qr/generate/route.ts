import { NextRequest, NextResponse } from "next/server";
import { generateQRDataURL, generateQRSVG } from "@/lib/qr";
import { createClient } from "@supabase/supabase-js";
import { nanoid } from "nanoid";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://leqr.fr";

const PLAN_LIMITS: Record<string, number> = {
  free: 10,
  pro: 50,
  business: 9999,
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { data, fgColor, bgColor, size, format, tracked } = body;

    if (!data || typeof data !== "string" || data.length > 2000) {
      return NextResponse.json(
        { error: "Données invalides ou trop longues" },
        { status: 400 }
      );
    }

    let qrContent = data;
    let shortCode: string | null = null;
    let userId: string | null = null;

    // If tracked mode (default for downloads), route through our servers
    if (tracked !== false && supabaseUrl && supabaseServiceKey) {
      const supabase = createClient(supabaseUrl, supabaseServiceKey);
      const authHeader = req.headers.get("authorization");

      if (!authHeader) {
        return NextResponse.json(
          {
            error:
              "Compte requis : créez un compte gratuit pour générer et suivre vos QR.",
          },
          { status: 401 }
        );
      }

      const token = authHeader.replace("Bearer ", "");
      const {
        data: { user },
      } = await supabase.auth.getUser(token);

      if (!user) {
        return NextResponse.json(
          {
            error:
              "Compte requis : créez un compte gratuit pour générer et suivre vos QR.",
          },
          { status: 401 }
        );
      }

      userId = user.id;

      const [{ data: sub }, { count }] = await Promise.all([
        supabase
          .from("subscriptions")
          .select("plan, status")
          .eq("user_id", user.id)
          .single(),
        supabase
          .from("qr_codes")
          .select("id", { count: "exact", head: true })
          .eq("user_id", user.id),
      ]);

      const plan =
        sub?.status === "active" ? sub.plan || "free" : "free";
      const limit = PLAN_LIMITS[plan] ?? PLAN_LIMITS.free;

      if ((count ?? 0) >= limit) {
        return NextResponse.json(
          {
            error:
              plan === "free"
                ? `Limite du plan gratuit atteinte (${limit} QR). Passez en Pro pour gérer jusqu'à 50 QR modifiables.`
                : `Limite atteinte (${limit} QR).`,
          },
          { status: 403 }
        );
      }

      shortCode = nanoid(8);

      await supabase.from("qr_codes").insert({
        user_id: userId,
        short_code: shortCode,
        initial_target_url: data,
        target_url: data,
        fg_color: fgColor || "#000000",
        bg_color: bgColor || "#ffffff",
        is_dynamic: true,
      });

      qrContent = `${appUrl}/r/${shortCode}`;
    }

    if (format === "svg") {
      const svg = await generateQRSVG({
        data: qrContent,
        fgColor: fgColor || "#000000",
        bgColor: bgColor || "#ffffff",
      });
      return NextResponse.json({ svg, shortCode });
    }

    const dataURL = await generateQRDataURL({
      data: qrContent,
      size: Math.min(size || 400, 2000),
      fgColor: fgColor || "#000000",
      bgColor: bgColor || "#ffffff",
      errorCorrection: "H",
    });

    return NextResponse.json({ dataURL, shortCode });
  } catch {
    return NextResponse.json(
      { error: "Erreur lors de la génération" },
      { status: 500 }
    );
  }
}
