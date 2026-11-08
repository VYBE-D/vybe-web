"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabase";

export default function Chat() {
  const [messages, setMessages] = useState<any[]>([]);
  const [text, setText] = useState("");

  useEffect(() => {
    supabase.from("messages").select("*").order("created_at", { ascending: true })
      .then(({ data }) => data && setMessages(data));
  }, []);

  const send = async () => {
    if (!text) return;
    const { data: user } = await supabase.auth.getUser();
    await supabase.from("messages").insert({
      sender: user.user?.id,
      message: text,
    });
    setText("");
  };

  return (
    <div className="space-y-3">
      <div className="max-h-96 overflow-y-auto space-y-2">
        {messages.map(m => (
          <div key={m.id} className="bg-gray-800 p-2 rounded-xl">
            <p className="text-xs text-gray-400">{m.sender}</p>
            <p>{m.message}</p>
          </div>
        ))}
      </div>
      <input
        className="input"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Admin message…"
      />
      <button onClick={send} className="bg-red-600 py-2 rounded-xl">Send</button>
    </div>
  );
}
