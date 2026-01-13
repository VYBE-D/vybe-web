"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../lib/supabase"; 
import { 
  X, Info, Calendar, MapPin, 
  ArrowRight, Loader2, ChevronDown, 
  Lock 
} from "lucide-react";

export default function HomeGrid({ girls }: { girls: any[] }) {
  const router = useRouter();
  
  // -- STATE MANAGEMENT --
  const [selected, setSelected] = useState<any>(null);
  const [mode, setMode] = useState<"view" | "book">("view"); 
  const [loading, setLoading] = useState(false);
  
  // These control the inputs directly
  const [date, setDate] = useState("");
  const [venue, setVenue] = useState("");

  // -- HANDLERS --

  // 1. Open Profile & Reset Form
  const openProfile = (girl: any) => {
    setSelected(girl);
    setMode("view");
    setDate("");  // Reset date so it's fresh
    setVenue(""); // Reset venue so it's fresh
  };

  // 2. Submit Logic
  const handleConfirmAndChat = async () => {
    // Debug: Check if state is capturing input
    console.log("Submitting:", { date, venue });

    if (!date) return alert("Please select a Date and Time.");
    if (!venue.trim()) return alert("Please enter the Venue Address.");

    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return router.push('/login');
      }

      // Create/Get Conversation
      const { data: conv } = await supabase
        .from("conversations")
        .upsert({ user_id: user.id, talent_id: selected.id }, { onConflict: 'user_id,talent_id' })
        .select().single();

      // Calculate Total
      const grandTotal = Number(selected.price) || 0;

      // Send to Payment API
      const response = await fetch("/api/payments/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          userId: user.id,
          amount: grandTotal,
          talentId: selected.id,
          conversationId: conv.id,
          metadata: { 
            date: date,    // passing the state variable
            venue: venue   // passing the state variable
          }
        }),
      });

      const paymentData = await response.json();
      if (paymentData.invoice_url) {
        window.location.href = paymentData.invoice_url;
      } else {
        throw new Error("Payment link generation failed.");
      }

    } catch (err) {
      console.error(err);
      alert("System error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* 1. DISCOVERY GRID */}
      <div className="grid grid-cols-2 gap-4 max-w-4xl mx-auto px-4 pb-20">
        {girls.map((girl) => (
          <div 
            key={girl.id} 
            onClick={() => openProfile(girl)} 
            className="group relative aspect-[3/4] rounded-[2.5rem] overflow-hidden border border-white/5 cursor-pointer active:scale-95 transition-all duration-500 shadow-2xl"
          >
            <img 
              src={girl.image_url} 
              className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition duration-700" 
              alt={girl.name} 
            />
            
            <div className="absolute bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-black via-black/70 to-transparent">
              <p className="text-[7px] font-black text-red-600 tracking-[0.3em] uppercase mb-1 opacity-90">
                {girl.category || "New Face"}
              </p>
              <p className="font-black italic uppercase text-xl text-white leading-none">{girl.name}</p>
              <p className="text-[8px] font-bold text-zinc-400 tracking-widest uppercase mt-2">
                {girl.role || "Elite Personnel"}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* 2. PROFILE & CHECKOUT MODAL */}
      {selected && (
        <div className="fixed inset-0 z-[100] bg-black overflow-y-auto animate-in slide-in-from-bottom duration-500">
          
          {/* Sticky Header */}
          <div className="sticky top-0 z-[110] p-6 flex justify-between items-center bg-gradient-to-b from-black to-transparent">
             <button 
                onClick={() => setSelected(null)} 
                className="bg-black/50 backdrop-blur-md p-3 rounded-full text-white border border-white/10 shadow-2xl hover:bg-red-600 transition-colors"
             >
                <X size={24} />
             </button>
             <h2 className="text-xs font-black uppercase tracking-[0.4em] text-white/40">{selected.category}</h2>
             <div className="w-12"></div>
          </div>

          <div className="flex flex-col w-full pb-40">
            {mode === "view" ? (
              <>
                {/* --- VIEW MODE --- */}
                <div className="w-full h-[85vh] relative px-4">
                  <img src={selected.image_url} className="w-full h-full object-cover rounded-[3.5rem] shadow-2xl" />
                  <div className="absolute bottom-12 left-10">
                    <p className="text-red-600 font-black uppercase tracking-[0.4em] text-[10px] mb-2 drop-shadow-lg">
                        {selected.category}
                    </p>
                    <h1 className="text-6xl font-black italic uppercase tracking-tighter text-white drop-shadow-2xl">
                        {selected.name}
                    </h1>
                  </div>
                  <div className="absolute bottom-6 left-1/2 -translate-x-1/2 animate-bounce opacity-30">
                    <ChevronDown size={32} className="text-white" />
                  </div>
                </div>

                <div className="p-6">
                   <div className="bg-zinc-900/50 border border-white/5 p-8 rounded-[3rem] backdrop-blur-sm">
                      <div className="flex items-center gap-2 text-red-600 mb-4">
                         <Info size={18} /><span className="text-[10px] font-black uppercase tracking-widest text-white">Advanced Intel</span>
                      </div>
                      <p className="text-xl text-zinc-300 italic leading-relaxed font-medium">"{selected.bio}"</p>
                   </div>
                </div>

                {selected.gallery?.slice(1).map((img: string, idx: number) => (
                  <div key={idx} className="w-full h-[85vh] px-4 mb-6">
                    <img src={img} className="w-full h-full object-cover rounded-[3.5rem] border border-white/5 shadow-2xl" />
                  </div>
                ))}

                <div className="fixed bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black via-black/90 to-transparent z-[120]">
                  <button 
                    onClick={() => { setMode("book"); window.scrollTo(0,0); }} 
                    className="w-full bg-white text-black py-6 rounded-full font-black uppercase tracking-[0.2em] shadow-2xl active:scale-95 transition-all"
                  >
                    Initiate Deployment
                  </button>
                </div>
              </>
            ) : (
              /* --- CHECKOUT MODE --- */
              <div className="p-6 space-y-6 pt-10 max-w-md mx-auto w-full">
                <div className="text-center space-y-2 mb-8">
                    <h3 className="text-3xl font-black italic uppercase text-red-600">Secure Checkout</h3>
                    <p className="text-[10px] font-bold text-zinc-500 tracking-[0.3em] uppercase">Talent: {selected.name}</p>
                </div>
                
                <div className="bg-zinc-900/80 p-7 rounded-[3.5rem] border border-white/10 space-y-6 backdrop-blur-xl">
                    {/* Date Input */}
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                        <Calendar size={12}/> Date and Time
                      </label>
                      <input 
                        type="datetime-local" 
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="w-full bg-black border border-white/10 p-5 rounded-2xl outline-none invert text-white font-bold" 
                      />
                    </div>

                    {/* Venue Input */}
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                        <MapPin size={12}/> Venue Address
                      </label>
                      <input 
                        type="text" 
                        value={venue}
                        onChange={(e) => setVenue(e.target.value)}
                        placeholder="Street, Suite, City..." 
                        className="w-full bg-black border border-white/10 p-5 rounded-2xl outline-none text-white font-bold placeholder:text-zinc-700" 
                      />
                    </div>
                </div>

                <div className="flex flex-col gap-4">
                    {/* Price Summary */}
                    <div className="p-8 bg-zinc-900 rounded-[3rem] border border-red-600/30 flex justify-between items-center shadow-2xl">
                        <div>
                            <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Deployment Fee</p>
                            <p className="text-4xl font-black italic text-white">
                                ${selected.price || '0'}
                            </p>
                        </div>
                        <div className="bg-red-600/10 p-4 rounded-2xl">
                           <Lock className="text-red-600" size={24} />
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button 
                      onClick={handleConfirmAndChat} 
                      disabled={loading} 
                      className="w-full bg-red-600 py-6 rounded-full font-black uppercase tracking-widest flex items-center justify-center gap-3 text-white shadow-[0_0_50px_rgba(220,38,38,0.3)] active:scale-95 transition-all"
                    >
                      {loading ? (
                        <Loader2 className="animate-spin" size={24}/>
                      ) : (
                        <>Confirm & Chat <ArrowRight size={20}/></>
                      )}
                    </button>
                    
                    <button 
                      onClick={() => setMode("view")} 
                      className="text-[10px] font-black text-zinc-600 uppercase tracking-widest hover:text-white transition-colors"
                    >
                        Back to Intel
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