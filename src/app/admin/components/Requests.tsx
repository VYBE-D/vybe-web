"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabase";

export default function Requests() {
  const [requests, setRequests] = useState<any[]>([]);

  useEffect(() => {
    supabase.from("requests").select("*").order("created_at", { ascending: false })
      .then(({ data }) => data && setRequests(data));
  }, []);

  const updateStatus = async (id: string, status: string) => {
    await supabase.from("requests").update({ status }).eq("id", id);
    setRequests(r => r.map(x => x.id === id ? { ...x, status } : x));
  };

  return (
    <div className="space-y-3">
      {requests.map(r => (
        <div key={r.id} className="bg-gray-900 p-4 rounded-xl flex justify-between">
          <span>Status: {r.status}</span>
          <div className="flex gap-2">
            <button onClick={() => updateStatus(r.id, "accepted")} className="text-green-400">Accept</button>
            <button onClick={() => updateStatus(r.id, "rejected")} className="text-red-400">Reject</button>
          </div>
        </div>
      ))}
    </div>
  );
}
