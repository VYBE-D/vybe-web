import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // Destructure all possible fields from the frontend request
    const { 
      userId, 
      tierName,      // Present if upgrading membership
      talentId,      // Present if unlocking a girl/chat
      items,         // Present if buying from store (Array of IDs)
      amount,        // The dollar amount (e.g., 50)
      price          // Alternative field name for amount
    } = body;

    // 1. Validate User
    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    // 2. Determine Payment Type & Construct Order ID
    let orderId = "";
    let orderDesc = "";
    let successUrl = "";
    const finalAmount = amount || price; // Handle either naming convention

    // --- SCENARIO A: MEMBERSHIP UPGRADE ---
    // Matches Webhook Logic (Fallback case: userId:tierName)
    if (tierName) {
      orderId = `${userId}:${tierName}`; 
      orderDesc = `VYBE Upgrade: ${tierName} Tier`;
      successUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/profile`;
    }
    
    // --- SCENARIO B: CHAT / TALENT UNLOCK ---
    // Matches Webhook Logic A (CHAT_UNLOCK:userId:talentId)
    else if (talentId) {
      orderId = `CHAT_UNLOCK:${userId}:${talentId}`;
      orderDesc = `Secure Line Unlock: Talent ${talentId}`;
      successUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/messages`; // Go straight to chat
    }

    // --- SCENARIO C: STORE PURCHASE ---
    // Matches Webhook Logic B (STORE:userId:item1,item2)
    else if (items && Array.isArray(items) && items.length > 0) {
      // If items are objects {id: "123"}, map them. If strings, just join.
      const itemIds = items.map((i: any) => i.id || i).join(",");
      
      orderId = `STORE:${userId}:${itemIds}`;
      orderDesc = `Arsenal Purchase: ${items.length} Item(s)`;
      successUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/inventory`;
    } 
    
    // --- ERROR: UNKNOWN REQUEST ---
    else {
      return NextResponse.json({ error: "Invalid transaction type" }, { status: 400 });
    }

    // 3. Create Payment with NowPayments
    // We use /v1/payment to generate a dynamic invoice link
    const response = await fetch("https://api.nowpayments.io/v1/payment", {
      method: "POST",
      headers: {
        "x-api-key": process.env.NOWPAYMENTS_API_KEY || "", // Ensure this is in .env
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        price_amount: finalAmount,
        price_currency: "usd",      // You set the price in USD
        pay_currency: "btc",        // Default crypto (user can usually change this on gateway)
        order_id: orderId,          // CRITICAL: This allows the Webhook to know what to unlock
        order_description: orderDesc,
        ipn_callback_url: `${process.env.NEXT_PUBLIC_SITE_URL}/api/nowpayments/webhook`,
        success_url: successUrl,
        cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/`,
      }),
    });

    const data = await response.json();

    // 4. Return the Link to Frontend
    if (data.invoice_url) {
      return NextResponse.json({ invoice_url: data.invoice_url });
    } else {
      console.error("NowPayments API Error:", data);
      return NextResponse.json({ error: "Failed to generate payment link" }, { status: 500 });
    }

  } catch (err: any) {
    console.error("Payment Route Exception:", err.message);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}