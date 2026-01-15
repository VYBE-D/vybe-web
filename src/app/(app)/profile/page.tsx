"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { 
  Settings, 
  Flame, 
  Zap, 
  ShieldCheck, 
  Activity, 
  ChevronRight 
} from "lucide-react";
import { supabase } from "../../../lib/supabase";

// Components
import MembershipCard from "../../../component/profile/MembershipCard";
import ActivityCard from "../../../component/profile/ActivityCard";

export default function ProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState({
    nickname: "",
  });

  // Fetch Profile Data
  useEffect(() => {
    async function fetchProfile() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          router.push("/");
          return;
        }

        const { data } = await supabase
          .from("profiles")
          .select("nickname")
          .eq("id", user.id)
          .single();

        if (data) {
          setProfile({
            nickname: data.nickname || "Anonymous",
          });
        }
      } catch (err) {
        console.error("Error loading profile:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, [router]);

  return (
    <main className="min-h-screen bg-black text-white relative overflow-hidden font-sans selection:bg-white/20">
      
      {/* 🌑 BACKGROUND AMBIENCE (Neutral/Dark) */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-zinc-800/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-zinc-900/10 blur-[120px] rounded-full" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-[0.03]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-10 max-w-lg mx-auto px-6 pt-12 pb-32"
      >
        
        {/* ─── HEADER SECTION ─── */}
        <header className="flex items-center justify-between mb-16">
          <div className="flex items-center gap-5">
            {/* Logo / Avatar Sigil */}
            <div className="relative">
              <div className="w-16 h-16 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-md flex items-center justify-center shadow-2xl">
                <div className="relative">
                  <Flame size={28} className="text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]" fill="currentColor" />
                  <Zap size={14} className="text-black absolute -bottom-1 -right-1 fill-white stroke-white" />
                </div>
              </div>
              {/* Online Indicator */}
              <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-black border border-white/10 flex items-center justify-center">
                <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse shadow-[0_0_5px_white]" />
              </div>
            </div>

            {/* Identity Text */}
            <div className="flex flex-col">
              <span className="text-[9px] font-bold tracking-[0.4em] text-zinc-500 uppercase mb-1">
                Verified ID
              </span>
              <h1 className="text-3xl font-black italic uppercase tracking-tighter text-white">
                {loading ? "..." : profile.nickname}
              </h1>
            </div>
          </div>

          {/* Settings Button */}
          <button 
            onClick={() => router.push("/settings")}
            className="w-12 h-12 flex items-center justify-center rounded-full bg-white/[0.03] border border-white/10 hover:bg-white/[0.08] transition-all active:scale-95"
          >
            <Settings size={20} className="text-zinc-400" />
          </button>
        </header>


        {/* ─── MAIN CONTENT GRID ─── */}
        <div className="space-y-8">
          
          {/* 1. Membership Card */}
          <section>
            <div className="flex items-center justify-between mb-4 px-2">
              <h2 className="text-[10px] font-black uppercase tracking-widest text-zinc-600">
                Membership Status
              </h2>
            </div>
            <motion.div 
              whileHover={{ scale: 1.01 }}
              transition={{ duration: 0.3 }}
              className="bg-zinc-900/20 border border-white/5 rounded-[2rem] p-1 backdrop-blur-xl overflow-hidden relative group"
            >
              {/* Subtle sheen effect */}
              <div className="absolute inset-0 bg-gradient-to-tr from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <MembershipCard onUpgrade={() => router.push("/membership/upgrade")} />
            </motion.div>
          </section>

          {/* 2. Activity / History */}
          <section>
            <div className="flex items-center justify-between mb-4 px-2">
              <h2 className="text-[10px] font-black uppercase tracking-widest text-zinc-600">
                Recent Movements
              </h2>
              <button 
                onClick={() => router.push("/profile/history")}
                className="flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider text-zinc-500 hover:text-white transition-colors"
              >
                View All <ChevronRight size={10} />
              </button>
            </div>
            
            <motion.div 
              className="bg-zinc-900/20 border border-white/5 rounded-[2rem] min-h-[160px] p-2 backdrop-blur-xl relative overflow-hidden"
            >
              <ActivityCard onViewHistory={() => router.push("/profile/history")} />
              
              {/* Decorative Icon Background */}
              <div className="absolute top-4 right-4 text-white/[0.02] pointer-events-none">
                <Activity size={80} />
              </div>
            </motion.div>
          </section>

        </div>

        {/* ─── FOOTER ─── */}
        <footer className="mt-24 flex flex-col items-center gap-4 opacity-30">
          <div className="w-12 h-[1px] bg-zinc-800" />
          <div className="flex items-center gap-2">
            <ShieldCheck size={12} className="text-zinc-600" />
            <span className="text-[9px] font-black uppercase tracking-[0.3em] text-zinc-600">
              End-to-End Encrypted
            </span>
          </div>
        </footer>

      </motion.div>
    </main>
  );
}