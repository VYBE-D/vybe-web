"use client";
import { useState } from "react";
import { supabase } from "../../lib/supabase";

export default function EventBooking() {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");

  const createEvent = async () => {
    const user = await supabase.auth.getUser();
    await supabase.from("events").insert({
      user_id: user.data.user?.id,
      title,
      description: desc,
      location,
      date,
      participants: [],
    });
    alert("Event created!");
  };

  return (
    <div className="p-4 bg-gray-900 rounded-xl space-y-2">
      <input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} className="input" />
      <input placeholder="Description" value={desc} onChange={(e) => setDesc(e.target.value)} className="input" />
      <input placeholder="Location" value={location} onChange={(e) => setLocation(e.target.value)} className="input" />
      <input type="datetime-local" value={date} onChange={(e) => setDate(e.target.value)} className="input" />
      <button className="w-full bg-red-600 py-2 rounded-full" onClick={createEvent}>Create Event</button>
    </div>
  );
}
