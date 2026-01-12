import { NextResponse } from "next/server";
import crypto from "crypto";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // Secret key to bypass security
);

export async function POST(req: Request) {
  const rawBody = await req.text(); // Get raw text for signature verification
  const body = JSON.parse(rawBody);
  const signature = req.headers.get("x-nowpayments-sig");

  // 1. Verify the signature so nobody can "fake" a payment
  const hmac = crypto.createHmac("sha512", process.env.NOWPAYMENTS_IPN_SECRET!);
  const sortedBody = JSON.stringify(body, Object.keys(body).sort());
  const checkSignature = hmac.update(sortedBody).digest("hex");

  if (signature !== checkSignature) return new Response("Invalid signature", { status: 400 });

  // 2. If status is "finished", upgrade the user
  if (body.payment_status === "finished") {
    const [userId, tierId] = body.order_id.split(":");

    await supabaseAdmin
      .from("profiles")
      .update({ 
        subscription_tier: tierId, 
        is_verified: true,
        updated_at: new Date() 
      })
      .eq("id", userId);
  }

  return NextResponse.json({ ok: true });
}