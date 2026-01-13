import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { userId, tierName, price } = await req.json();

    // IMPORTANT: Format the order_id exactly as the webhook expects
    const orderId = `${userId}:${tierName}`;

    const response = await fetch("https://api.nowpayments.io/v1/invoice", {
      method: "POST",
      headers: {
        "x-api-key": process.env.NOWPAYMENTS_API_KEY || "", // Your API Key
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        price_amount: price,
        price_currency: "usd",
        order_id: orderId, // This is userId:tierName
        order_description: `Upgrade to ${tierName} Tier`,
        ipn_callback_url: "https://your-domain.com/api/webhooks/nowpayments",
        success_url: "https://your-domain.com/profile?status=success",
        cancel_url: "https://your-domain.com/membership?status=cancelled",
      }),
    });

    const data = await response.json();
    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}