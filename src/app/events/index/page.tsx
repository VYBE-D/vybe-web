"use client";

import { useEffect, useState } from "react";
import { db, storage, auth } from "../../../lib/firebase";
import { collection, getDocs, doc, updateDoc, query, where } from "firebase/firestore";
import { getDownloadURL, ref } from "firebase/storage";

type Event = {
  id: string;
  name: string;
  date: string;
  slots: number;
  photos: string[];
};

export default function EventReveal() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      const q = query(collection(db, "events"));
      const snapshot = await getDocs(q);
      const evs: Event[] = [];

      for (const docSnap of snapshot.docs) {
        const data: any = docSnap.data();
        const urls: string[] = [];
        for (const p of data.photos) {
          const url = await getDownloadURL(ref(storage, p));
          urls.push(url);
        }
        evs.push({
          id: docSnap.id,
          name: data.name,
          date: data.date,
          slots: data.slots,
          photos: urls,
        });
      }

      setEvents(evs);
      setLoading(false);
    };

    fetchEvents();
  }, []);

  const handleBook = async (eventId: string) => {
    const user = auth.currentUser;
    if (!user) return alert("You must be logged in!");
    await updateDoc(doc(db, "events", eventId), {
      bookedUsers: user.uid, // optional: track bookings
      slots: (events.find(e => e.id === eventId)?.slots || 1) - 1
    });
    alert("Access requested! Admin will confirm.");
  };

  if (loading) return <div className="text-white p-6">Loading events...</div>;

  return (
    <main className="bg-black min-h-screen text-white p-6">
      <h1 className="text-3xl font-bold mb-6">Private Events</h1>
      <p className="text-gray-400 mb-6">You don’t browse people. You unlock moments.</p>
      
      <div className="grid gap-6 md:grid-cols-2">
        {events.map(event => (
          <div key={event.id} className="bg-zinc-900 rounded-xl p-4 flex flex-col">
            <h2 className="text-xl font-bold">{event.name}</h2>
            <p className="text-gray-400">{event.date ? event.date : "This Weekend"}</p>
            <p className="text-gray-400">Slots remaining: {event.slots}</p>

            <div className="flex gap-2 mt-2 overflow-x-auto">
              {event.photos.map((url, i) => (
                <img
                  key={i}
                  src={url}
                  className="w-24 h-24 object-cover rounded-xl"
                />
              ))}
            </div>

            <button
              onClick={() => handleBook(event.id)}
              disabled={event.slots <= 0}
              className={`mt-4 py-3 rounded-full w-full ${
                event.slots > 0 ? "bg-red-600" : "bg-zinc-700 text-gray-400"
              }`}
            >
              {event.slots > 0 ? "Book Access" : "Full"}
            </button>
          </div>
        ))}
      </div>
    </main>
  );
}