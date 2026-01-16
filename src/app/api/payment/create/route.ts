import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    const { 
      userId, 
      tierName,      
      talentId,      
      items,         
      amount,        
      price          
    } = body;

    const apiKey = process.env.NOWPAYMENTS_API_KEY;
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://your-domain.com";

    // 1. Validate Environment
    if (!apiKey) {
      console.error("CRITICAL: NOWPAYMENTS_API_KEY is missing in environment variables.");
      return NextResponse.json({ error: "Server Configuration Error: API Key missing." }, { status: 500 });
    }

    // 2. Validate Input
    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    const finalAmount = amount || price;
    if (!finalAmount || finalAmount < 5) { // NowPayments usually requires at least $5
      return NextResponse.json({ error: "Invalid Amount. Minimum is $5.00 USD" }, { status: 400 });
    }

    // 3. Construct Order ID (Matches your Webhook logic)
    let orderId = "";
    let orderDesc = "";
    let successUrl = `${siteUrl}/`;

    if (tierName) {
      orderId = `${userId}:${tierName}`; 
      orderDesc = `VYBE Upgrade: ${tierName}`;
      successUrl = `${siteUrl}/membership/success`;
    } 
    else if (talentId) {
      orderId = `CHAT_UNLOCK:${userId}:${talentId}`;
      orderDesc = `Direct Unlock: Talent ${talentId}`;
      successUrl = `${siteUrl}/discovery`;
    }
    else if (items && Array.isArray(items)) {
      const itemIds = items.map((i: any) => i.id || i).join(",");
      orderId = `STORE:${userId}:${itemIds}`;
      orderDesc = `Supply Requisition: ${items.length} Items`;
      successUrl = `${siteUrl}/store/success`;
    } 
    else {
      return NextResponse.json({ error: "Invalid transaction type" }, { status: 400 });
    }

    // 4. Create INVOICE (Not "Payment") with NowPayments
    // CHANGED: Endpoint updated to /v1/invoice to get the link
    const response = await fetch("https://api.nowpayments.io/v1/invoice", {
      method: "POST",
      headers: {
        "x-api-key": apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        price_amount: finalAmount,
        price_currency: "usd",
        order_id: orderId,
        order_description: orderDesc,
        ipn_callback_url: `${siteUrl}/api/payment/webhook`,
        success_url: successUrl,
        cancel_url: `${siteUrl}/`,
      }),
    });

    const data = await response.json();

    // 5. Handle Response
    if (data.invoice_url) {
      console.log("Success: Payment link generated for", orderId);
      return NextResponse.json({ invoice_url: data.invoice_url });
    } else {
      // Log the full error from NowPayments to your Vercel Console
      console.error("NowPayments Rejected Request:", data);
      
      // Return the specific error message to the frontend alert
      return NextResponse.json({ 
        error: data.message || "NowPayments failed to generate link.",
        details: data
      }, { status: 400 });
    }

  } catch (err: any) {
    console.error("Payment Route Crash:", err);
    return NextResponse.json({ error: "Internal Server Error", details: err.message }, { status: 500 });
  }
}