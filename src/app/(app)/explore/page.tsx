"use client";

import { useState, useEffect } from "react";
import { supabase } from "../../../lib/supabase"; // Ensure this path is correct for your file structure
import { ShieldCheck, Lock, X, Mail, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function EventView() {
  // --- STATE ---
  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showClearanceModal, setShowClearanceModal] = useState(false);

  // --- FETCHING LOGIC ---
  useEffect(() => {
    async function fetchLatestEvent() {
      try {
        setLoading(true);
        // Fetch the single most recent event
        const { data, error } = await supabase
          .from('events')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(1)
          .single();

        if (error) {
            console.error("Event Fetch Error:", error.message);
        } else {
            setEvent(data);
        }
      } catch (err) {
        console.error("System Error:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchLatestEvent();
  }, []);

  // --- LOADING STATE ---
  if (loading) {
    return (
      <div className="w-full h-64 flex flex-col items-center justify-center bg-zinc-900/50 rounded-[2rem] border border-white/5">
        <Loader2 className="text-red-600 animate-spin mb-4" />
        <p className="text-[9px] font-black uppercase tracking-[0.3em] text-zinc-500 animate-pulse">
          Decrypting Event Protocol...
        </p>
      </div>
    );
  }

  // --- NO EVENT FOUND STATE ---
  if (!event) {
    return (
      <div className="w-full h-48 flex items-center justify-center bg-zinc-900/50 rounded-[2rem] border border-white/5">
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600">
          No Active Protocols
        </p>
      </div>
    );
  }

  // --- DATA VARIABLES ---
  const title = event.title || "CLASSIFIED GATHERING";
  const tagline = event.tagline || "Signals Detected. Location Unknown.";
  const description = event.description || "High-fidelity sound. Private personnel. Entry restricted.";
  const email = event.clearance_email || "clearance@vybe.club";
  // Fallback image if none provided in DB
  const cover = event.cover_image || "https://images.unsplash.com/photo-1534120247760-c44c3e4a62f1"; 

  // --- HANDLER ---
  const handleEmailRequest = () => {
    const subject = `REQUEST CLEARANCE: ${title}`;
    const body = `State your intent briefly:\n\n\n(My User ID: VYB-REQ-${Date.now().toString().slice(-4)})`;
    window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  // --- RENDER UI ---
  return (
    <>
      {/* --- EVENT CARD --- */}
      <div className="w-full max-w-md mx-auto bg-zinc-900 border border-white/10 rounded-[2rem] overflow-hidden relative group shadow-2xl">
        
        {/* Cover Image */}
        <div className="h-64 w-full relative">
          <img 
            src={cover} 
            alt="Cover" 
            className="w-full h-full object-cover opacity-60 group-hover:opacity-40 transition-opacity duration-500 grayscale group-hover:grayscale-0" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-transparent" />
          
          {/* Status Badge */}
          <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-md border border-red-600/30 px-3 py-1 rounded-full flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-red-600 rounded-full animate-pulse" />
            <span className="text-[8px] font-black uppercase tracking-widest text-red-500">Restricted</span>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 relative -mt-12 space-y-4">
          <div>
            <h2 className="text-3xl font-black italic uppercase text-white leading-none tracking-tighter mb-2">
              {title}
            </h2>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500">
              {tagline}
            </p>
          </div>

          <p className="text-xs text-zinc-400 leading-relaxed border-l-2 border-red-900/50 pl-4">
            {description}
          </p>

          {/* Hidden Data Indicators */}
          <div className="flex gap-4 opacity-50 select-none">
            <div className="flex items-center gap-2 text-[10px] uppercase font-bold text-zinc-600">
               <span className="bg-zinc-800 px-2 py-0.5 rounded">DATE</span> Redacted
            </div>
            <div className="flex items-center gap-2 text-[10px] uppercase font-bold text-zinc-600">
               <span className="bg-zinc-800 px-2 py-0.5 rounded">LOC</span> Unknown
            </div>
          </div>

          {/* ACTION BUTTON */}
          <button 
            onClick={() => setShowClearanceModal(true)}
            className="w-full mt-4 bg-white text-black py-4 rounded-xl font-black uppercase text-[10px] tracking-[0.3em] hover:bg-zinc-200 transition-all active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.1)]"
          >
            [ REQUEST CLEARANCE ]
          </button>
        </div>
      </div>

      {/* --- CLEARANCE MODAL --- */}
      <AnimatePresence>
        {showClearanceModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex items-center justify-center p-6"
          >
            <div className="w-full max-w-sm bg-zinc-900 border border-white/10 p-8 rounded-[2rem] relative shadow-2xl shadow-black">
              
              <button 
                onClick={() => setShowClearanceModal(false)}
                className="absolute top-4 right-4 text-zinc-600 hover:text-white"
              >
                <X size={20} />
              </button>

              <div className="flex flex-col items-center text-center space-y-6">
                <Lock size={40} className="text-zinc-500" />
                
                <div>
                  <h3 className="text-2xl font-black italic uppercase text-white tracking-tighter mb-2">Restricted Event</h3>
                  <div className="h-0.5 w-12 bg-red-600 mx-auto" />
                </div>

                <p className="text-xs text-zinc-400 font-medium leading-relaxed uppercase tracking-wide">
                  This location is not public. Entry is granted by clearance only.
                </p>

                <div className="w-full bg-black/40 p-4 rounded-xl border border-white/5">
                  <p className="text-[10px] text-zinc-500 uppercase tracking-widest mb-3">Protocol</p>
                  <ol className="text-[10px] text-left text-zinc-300 space-y-2 list-decimal list-inside font-mono">
                    <li>Request clearance via secure channel.</li>
                    <li>State intent briefly.</li>
                    <li>Approved IDs receive coordinates.</li>
                  </ol>
                </div>

                <button 
                  onClick={handleEmailRequest}
                  className="w-full bg-red-600 text-white py-4 rounded-xl font-black uppercase text-[10px] tracking-[0.3em] flex items-center justify-center gap-3 hover:bg-red-700 transition-all"
                >
                  <Mail size={14} /> Request via Email
                </button>

                <p className="text-[8px] text-zinc-600 uppercase tracking-widest">
                  ⚠️ Alternate channel available upon request.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}