"use client";

import { useState } from "react";
import { supabase } from "../../../lib/supabase";

export default function Events() {
  const [title, setTitle] = useState("");

  const create = async () => {
    if (!title) return;
    await supabase.from("events").insert({ title });
    setTitle("");
  };

  return (
    <div>
      <input className="input mb-3" value={title} onChange={e => setTitle(e.target.value)} placeholder="Event title" />
      <button onClick={create} className="bg-red-600 px-4 py-2 rounded-xl">Create Event</button>
    </div>
  );
}
