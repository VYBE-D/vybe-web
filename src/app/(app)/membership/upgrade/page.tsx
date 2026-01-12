"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ChevronLeft, 
  ShieldCheck, 
  Zap, 
  Flame, 
  Crown, 
  Check, 
  Loader2,
  X,
  ArrowRight,
  ShieldAlert
} from "lucide-react";

const TIERS = [
  {
    id: "guest",
    name: "Guest",
    price: "FREE",
    features: [
      "Access Public Discovery",
      "Standard Signal Scan",
      "General Network Alerts",
      "3 Personnel Requests / Day",
    ],
    button: "Current Tier",
    active: true,
  },
  {
    id: "prime",
    name: "Prime",
    price: "From $5.99",
    features: [
      "Unlimited Personnel Requests",
      "Exclusive Event Intel",
      "Priority Booking Slots",
      "Advanced Personnel Filtering",
      "Stealth Browsing Protocol"
    ],
    options: [
      { id: "prime_monthly", label: "Monthly Protocol", price: "$5.99", period: "/ month" },
      { id: "prime_yearly", label: "Annual Protocol", price: "$59.99", period: "/ year" },
    ],
    button: "Select Protocol",
    active: false,
    hot: true,
  },
  {
    id: "vybe",
    name: "VYBE",
    price: "From $169.99",
    features: [
      "Everything in Prime",
      "The Backroom Access",
      "Direct Line Concierge",
      "Verified Handler Status",
      "Priority Talent Deployment"
    ],
    options: [
      { id: "vybe_yearly", label: "Annual Clearance", price: "$169.99", period: "/ year" },
      { id: "vybe_shadow", label: "Shadow (Lifetime)", price: "$299", period: "/ total", demand: true },
    ],
    button: "Gain Authority",
    active: false,
  }
];

export default function MembershipPage() {
  const router = useRouter();
  const [selectedMainTier, setSelectedMainTier] = useState<any | null>(null);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleFinalPayment = async (optionId: string, amount: string) => {
    setLoadingId(optionId);
    try {
      const response = await fetch("/api/payments/nowpayments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          amount: amount.replace('$', ''), 
          tierId: optionId 
        }),
      });
      const data = await response.json();
      if (data.invoice_url) {
        window.location.href = data.invoice_url;
      } else {
        console.error("Gateway Error:", data.error);
      }
    } catch (error) {
      console.error("Connection Error:", error);
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <main className="min-h-screen bg-black text-white p-6 pb-40 font-sans selection:bg-red-600/30">
      
      {/* HEADER */}
      <div className="flex items-center justify-between mb-10 max-w-md mx-auto">
        <button onClick={() => router.back()} className="p-3 bg-zinc-900/50 rounded-2xl border border-white/5 hover:border-red-600/50 transition-all group">
          <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
        </button>
        <div className="flex flex-col items-center">
            <h1 className="text-[10px] font-black italic uppercase tracking-[0.4em] text-red-600">Clearance</h1>
            <p className="text-[8px] text-zinc-600 font-bold uppercase tracking-[0.2em]">Network Authority</p>
        </div>
        <div className="w-10" />
      </div>

      {/* TITLE */}
      <div className="text-center mb-12">
        <h2 className="text-5xl font-black italic uppercase tracking-tighter mb-3">
          Level <span className="text-red-600">Up</span>
        </h2>
        <p className="text-[9px] text-zinc-500 font-bold uppercase tracking-[0.3em] max-w-[220px] mx-auto leading-relaxed">
          Establish higher authority within the archives
        </p>
      </div>

      {/* TIERS LIST */}
      <div className="flex flex-col gap-8 max-w-md mx-auto">
        {TIERS.map((tier) => (
          <div
            key={tier.id}
            className={`relative flex flex-col p-8 rounded-[3.5rem] border-2 transition-all duration-500 ${
              tier.hot 
                ? 'bg-zinc-900/40 border-red-600 shadow-[0_0_40px_rgba(220,38,38,0.1)]' 
                : 'bg-zinc-900/20 border-white/5'
            }`}
          >
            {tier.hot && (
              <div className="absolute top-6 right-8 bg-red-600 text-white text-[7px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-full animate-pulse">
                High Demand
              </div>
            )}

            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className={`text-3xl font-black italic uppercase tracking-tighter ${tier.hot ? 'text-red-600' : 'text-white'}`}>
                  {tier.name}
                </h3>
                <span className="text-xl font-black italic text-zinc-500">{tier.price}</span>
              </div>
              <div className={`p-4 rounded-3xl bg-black/50 border border-white/5 ${tier.hot ? 'text-red-600' : 'text-zinc-700'}`}>
                {tier.id === "guest" && <Zap size={22} />}
                {tier.id === "prime" && <Flame size={22} />}
                {tier.id === "vybe" && <Crown size={22} />}
              </div>
            </div>

            {/* FEATURES LIST */}
            <div className="flex flex-col gap-4 mb-10 mt-6">
              {tier.features.map((feat) => (
                <div key={feat} className="flex items-start gap-4">
                  <Check size={14} className={`mt-0.5 shrink-0 ${tier.hot ? 'text-red-600' : 'text-zinc-500'}`} />
                  <span className="text-[10px] font-black uppercase tracking-widest text-zinc-300 leading-tight">
                    {feat}
                  </span>
                </div>
              ))}
            </div>

            <button 
              onClick={() => !tier.active && setSelectedMainTier(tier)}
              disabled={tier.active}
              className={`w-full py-5 rounded-[2rem] font-black italic uppercase tracking-[0.3em] text-[10px] transition-all active:scale-95 ${
                tier.active 
                  ? 'bg-zinc-800/50 text-zinc-600 border border-white/5 cursor-default' 
                  : 'bg-white text-black hover:bg-red-600 hover:text-white'
              }`}
            >
              {tier.button}
            </button>
          </div>
        ))}
      </div>

      {/* PROTOCOL SELECTION DRAWER */}
      <AnimatePresence>
        {selectedMainTier && (
          <div className="fixed inset-0 z-[100] flex items-end justify-center">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setSelectedMainTier(null)}
              className="absolute inset-0 bg-black/95 backdrop-blur-md"
            />
            <motion.div 
              initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="relative w-full max-w-md bg-zinc-900 border-t border-white/10 rounded-t-[3.5rem] p-8 pb-16 shadow-2xl"
            >
              <div className="w-12 h-1 bg-zinc-800 rounded-full mx-auto mb-8" />
              <button onClick={() => setSelectedMainTier(null)} className="absolute top-8 right-8 text-zinc-500 hover:text-white">
                <X size={20}/>
              </button>

              <div className="mb-8 text-center px-4">
                 <ShieldAlert size={24} className="text-red-600 mx-auto mb-3 animate-pulse" />
                 <h3 className="text-xl font-black italic uppercase tracking-tighter text-white">
                   {selectedMainTier.name} Protocol Clearance
                 </h3>
                 <p className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest mt-2">Select operational timeframe</p>
              </div>

              <div className="space-y-4">
                {selectedMainTier.options?.map((opt: any) => (
                  <button 
                    key={opt.id}
                    onClick={() => handleFinalPayment(opt.id, opt.price)}
                    disabled={loadingId !== null}
                    className={`w-full bg-black/60 p-6 rounded-[2.5rem] border flex items-center justify-between group transition-all active:scale-95 ${
                      opt.demand ? 'border-red-600 shadow-[0_0_20px_rgba(220,38,38,0.15)]' : 'border-white/5'
                    }`}
                  >
                    <div className="text-left">
                      <div className="flex items-center gap-2">
                        <p className={`text-[9px] font-black uppercase tracking-[0.2em] mb-1 ${opt.demand ? 'text-red-600' : 'text-zinc-500'}`}>
                          {opt.label}
                        </p>
                        {opt.demand && (
                          <span className="bg-red-600 text-[6px] text-white px-2 py-0.5 rounded-full animate-pulse tracking-normal">HIGH DEMAND</span>
                        )}
                      </div>
                      <div className="flex items-baseline gap-1">
                        <span className="text-2xl font-black italic">{opt.price}</span>
                        <span className="text-[8px] text-zinc-600 font-bold uppercase tracking-tighter">{opt.period}</span>
                      </div>
                    </div>
                    
                    {loadingId === opt.id ? (
                      <Loader2 className="animate-spin text-red-600" size={24}/>
                    ) : (
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${opt.demand ? 'bg-red-600 text-white' : 'bg-zinc-900 text-zinc-600 border border-white/5 group-hover:bg-white group-hover:text-black'}`}>
                         <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                      </div>
                    )}
                  </button>
                ))}
              </div>

              <p className="mt-8 text-[8px] text-zinc-700 text-center font-black uppercase tracking-[0.4em]">
                Secure Encryption Active • No Identity Trace
              </p>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="mt-16 text-center space-y-6 opacity-20">
        <ShieldCheck size={24} className="mx-auto" />
        <p className="text-[8px] font-black uppercase tracking-[0.6em] max-w-[250px] mx-auto leading-loose">
          Encrypted Database • Private Protocol • Anonymous Archives
        </p>
      </div>
    </main>
  );
}