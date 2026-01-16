"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabase"; 
import { 
  Calendar, Plus, Trash2, Loader2, Camera, 
  Users, MapPin, Gavel, Info, ShieldCheck, DollarSign, Tag, Globe, Lock
} from "lucide-react";

export default function EventsAdmin() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  // --- FORM STATE (ALIGNED WITH YOUR STRUCTURE) ---
  const [eventName, setEventName] = useState("");
  const [eventTagline, setEventTagline] = useState(""); // New
  const [eventDescription, setEventDescription] = useState("");
  const [eventDate, setEventDate] = useState(""); 
  const [eventLocation, setEventLocation] = useState("");
  const [eventSlots, setEventSlots] = useState(15);
  const [eventImage, setEventImage] = useState("");
  const [accessPrice, setAccessPrice] = useState(20); // New
  const [isBidding, setIsBidding] = useState(false);

  useEffect(() => {
    fetchEvents();
  }, []);

  async function fetchEvents() {
    const { data, error } = await supabase.from("events").select("*").order("created_at", { ascending: false });
    if (data) setEvents(data);
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      const file = e.target.files?.[0];
      if (!file) return;
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `wallpapers/${fileName}`;
      await supabase.storage.from('events').upload(filePath, file);
      const { data } = supabase.storage.from('events').getPublicUrl(filePath);
      setEventImage(data.publicUrl);
    } catch (error: any) {
      alert("Upload Failed");
    } finally {
      setUploading(false);
    }
  };

  const handleCreateEvent = async () => {
    if (!eventName || !eventLocation || !eventDescription) return alert("Fill all required fields");
    setLoading(true);

    const { error } = await supabase.from("events").insert([{ 
      title: eventName, 
      tagline: eventTagline,
      description: eventDescription,
      event_date: eventDate || new Date().toISOString(), 
      location: eventLocation, // This is the 'Secret' location
      total_slots: eventSlots,
      available_slots: eventSlots,
      image_url: eventImage,
      access_price: accessPrice, // Used by NowPayments
      is_bidding_enabled: isBidding,
      current_highest_bid: accessPrice
    }]);

    if (!error) {
      alert("VAULT INITIALIZED");
      resetForm();
      fetchEvents();
    }
    setLoading(false);
  };

  const resetForm = () => {
    setEventName(""); setEventTagline(""); setEventDescription("");
    setEventDate(""); setEventLocation(""); setEventImage("");
  };

  return (
    <main className="min-h-screen bg-[#050505] text-white p-6 pb-24 font-sans">
      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* LEFT COLUMN: CREATION FORM */}
        <div className="lg:col-span-2 space-y-8">
          <header>
            <h1 className="text-4xl font-black italic uppercase tracking-tighter">Event Creator</h1>
            <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-[0.3em]">Protocol: Access Encryption</p>
          </header>

          <div className="bg-zinc-900/30 border border-white/5 p-8 rounded-[3rem] space-y-10 backdrop-blur-xl">
            
            {/* SECTION A: PUBLIC INFO */}
            <section className="space-y-6">
              <div className="flex items-center gap-2 text-red-600">
                <Globe size={14} />
                <h2 className="text-[10px] font-black uppercase tracking-widest">Section A: Public Intel</h2>
              </div>

              <div className="relative h-48 bg-black rounded-[2rem] overflow-hidden border border-white/5 group">
                 {eventImage ? <img src={eventImage} className="w-full h-full object-cover opacity-50" /> : <Camera className="absolute inset-0 m-auto text-zinc-800" size={30} />}
                 <input type="file" onChange={handleImageUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
                 {uploading && <div className="absolute inset-0 bg-black/60 flex items-center justify-center"><Loader2 className="animate-spin text-red-600" /></div>}
              </div>

              <div className="grid gap-4">
                <input value={eventName} onChange={e => setEventName(e.target.value)} className="bg-black border border-white/10 p-4 rounded-2xl outline-none focus:border-white/40 transition font-bold text-sm" placeholder="EVENT TITLE" />
                <input value={eventTagline} onChange={e => setEventTagline(e.target.value)} className="bg-black border border-white/10 p-4 rounded-2xl outline-none focus:border-white/40 transition font-bold text-[10px] uppercase tracking-widest text-red-500" placeholder="SHORT TAGLINE (THE VIBE)" />
                <textarea value={eventDescription} onChange={e => setEventDescription(e.target.value)} className="bg-black border border-white/10 p-4 rounded-2xl outline-none focus:border-white/40 transition font-medium text-xs h-32" placeholder="FULL EVENT DESCRIPTION..." />
              </div>
            </section>

            {/* SECTION B: LOCKED DETAILS */}
            <section className="space-y-6">
              <div className="flex items-center gap-2 text-zinc-500">
                <Lock size={14} />
                <h2 className="text-[10px] font-black uppercase tracking-widest">Section B: Encrypted Logistics (Post-Payment)</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-zinc-600 uppercase ml-2 tracking-widest">Secret Coordinates</label>
                  <input value={eventLocation} onChange={e => setEventLocation(e.target.value)} className="w-full bg-black border border-white/10 p-4 rounded-2xl outline-none focus:border-red-600 transition font-bold text-xs" placeholder="WAREHOUSE / SUITE / LINK" />
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-zinc-600 uppercase ml-2 tracking-widest">Revealed Date/Time</label>
                  <input type="datetime-local" value={eventDate} onChange={e => setEventDate(e.target.value)} className="w-full bg-black border border-white/10 p-4 rounded-2xl outline-none invert font-bold text-xs" />
                </div>
              </div>
            </section>

            {/* SECTION C: ACCESS & PRICING */}
            <section className="space-y-6">
              <div className="flex items-center gap-2 text-zinc-500">
                <DollarSign size={14} />
                <h2 className="text-[10px] font-black uppercase tracking-widest">Section C: Access Protocol</h2>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-black p-4 rounded-2xl border border-white/10">
                  <p className="text-[8px] font-black text-zinc-600 uppercase mb-2">Access Price (USD)</p>
                  <input type="number" value={accessPrice} onChange={e => setAccessPrice(parseInt(e.target.value))} className="bg-transparent border-none outline-none font-black text-xl w-full" />
                </div>
                <div className="bg-black p-4 rounded-2xl border border-white/10">
                  <p className="text-[8px] font-black text-zinc-600 uppercase mb-2">Total Slots</p>
                  <input type="number" value={eventSlots} onChange={e => setEventSlots(parseInt(e.target.value))} className="bg-transparent border-none outline-none font-black text-xl w-full" />
                </div>
              </div>
            </section>

            <button 
              onClick={handleCreateEvent} 
              disabled={loading || uploading}
              className="w-full bg-white text-black h-20 rounded-[2.5rem] font-black uppercase text-xs tracking-[0.3em] hover:invert transition-all active:scale-95 flex items-center justify-center gap-3"
            >
              {loading ? <Loader2 className="animate-spin" /> : "Deploy to Vault"}
            </button>
          </div>
        </div>

        {/* RIGHT COLUMN: RECENT DEPLOYMENTS */}
        <div className="space-y-6">
          <h2 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.4em] ml-4">Active Vault</h2>
          <div className="space-y-4">
            {events.map(ev => (
              <div key={ev.id} className="bg-white/5 border border-white/5 p-4 rounded-3xl flex items-center gap-4 group">
                <div className="w-12 h-12 bg-black rounded-2xl overflow-hidden flex-shrink-0">
                  <img src={ev.image_url} className="w-full h-full object-cover opacity-40 group-hover:opacity-100 transition" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-black uppercase text-[10px] truncate">{ev.title}</p>
                  <p className="text-[8px] text-zinc-500 font-bold">${ev.access_price} • {ev.available_slots} Slots</p>
                </div>
                <button onClick={() => { if(confirm("Delete?")) supabase.from("events").delete().eq("id", ev.id).then(() => fetchEvents()) }} className="text-zinc-800 hover:text-red-600 transition">
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>

      </div>
    </main>
  );
}