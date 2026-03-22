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
  const body = await req.text();
  const sig = req.headers.get("stripe-signature") || "";

  let event: Stripe.Event;
  try {
    const stripe = getStripe();
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET || ""
    );
  } catch {
    return NextResponse.json({ error: "Signature invalide" }, { status: 400 });
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const userId = session.metadata?.user_id;
    if (!userId) return NextResponse.json({ received: true });

    const subscriptionId = session.subscription as string;
    const stripeClient = getStripe();
    const subResponse = await stripeClient.subscriptions.retrieve(subscriptionId);
    const sub = subResponse as unknown as {
      items: { data: Array<{ price?: { id: string } }> };
      current_period_end: number;
    };

    const priceId = sub.items.data[0]?.price?.id;
    let plan = "pro";
    if (priceId === process.env.STRIPE_BUSINESS_PRICE_ID) plan = "business";

    await supabase.from("subscriptions").upsert({
      user_id: userId,
      stripe_customer_id: session.customer as string,
      stripe_subscription_id: subscriptionId,
      plan,
      status: "active",
      current_period_end: new Date(
        sub.current_period_end * 1000
      ).toISOString(),
    });
  }

  if (event.type === "customer.subscription.updated") {
    const raw = event.data.object as unknown as {
      id: string;
      status: string;
      current_period_end: number;
    };
    const { data: existing } = await supabase
      .from("subscriptions")
      .select("user_id")
      .eq("stripe_subscription_id", raw.id)
      .single();

    if (existing) {
      await supabase
        .from("subscriptions")
        .update({
          status: raw.status === "active" ? "active" : "cancelled",
          current_period_end: new Date(
            raw.current_period_end * 1000
          ).toISOString(),
        })
        .eq("stripe_subscription_id", raw.id);
    }
  }

  if (event.type === "customer.subscription.deleted") {
    const raw = event.data.object as unknown as { id: string };
    await supabase
      .from("subscriptions")
      .update({ status: "cancelled" })
      .eq("stripe_subscription_id", raw.id);
  }

  return NextResponse.json({ received: true });
}
