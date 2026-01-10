"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { supabase } from "../../../../lib/supabase";
import { Camera, ChevronLeft, Flame, Zap } from "lucide-react";

export default function EditProfile() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    nickname: "",
    hosting: "",
    photos: [] as string[],
  });

  useEffect(() => {
    async function loadProfile() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return router.push("/");

      const { data } = await supabase
        .from("profiles")
        .select("nickname, hosting, photos")
        .eq("id", user.id)
        .single();

      if (data) {
        setForm({
          nickname: data.nickname || "",
          hosting: data.hosting || "",
          photos: data.photos || [],
        });
      }
      setLoading(false);
    }
    loadProfile();
  }, [router]);

  const handleSave = async () => {
    setSaving(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { error } = await supabase
        .from("profiles")
        .update({
          nickname: form.nickname,
          hosting: form.hosting,
        })
        .eq("id", user.id);

      if (error) alert(error.message);
      else router.back();
    }
    setSaving(false);
  };

  if (loading) return <div className="min-h-screen bg-black" />;

  return (
    <main className="min-h-screen bg-[#050505] text-white p-6 font-sans selection:bg-red-500">
      
      {/* HEADER: Nav + Save Top Right */}
      <div className="flex items-center justify-between mb-12">
        <button onClick={() => router.back()} className="hover:scale-110 transition-transform">
          <ChevronLeft size={32} strokeWidth={3} />
        </button>
        
        <button 
          onClick={handleSave}
          disabled={saving}
          className="bg-white text-black font-black italic uppercase text-xs tracking-[0.2em] px-8 py-2 rounded-full hover:bg-red-600 hover:text-white transition-all active:scale-95 border-2 border-transparent"
        >
          {saving ? "SYNCING..." : "SAVE"}
        </button>
      </div>

      {/* TOP MIDDLE PROFILE: The Glow & Frame */}
      <div className="flex flex-col items-center justify-center mb-16">
        <div className="relative">
          {/* Intense Underground Glow */}
          <div className="absolute inset-0 rounded-full bg-red-600 blur-[40px] opacity-30" />
          
          <div className="relative w-40 h-40 rounded-full p-1 bg-gradient-to-b from-zinc-700 to-black shadow-[0_0_50px_rgba(255,0,0,0.2)]">
            <div className="w-full h-full rounded-full bg-zinc-900 overflow-hidden border-4 border-[#050505]">
              {form.photos[0] ? (
                <img src={form.photos[0]} alt="Profile" className="w-full h-full object-cover grayscale-[30%] hover:grayscale-0 transition-all duration-500" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-zinc-900">
                  <Camera className="text-zinc-700" size={40} />
                </div>
              )}
            </div>
          </div>
          <button className="absolute bottom-2 right-2 bg-red-600 text-white p-3 rounded-full shadow-2xl border-4 border-[#050505] hover:bg-white hover:text-black transition-colors">
            <Camera size={20} fill="currentColor" />
          </button>
        </div>
        <h2 className="mt-6 text-3xl font-black italic uppercase tracking-tighter italic">
          {form.nickname || "NO NAME"}
        </h2>
      </div>

      {/* INPUT FIELDS: Raw & Heavy */}
      <div className="space-y-8 max-w-sm mx-auto">
        
        <div className="group">
          <label className="text-[11px] font-black uppercase tracking-[0.4em] text-zinc-600 group-focus-within:text-red-600 transition-colors ml-1 block mb-2">
            Alias / Identity
          </label>
          <input
            className="w-full bg-transparent border-b-2 border-zinc-800 p-3 outline-none focus:border-red-600 transition-all text-2xl font-black italic uppercase placeholder:text-zinc-900"
            value={form.nickname}
            onChange={(e) => setForm({ ...form, nickname: e.target.value })}
            placeholder="UNKNOWN"
          />
        </div>

        <div className="space-y-3">
          <label className="text-[11px] font-black uppercase tracking-[0.4em] text-zinc-600 ml-1 block">
            Movement
          </label>
          <div className="grid grid-cols-2 gap-4">
            <button 
              onClick={() => setForm({...form, hosting: 'host'})}
              className={`py-5 rounded-none font-black italic uppercase text-sm tracking-widest border-2 transition-all ${
                form.hosting === 'host' 
                ? 'bg-red-600 text-white border-red-600' 
                : 'bg-transparent border-zinc-800 text-zinc-500 hover:border-zinc-500'
              }`}
            >
              I CAN HOST
            </button>
            <button 
              onClick={() => setForm({...form, hosting: 'travel'})}
              className={`py-5 rounded-none font-black italic uppercase text-sm tracking-widest border-2 transition-all ${
                form.hosting === 'travel' 
                ? 'bg-red-600 text-white border-red-600' 
                : 'bg-transparent border-zinc-800 text-zinc-500 hover:border-zinc-500'
              }`}
            >
              WE HOST
            </button>
          </div>
        </div>
      </div>

      {/* FOOTER: Spicy Descriptive */}
      <div className="mt-20 flex flex-col items-center justify-center space-y-2 opacity-60 hover:opacity-100 transition-opacity">
        <div className="flex items-center gap-2 text-red-600">
          <Flame size={18} fill="currentColor" />
          <span className="text-xs font-black uppercase tracking-[0.5em]">Keep it spicy</span>
          <Flame size={18} fill="currentColor" />
        </div>
        <p className="text-[9px] text-zinc-600 font-bold uppercase tracking-widest text-center max-w-[200px]">
          Updates are live. Your profile is currently active in the underground.
        </p>
      </div>

    </main>
  );
}