"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { supabase } from "../../../../lib/supabase";
import { ChevronLeft, Flame, MapPin, ShieldCheck, Heart, Zap, Globe } from "lucide-react";

export default function PublicProfileView() {
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
    <main className="min-h-screen bg-black text-white relative">
      
      {/* 1. TOP IMAGE AREA */}
      <div className="relative h-[65vh] w-full">
        <img 
          src={profile.photos?.[0] || "/avatar.jpg"} 
          className="w-full h-full object-cover" 
          alt="Profile" 
        />
        
        {/* Gradient Overlay for Text Readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black" />

        {/* Back Button */}
        <button 
          onClick={() => router.back()}
          className="absolute top-6 left-4 p-3 bg-black/40 backdrop-blur-md border border-white/10 rounded-full"
        >
          <ChevronLeft size={24} />
        </button>

        {/* Name & Verification Badge */}
        <div className="absolute bottom-6 left-6">
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-4xl font-black tracking-tighter uppercase italic">
              {profile.nickname || "ANONYMOUS"}
            </h1>
            <ShieldCheck size={24} className="text-blue-400 fill-blue-400/20" />
          </div>
          <div className="flex items-center gap-2 text-zinc-400">
            <MapPin size={16} className="text-red-600" />
            <span className="font-bold text-xs uppercase tracking-widest">
              {profile.hosting === 'host' ? 'Can Host • Lagos' : 'Can Travel • Lagos'}
            </span>
          </div>
        </div>
      </div>

      {/* 2. INFO SECTION (Glass Cards) */}
      <div className="px-4 -mt-4 relative z-10 space-y-4 pb-32">
        
        {/* Tags Row - Now Functional from DB */}
        <div className="flex flex-wrap gap-2">
          {profile.intent?.map((tag: string) => (
            <div key={tag} className="bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2 rounded-full flex items-center gap-2">
              <Flame size={14} className="text-red-500" />
              <span className="text-[10px] font-black uppercase tracking-widest">{tag}</span>
            </div>
          ))}
          {profile.sub_intents?.slice(0, 2).map((sub: string) => (
            <div key={sub} className="bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2 rounded-full flex items-center gap-2">
              <Zap size={14} className="text-yellow-400" />
              <span className="text-[10px] font-black uppercase tracking-widest">{sub}</span>
            </div>
          ))}
        </div>

        {/* Vibe Details Card */}
        <div className="bg-zinc-900/50 border border-white/10 rounded-3xl p-6 backdrop-blur-xl">
          <div className="flex items-center gap-2 mb-3">
            <Heart size={18} className="text-red-600 fill-red-600/20" />
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Current Intent</h3>
          </div>
          <p className="text-lg font-bold italic uppercase tracking-tight text-white">
            {profile.sub_intents?.join(" • ") || "Looking for a vibe"}
          </p>
        </div>

        {/* Underground Status */}
        <div className="flex items-center justify-center gap-4 py-6">
            <div className="h-[1px] flex-1 bg-zinc-800" />
            <p className="text-[9px] text-zinc-600 font-black uppercase tracking-[0.4em]">
              Underground Vybe Verified
            </p>
            <div className="h-[1px] flex-1 bg-zinc-800" />
        </div>
      </div>

      {/* 3. FLOATING ACTION BUTTON */}
      <div className="fixed bottom-8 left-0 right-0 px-8 flex justify-center">
        <button className="w-full max-w-xs bg-white text-black py-4 rounded-full font-black italic uppercase tracking-widest text-sm shadow-2xl transition-transform active:scale-95 flex items-center justify-center gap-3">
          <Flame size={20} fill="black" />
          Send a Vybe
        </button>
      </div>

    </main>
  );
}