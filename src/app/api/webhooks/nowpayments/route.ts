import { NextResponse } from "next/server";
import crypto from "crypto";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: Request) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
    const ipnSecret = process.env.NOWPAYMENTS_IPN_SECRET || "";

    if (!supabaseUrl || !serviceKey) {
        console.error("Critical: Supabase keys missing in Webhook");
        return new Response("Configuration Error", { status: 500 });
    }

    const supabaseAdmin = createClient(supabaseUrl, serviceKey);

    const rawBody = await req.text();
    const body = JSON.parse(rawBody);
    const signature = req.headers.get("x-nowpayments-sig");

    if (!ipnSecret) {
        console.error("NOWPAYMENTS_IPN_SECRET is missing");
        return new Response("Server configuration error", { status: 500 });
    }

    const hmac = crypto.createHmac("sha512", ipnSecret);
    const sortedBody = JSON.stringify(body, Object.keys(body).sort());
    const checkSignature = hmac.update(sortedBody).digest("hex");

    if (signature !== checkSignature) {
      console.error("Invalid signature detected");
      return new Response("Invalid signature", { status: 400 });
    }

    // --- PROCESSING LOGIC ---
    if (body.payment_status === "finished" || body.payment_status === "partially_paid") {
      
      const orderId = body.order_id;

      // --- LOGIC A: BOOKING PAYMENT (NEW) ---
      if (orderId.startsWith("BOOKING:")) {
        // Format: BOOKING:userId:talentId:timestamp
        const [prefix, userId, talentId] = orderId.split(":");

        console.log(`Processing Booking Payment for User: ${userId}`);

        // 1. Find the conversation to post the confirmation message
        const { data: conv } = await supabaseAdmin
          .from("conversations")
          .select("id")
          .eq("user_id", userId)
          .eq("talent_id", talentId)
          .single();

        if (conv) {
          // 2. Insert the "PAID" confirmation message automatically
          await supabaseAdmin.from("messages").insert([{
            conversation_id: conv.id,
            sender_id: userId, // or a System ID if you have one
            content: `✅ PAYMENT VERIFIED: $${body.pay_amount} ${body.pay_currency.toUpperCase()} received. Booking is now active.`
          }]);
          
          console.log(`✅ Success: Booking message sent for conversation ${conv.id}`);
        }
      } 
      
      // --- LOGIC B: MEMBERSHIP UPGRADE (EXISTING - UNTOUCHED) ---
      else {
        const [userId, tierId] = orderId.split(":");

        if (!userId || !tierId) {
          console.error("Malformed order_id:", orderId);
          return new Response("Malformed order_id", { status: 400 });
        }

        let finalTier = "Guest";
        const t = tierId.toLowerCase();
        if (t.includes("prime")) finalTier = "Prime";
        if (t.includes("vybe")) finalTier = "VYBE";
        if (t.includes("shadow")) finalTier = "VYBE";

        const { error } = await supabaseAdmin
          .from("profiles")
          .update({ 
            tier: finalTier, 
            updated_at: new Date() 
          })
          .eq("id", userId);

        if (error) {
          console.error("Supabase Update Error:", error);
          return new Response("Database update failed", { status: 500 });
        }

        console.log(`✅ Success: User ${userId} upgraded to ${finalTier}`);
      }
    }

    return NextResponse.json({ ok: true });
  } catch (error: any) {
    console.error("Webhook Error:", error.message);
    return new Response("Internal Server Error", { status: 500 });
  }
}