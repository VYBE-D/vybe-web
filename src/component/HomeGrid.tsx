"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../lib/supabase"; 
import { X, Info, Send, Calendar, MapPin, Clock, ArrowRight, Loader2, ShoppingCart } from "lucide-react";

export default function HomeGrid({ girls }: { girls: any[] }) {
  const router = useRouter();
  const [selected, setSelected] = useState<any>(null);
  const [mode, setMode] = useState<"view" | "book">("view"); 
  const [loading, setLoading] = useState(false);

  // --- NEW: STORE STATE ---
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [cart, setCart] = useState<any[]>([]);

  // Booking Form State
  const [date, setDate] = useState("");
  const [venue, setVenue] = useState("");
  const [hours, setHours] = useState(2);
  const [notes, setNotes] = useState("");

  // --- NEW: FETCH PRODUCTS ---
  useEffect(() => {
    const fetchStore = async () => {
      const { data } = await supabase.from("products").select("*");
      if (data) setAllProducts(data);
    };
    fetchStore();
  }, []);

  // --- NEW: TOGGLE CART LOGIC ---
  const toggleCart = (product: any) => {
    const isAlreadyInCart = cart.find((item) => item.id === product.id);
    if (isAlreadyInCart) {
      setCart(cart.filter((item) => item.id !== product.id));
    } else {
      setCart([...cart, product]);
    }
  };

  const handleConfirmBooking = async () => {
    if (!date || !venue) return alert("Date and Venue are required.");
    setLoading(true);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        alert("Please log in to book.");
        setLoading(false);
        return;
    }

    const { data: conversation, error } = await supabase
      .from("conversations")
      .insert([{ 
        user_id: user.id, 
        talent_id: selected.id, 
        last_message: "Booking Inquiry Sent" 
      }])
      .select()
      .single();

    if (error) {
        setLoading(false);
        return;
    }

    // --- NEW: FORMAT CART SUMMARY ---
    const cartSummary = cart.length > 0 
        ? cart.map(item => `• ${item.name} ($${item.price})`).join('\n')
        : "No items selected";

    const bookingDetails = `🚨 *NEW BOOKING REQUEST*\n\n📅 DATE: ${date}\n📍 VENUE: ${venue}\n⏳ DURATION: ${hours} Hours\n🛒 STORE ITEMS:\n${cartSummary}\n\n📝 NOTE: ${notes || "None"}`;

    await supabase.from("messages").insert([{
      conversation_id: conversation.id,
      sender_id: user.id,
      content: bookingDetails
    }]);

    router.push(`/chat?id=${conversation.id}`);
  };

  return (
    <>
      <div className="grid grid-cols-2 gap-4 max-w-4xl mx-auto">
        {girls.map((girl) => (
          <div 
            key={girl.id} 
            onClick={() => { setSelected(girl); setMode("view"); setCart([]); }} // Reset cart on select
            className="group relative aspect-[3/4] rounded-[2.5rem] overflow-hidden border border-white/5 cursor-pointer active:scale-95 transition-all duration-500"
          >
            <img src={girl.image_url} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-110 transition duration-700" alt={girl.name} />
            <div className="absolute bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-black via-black/60 to-transparent text-white">
              <p className="font-black italic uppercase text-xl leading-none">{girl.name}</p>
              <p className="text-[8px] font-bold text-red-600 tracking-widest mt-2 uppercase">{girl.category || 'New Talent'}</p>
            </div>
          </div>
        ))}
      </div>

      {selected && (
        <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl p-6 flex flex-col animate-in fade-in zoom-in duration-300 overflow-y-auto">
          <button onClick={() => setSelected(null)} className="self-end p-2 text-gray-400 hover:text-white mb-2">
            <X size={32} />
          </button>

          <div className="flex-1 flex flex-col items-center max-w-md mx-auto w-full space-y-6">
            
            {mode === "view" && (
                <>
                    <div className="w-48 h-48 rounded-full overflow-hidden border-2 border-red-600">
                        <img src={selected.image_url} className="w-full h-full object-cover" />
                    </div>
                    <div className="text-center text-white">
                        <h2 className="text-4xl font-black italic uppercase tracking-tighter">{selected.name}</h2>
                        <span className="text-red-600 font-bold text-[10px] uppercase tracking-widest">{selected.category}</span>
                    </div>
                    <div className="w-full bg-white/5 border border-white/10 p-6 rounded-[2rem] space-y-3">
                        <div className="flex items-center gap-2 text-red-600"><Info size={14} /><span className="text-[10px] font-black uppercase tracking-widest text-white">Personnel Dossier</span></div>
                        <p className="text-sm leading-relaxed text-gray-300 italic">"{selected.bio || "Available for exclusive bookings."}"</p>
                    </div>
                    <button onClick={() => setMode("book")} className="w-full bg-white text-black py-5 rounded-2xl font-black uppercase tracking-widest">
                        Proceed to Booking
                    </button>
                </>
            )}

            {mode === "book" && (
                <div className="w-full space-y-4 animate-in slide-in-from-right duration-300 text-white pb-10">
                    <div className="text-center mb-6">
                        <h3 className="text-2xl font-black italic uppercase text-red-600">Mission Details</h3>
                    </div>
                    
                    <div className="bg-zinc-900/50 p-4 rounded-2xl border border-white/10 space-y-4">
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-gray-500 uppercase ml-2 flex items-center gap-2"><Calendar size={12}/> Date & Time</label>
                            <input type="datetime-local" value={date} onChange={e => setDate(e.target.value)} className="w-full bg-black border border-white/10 p-3 rounded-xl outline-none text-xs uppercase invert text-white" />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-gray-500 uppercase ml-2 flex items-center gap-2"><MapPin size={12}/> Venue</label>
                            <input value={venue} onChange={e => setVenue(e.target.value)} placeholder="Location..." className="w-full bg-black border border-white/10 p-3 rounded-xl outline-none text-sm font-bold text-white" />
                        </div>

                        {/* --- NEW: STORE CAROUSEL --- */}
                        <div className="space-y-2 py-2">
                          <label className="text-[10px] font-bold text-gray-500 uppercase ml-2 flex items-center gap-2"><ShoppingCart size={12}/> Mission Essentials</label>
                          <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
                            {allProducts.map((item) => {
                              const active = cart.find(p => p.id === item.id);
                              return (
                                <div 
                                  key={item.id} 
                                  onClick={() => toggleCart(item)}
                                  className={`min-w-[110px] p-3 rounded-2xl border transition-all cursor-pointer ${active ? 'bg-red-600 border-red-500 scale-95' : 'bg-black border-white/10'}`}
                                >
                                  <img src={item.image_url} className="w-full h-14 object-cover rounded-lg mb-2" />
                                  <p className="text-[9px] font-black uppercase truncate leading-none mb-1">{item.name}</p>
                                  <p className="text-[10px] font-bold text-white opacity-60">${item.price}</p>
                                </div>
                              )
                            })}
                          </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-gray-500 uppercase ml-2">Notes</label>
                            <textarea value={notes} onChange={e => setNotes(e.target.value)} className="w-full bg-black border border-white/10 p-3 rounded-xl outline-none text-sm h-16 text-white" placeholder="..." />
                        </div>
                    </div>

                    <button onClick={handleConfirmBooking} disabled={loading} className="w-full bg-red-600 py-5 rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-2 text-white">
                        {loading ? <Loader2 className="animate-spin"/> : <>Confirm & Chat <ArrowRight size={18}/></>}
                    </button>
                </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}