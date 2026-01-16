"use client";

import { useState, useEffect } from "react";
import { supabase } from "../../../lib/supabase";
import HomeGrid from "../../../component/HomeGrid";
import { Lock, ShieldCheck, Globe, Loader2, Crown } from "lucide-react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"public" | "backroom">("public");
  const [publicGirls, setPublicGirls] = useState<any[]>([]);
  const [backroomGirls, setBackroomGirls] = useState<any[]>([]);
  const [isVip, setIsVip] = useState(false);
  const [loading, setLoading] = useState(true);
  const [processingPayment, setProcessingPayment] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          const { data: profile } = await supabase
            .from("profiles")
            .select("tier")
            .eq("id", user.id)
            .single();
          
          if (profile?.tier === "VYBE" || profile?.tier === "Admin") {
            setIsVip(true);
          }
        }

        const { data, error } = await supabase
          .from("discovery")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) throw error;
        
        if (data) {
          setPublicGirls(data.filter(g => !g.is_backroom));
          setBackroomGirls(data.filter(g => g.is_backroom));
        }
      } catch (err) {
        console.error("Fetch Error:", err);
      } finally {
        setTimeout(() => setLoading(false), 1800); 
      }
    }
    fetchData();
  }, []);

  // --- INTEGRATED PAYMENT CREATION LOGIC ---
  const handleDirectCheckout = async (talentId: string) => {
    setProcessingPayment(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        router.push("/auth/login");
        return;
      }

      // We call our new unified payment route
      const res = await fetch("/api/payment/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          talentId: talentId, // This triggers the CHAT_UNLOCK logic in the API/Webhook
          amount: 50.00,      // Your standard chat unlock price
        }),
      });

      const paymentData = await res.json();

      if (paymentData.invoice_url) {
        // Redirect user to the NowPayments BTC portal
        window.location.href = paymentData.invoice_url;
      } else {
        throw new Error(paymentData.error || "Payment link generation failed");
      }
    } catch (err: any) {
      console.error("Payment Error:", err);
      alert(`SECURE LINE ERROR: ${err.message || "Please check your connection."}`);
    } finally {
      setProcessingPayment(false);
    }
  };

  if (loading)
    return (
      <div className="bg-black min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="relative w-16 h-16 flex items-center justify-center">
            <div className="absolute inset-0 border border-zinc-800 rounded-2xl"></div>
            <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-red-600/20 to-transparent animate-scan-y"></div>
            <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8 text-red-600 drop-shadow-[0_0_8px_rgba(220,38,38,0.8)]">
              <path d="M5 3H3v2M19 3h2v2M5 21H3v-2M19 21h2v-2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <circle cx="12" cy="12" r="1" fill="currentColor" />
            </svg>
          </div>
          <p className="mt-4 text-[8px] font-black uppercase tracking-[0.5em] text-red-600 animate-pulse">Vybing...</p>
        </div>
        <style jsx>{`
          @keyframes scan-y {
            0% { transform: translateY(-20%); opacity: 0; }
            50% { opacity: 1; }
            100% { transform: translateY(120%); opacity: 0; }
          }
          .animate-scan-y { animation: scan-y 1.2s ease-in-out infinite; }
        `}</style>
      </div>
    );

  return (
    <main className="bg-black min-h-screen text-white p-4 pb-32">
      {/* Loading Overlay for Payments */}
      {processingPayment && (
        <div className="fixed inset-0 z-[200] bg-black/90 backdrop-blur-md flex flex-col items-center justify-center">
          <Loader2 className="text-red-600 animate-spin mb-4" size={32} />
          <p className="text-[10px] font-black uppercase tracking-widest text-red-600 italic">Initializing Secure Payment...</p>
        </div>
      )}

      <header className="py-6 flex justify-between items-center max-w-[320px] mx-auto">
        <h1 className="text-2xl font-black italic uppercase tracking-tighter">VYBE</h1>
        {isVip && <Crown size={18} className="text-red-600 animate-pulse" />}
      </header>

      {/* TABS */}
      <div className="flex justify-center mb-8">
        <div className="bg-zinc-900/80 p-1 rounded-2xl flex gap-1 border border-white/5 w-full max-w-[320px]">
          <button 
            onClick={() => setActiveTab("public")}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${
                activeTab === "public" ? "bg-white text-black shadow-lg" : "text-zinc-500"
            }`}
          >
            <Globe size={12} />
            Public
          </button>
          <button 
            onClick={() => setActiveTab("backroom")}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${
                activeTab === "backroom" ? "bg-red-600 text-white shadow-[0_0_15px_rgba(220,38,38,0.4)]" : "text-zinc-500"
            }`}
          >
            {isVip ? <ShieldCheck size={12} /> : <Lock size={12} />}
            Backroom
          </button>
        </div>
      </div>

      {/* CONTENT AREA */}
      <div className="max-w-md mx-auto">
        {activeTab === "public" ? (
          <section>
            {publicGirls.length === 0 ? (
              <div className="text-center py-20 opacity-20 text-[9px] uppercase tracking-[0.4em]">Signal Lost...</div>
            ) : (
              <HomeGrid girls={publicGirls} onAction={handleDirectCheckout} />
            )}
          </section>
        ) : (
          <section>
            {isVip ? (
              backroomGirls.length === 0 ? (
                <div className="text-center py-20 opacity-20 text-[9px] uppercase tracking-[0.4em]">Backroom Secure</div>
              ) : (
                <HomeGrid girls={backroomGirls} onAction={handleDirectCheckout} />
              )
            ) : (
              /* ACCESS DENIED VIEW */
              <div className="mt-4 flex flex-col items-center justify-center text-center p-10 border border-white/5 bg-zinc-900/20 rounded-[3.5rem] backdrop-blur-sm">
                <div className="w-16 h-16 rounded-full bg-zinc-900 border border-red-600/30 flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(220,38,38,0.1)]">
                  <Lock size={24} className="text-red-600" />
                </div>
                <h3 className="text-xl font-black uppercase italic tracking-tighter mb-2">Access Restricted</h3>
                <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-[0.2em] leading-relaxed mb-8">
                  This archive requires <br/> 
                  <span className="text-red-600">VYBE Authority</span>
                </p>
                <button 
                  onClick={() => router.push('/membership/upgrade')}
                  className="bg-white text-black text-[9px] font-black uppercase px-10 py-5 rounded-full tracking-[0.3em] active:scale-95 transition-all hover:bg-red-600 hover:text-white"
                >
                  Elevate Clearance
                </button>
              </div>
            )}
          </section>
        )}
      </div>
    </main>
  );
}