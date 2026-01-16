import { NextResponse } from "next/server";
import crypto from "crypto";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: Request) {
  try {
    // 1. Setup Supabase Admin Client (Bypasses RLS)
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
    const ipnSecret = process.env.NOWPAYMENTS_IPN_SECRET || "";

    if (!supabaseUrl || !serviceKey) {
      console.error("CRITICAL: Supabase keys missing in Webhook");
      return new Response("Server Configuration Error", { status: 500 });
    }

    const supabaseAdmin = createClient(supabaseUrl, serviceKey);

    // 2. Verify NowPayments Signature
    const rawBody = await req.text();
    const body = JSON.parse(rawBody);
    const signature = req.headers.get("x-nowpayments-sig");

    if (!ipnSecret) {
      console.error("CRITICAL: NOWPAYMENTS_IPN_SECRET is missing");
      return new Response("Server Configuration Error", { status: 500 });
    }

    const hmac = crypto.createHmac("sha512", ipnSecret);
    const sortedBody = JSON.stringify(body, Object.keys(body).sort());
    const checkSignature = hmac.update(sortedBody).digest("hex");

    if (signature !== checkSignature) {
      console.error("⚠️ Invalid Signature - Potential Fraud Attempt");
      return new Response("Invalid Signature", { status: 400 });
    }

    console.log(`🔔 Webhook received. Order: ${body.order_id}, Status: ${body.payment_status}`);

    // 3. Process Only "Finished" Payments
    if (body.payment_status === "finished" || body.payment_status === "partially_paid") {
      
      const orderId = body.order_id;
      if (!orderId) return new Response("Missing Order ID", { status: 400 });

      // ====================================================
      // SCENARIO A: CHAT UNLOCK / TALENT PAYMENT
      // Format: CHAT_UNLOCK:userId:talentId
      // ====================================================
      if (orderId.startsWith("CHAT_UNLOCK:") || orderId.startsWith("BOOKING:")) {
        const parts = orderId.split(":");
        const userId = parts[1];
        const talentId = parts[2];

        console.log(`🔓 Unlocking Chat for User: ${userId}, Talent: ${talentId}`);

        // A1. Add to User Inventory (This unlocks the chat on the frontend)
        const { error: invError } = await supabaseAdmin
          .from("user_inventory")
          .insert([{
            user_id: userId,
            product_id: talentId, // Storing the Talent ID as the "Product"
            status: 'unlocked'
          }]);

        if (invError) console.error("Inventory Insert Error:", invError);

        // A2. Find or Create Conversation to send a "System Message"
        // This ensures the chat exists and has a "Payment Received" note
        let { data: conversation } = await supabaseAdmin
          .from("conversations")
          .select("id")
          .eq("user_id", userId)
          .eq("talent_id", talentId)
          .single();

        if (!conversation) {
          const { data: newConv } = await supabaseAdmin
            .from("conversations")
            .insert([{ user_id: userId, talent_id: talentId }])
            .select()
            .single();
          conversation = newConv;
        }

        if (conversation) {
          await supabaseAdmin.from("messages").insert([{
            conversation_id: conversation.id,
            sender_id: userId, // Or a system ID if you have one
            content: `⚡ SYSTEM: Secure Line Established. Payment of $${body.pay_amount} verified.`
          }]);
        }
      }

      // ====================================================
      // SCENARIO B: STORE PURCHASE
      // Format: STORE:userId:prodId1,prodId2,prodId3
      // ====================================================
      else if (orderId.startsWith("STORE:")) {
        const [_, userId, productIdsString] = orderId.split(":");
        
        if (userId && productIdsString) {
          const productIds = productIdsString.split(",");
          console.log(`📦 Processing Store Purchase: ${productIds.length} items for ${userId}`);

          const inventoryRows = productIds.map((pid: string) => ({
            user_id: userId,
            product_id: pid.trim(),
            status: 'available'
          }));

          const { error: storeError } = await supabaseAdmin
            .from("user_inventory")
            .insert(inventoryRows);

          if (storeError) console.error("Store Inventory Error:", storeError);
        }
      }

      // ====================================================
      // SCENARIO C: MEMBERSHIP UPGRADE (Fallback)
      // Format: userId:tierName (Old format, 2 parts)
      // ====================================================
      else {
        // Assume it's a membership upgrade if no prefix matches
        const parts = orderId.split(":");
        
        // Safety check: memberships usually imply 2 parts "ID:Tier"
        if (parts.length >= 2) {
          const userId = parts[0];
          const tierRaw = parts[1].toLowerCase();

          let finalTier = "Guest";
          if (tierRaw.includes("prime")) finalTier = "Prime";
          if (tierRaw.includes("vybe")) finalTier = "VYBE";
          if (tierRaw.includes("shadow")) finalTier = "VYBE"; // Handle aliases

          console.log(`👑 Upgrading User ${userId} to ${finalTier}`);

          const { error: upgradeError } = await supabaseAdmin
            .from("profiles")
            .update({ 
              tier: finalTier, 
              updated_at: new Date().toISOString() 
            })
            .eq("id", userId);

          if (upgradeError) console.error("Membership Upgrade Error:", upgradeError);
        }
      }
    }

    return NextResponse.json({ ok: true });

  } catch (error: any) {
    console.error("❌ Webhook Fatal Error:", error.message);
    return new Response("Internal Server Error", { status: 500 });
  }
}