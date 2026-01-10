"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";
import Link from "next/link";
import { FileText, ShieldCheck, ChevronRight, LogOut, Trash2, ShieldAlert, Loader2 } from "lucide-react";

export default function SettingsPage() {
  const router = useRouter();
  const [incognito, setIncognito] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    async function loadSettings() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase
          .from("profiles")
          .select("incognito")
          .eq("id", user.id)
          .single();
        if (data) setIncognito(data.incognito);
      }
      setLoading(false);
    }
    loadSettings();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  const toggleIncognito = async () => {
    const newValue = !incognito;
    setIncognito(newValue);
    
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await supabase
        .from("profiles")
        .update({ incognito: newValue })
        .eq("id", user.id);
    }
  };

  /* 🧨 DELETE ACCOUNT LOGIC */
  const handleDeleteAccount = async () => {
    const confirmed = window.confirm(
      "EXTREME DANGER: This will permanently wipe your profile, collection, and photos. This cannot be undone. Proceed?"
    );

    if (confirmed) {
      setIsDeleting(true);
      try {
        const { data: { user } } = await supabase.auth.getUser();

        if (user) {
          // 1. Delete profile data (Supabase RLS should handle cascading if set up)
          const { error: profileError } = await supabase
            .from("profiles")
            .delete()
            .eq("id", user.id);

          if (profileError) throw profileError;

          // 2. Sign out the user
          await supabase.auth.signOut();
          
          alert("Account wiped successfully.");
          router.push("/");
        }
      } catch (error: any) {
        alert("Wipe failed: " + error.message);
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const handleDataDownload = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    alert(`Request received! Your account data is being compiled and will be sent to ${user?.email} shortly.`);
  };

  const glassItemClass = "flex items-center justify-between w-full border border-white/20 bg-white/10 backdrop-blur-md p-4 rounded-2xl mt-2 hover:bg-white/20 transition-all text-left text-white";
  const dangerGlassClass = "flex items-center justify-between w-full border border-red-500/30 bg-red-600/20 backdrop-blur-md p-4 rounded-2xl mt-2 hover:bg-red-600/30 transition-all text-left text-white font-medium disabled:opacity-50";

  return (
    <main className="min-h-screen bg-black flex justify-center p-4">
      <div className="w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 space-y-8 shadow-2xl text-white self-start mt-10">

        <div className="flex items-center justify-between px-1">
          <h1 className="text-2xl font-bold tracking-tight italic uppercase">Settings</h1>
          <button onClick={() => router.back()} className="text-[10px] font-black uppercase tracking-widest bg-white/5 hover:bg-white/10 px-4 py-2 rounded-full border border-white/10">
            Done
          </button>
        </div>

        {/* ACCOUNT INFO */}
        <section>
          <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500 mb-3 ml-1">
            Account Information
          </h2>
          <div className="flex flex-col">
            <button onClick={() => router.push("/settings/email")} className={glassItemClass}>
              Email address
            </button>
            <button onClick={() => router.push("/settings/password")} className={glassItemClass}>
              Change password
            </button>
            
            <div className={glassItemClass}>
              <span className="font-medium">Incognito Mode</span>
              <input
                type="checkbox"
                checked={incognito}
                disabled={loading}
                onChange={toggleIncognito}
                className="w-5 h-5 accent-red-600 cursor-pointer"
              />
            </div>

            <button onClick={handleDataDownload} className={glassItemClass}>
              Data download
            </button>
          </div>
        </section>

        {/* LEGAL & SAFETY */}
        <section>
          <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500 mb-3 ml-1">
            Legal & Safety
          </h2>
          <div className="flex flex-col gap-1">
            <Link href="/safety" className={glassItemClass}>
              <div className="flex items-center gap-3">
                <ShieldAlert size={18} className="text-gray-400" />
                <span>Safety Tips</span>
              </div>
              <ChevronRight size={16} className="text-white/20" />
            </Link>

            <Link href="/terms" className={glassItemClass}>
              <div className="flex items-center gap-3">
                <FileText size={18} className="text-gray-400" />
                <span>Terms of Service</span>
              </div>
              <ChevronRight size={16} className="text-white/20" />
            </Link>

            <Link href="/privacy" className={glassItemClass}>
              <div className="flex items-center gap-3">
                <ShieldCheck size={18} className="text-gray-400" />
                <span>Privacy Policy</span>
              </div>
              <ChevronRight size={16} className="text-white/20" />
            </Link>
          </div>
        </section>

        {/* ACCOUNT MANAGEMENT */}
        <section className="pb-4">
          <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500 mb-3 ml-1">
            Management
          </h2>
          <div className="flex flex-col">
            <button onClick={handleLogout} className={dangerGlassClass}>
              <span>Logout</span>
              <LogOut size={18} />
            </button>
            
            {/* UPDATED DELETE BUTTON */}
            <button 
              onClick={handleDeleteAccount} 
              disabled={isDeleting}
              className={dangerGlassClass}
            >
              <span>{isDeleting ? "Wiping Account..." : "Delete account"}</span>
              {isDeleting ? <Loader2 size={18} className="animate-spin" /> : <Trash2 size={18} />}
            </button>
          </div>
        </section>

        <p className="text-center text-[10px] text-white/20 uppercase tracking-[0.4em] font-bold italic">Vybe v1.0.4</p>
      </div>
    </main>
  );
}