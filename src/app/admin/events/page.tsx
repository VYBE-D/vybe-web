"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabase"; 
import { 
  Calendar, Plus, Trash2, Loader2, Camera, 
  Users, MapPin, AlertCircle, Gavel, AlignLeft 
} from "lucide-react";

export default function EventsAdmin() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  // --- FULL FORM STATE ---
  const [eventName, setEventName] = useState("");
  const [eventDate, setEventDate] = useState(""); 
  const [eventLocation, setEventLocation] = useState("");
  const [eventSlots, setEventSlots] = useState(15);
  const [eventDescription, setEventDescription] = useState("");
  const [eventImage, setEventImage] = useState("");
  const [isBidding, setIsBidding] = useState(false);
  const [minBid, setMinBid] = useState(0);

  useEffect(() => {
    fetchEvents();
  }, []);

  async function fetchEvents() {
    const { data, error } = await supabase
      .from("events")
      .select("*")
      .order("event_date", { ascending: true });
    
    if (data) setEvents(data);
    if (error) console.error("Fetch Error:", error);
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      const file = e.target.files?.[0];
      if (!file) return;

      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `wallpapers/${fileName}`;

      const { error: uploadError } = await supabase.storage.from('events').upload(filePath, file);
      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from('events').getPublicUrl(filePath);
      setEventImage(data.publicUrl);
    } catch (error: any) {
      alert("Image Upload Failed: " + error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleCreateEvent = async () => {
    // 1. Validation Logic
    if (!eventName.trim() || !eventLocation.trim()) {
      alert("ERROR: Title and Location cannot be empty.");
      return;
    }

    // Fix for the 'Date Missing' bug: use current time if user forgot to pick
    const finalDate = eventDate || new Date().toISOString().slice(0, 16);

    setLoading(true);

    const { error } = await supabase.from("events").insert([{ 
      title: eventName, 
      event_date: finalDate, 
      total_slots: eventSlots,
      available_slots: eventSlots,
      location: eventLocation,
      description: eventDescription,
      image_url: eventImage,
      is_bidding_enabled: isBidding,
      min_bid_amount: minBid,
      current_highest_bid: minBid
    }]);

    if (error) {
      console.error("Supabase Error:", error);
      alert("DATABASE ERROR: " + error.message);
    } else {
      alert("SUCCESS: Event has been initialized in the Vault.");
      // Reset all fields
      setEventName(""); 
      setEventDate(""); 
      setEventLocation(""); 
      setEventDescription("");
      setEventImage("");
      setIsBidding(false);
      setMinBid(0);
      fetchEvents(); // Refresh the list below
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this event?")) return;
    const { error } = await supabase.from("events").delete().eq("id", id);
    if (!error) fetchEvents();
  };

  return (
    <main className="min-h-screen bg-black text-white p-6 pb-24">
      <div className="max-w-4xl mx-auto space-y-10">
        
        {/* Header */}
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-black italic uppercase tracking-tighter text-white">Event Archives</h1>
            <p className="text-[10px] text-red-600 font-bold uppercase tracking-[0.3em] mt-1">Initialize New Entry</p>
          </div>
          <div className="bg-white/5 px-4 py-2 rounded-xl border border-white/10 text-[10px] font-bold uppercase text-gray-400">
            Total: {events.length}
          </div>
        </header>

        {/* Creation Form */}
        <div className="bg-zinc-900/40 border border-white/10 p-8 rounded-[3rem] space-y-6 shadow-2xl backdrop-blur-md">
          
          {/* Wallpaper Upload */}
          <div className="relative h-44 bg-black rounded-[2rem] overflow-hidden flex items-center justify-center border border-white/5 group transition-all hover:border-red-600/30">
             {eventImage ? (
                <img src={eventImage} className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition" alt="Preview" />
             ) : (
                <div className="text-center group-hover:scale-110 transition duration-500">
                    <Camera className="text-gray-700 mx-auto mb-2" size={32} />
                    <p className="text-[8px] font-black text-gray-600 tracking-[0.3em]">UPLOAD WALLPAPER</p>
                </div>
             )}
             <input type="file" onChange={handleImageUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
             {uploading && <div className="absolute inset-0 bg-black/60 flex items-center justify-center"><Loader2 className="animate-spin text-red-600" /></div>}
          </div>

          {/* Text Inputs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-500 uppercase ml-2 tracking-widest">Event Title</label>
                <input value={eventName} onChange={e => setEventName(e.target.value)} className="w-full bg-black border border-white/10 p-4 rounded-2xl outline-none focus:border-red-600 transition font-bold" placeholder="E.G. MIDNIGHT VIBE" />
            </div>
            
            <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-500 uppercase ml-2 tracking-widest">Secret Location</label>
                <input value={eventLocation} onChange={e => setEventLocation(e.target.value)} className="w-full bg-black border border-white/10 p-4 rounded-2xl outline-none focus:border-red-600 transition font-bold" placeholder="E.G. WAREHOUSE 7" />
            </div>

            <div className="space-y-2 md:col-span-2">
                <label className="text-[10px] font-black text-gray-500 uppercase ml-2 flex items-center gap-2 tracking-widest">
                    <Calendar size={12} className="text-red-600" /> Schedule Date & Time
                </label>
                <input 
                    type="datetime-local" 
                    value={eventDate} 
                    onChange={e => setEventDate(e.target.value)} 
                    className="w-full bg-black border border-white/10 p-4 rounded-2xl outline-none text-xs uppercase invert cursor-pointer font-bold" 
                />
            </div>

            <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-500 uppercase ml-2 tracking-widest flex items-center gap-2"><Users size={12}/> Capacity</label>
                <input type="number" value={eventSlots} onChange={e => setEventSlots(parseInt(e.target.value))} className="w-full bg-black border border-white/10 p-4 rounded-2xl outline-none focus:border-red-600 transition font-bold" />
            </div>

            <div className="flex flex-col justify-end space-y-2">
                <label className="text-[10px] font-black text-gray-500 uppercase ml-2 tracking-widest flex items-center gap-2"><Gavel size={12}/> Bidding Protocol</label>
                <div className="bg-black border border-white/10 p-4 rounded-2xl flex items-center justify-between">
                    <span className="text-[10px] font-bold text-gray-400">Enable Auction?</span>
                    <input type="checkbox" checked={isBidding} onChange={e => setIsBidding(e.target.checked)} className="accent-red-600 w-5 h-5 cursor-pointer" />
                </div>
            </div>
          </div>

          <button 
            onClick={handleCreateEvent} 
            disabled={loading || uploading}
            className="w-full bg-red-600 h-20 rounded-[2.5rem] font-black italic uppercase tracking-[0.2em] hover:bg-red-500 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3 shadow-2xl shadow-red-900/40"
          >
            {loading ? <Loader2 className="animate-spin" /> : <><Plus size={20} /> Initialize Event</>}
          </button>
        </div>

        {/* List Section */}
        <div className="space-y-4">
            <h2 className="text-[11px] font-black text-gray-500 uppercase tracking-[0.4em] ml-4">Live Archives</h2>
            {events.length === 0 ? (
                <div className="p-20 border border-dashed border-white/10 rounded-[2.5rem] text-center text-gray-600 uppercase font-black italic text-xs tracking-widest">The archives are empty.</div>
            ) : (
                events.map(ev => (
                    <div key={ev.id} className="group bg-white/5 border border-white/5 p-6 rounded-[2.5rem] flex justify-between items-center hover:bg-white/[0.08] transition duration-500">
                        <div className="flex items-center gap-5">
                            <div className="w-16 h-16 bg-black rounded-[1.5rem] overflow-hidden border border-white/10 shadow-inner">
                                <img src={ev.image_url || "/placeholder.jpg"} className="w-full h-full object-cover opacity-40 group-hover:opacity-100 transition duration-700" alt="" />
                            </div>
                            <div>
                                <p className="font-black italic uppercase text-2xl leading-none group-hover:text-red-600 transition">{ev.title}</p>
                                <p className="text-[10px] text-gray-500 uppercase tracking-[0.2em] mt-2 flex items-center gap-2 font-bold">
                                    <MapPin size={10} className="text-red-600" /> {ev.location}
                                </p>
                            </div>
                        </div>
                        <button onClick={() => handleDelete(ev.id)} className="p-4 text-gray-700 hover:text-red-600 transition-colors">
                            <Trash2 size={22} />
                        </button>
                    </div>
                ))
            )}
        </div>
      </div>
    </main>
  );
}