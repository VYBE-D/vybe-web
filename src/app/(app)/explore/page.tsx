"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabase"; // Ensure this path is correct
import EventSkeleton from "../../../component/EventSkeleton";
import EmptyState from "../../../component/EmptyState";
import { Gavel, MapPin, Users } from "lucide-react";

export default function ExplorePage() {
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState<any[]>([]);

  useEffect(() => {
    fetchRealEvents();
  }, []);

  async function fetchRealEvents() {
    setLoading(true);
    // Fetch from your 'events' table
    const { data, error } = await supabase
      .from("events")
      .select("*")
      .order("event_date", { ascending: true });

    if (!error && data) {
      setEvents(data);
    }
    setLoading(false);
  }

  const handleBid = async (eventId: string, currentBid: number) => {
    const bidValue = prompt(`Current high bid: $${currentBid}. Enter your bid:`);
    const numericBid = parseFloat(bidValue || "0");

    if (numericBid > currentBid) {
      const { error } = await supabase
        .from("events")
        .update({ current_highest_bid: numericBid })
        .eq("id", eventId);

      if (!error) {
        alert("Bid placed successfully!");
        fetchRealEvents(); // Refresh data
      }
    } else if (bidValue) {
      alert("Your bid must be higher than the current bid.");
    }
  };

  return (
    <main className="pt-8 px-4 pb-32 bg-black min-h-screen">
      <h1 className="text-4xl font-black italic uppercase tracking-tighter mb-8 text-white">
        Explore <span className="text-red-600">Vault</span>
      </h1>

      {loading ? (
        <div className="space-y-6">
          {[...Array(3)].map((_, i) => (
            <EventSkeleton key={i} />
          ))}
        </div>
      ) : events.length === 0 ? (
        <EmptyState text="No underground events found" />
      ) : (
        <div className="space-y-8">
          {events.map((event) => (
            <div 
              key={event.id} 
              className="relative w-full h-80 rounded-[2.5rem] overflow-hidden border border-white/10 group shadow-2xl"
            >
              {/* Event Wallpaper */}
              <img 
                src={event.image_url || "/placeholder.jpg"} 
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition duration-700 opacity-60" 
                alt={event.title}
              />
              
              {/* Dark Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />

              {/* Event Content */}
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <div className="flex justify-between items-end">
                  <div className="flex-1">
                    <h2 className="text-3xl font-black italic uppercase leading-none tracking-tighter mb-2">
                      {event.title}
                    </h2>
                    <div className="flex flex-col gap-1">
                      <p className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-red-500">
                        <MapPin size={12} /> {event.location}
                      </p>
                      <p className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                        <Users size={12} /> {event.available_slots} / {event.total_slots} Slots
                      </p>
                    </div>
                  </div>

                  {/* Dynamic Bidding/RSVP Button */}
                  <div className="ml-4">
                    {event.is_bidding_enabled ? (
                      <button 
                        onClick={() => handleBid(event.id, event.current_highest_bid)}
                        className="bg-red-600 hover:bg-red-500 px-6 py-4 rounded-2xl flex flex-col items-center gap-1 transition shadow-lg shadow-red-900/40 active:scale-95 border border-white/10"
                      >
                        <Gavel size={18} />
                        <span className="text-[10px] font-black uppercase italic">
                          Bid ${event.current_highest_bid}
                        </span>
                      </button>
                    ) : (
                      <button className="bg-white text-black px-8 py-4 rounded-2xl font-black uppercase text-[11px] tracking-widest hover:bg-gray-200 transition active:scale-95">
                        RSVP
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}