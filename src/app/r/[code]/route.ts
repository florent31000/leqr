import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

function getDeviceType(ua: string): string {
  if (/mobile/i.test(ua)) return "mobile";
  if (/tablet|ipad/i.test(ua)) return "tablet";
  return "desktop";
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  const { code } = await params;

  if (!supabaseUrl || !supabaseServiceKey) {
    return NextResponse.redirect("https://leqr.fr");
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  const { data: qr } = await supabase
    .from("qr_codes")
    .select("id, target_url, user_id, is_dynamic")
    .eq("short_code", code)
    .single();

  if (!qr) {
    return NextResponse.redirect("https://leqr.fr?error=not_found");
  }

  // Log the scan
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown";
  const userAgent = req.headers.get("user-agent") || "";
  const referer = req.headers.get("referer") || "";
  const device = getDeviceType(userAgent);

  await supabase.from("scans").insert({
    qr_id: qr.id,
    ip,
    user_agent: userAgent,
    device,
    referer,
  });

  // Determine if user has Pro subscription
  let isPro = false;
  if (qr.user_id) {
    const { data: sub } = await supabase
      .from("subscriptions")
      .select("plan, status")
      .eq("user_id", qr.user_id)
      .single();

    isPro =
      !!sub &&
      (sub.plan === "pro" || sub.plan === "business") &&
      sub.status === "active";
  }

  // Anonymous QR codes (from free generator) or free users with dynamic QR:
  // show a brief overlay before redirecting
  if (!isPro && qr.is_dynamic) {
    const safeUrl = qr.target_url.replace(/"/g, '\\"');
    const overlayHtml = `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Redirection — LeQR.fr</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: system-ui, sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; background: #f8fafc; }
    .card { text-align: center; padding: 2rem; }
    .brand { font-size: 1.2rem; font-weight: 800; color: #1e40af; margin-bottom: 0.5rem; }
    .msg { color: #6b7280; font-size: 0.9rem; margin-bottom: 1rem; }
    .bar { width: 200px; height: 4px; background: #e5e7eb; border-radius: 2px; overflow: hidden; margin: 0 auto; }
    .fill { height: 100%; background: #2563eb; animation: load 3s linear forwards; }
    @keyframes load { from { width: 0; } to { width: 100%; } }
    a { color: #2563eb; text-decoration: none; font-size: 0.8rem; }
  </style>
</head>
<body>
  <div class="card">
    <div class="brand">Propulsé par LeQR.fr</div>
    <div class="msg">Redirection dans 3 secondes...</div>
    <div class="bar"><div class="fill"></div></div>
    <p style="margin-top:1rem"><a href="https://leqr.fr">Créez vos QR codes gratuitement</a></p>
  </div>
  <script>setTimeout(()=>location.href="${safeUrl}",3000);</script>
</body>
</html>`;
    return new NextResponse(overlayHtml, {
      headers: { "Content-Type": "text/html; charset=utf-8" },
    });
  }

  // Free/anonymous non-dynamic QR codes: redirect immediately (no overlay)
  return NextResponse.redirect(qr.target_url);
}
