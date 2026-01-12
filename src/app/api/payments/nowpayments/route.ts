import { NextResponse } from "next/server";
import { createClient } from "../../../../../utils/supabase/server";

export async function POST(req: Request) {
  const { amount, tierId } = await req.json();
  const supabase = await createClient(); // Use await if using Next.js 15
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const response = await fetch("https://api.nowpayments.io/v1/invoice", {
    method: "POST",
    headers: {
      "x-api-key": process.env.NOWPAYMENTS_API_KEY!,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      price_amount: amount,
      price_currency: "usd",
      order_id: `${user.id}:${tierId}`, // Store UserID and TierID in the order
      order_description: `VYBE Clearance: ${tierId}`,
      ipn_callback_url: `${process.env.NEXT_PUBLIC_SITE_URL}/api/webhooks/nowpayments`,
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard?status=success`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/membership`,
    }),
  });

  const data = await response.json();
  return NextResponse.json({ invoice_url: data.invoice_url });
}