import { NextRequest, NextResponse } from "next/server";
import { generateQRDataURL, generateQRSVG } from "@/lib/qr";
import { createClient } from "@supabase/supabase-js";
import { nanoid } from "nanoid";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://leqr.fr";

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

    // If tracked mode (default for downloads), route through our servers
    if (tracked !== false && supabaseUrl && supabaseServiceKey) {
      const supabase = createClient(supabaseUrl, supabaseServiceKey);
      shortCode = nanoid(8);

      await supabase.from("qr_codes").insert({
        short_code: shortCode,
        target_url: data,
        fg_color: fgColor || "#000000",
        bg_color: bgColor || "#ffffff",
        is_dynamic: false,
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
