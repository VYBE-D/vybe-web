"use client";
import { useState, useEffect } from "react";
import { supabase } from "../../../lib/supabase";
import { useRouter } from "next/navigation";

export default function EmailSettings() {
  const [email, setEmail] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter();

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (data?.user?.email) setEmail(data.user.email);
    };
    getUser();
  }, []);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.auth.updateUser({ email: newEmail });
    if (error) setMessage(error.message);
    else setMessage("Check both old and new emails for confirmation links!");
  };

  return (
    <main className="min-h-screen bg-black flex justify-center p-4">
      <div className="w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 text-white self-start">
        <button onClick={() => router.back()} className="text-sm text-gray-400 mb-4">← Back</button>
        <h1 className="text-xl font-bold mb-6">Email Address</h1>
        <p className="text-sm text-gray-400 mb-2">Current: {email}</p>
        <form onSubmit={handleUpdate} className="space-y-4">
          <input 
            type="email" 
            placeholder="New Email Address" 
            className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl outline-none"
            onChange={(e) => setNewEmail(e.target.value)}
            required
          />
          <button type="submit" className="w-full bg-white/10 border border-white/20 py-3 rounded-full hover:bg-white/20 transition">
            Update Email
          </button>
          {message && <p className="text-xs text-center text-indigo-300">{message}</p>}
        </form>
      </div>
    </main>
  );
}