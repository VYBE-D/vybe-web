"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabase";
import EventSkeleton from "../../../component/EventSkeleton";
import EmptyState from "../../../component/EmptyState";
import { Gavel, MapPin, Users, Lock, Unlock, Calendar, Info, ShieldCheck, Zap, X, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ExplorePage() {
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState<any[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<any | null>(null);
  const [userOwnedEvents, setUserOwnedEvents] = useState<string[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();

    // 1. Fetch Events
    const { data: eventData } = await supabase
      .from("events")
      .select("*")
      .order("event_date", { ascending: true });

    // 2. Fetch User's Purchased Access (from the user_inventory table we created earlier)
    if (user) {
      const { data: owned } = await supabase
        .from("user_inventory")
        .select("product_id")
        .eq("user_id", user.id);
      
      if (owned) setUserOwnedEvents(owned.map(o => o.product_id));
    }

    if (eventData) setEvents(eventData);
    setLoading(false);
  }

  const handleAccessPayment = async (event: any) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return alert("Identify yourself (Login required)");

    // Format for Webhook: BOOKING:userId:eventId
    const orderId = `BOOKING:${user.id}:${event.id}`;

    try {
      const res = await fetch("/api/checkout", { // Your NowPayments API
        method: "POST",
        body: JSON.stringify({
          amount: event.access_price || 20, // Default price if not set
          orderId: orderId,
        }),
      });

      const paymentData = await res.json();
      if (paymentData.invoice_url) {
        window.location.href = paymentData.invoice_url;
      }
    } catch (err) {
      console.error("Payment Init Failed", err);
    }
  };

  return (
    <main className="pt-8 px-4 pb-32 bg-black min-h-screen text-white font-sans">
      <header className="mb-10">
        <h1 className="text-4xl font-black italic uppercase tracking-tighter">
          Explore <span className="text-red-600 underline decoration-red-600/30 underline-offset-8">Vault</span>
        </h1>
        <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-[0.3em] mt-2">Classified Underground Experiences</p>
      </header>

      {loading ? (
        <div className="space-y-6">
          {[...Array(3)].map((_, i) => <EventSkeleton key={i} />)}
        </div>
      ) : events.length === 0 ? (
        <EmptyState text="No underground events found" />
      ) : (
        <div className="space-y-8">
          {events.map((event) => {
            const isUnlocked = userOwnedEvents.includes(event.id);
            return (
              <motion.div 
                layoutId={event.id}
                key={event.id} 
                onClick={() => setSelectedEvent(event)}
                className="relative w-full h-80 rounded-[2.5rem] overflow-hidden border border-white/10 group cursor-pointer"
              >
                <img src={event.image_url} className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:scale-105 transition duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                
                {/* UNLOCKED BADGE */}
                {isUnlocked && (
                  <div className="absolute top-6 right-6 bg-green-500 text-black px-3 py-1 rounded-full flex items-center gap-1 shadow-lg shadow-green-500/20">
                    <Unlock size={10} />
                    <span className="text-[8px] font-black uppercase">Access Granted</span>
                  </div>
                )}

                <div className="absolute bottom-8 left-8 right-8">
                  <h2 className="text-3xl font-black italic uppercase tracking-tighter mb-2">{event.title}</h2>
                  <div className="flex items-center gap-4">
                    <p className="text-[9px] font-bold uppercase tracking-widest text-zinc-400 flex items-center gap-1">
                      <Users size={12} /> {event.available_slots} Slots Left
                    </p>
                    <p className="text-[9px] font-bold uppercase tracking-widest text-red-500 flex items-center gap-1">
                      <Zap size={12} fill="currentColor" /> {event.is_bidding_enabled ? "Bidding Active" : "Fixed Access"}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* --- EVENT DETAIL MODAL --- */}
      <AnimatePresence>
        {selectedEvent && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[150] bg-black flex flex-col pt-12"
          >
            <div className="px-6 flex justify-between items-center mb-6">
              <button onClick={() => setSelectedEvent(null)} className="p-3 bg-white/5 rounded-full"><X size={20}/></button>
              <span className="text-[10px] font-black uppercase tracking-widest opacity-40 italic">Mission Briefing</span>
              <div className="w-10" />
            </div>

            <div className="flex-1 overflow-y-auto px-6 pb-20">
              <h1 className="text-5xl font-black italic uppercase tracking-tighter leading-[0.9] mb-4">{selectedEvent.title}</h1>
              <p className="text-red-500 font-bold uppercase tracking-widest text-xs mb-8 italic">"{selectedEvent.tagline || 'Limited access experience'}"</p>

              <section className="space-y-8">
                <div>
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-3 flex items-center gap-2">
                    <Info size={14}/> The Vibe
                  </h3>
                  <p className="text-zinc-300 leading-relaxed text-sm">{selectedEvent.description}</p>
                </div>

                {/* LOGISTICS CARD (LOCKED) */}
                <div className="bg-zinc-900/50 border border-white/5 rounded-[2rem] p-6 relative overflow-hidden">
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-zinc-500">
                        <Calendar size={18}/>
                      </div>
                      <div>
                        <p className="text-[8px] font-black uppercase text-zinc-600">Date & Time</p>
                        <p className="text-xs font-bold uppercase">
                          {userOwnedEvents.includes(selectedEvent.id) ? selectedEvent.event_date : "•••••••• ••••"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-zinc-500">
                        <MapPin size={18}/>
                      </div>
                      <div>
                        <p className="text-[8px] font-black uppercase text-zinc-600">Coordinates</p>
                        <p className="text-xs font-bold uppercase tracking-widest">
                          {userOwnedEvents.includes(selectedEvent.id) ? selectedEvent.location : "CLASSIFIED AREA"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {!userOwnedEvents.includes(selectedEvent.id) && (
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center">
                       <Lock className="text-red-600 mb-2" size={24} />
                       <p className="text-[9px] font-black uppercase tracking-widest">Logistics Locked</p>
                       <p className="text-[7px] text-zinc-500 uppercase mt-1">Purchase access to reveal coordinates</p>
                    </div>
                  )}
                </div>

                <div>
                   <h3 className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-3 flex items-center gap-2">
                    <ShieldCheck size={14}/> Hosted By
                  </h3>
                  <div className="flex items-center gap-3 bg-white/5 p-4 rounded-2xl">
                    <div className="w-8 h-8 rounded-full bg-zinc-800" />
                    <span className="text-xs font-bold uppercase tracking-wider">{selectedEvent.host_name || "Verified Host"}</span>
                  </div>
                </div>
              </section>
            </div>

            {/* ACTION FOOTER */}
            <div className="p-6 border-t border-white/10 bg-black">
              {userOwnedEvents.includes(selectedEvent.id) ? (
                <button className="w-full py-5 bg-green-500 text-black rounded-[2rem] font-black uppercase text-xs tracking-[0.2em] shadow-lg shadow-green-500/20">
                  Access Granted • Open Map
                </button>
              ) : (
                <button 
                  onClick={() => handleAccessPayment(selectedEvent)}
                  className="w-full py-5 bg-white text-black rounded-[2rem] font-black uppercase text-xs tracking-[0.2em] flex items-center justify-center gap-3 active:scale-95 transition"
                >
                  Acquire Access • ${selectedEvent.access_price || 20} <ArrowRight size={16}/>
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}