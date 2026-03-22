import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

const ADMIN_EMAILS = ["flo.bolzinger@gmail.com"];

function getStripe() {
  return new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2026-02-25.clover",
  });
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

export async function POST(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  if (!authHeader) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey);
  const token = authHeader.replace("Bearer ", "");
  const {
    data: { user },
  } = await supabase.auth.getUser(token);

  if (!user || !ADMIN_EMAILS.includes(user.email || "")) {
    return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
  }

  const body = await req.json();
  const { stripe_customer_id } = body;

  if (!stripe_customer_id) {
    return NextResponse.json(
      { error: "stripe_customer_id requis" },
      { status: 400 }
    );
  }

  try {
    const stripe = getStripe();

    const subscriptions = await stripe.subscriptions.list({
      customer: stripe_customer_id,
      status: "active",
      limit: 1,
    });

    if (subscriptions.data.length === 0) {
      return NextResponse.json(
        { error: "Aucun abonnement actif trouvé" },
        { status: 404 }
      );
    }

    const sub = subscriptions.data[0];

    const latestInvoice = await stripe.invoices.retrieve(
      sub.latest_invoice as string
    );
    const invoiceData = latestInvoice as unknown as { charge?: string };
    if (invoiceData.charge) {
      await stripe.refunds.create({
        charge: invoiceData.charge,
      });
    }

    await stripe.subscriptions.cancel(sub.id);

    await supabase
      .from("subscriptions")
      .update({ status: "cancelled" })
      .eq("stripe_customer_id", stripe_customer_id);

    return NextResponse.json({ success: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Erreur Stripe";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
