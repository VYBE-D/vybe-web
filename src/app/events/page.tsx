"use client";

import { useEffect, useState } from "react";
import { db, auth } from "../../lib/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

export default function EventsPage() {
  const [events, setEvents] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    onAuthStateChanged(auth, async (u) => {
      if (!u) return;
      setUser(u);
      const q = query(collection(db, "users"), where("status", "==", "APPROVED"));
      const snap = await getDocs(q);
      if (!snap.empty) {
        const evSnap = await getDocs(collection(db, "events"));
        setEvents(evSnap.docs.map(doc=>({id:doc.id,...doc.data()})));
      } else {
        alert("You are not approved yet");
      }
    });
  }, []);

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <h1 className="text-3xl font-bold mb-4">Private Events</h1>
      {events.map(ev => (
        <div key={ev.id} className="bg-zinc-900 rounded-lg p-4 mb-4">
          <h2 className="font-bold text-xl">{ev.name}</h2>
          <p className="text-gray-400">{ev.date}</p>
          <p>Slots: {ev.slots}</p>
          <button className="bg-red-600 px-4 py-2 rounded-full mt-2">Book Access</button>
        </div>
      ))}
    </div>
  );
}