import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { generateQRBuffer } from "@/lib/qr";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://leqr.fr";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const size = Math.min(
      Number(req.nextUrl.searchParams.get("size") || "300"),
      1000
    );

    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const { data: qr } = await supabase
      .from("qr_codes")
      .select("short_code, fg_color, bg_color")
      .eq("id", id)
      .single();

    if (!qr) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const buffer = await generateQRBuffer({
      data: `${appUrl}/r/${qr.short_code}`,
      size,
      fgColor: qr.fg_color || "#000000",
      bgColor: qr.bg_color || "#ffffff",
      errorCorrection: "H",
    });

    return new NextResponse(new Uint8Array(buffer), {
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "public, max-age=86400",
      },
    });
  } catch {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
