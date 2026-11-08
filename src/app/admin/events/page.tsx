"use client";

import { useState } from "react";
import { supabase } from "../../../lib/supabase";
import { ShieldAlert, Loader2, Lock } from "lucide-react";

export default function AdminEventSetup() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    tagline: "", // "Desperation" / Mood text
    description: "",
    cover_image: "",
    location_secret: "",
    date_secret: "",
    clearance_email: "",
    price_amount: 0,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase
        .from('events')
        .insert([formData]);

      if (error) throw error;
      alert("PROTOCOL INITIATED: Event Live.");
      // Reset form or redirect
    } catch (err: any) {
      alert(`ERROR: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-6 pb-20 font-mono">
      <div className="max-w-xl mx-auto border border-white/10 bg-zinc-900/50 p-8 rounded-3xl backdrop-blur-md">
        
        <div className="flex items-center gap-3 mb-8">
          <ShieldAlert className="text-red-600" />
          <h1 className="text-2xl font-black italic uppercase tracking-tighter">
            Initialize <span className="text-red-600">Restricted Event</span>
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* PUBLIC FACING DATA */}
          <div className="space-y-4">
            <label className="text-[10px] font-bold uppercase text-zinc-500 tracking-widest">Public Intel</label>
            <input 
              type="text" 
              placeholder="Event Code / Title" 
              className="w-full bg-black border border-white/20 p-4 text-xs font-bold uppercase tracking-widest focus:border-red-600 outline-none rounded-xl"
              onChange={(e) => setFormData({...formData, title: e.target.value})}
            />
            <input 
              type="text" 
              placeholder="Tagline (The Desperation/Vibe)" 
              className="w-full bg-black border border-white/20 p-4 text-xs font-bold uppercase tracking-widest focus:border-red-600 outline-none rounded-xl"
              onChange={(e) => setFormData({...formData, tagline: e.target.value})}
            />
             <input 
              type="text" 
              placeholder="Cover Image URL" 
              className="w-full bg-black border border-white/20 p-4 text-xs text-zinc-400 focus:border-red-600 outline-none rounded-xl"
              onChange={(e) => setFormData({...formData, cover_image: e.target.value})}
            />
            <textarea 
              placeholder="Manifesto / Description (What to expect)" 
              rows={4}
              className="w-full bg-black border border-white/20 p-4 text-xs text-zinc-300 focus:border-red-600 outline-none rounded-xl"
              onChange={(e) => setFormData({...formData, description: e.target.value})}
            />
          </div>

          <div className="w-full h-px bg-white/10 my-6" />

          {/* RESTRICTED DATA */}
          <div className="space-y-4">
            <label className="text-[10px] font-bold uppercase text-red-600 tracking-widest flex items-center gap-2">
              <Lock size={12}/> Classified Data (Hidden)
            </label>
            <div className="grid grid-cols-2 gap-4">
              <input 
                type="datetime-local" 
                className="w-full bg-zinc-900/50 border border-red-900/30 p-4 text-xs text-red-400 outline-none rounded-xl"
                onChange={(e) => setFormData({...formData, date_secret: e.target.value})}
              />
              <input 
                type="number" 
                placeholder="Entry Price ($)" 
                className="w-full bg-zinc-900/50 border border-red-900/30 p-4 text-xs text-red-400 outline-none rounded-xl"
                onChange={(e) => setFormData({...formData, price_amount: parseInt(e.target.value)})}
              />
            </div>
            <input 
              type="text" 
              placeholder="Exact Coordinates / Location" 
              className="w-full bg-zinc-900/50 border border-red-900/30 p-4 text-xs text-red-400 outline-none rounded-xl"
              onChange={(e) => setFormData({...formData, location_secret: e.target.value})}
            />
            <input 
              type="text" 
              defaultValue="clearance@vybeclub.fun"
              placeholder="Clearance Email" 
              className="w-full bg-zinc-900/50 border border-red-900/30 p-4 text-xs text-red-400 outline-none rounded-xl"
              onChange={(e) => setFormData({...formData, clearance_email: e.target.value})}
            />
          </div>

          <button 
            disabled={loading}
            className="w-full bg-white text-black py-4 rounded-xl font-black uppercase text-xs tracking-[0.3em] hover:bg-zinc-200 transition-all flex justify-center items-center"
          >
            {loading ? <Loader2 className="animate-spin" /> : "INITIATE PROTOCOL"}
          </button>

        </form>
      </div>
    </div>
  );
}