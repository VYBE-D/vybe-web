"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../../../lib/supabase";
import { Loader2, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";

export default function CheckoutPage() {
  const [cart, setCart] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const savedCart = localStorage.getItem("mission_cart");
    if (savedCart) setCart(JSON.parse(savedCart));
  }, []);

  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  // --- UPDATED: Integrated Store Checkout Logic ---
  const handlePayment = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return router.push("/login");

      // Extract item IDs or names for the API to construct the orderId
      // We send this as the 'items' key to trigger Scenario C in our API route
      const itemIds = cart.map(item => item.id || item.name);

      const response = await fetch("/api/payment/create", { // Unified singular route
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          items: itemIds, // This triggers the STORE logic in the API/Webhook
          amount: total,
        }),
      });

      const data = await response.json();

      if (data.invoice_url) {
        // Clear cart before redirecting so they don't see items if they click 'back'
        localStorage.removeItem("mission_cart");
        
        // Redirect to NowPayments BTC Gateway
        window.location.href = data.invoice_url;
      } else {
        throw new Error(data.error || "Could not generate payment link.");
      }
    } catch (err: any) {
      console.error("Store Payment Error:", err);
      alert(`SUPPLY CHAIN ERROR: ${err.message || "Please try again."}`);
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <p className="uppercase text-[10px] tracking-widest opacity-20">Cart is empty</p>
    </div>
  );

  return (
    <main className="min-h-screen bg-black text-white p-6 flex flex-col items-center justify-center">
      <div className="max-w-md w-full bg-zinc-900/50 border border-white/10 rounded-[3rem] p-10 backdrop-blur-xl">
        <h2 className="text-3xl font-black italic uppercase text-center mb-8">Authorize Supply</h2>
        
        <div className="space-y-4 mb-10">
          {cart.map((item, idx) => (
            <div key={idx} className="flex justify-between items-center border-b border-white/5 pb-2">
              <span className="text-[10px] font-bold uppercase text-zinc-400">
                {item.name} <span className="text-red-600 ml-1">x{item.quantity}</span>
              </span>
              <span className="text-xs font-black">${(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
          <div className="flex justify-between pt-4">
            <span className="text-[10px] font-black uppercase tracking-widest text-red-600">Total Requisition</span>
            <span className="text-2xl font-black italic">${total.toFixed(2)}</span>
          </div>
        </div>

        <button 
          onClick={handlePayment}
          disabled={loading}
          className="w-full bg-white text-black py-6 rounded-2xl font-black uppercase text-xs tracking-[0.2em] flex items-center justify-center gap-3 active:scale-95 transition-all disabled:opacity-50"
        >
          {loading ? (
            <Loader2 className="animate-spin" />
          ) : (
            <>
              <ShieldCheck size={18}/> 
              Confirm Requisition
            </>
          )}
        </button>
        
        <p className="text-center mt-6 text-[8px] text-zinc-600 uppercase tracking-[0.3em]">
          Secure Encryption • Anonymous Fullfillment
        </p>
      </div>
    </main>
  );
}