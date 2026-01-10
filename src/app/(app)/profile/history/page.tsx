"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ChevronLeft, Flame, Lock, MapPin, Calendar } from "lucide-react";
import { supabase } from "../../../../lib/supabase";

export default function HookupHistoryPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [connections, setConnections] = useState<any[]>([]);

  useEffect(() => {
    async function fetchHistory() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return router.push("/");

      // Fetching users you've successfully 'hooked up' with
      // Logic: Fetching from a 'hookups' table or filtered connections
      const { data, error } = await supabase
        .from("hookups") 
        .select(`
          id,
          date,
          partner_id,
          profiles:partner_id (nickname, photos, location)
        `)
        .eq("user_id", user.id)
        .order("date", { ascending: false });

      if (data) setConnections(data);
      setLoading(false);
    }
    fetchHistory();
  }, []);

  if (loading) return <div className="min-h-screen bg-black" />;

  return (
    <main className="min-h-screen bg-[#050505] text-white p-6 pb-24">
      
      {/* HEADER */}
      <header className="flex items-center justify-between mb-12">
        <button onClick={() => router.back()} className="p-2 bg-white/5 rounded-full border border-white/10">
          <ChevronLeft size={24} />
        </button>
        <div className="text-center">
          <h1 className="text-[10px] font-black uppercase tracking-[0.5em] text-zinc-600">Private Vault</h1>
          <p className="text-lg font-black italic uppercase tracking-tighter">Your Collection</p>
        </div>
        <div className="w-10 h-10 flex items-center justify-center bg-red-600/10 rounded-full border border-red-600/20">
          <Lock size={16} className="text-red-600" />
        </div>
      </header>

      {/* STATS ROW */}
      <div className="grid grid-cols-2 gap-4 mb-10">
        <div className="bg-white/5 border border-white/5 p-4 rounded-2xl">
          <p className="text-[8px] font-black uppercase tracking-widest text-zinc-500 mb-1">Total Links</p>
          <p className="text-2xl font-black italic">{connections.length}</p>
        </div>
        <div className="bg-white/5 border border-white/5 p-4 rounded-2xl">
          <p className="text-[8px] font-black uppercase tracking-widest text-zinc-500 mb-1">Active Status</p>
          <p className="text-2xl font-black italic text-red-600 uppercase">Verified</p>
        </div>
      </div>

      {/* COLLECTION LIST */}
      <div className="space-y-4">
        {connections.length > 0 ? (
          connections.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => router.push(`/profile/preview/${item.partner_id}`)}
              className="relative group bg-zinc-900/40 border border-white/5 rounded-3xl p-4 flex items-center gap-4 hover:border-red-600/40 transition-all cursor-pointer"
            >
              {/* Profile Image - Small Thumbnail */}
              <div className="relative w-16 h-16 rounded-2xl overflow-hidden border border-white/10 shrink-0">
                <img 
                  src={item.profiles?.photos?.[0] || "/avatar.jpg"} 
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                  alt="Partner"
                />
              </div>

              {/* Info */}
              <div className="flex-1">
                <h3 className="text-lg font-black italic uppercase tracking-tight leading-none mb-1">
                  {item.profiles?.nickname || "UNKNOWN"}
                </h3>
                <div className="flex items-center gap-3 text-zinc-500">
                  <div className="flex items-center gap-1">
                    <Calendar size={10} />
                    <span className="text-[9px] font-bold uppercase tracking-widest">Linked {item.date}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin size={10} />
                    <span className="text-[9px] font-bold uppercase tracking-widest">{item.profiles?.location || "LAGOS"}</span>
                  </div>
                </div>
              </div>

              {/* Spicy Indicator */}
              <div className="p-2">
                <Flame size={18} className="text-red-600" fill="currentColor" />
              </div>
            </motion.div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-20 opacity-20">
            <Flame size={48} className="mb-4" />
            <p className="text-xs font-black uppercase tracking-widest italic">No successful links logged yet.</p>
          </div>
        )}
      </div>

      {/* SAFETY WARNING FOOTER */}
      <div className="fixed bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black to-transparent">
        <p className="text-[8px] text-center text-zinc-700 font-black uppercase tracking-[0.4em]">
           End-to-End Encrypted Logs • Only You See This
        </p>
      </div>

    </main>
  );
}