"use client";
import { useState } from "react";
import { supabase } from "../../../lib/supabase";
import { useRouter } from "next/navigation";

export default function PasswordSettings() {
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) setMessage(error.message);
    else setMessage("Password updated successfully!");
  };

  const resetPassword = async () => {
    const { data } = await supabase.auth.getUser();
    if (data?.user?.email) {
      await supabase.auth.resetPasswordForEmail(data.user.email);
      setMessage("Reset link sent to your email!");
    }
  };

  return (
    <main className="min-h-screen bg-black flex justify-center p-4">
      <div className="w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 text-white self-start">
        <button onClick={() => router.back()} className="text-sm text-gray-400 mb-4">← Back</button>
        <h1 className="text-xl font-bold mb-6">Change Password</h1>
        <form onSubmit={handleUpdate} className="space-y-4">
          <input 
            type="password" 
            placeholder="New Password" 
            className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl outline-none"
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
          <button type="submit" className="w-full bg-white/10 border border-white/20 py-3 rounded-full hover:bg-white/20 transition">
            Update Password
          </button>
        </form>
        <button onClick={resetPassword} className="w-full mt-4 text-xs text-gray-400 underline">
          Forgot password? Send reset link
        </button>
        {message && <p className="text-xs text-center mt-4 text-indigo-300">{message}</p>}
      </div>
    </main>
  );
}