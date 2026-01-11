"use client";

import { useState, useEffect } from "react";
import { supabase } from "../../../lib/supabase";
import HomeGrid from "../../../component/HomeGrid";
import { Lock, ShieldCheck, Globe, Loader2 } from "lucide-react";

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<"public" | "backroom">("public");
  const [publicGirls, setPublicGirls] = useState<any[]>([]);
  const [backroomGirls, setBackroomGirls] = useState<any[]>([]);
  const [isVip, setIsVip] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        // 1. Check Subscription
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data: profile } = await supabase
            .from("profiles")
            .select("subscription_tier")
            .eq("id", user.id)
            .single();
          
          if (profile?.subscription_tier === "Highest") setIsVip(true);
        }

        // 2. Fetch Talent
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
        // Short delay for the animation
        setTimeout(() => setLoading(false), 1800); 
      }
    }
    fetchData();
  }, []);

  if (loading)
    return (
      <div className="bg-black min-h-screen flex flex-col justify-center items-center">
        {/* COMPACT SCANNER (Reduced Size) */}
        <div className="relative w-16 h-16 flex items-center justify-center">
          <div className="absolute inset-0 border border-zinc-800 rounded-2xl"></div>
          
          {/* Scanning Beam */}
          <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-red-600/20 to-transparent animate-scan-y"></div>
          
          <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8 text-red-600 drop-shadow-[0_0_8px_rgba(220,38,38,0.8)]">
            <path d="M5 3H3v2M19 3h2v2M5 21H3v-2M19 21h2v-2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            <circle cx="12" cy="12" r="1" fill="currentColor" />
          </svg>
        </div>

        <div className="mt-6 text-center">
          <p className="text-[8px] font-black uppercase tracking-[0.5em] text-red-600 animate-pulse">
            Vybing...
          </p>
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
    <main className="bg-black min-h-screen text-white p-4 pb-24">
      {/* MINIMAL HEADER */}
      <header className="py-6 text-center">
        <h1 className="text-2xl font-black italic uppercase tracking-tighter">VYBE</h1>
      </header>

      {/* TABS (Backroom as a Tab) */}
      <div className="flex justify-center mb-8">
        <div className="bg-zinc-900/80 p-1 rounded-2xl flex gap-1 border border-white/5 w-full max-w-[320px]">
          <button 
            onClick={() => setActiveTab("public")}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${activeTab === "public" ? "bg-white text-black" : "text-zinc-500"}`}
          >
            <Globe size={12} />
            Public
          </button>
          <button 
            onClick={() => setActiveTab("backroom")}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${activeTab === "backroom" ? "bg-red-600 text-white shadow-[0_0_10px_rgba(220,38,38,0.4)]" : "text-zinc-500"}`}
          >
            {isVip ? <ShieldCheck size={12} /> : <Lock size={12} />}
            Backroom
          </button>
        </div>
      </div>

      {/* CONTENT AREA */}
      <div className="transition-all duration-500">
        {activeTab === "public" ? (
          <section>
            {publicGirls.length === 0 ? (
              <div className="text-center py-20 opacity-20 text-[9px] uppercase tracking-widest">Feed Offline</div>
            ) : (
              <HomeGrid girls={publicGirls} />
            )}
          </section>
        ) : (
          <section>
            {isVip ? (
              backroomGirls.length === 0 ? (
                <div className="text-center py-20 opacity-20 text-[9px] uppercase tracking-widest">Backroom Empty</div>
              ) : (
                <HomeGrid girls={backroomGirls} />
              )
            ) : (
              /* THE LOCKED BACKROOM VIEW */
              <div className="mt-4 flex flex-col items-center justify-center text-center p-8 border border-white/5 bg-zinc-900/20 rounded-[3rem]">
                <div className="w-14 h-14 rounded-full bg-zinc-900 border border-red-600/30 flex items-center justify-center mb-6">
                  <Lock size={20} className="text-red-600" />
                </div>
                <h3 className="text-lg font-black uppercase italic tracking-tighter mb-2">Access Denied</h3>
                <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-[0.2em] leading-relaxed mb-8">
                  This sector is reserved for <br/> 
                  <span className="text-white">Highest Tier Subscribers</span>
                </p>
                <button 
                  onClick={() => window.location.href = '/membership/upgrade'}
                  className="bg-white text-black text-[9px] font-black uppercase px-10 py-4 rounded-full tracking-[0.2em] active:scale-95 transition-transform"
                >
                  Upgrade Authority
                </button>
              </div>
            )}
          </section>
        )}
      </div>
    </main>
  );
}