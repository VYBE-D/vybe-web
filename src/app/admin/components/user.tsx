"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabase";

export default function Users() {
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    supabase.from("profiles").select("*").then(({ data }) => {
      if (data) setUsers(data);
    });
  }, []);

  const deactivate = async (id: string) => {
    await supabase.from("profiles").update({ status: "DEACTIVATED" }).eq("id", id);
    setUsers((u) => u.map(x => x.id === id ? { ...x, status: "DEACTIVATED" } : x));
  };

  const remove = async (id: string) => {
    await supabase.from("profiles").delete().eq("id", id);
    setUsers((u) => u.filter(x => x.id !== id));
  };

  return (
    <div className="space-y-3">
      {users.map((u) => (
        <div key={u.id} className="bg-gray-900 p-4 rounded-xl flex justify-between">
          <div>
            <p className="font-semibold">{u.name}</p>
            <p className="text-xs text-gray-400">{u.email}</p>
          </div>
          <div className="flex gap-2">
            <button onClick={() => deactivate(u.id)} className="text-yellow-400">Deactivate</button>
            <button onClick={() => remove(u.id)} className="text-red-500">Delete</button>
          </div>
        </div>
      ))}
    </div>
  );
}
