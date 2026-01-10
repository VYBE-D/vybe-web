"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ChevronLeft, ShieldCheck, Zap, Flame, Crown, Check } from "lucide-react";

const TIERS = [
  {
    name: "Standard",
    price: "FREE",
    features: ["Basic Matching", "3 Vybes / Day", "Standard Privacy"],
    color: "zinc-500",
    button: "Current Plan",
    active: true
  },
  {
    name: "Elite",
    price: "$19/mo",
    features: ["Unlimited Vybes", "Priority Shadowing", "See Who Viewed You", "Incognito Mode"],
    color: "red-600",
    button: "Go Elite",
    active: false,
    hot: true
  },
  {
    name: "VVIP",
    price: "$49/mo",
    features: ["Everything in Elite", "Global Movement", "Verified Badge", "24/7 Concierge"],
    color: "fuchsia-600",
    button: "Unlock All",
    active: false
  }
];

export default function MembershipPage() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-[#050505] text-white p-6 pb-20">
      
      {/* HEADER */}
      <div className="flex items-center justify-between mb-10">
        <button onClick={() => router.back()} className="p-2 bg-white/5 rounded-full border border-white/10 hover:bg-red-600/20 transition-colors">
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-xs font-black italic uppercase tracking-[0.4em]">Membership</h1>
        <div className="w-10" />
      </div>

      {/* TITLE AREA */}
      <div className="text-center mb-12">
        <h2 className="text-4xl font-black italic uppercase tracking-tighter mb-2">
          Level <span className="text-red-600">Up</span>
        </h2>
        <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-[0.2em]">
          Access the full underground network
        </p>
      </div>

      {/* TIERS STACK */}
      <div className="space-y-6">
        {TIERS.map((tier, index) => (
          <motion.div
            key={tier.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`relative group p-6 rounded-3xl border-2 transition-all duration-500 ${
              tier.hot 
                ? 'bg-red-600/5 border-red-600 shadow-[0_0_30px_rgba(220,38,38,0.15)]' 
                : 'bg-white/5 border-white/10'
            }`}
          >
            {tier.hot && (
              <div className="absolute -top-3 right-6 bg-red-600 text-white text-[8px] font-black uppercase tracking-widest px-3 py-1 rounded-full">
                Most Viral
              </div>
            )}

            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className={`text-2xl font-black italic uppercase tracking-tight ${tier.hot ? 'text-red-600' : 'text-white'}`}>
                  {tier.name}
                </h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-xl font-black italic">{tier.price}</span>
                  {tier.price !== "FREE" && <span className="text-[10px] text-zinc-500 font-bold">/MONTH</span>}
                </div>
              </div>
              <div className={`p-3 rounded-2xl bg-white/5 ${tier.hot ? 'text-red-600' : 'text-zinc-600'}`}>
                {tier.name === "Standard" && <Zap size={24} />}
                {tier.name === "Elite" && <Flame size={24} />}
                {tier.name === "VVIP" && <Crown size={24} />}
              </div>
            </div>

            <ul className="space-y-3 mb-8">
              {tier.features.map((feat) => (
                <li key={feat} className="flex items-center gap-3">
                  <Check size={14} className={tier.hot ? 'text-red-600' : 'text-zinc-600'} />
                  <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-300">{feat}</span>
                </li>
              ))}
            </ul>

            <button 
              disabled={tier.active}
              className={`w-full py-4 rounded-2xl font-black italic uppercase tracking-widest text-xs transition-all active:scale-95 ${
                tier.active 
                  ? 'bg-zinc-800 text-zinc-500 border border-white/5 cursor-default' 
                  : tier.hot
                    ? 'bg-red-600 text-white shadow-lg'
                    : 'bg-white text-black hover:bg-red-600 hover:text-white'
              }`}
            >
              {tier.button}
            </button>
          </motion.div>
        ))}
      </div>

      {/* SAFETY BADGE */}
      <div className="mt-12 flex flex-col items-center gap-2 opacity-30">
        <ShieldCheck size={20} />
        <span className="text-[8px] font-black uppercase tracking-[0.5em]">Secure Payments • Discreet Billing</span>
      </div>

    </main>
  );
}