"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../../../lib/supabase";
import { ChevronLeft, Flame, Loader2, Heart, GlassWater, Sparkles, Check } from "lucide-react";

export default function EditProfile() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Suggested Vibe Tags
  const vibeOptions = ["Discreet", "Late Night", "High Energy", "Chill", "Cocktails", "Fast Paced"];

  const [form, setForm] = useState({
    nickname: "",
    hosting: "",
    intent: [] as string[],
  });

  useEffect(() => {
    async function loadProfile() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return router.push("/");

      const { data } = await supabase
        .from("profiles")
        .select("nickname, hosting, intent")
        .eq("id", user.id)
        .single();

      if (data) {
        setForm({
          nickname: data.nickname || "",
          hosting: data.hosting || "",
          intent: data.intent || [],
        });
      }
      setLoading(false);
    }
    loadProfile();
  }, [router]);

  const toggleVibe = (vibe: string) => {
    setForm(prev => ({
      ...prev,
      intent: prev.intent.includes(vibe) 
        ? prev.intent.filter(i => i !== vibe) 
        : [...prev.intent, vibe]
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { error } = await supabase
        .from("profiles")
        .update({
          nickname: form.nickname,
          hosting: form.hosting,
          intent: form.intent,
        })
        .eq("id", user.id);

      if (error) {
        alert(error.message);
      } else {
        router.refresh();
        router.back();
      }
    }
    setSaving(false);
  };

  if (loading) return <div className="min-h-screen bg-black" />;

  return (
    <main className="min-h-screen bg-[#050505] text-white p-6 pb-20 font-sans">
      
      {/* LUXE BACKGROUND AMBIENCE */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-tr from-red-950/20 via-black to-fuchsia-950/10 pointer-events-none" />

      {/* HEADER */}
      <div className="flex items-center justify-between mb-12 relative z-10">
        <button onClick={() => router.back()} className="p-3 bg-white/5 rounded-full backdrop-blur-md border border-white/10">
          <ChevronLeft size={24} />
        </button>
        
        <button 
          onClick={handleSave}
          disabled={saving}
          className="bg-white text-black font-black italic uppercase text-[10px] tracking-[0.2em] px-8 py-3 rounded-full hover:bg-red-600 hover:text-white transition-all active:scale-95"
        >
          {saving ? "SYNCING..." : "UPDATE VIBE"}
        </button>
      </div>

      <div className="flex flex-col items-center justify-center mb-12 relative z-10">
        <div className="relative mb-6">
          <div className="absolute -inset-6 bg-red-600/20 rounded-full blur-[50px] animate-pulse" />
          <div className="relative w-24 h-24 rounded-full border border-white/10 flex items-center justify-center bg-zinc-900/40 backdrop-blur-xl">
            <Heart size={32} className="text-red-600 fill-red-600/20" />
          </div>
        </div>
      </div>

      <div className="space-y-10 max-w-sm mx-auto relative z-10">
        
        {/* NICKNAME */}
        <div className="group">
          <label className="text-[9px] font-black uppercase tracking-[0.4em] text-zinc-500 block mb-2 transition-colors">
            Identity / Alias
          </label>
          <input
            className="w-full bg-transparent border-b border-zinc-800 p-2 outline-none focus:border-red-600 transition-all text-2xl font-black italic uppercase placeholder:text-zinc-900"
            value={form.nickname}
            onChange={(e) => setForm({ ...form, nickname: e.target.value })}
            placeholder="YOUR NAME"
          />
        </div>

        {/* VIBE PROTOCOL (NEW SECTION) */}
        <div className="space-y-4">
          <label className="text-[9px] font-black uppercase tracking-[0.4em] text-zinc-500 block">
            Vibe Protocol
          </label>
          <div className="grid grid-cols-2 gap-2">
            {vibeOptions.map((vibe) => (
              <button
                key={vibe}
                onClick={() => toggleVibe(vibe)}
                className={`py-3 px-4 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all flex justify-between items-center ${
                  form.intent.includes(vibe) 
                    ? 'bg-red-600/20 border-red-600 text-white' 
                    : 'bg-white/5 border-white/5 text-zinc-500'
                }`}
              >
                {vibe}
                {form.intent.includes(vibe) && <Check size={12} />}
              </button>
            ))}
          </div>
        </div>

        {/* MOVEMENT MOOD */}
        <div className="space-y-4">
          <label className="text-[9px] font-black uppercase tracking-[0.4em] text-zinc-500 block">
            Movement
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button 
              onClick={() => setForm({...form, hosting: 'host'})}
              className={`py-5 rounded-2xl font-black italic uppercase text-[10px] tracking-widest border transition-all flex flex-col items-center gap-2 ${
                form.hosting === 'host' ? 'bg-white text-black border-white' : 'border-white/5 text-zinc-600 bg-white/5'
              }`}
            >
              <GlassWater size={18} />
              I CAN HOST
            </button>
            <button 
              onClick={() => setForm({...form, hosting: 'travel'})}
              className={`py-5 rounded-2xl font-black italic uppercase text-[10px] tracking-widest border transition-all flex flex-col items-center gap-2 ${
                form.hosting === 'travel' ? 'bg-white text-black border-white' : 'border-white/5 text-zinc-600 bg-white/5'
              }`}
            >
              <Sparkles size={18} />
              I CAN TRAVEL
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}