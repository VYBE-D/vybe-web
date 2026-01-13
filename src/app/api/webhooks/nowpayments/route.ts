import { NextResponse } from "next/server";
import crypto from "crypto";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: Request) {
  try {
    // 1. Initialize inside the POST function (Build-Safe)
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
    const ipnSecret = process.env.NOWPAYMENTS_IPN_SECRET || "";

    // 2. Immediate check for keys
    if (!supabaseUrl || !serviceKey) {
        console.error("Critical: Supabase keys missing in Webhook");
        return new Response("Configuration Error", { status: 500 });
    }

    const supabaseAdmin = createClient(supabaseUrl, serviceKey);

    const rawBody = await req.text();
    const body = JSON.parse(rawBody);
    const signature = req.headers.get("x-nowpayments-sig");

    // 3. Security Verification
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

    // 4. Upgrade Logic
    if (body.payment_status === "finished" || body.payment_status === "partially_paid") {
      // Expects order_id format "userId:tierName"
      const [userId, tierId] = body.order_id.split(":");

      if (!userId || !tierId) {
        console.error("Malformed order_id:", body.order_id);
        return new Response("Malformed order_id", { status: 400 });
      }

      // Standardize the tier name
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

    return NextResponse.json({ ok: true });
  } catch (error: any) {
    console.error("Webhook Error:", error.message);
    return new Response("Internal Server Error", { status: 500 });
  }
}