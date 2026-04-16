import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

function getStripe() {
  return new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2026-02-25.clover",
  });
}

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
    const { plan, billing = "monthly", acquisition } = body;

    if (plan !== "pro" || !["monthly", "annual"].includes(billing)) {
      return NextResponse.json(
        { error: "Plan non configuré" },
        { status: 400 }
      );
    }

    const offer = billing === "annual"
      ? {
          unit_amount: 14900,
          interval: "year" as const,
          name: "LeQR Pro Annuel",
          description: "50 QR modifiables, analytics détaillés, redirection instantanée, sans overlay.",
        }
      : {
          unit_amount: 1490,
          interval: "month" as const,
          name: "LeQR Pro Mensuel",
          description: "50 QR modifiables, analytics détaillés, redirection instantanée, sans overlay.",
        };

    let customerId: string | undefined;
    const { data: sub } = await supabase
      .from("subscriptions")
      .select("stripe_customer_id")
      .eq("user_id", user.id)
      .single();

    if (sub?.stripe_customer_id) {
      customerId = sub.stripe_customer_id;
    }

    const stripe = getStripe();
    const acquisitionMetadata =
      acquisition && typeof acquisition === "object"
        ? Object.fromEntries(
            Object.entries(acquisition)
              .filter(([, value]) => typeof value === "string" && value)
              .map(([key, value]) => [key, String(value).slice(0, 200)])
          )
        : {};

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer: customerId,
      customer_email: customerId ? undefined : user.email,
      line_items: [
        {
          price_data: {
            currency: "eur",
            unit_amount: offer.unit_amount,
            recurring: { interval: offer.interval },
            product_data: {
              name: offer.name,
              description: offer.description,
            },
          },
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?upgraded=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`,
      metadata: {
        user_id: user.id,
        plan,
        billing,
        ...acquisitionMetadata,
      },
      allow_promotion_codes: true,
    });

    return NextResponse.json({ url: session.url });
  } catch {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
