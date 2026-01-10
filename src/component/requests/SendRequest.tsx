"use client";
import { supabase } from "../../lib/supabase";
import { useState } from "react";

export default function SendRequest({ toUser }: { toUser: string }) {
  const [message, setMessage] = useState("");

  const sendRequest = async () => {
    const user = await supabase.auth.getUser();
    const { error } = await supabase.from("requests").insert({
      from_user: user.data.user?.id,
      to_user: toUser,
      message,
    });
    if (error) alert(error.message);
    else alert("Request sent!");
  };

  return (
    <div className="p-4 bg-gray-900 rounded-xl space-y-2">
      <textarea placeholder="Message" value={message} onChange={(e) => setMessage(e.target.value)} className="w-full p-2 rounded" />
      <button className="w-full bg-red-600 py-2 rounded-full" onClick={sendRequest}>Send Request</button>
    </div>
  );
}
