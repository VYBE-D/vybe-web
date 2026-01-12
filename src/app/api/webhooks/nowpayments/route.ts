import { NextResponse } from "next/server";
import crypto from "crypto";
import { createClient } from "@supabase/supabase-js";

// 1. Initialize inside the file but without the "!" operator to prevent build crashes
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
const ipnSecret = process.env.NOWPAYMENTS_IPN_SECRET || "";

const supabaseAdmin = createClient(supabaseUrl, serviceKey);

export async function POST(req: Request) {
  try {
    const rawBody = await req.text();
    const body = JSON.parse(rawBody);
    const signature = req.headers.get("x-nowpayments-sig");

    // 2. Security Verification
    if (!ipnSecret) {
        console.error("NOWPAYMENTS_IPN_SECRET is missing in environment variables");
        return new Response("Server configuration error", { status: 500 });
    }

    const hmac = crypto.createHmac("sha512", ipnSecret);
    const sortedBody = JSON.stringify(body, Object.keys(body).sort());
    const checkSignature = hmac.update(sortedBody).digest("hex");

    if (signature !== checkSignature) {
      console.error("Invalid signature detected");
      return new Response("Invalid signature", { status: 400 });
    }

    // 3. Upgrade Logic
    if (body.payment_status === "finished") {
      // Logic assumes order_id format is "userId:tierId" (e.g. "uuid-123:VYBE")
      const [userId, tierId] = body.order_id.split(":");

      if (!userId || !tierId) {
        console.error("Malformed order_id:", body.order_id);
        return new Response("Malformed order_id", { status: 400 });
      }

      // Determine final tier name for the database
      let finalTier = "Guest";
      if (tierId.toLowerCase().includes("prime")) finalTier = "Prime";
      if (tierId.toLowerCase().includes("vybe")) finalTier = "VYBE";
      if (tierId.toLowerCase().includes("shadow")) finalTier = "VYBE";

      const { error } = await supabaseAdmin
        .from("profiles")
        .update({ 
          tier: finalTier, // Updated to your new column name
          subscription_tier: finalTier, // Keeping this for safety if you still have the old column
          updated_at: new Date() 
        })
        .eq("id", userId);

      if (error) {
        console.error("Supabase Update Error:", error);
        return new Response("Database update failed", { status: 500 });
      }

      console.log(`Successfully upgraded User ${userId} to ${finalTier}`);
    }

    return NextResponse.json({ ok: true });
  } catch (error: any) {
    console.error("Webhook Error:", error.message);
    return new Response("Internal Server Error", { status: 500 });
  }
}