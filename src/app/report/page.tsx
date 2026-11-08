"use client";

import { useState, Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "../../lib/supabase";
import { ChevronLeft, ShieldAlert, CheckCircle2, Loader2, Info, AlertTriangle, UserSearch } from "lucide-react";

function ReportForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Get ID from URL if it exists
  const initialId = searchParams.get("userId") || searchParams.get("id") || "";
  
  const [targetId, setTargetId] = useState(initialId);
  const [reason, setReason] = useState("");
  const [details, setDetails] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Sync state if URL changes
  useEffect(() => {
    if (initialId) setTargetId(initialId);
  }, [initialId]);

  const REPORT_REASONS = [
    "Underage User",
    "Catfish / Fake Profile",
    "Solicitation / Escorting",
    "Harassment / Threats",
    "Non-Consensual Media",
    "Scam / Extortion"
  ];

  const handleSubmitReport = async () => {
    if (!reason || !targetId) {
      setError("Target Subject and Reason are required.");
      return;
    }
    
    setLoading(true);
    setError(null);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      const { error: dbError } = await supabase
        .from("reports")
        .insert({
          reporter_id: session?.user?.id || null, 
          target_id: targetId, // Now uses the state from the input box
          reason: reason,
          details: details || "No additional intel provided",
          status: "pending",
          severity: "high"
        });

      if (dbError) throw dbError;

      setSubmitted(true);
      setTimeout(() => router.back(), 2500);
    } catch (err: any) {
      console.error("Transmission Error:", err);
      setError(`${err.code === '22P02' ? 'Invalid ID Format' : err.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center space-y-6 py-20 animate-in fade-in zoom-in duration-500">
        <CheckCircle2 size={80} className="text-red-600 animate-bounce" />
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-black uppercase italic tracking-tighter text-white">Intel Received</h1>
          <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-[0.3em]">Shadow Admins notified</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {error && (
        <div className="bg-red-600/10 border border-red-600/50 p-4 rounded-2xl flex items-center gap-3">
          <AlertTriangle size={18} className="text-red-600 shrink-0" />
          <p className="text-[11px] text-red-500 font-bold uppercase tracking-tight">{error}</p>
        </div>
      )}

      {/* TARGET INPUT BOX */}
      <section className="space-y-2">
        <label className="text-[10px] font-black uppercase text-zinc-600 ml-1 tracking-[0.2em]">Target Subject (ID or Username)</label>
        <div className="relative group">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-red-600 transition-colors">
            <UserSearch size={18} />
          </div>
          <input 
            type="text"
            value={targetId}
            onChange={(e) => setTargetId(e.target.value)}
            placeholder="Enter User ID to report..."
            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm focus:border-red-600 focus:ring-1 focus:ring-red-600 outline-none transition-all text-white placeholder:text-zinc-700"
          />
        </div>
        {!initialId && (
          <p className="text-[9px] text-zinc-500 italic ml-1">* Manual entry enabled: No ID found in URL.</p>
        )}
      </section>

      {/* REASON SELECTION */}
      <section>
        <label className="text-[10px] font-black uppercase text-zinc-600 mb-4 block tracking-[0.2em] ml-1">Violation Protocol</label>
        <div className="grid grid-cols-1 gap-2">
          {REPORT_REASONS.map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setReason(r)}
              className={`p-4 rounded-2xl border text-left text-xs font-bold uppercase transition-all duration-300 ${
                reason === r 
                ? "bg-red-600 border-red-600 text-white shadow-[0_0_20px_rgba(220,38,38,0.2)]" 
                : "bg-white/5 border-white/5 text-zinc-500 hover:border-white/10"
              }`}
            >
              <div className="flex items-center justify-between">
                {r}
                {reason === r && <ShieldAlert size={14} className="animate-pulse" />}
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* ADDITIONAL INTEL */}
      <section>
        <label className="text-[10px] font-black uppercase text-zinc-600 mb-2 block tracking-[0.2em] ml-1">Additional Intel</label>
        <textarea
          value={details}
          onChange={(e) => setDetails(e.target.value)}
          placeholder="Describe the violation..."
          className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm focus:border-red-600 outline-none h-32 resize-none transition-all placeholder:text-zinc-700 text-white"
        />
      </section>

      <button
        onClick={handleSubmitReport}
        disabled={loading || !reason || !targetId}
        className="w-full py-5 bg-red-600 rounded-2xl font-black uppercase italic tracking-widest disabled:opacity-20 flex items-center justify-center gap-3 text-white transition-all active:scale-[0.98] shadow-lg shadow-red-600/10"
      >
        {loading ? <Loader2 className="animate-spin" size={20} /> : <ShieldAlert size={20} />}
        {loading ? "TRANSMITTING..." : "SUBMIT REPORT"}
      </button>
    </div>
  );
}

export default function ReportPage() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-[#050505] text-white p-6 pb-20 font-sans">
      <div className="max-w-md mx-auto">
        <header className="flex items-center justify-between mb-10">
          <button onClick={() => router.back()} className="p-2 bg-white/5 rounded-full border border-white/10 hover:bg-white/10 transition-colors">
            <ChevronLeft size={24} />
          </button>
          <div className="text-right">
            <h1 className="text-xl font-black uppercase italic tracking-tighter text-white">Report System</h1>
            <p className="text-[8px] font-bold text-red-600 uppercase tracking-widest">Protocol 7-B Engagement</p>
          </div>
        </header>

        <Suspense fallback={<div className="flex justify-center pt-10"><Loader2 className="animate-spin text-zinc-800" size={32} /></div>}>
          <ReportForm />
        </Suspense>
      </div>
    </main>
  );
}