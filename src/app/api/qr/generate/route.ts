import { NextRequest, NextResponse } from "next/server";
import { generateQRDataURL, generateQRSVG } from "@/lib/qr";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { data, fgColor, bgColor, size, format } = body;

    if (!data || typeof data !== "string" || data.length > 2000) {
      return NextResponse.json(
        { error: "Données invalides ou trop longues" },
        { status: 400 }
      );
    }

    if (format === "svg") {
      const svg = await generateQRSVG({
        data,
        fgColor: fgColor || "#000000",
        bgColor: bgColor || "#ffffff",
      });
      return NextResponse.json({ svg });
    }

    const dataURL = await generateQRDataURL({
      data,
      size: Math.min(size || 400, 2000),
      fgColor: fgColor || "#000000",
      bgColor: bgColor || "#ffffff",
      errorCorrection: "H",
    });

    return NextResponse.json({ dataURL });
  } catch {
    return NextResponse.json(
      { error: "Erreur lors de la génération" },
      { status: 500 }
    );
  }
}
