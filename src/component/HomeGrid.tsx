"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../lib/supabase"; 
import { 
  X, Calendar, MapPin, 
  ArrowRight, Loader2, 
  Clock, Sparkles, ShieldCheck,
  MessageSquare, Lock, DoorOpen,
} from "lucide-react";

export default function HomeGrid({ girls }: { girls: any[] }) {
  const router = useRouter();
  
  // State variables
  const [shuffledGirls, setShuffledGirls] = useState<any[]>([]);
  const [selected, setSelected] = useState<any>(null);
  const [mode, setMode] = useState<"view" | "book">("view"); 
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);

  // Booking State
  const [date, setDate] = useState("");
  const [venue, setVenue] = useState("");
  const [duration, setDuration] = useState<number>(1);

  // 1. FETCH USER ON LOAD
  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();
  }, []);

  // 2. YOUR ACCESS LOGIC
  const isShadow = user?.user_metadata?.tier === 'shadow';
  const isAdmin = user?.user_metadata?.role === 'admin';
  const hasAccess = isShadow || isAdmin;

  // Shuffle talents on mount
  useEffect(() => {
    const shuffled = [...girls].sort(() => 0.5 - Math.random());
    setShuffledGirls(shuffled);
  }, [girls]);

  const basePrice = Number(selected?.price) || 0;
  const finalPrice = duration === 11 ? basePrice * 11 : basePrice * duration;

  const openProfile = (girl: any) => {
    setSelected(girl);
    setMode("view");
    setDate("");
    setVenue("");
    setDuration(1);
  };

  const handleBookAndChat = async () => {
    if (!date || !venue.trim()) return alert("Please add a date and location.");
    setLoading(true);
    try {
      if (!user) return router.push('/login');
      
      await supabase.from("conversations").upsert({ 
        user_id: user.id, 
        talent_id: selected.id 
      }, { onConflict: 'user_id,talent_id' });
      
      const response = await fetch("/api/payment/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          userId: user.id, 
          talentId: selected.id, 
          amount: finalPrice, 
          metadata: { date, venue, duration_hours: duration } 
        }),
      });
      
      const data = await response.json();
      if (data.invoice_url) {
        window.location.href = data.invoice_url;
      }
    } catch (err) {
      alert("System could not generate secure link. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* HEADER: Shows Backroom Link ONLY if Authorized */}
      <div className="flex justify-between items-center px-4 py-6 max-w-4xl mx-auto">
        <h1 className="text-xl font-black italic text-zinc-100 uppercase tracking-tighter">Discovery</h1>
        
        {hasAccess && (
          <button 
            onClick={() => router.push('/backroom')}
            className="flex items-center gap-2 bg-red-900/20 text-red-500 border border-red-500/20 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-red-900/40 transition-all"
          >
            <DoorOpen size={14} /> Enter Backroom
          </button>
        )}
      </div>

      {/* MAIN DISCOVERY FEED */}
      <div className="grid grid-cols-2 gap-3 max-w-4xl mx-auto px-3 pb-32">
        {shuffledGirls.map((girl) => (
          <div 
            key={girl.id} 
            onClick={() => openProfile(girl)} 
            className="relative aspect-[2/3] rounded-3xl overflow-hidden cursor-pointer active:scale-[0.98] transition-all bg-zinc-900 border border-white/5 shadow-lg"
          >
            <img src={girl.image_url} className="w-full h-full object-cover opacity-90" alt={girl.name} />
            
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4">
              <div className="flex justify-between items-end">
                <div>
                   <p className="text-zinc-100 font-bold text-xl tracking-tight leading-none">{girl.name}</p>
                   <p className="text-zinc-400 text-[10px] font-medium uppercase tracking-wider mt-1">
                     {girl.role || girl.category || "Model"}
                   </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* PROFILE & BOOKING MODAL */}
      {selected && (
        <div className="fixed inset-0 z-[100] bg-[#0a0a0a] overflow-y-auto no-scrollbar animate-in slide-in-from-bottom duration-500">
          
          <div className="sticky top-0 z-[110] px-6 py-4 flex justify-between items-center bg-[#0a0a0a]/90 backdrop-blur-xl border-b border-white/5">
              <button onClick={() => setSelected(null)} className="p-2 -ml-2 text-zinc-400 hover:text-white transition-colors">
                <X size={26} strokeWidth={1.5} />
              </button>
              {mode === "book" && (
                <button onClick={() => setMode("view")} className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600 hover:text-zinc-300 transition-colors">
                  Exit Booking
                </button>
              )}
          </div>

          <div className="max-w-md mx-auto w-full">
            {mode === "view" ? (
              <div className="px-4 space-y-4 pb-48">
                
                <div className="relative h-[75vh] w-full overflow-hidden rounded-[2.5rem] border border-white/5 mt-2 shadow-2xl">
                    <img src={selected.image_url} className="w-full h-full object-cover" />
                    <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black via-black/50 to-transparent">
                       <h1 className="text-5xl font-black italic uppercase tracking-tighter text-zinc-100 leading-none mb-2">{selected.name}</h1>
                       <div className="flex items-center gap-3">
                         <span className="bg-white/10 backdrop-blur-md text-zinc-200 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border border-white/10">
                           {selected.role || selected.category || "Talent"}
                         </span>
                         <span className="text-red-500 text-[10px] font-black tracking-widest uppercase">Verified</span>
                       </div>
                    </div>
                </div>

                <div className="bg-zinc-900/30 p-8 rounded-[2.5rem] border border-white/5">
                   <p className="text-zinc-500 text-[9px] font-black uppercase tracking-[0.3em] mb-3 flex items-center gap-2">
                     <Sparkles size={12} /> The Vibe
                   </p>
                   <p className="text-sm font-medium text-zinc-300 leading-relaxed italic">
                     "{selected.bio}"
                   </p>
                </div>

                {selected.gallery?.map((img: string, i: number) => (
                  <div key={i} className="h-[75vh] w-full overflow-hidden rounded-[2.5rem] border border-white/5 shadow-xl">
                    <img src={img} className="w-full h-full object-cover" />
                  </div>
                ))}

                <div className="fixed bottom-8 left-0 right-0 px-6 z-[120]">
                  <button 
                    onClick={() => setMode("book")} 
                    className="w-full bg-white text-black h-16 rounded-full font-black uppercase tracking-widest shadow-[0_0_50px_rgba(255,255,255,0.15)] active:scale-95 transition-all flex items-center justify-center gap-3 hover:bg-zinc-200"
                  >
                    Start Booking <ArrowRight size={18} />
                  </button>
                </div>
              </div>
            ) : (
              <div className="px-6 pt-8 animate-in fade-in duration-300">
                <div className="mb-10">
                    <h3 className="text-4xl font-black italic uppercase text-zinc-100 tracking-tighter">Details</h3>
                    <p className="text-zinc-500 text-[10px] mt-2 uppercase tracking-widest font-bold">Prepare for deployment</p>
                </div>
                
                <div className="space-y-12 pb-[550px]"> 
                    <div className="space-y-8">
                        <div className="space-y-3">
                            <label className="text-[9px] font-black text-zinc-600 uppercase tracking-[0.2em] flex items-center gap-2">
                              <Clock size={12}/> Duration
                            </label>
                            <div className="grid grid-cols-4 gap-2">
                                {[1, 2, 3, 11].map((h) => (
                                    <button 
                                      key={h} 
                                      onClick={() => setDuration(h)} 
                                      className={`py-4 rounded-xl text-[10px] font-black border transition-all ${
                                        duration === h ? "bg-white text-black border-white" : "bg-zinc-900 text-zinc-600 border-white/5 hover:border-white/10"
                                      }`}
                                    >
                                        {h === 11 ? "ALL DAY" : `${h}H`}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-3">
                            <label className="text-[9px] font-black text-zinc-600 uppercase tracking-[0.2em] flex items-center gap-2">
                              <Calendar size={12}/> When?
                            </label>
                            <input 
                              type="datetime-local" 
                              value={date} 
                              onChange={(e) => setDate(e.target.value)} 
                              className="w-full bg-zinc-900 border border-white/5 p-5 rounded-2xl outline-none text-zinc-100 font-bold text-xs focus:border-zinc-700 transition-all color-scheme-dark" 
                            />
                        </div>

                        <div className="space-y-3">
                            <label className="text-[9px] font-black text-zinc-600 uppercase tracking-[0.2em] flex items-center gap-2">
                              <MapPin size={12}/> Venue Address
                            </label>
                            <input 
                              type="text" 
                              value={venue} 
                              onChange={(e) => setVenue(e.target.value)} 
                              placeholder="Where are we meeting?" 
                              className="w-full bg-zinc-900 border border-white/5 p-5 rounded-2xl outline-none text-zinc-100 font-bold text-xs placeholder:text-zinc-800 focus:border-zinc-700 transition-all" 
                            />
                        </div>
                    </div>
                </div>

                <div className="fixed bottom-0 left-0 right-0 p-6 bg-[#0a0a0a] border-t border-white/5 z-[130]">
                    <div className="flex justify-between items-end mb-6 px-2">
                        <div>
                          <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest mb-1">Total Due</p>
                          <span className="text-3xl font-black italic text-zinc-100">${finalPrice}</span>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center gap-1.5 text-zinc-500 mb-1">
                             <ShieldCheck size={12} className="text-green-500" />
                             <span className="text-[9px] font-black uppercase tracking-widest">Secured</span>
                          </div>
                          <p className="text-[8px] font-medium text-zinc-700 uppercase tracking-tighter">Redirecting to Payment Gateway</p>
                        </div>
                    </div>

                    <button 
                      onClick={handleBookAndChat} 
                      disabled={loading} 
                      className="w-full bg-white py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-black shadow-[0_0_40px_rgba(255,255,255,0.1)] active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50 hover:bg-zinc-200"
                    >
                      {loading ? (
                        <Loader2 className="animate-spin" size={20}/>
                      ) : (
                        <><MessageSquare size={18} /> Book & Chat</>
                      )}
                    </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}