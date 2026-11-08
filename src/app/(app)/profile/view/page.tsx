"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { supabase } from "../../../../lib/supabase";
import { 
  ChevronLeft, Flame, 
  ShieldCheck, Zap, 
  Lock, Cpu, Activity
} from "lucide-react";

export default function IdentityVault() {
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    async function getProfile() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();
        setProfile(data);
      }
    }
    getProfile();
  }, []);

  if (!profile) return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-red-600 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <main className="min-h-screen bg-[#050505] text-white relative font-sans overflow-hidden flex flex-col">
      
      {/* 1. BACKGROUND AMBIENCE */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/asfalt-dark.png')] opacity-20 pointer-events-none" />
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-red-900/10 via-black to-black pointer-events-none" />

      {/* 2. HUD HEADER (The Core Identity) */}
      <div className="relative h-[60vh] w-full flex flex-col items-center justify-center bg-black/40">
        
        {/* Animated Scanner Line */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="w-full h-[1px] bg-red-600/20 shadow-[0_0_20px_rgba(220,38,38,0.5)] absolute animate-scan" />
        </div>

        {/* Back Button */}
        <button 
          onClick={() => router.back()}
          className="absolute top-8 left-6 p-4 bg-zinc-900/30 border border-white/5 rounded-2xl hover:bg-white/10 transition-all z-50 backdrop-blur-md"
        >
          <ChevronLeft size={20} />
        </button>

        {/* VYBE LOGO CORE */}
        <div className="relative mb-10">
            <div className="absolute -inset-10 bg-red-600/10 rounded-full blur-3xl animate-pulse" />
            <div className="relative w-40 h-40 rounded-full border border-white/5 flex items-center justify-center bg-zinc-900/20 shadow-2xl backdrop-blur-2xl">
                <div className="relative">
                    <Flame size={60} className="text-red-600 opacity-90" fill="currentColor" />
                    <Zap size={28} className="text-white absolute -bottom-2 -right-2 drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]" fill="currentColor" />
                </div>
            </div>
        </div>

        {/* Identity Text */}
        <div className="text-center z-10 px-6">
          <div className="flex items-center justify-center gap-3 mb-3">
            <h1 className="text-5xl font-black tracking-tighter uppercase italic text-white">
              {profile.nickname || "NODE_00"}
            </h1>
            <ShieldCheck size={24} className="text-red-600" />
          </div>
          <p className="text-[11px] font-mono text-zinc-600 tracking-[0.6em] uppercase">
            Access ID: {profile.id?.substring(0, 16).toUpperCase()}
          </p>
        </div>
      </div>

      {/* 3. STATUS ARRAY */}
      <div className="px-8 flex-1 flex flex-col justify-start pt-12 space-y-4 relative z-10">
        
        <div className="flex gap-4">
            <div className="flex-1 bg-zinc-900/40 border border-white/5 p-6 rounded-[2rem] backdrop-blur-xl">
                <div className="flex items-center gap-2 mb-2 text-zinc-500">
                    <Activity size={14} />
                    <span className="text-[9px] font-black uppercase tracking-[0.2em]">Signal</span>
                </div>
                <p className="text-sm font-bold text-green-500 uppercase tracking-widest">Active</p>
            </div>
            
            <div className="flex-1 bg-zinc-900/40 border border-white/5 p-6 rounded-[2rem] backdrop-blur-xl">
                <div className="flex items-center gap-2 mb-2 text-zinc-500">
                    <Lock size={14} />
                    <span className="text-[9px] font-black uppercase tracking-[0.2em]">Auth</span>
                </div>
                <p className="text-sm font-bold text-white uppercase italic tracking-widest">Verified</p>
            </div>
        </div>

        {/* Sub-Header Info */}
        <div className="pt-8 flex flex-col items-center">
            <div className="w-12 h-[1px] bg-red-600/50 mb-6" />
            <p className="text-[10px] font-black text-zinc-700 uppercase tracking-[0.5em] text-center leading-relaxed">
                Identity Record Locked<br/>
                End-to-End Encryption Active
            </p>
        </div>
      </div>

      {/* 4. SYSTEM DECORATION FOOTER */}
      <div className="p-10 opacity-10 pointer-events-none mt-auto">
        <div className="flex items-center gap-4">
            <Cpu size={14} />
            <div className="h-[1px] flex-1 bg-white/20" />
            <span className="text-[8px] font-mono tracking-widest">SYSTEM_V.2</span>
        </div>
      </div>

      <style jsx>{`
        @keyframes scan {
          0% { top: 0%; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
        .animate-scan {
          animation: scan 5s linear infinite;
        }
      `}</style>

    </main>
  );
}