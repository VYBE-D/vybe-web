import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId, tierName, price, amount, talentId, conversationId, items, metadata } = body;

    // --- LOGIC 1: MEMBERSHIP UPGRADE (EXISTING) ---
    if (tierName) {
      const orderId = `${userId}:${tierName}`;
      const response = await fetch("https://api.nowpayments.io/v1/invoice", {
        method: "POST",
        headers: {
          "x-api-key": process.env.NOWPAYMENTS_API_KEY || "",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          price_amount: price,
          price_currency: "usd",
          order_id: orderId,
          order_description: `Upgrade to ${tierName} Tier`,
          ipn_callback_url: "https://your-domain.com/api/webhooks/nowpayments",
          success_url: "https://your-domain.com/profile?status=success",
          cancel_url: "https://your-domain.com/membership?status=cancelled",
        }),
      });
      const data = await response.json();
      return NextResponse.json(data);
    }

    // --- LOGIC 2: BOOKING & CHAT (NEW INTEGRATION) ---
    if (talentId) {
      // Create a unique Order ID for the booking
      // Format: BOOKING:userId:talentId:timestamp
      const orderId = `BOOKING:${userId}:${talentId}:${Date.now()}`;
      
      const response = await fetch("https://api.nowpayments.io/v1/invoice", {
        method: "POST",
        headers: {
          "x-api-key": process.env.NOWPAYMENTS_API_KEY || "",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          price_amount: amount, // Total from HomeGrid (Toys + Fee)
          price_currency: "usd",
          order_id: orderId,
          order_description: `Booking with Talent ID: ${talentId}. Items: ${items?.join(", ") || 'Base Booking'}`,
          ipn_callback_url: "https://your-domain.com/api/webhooks/nowpayments",
          // REDIRECT TO CHAT IMMEDIATELY AFTER SUCCESS
          success_url: `https://your-domain.com/chat?id=${conversationId}&status=paid`,
          cancel_url: "https://your-domain.com/discovery?status=cancelled",
        }),
      });

      const data = await response.json();
      return NextResponse.json(data);
    }

    return NextResponse.json({ error: "Invalid request type" }, { status: 400 });

  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}