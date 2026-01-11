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
  CreditCard, 
  Bitcoin, 
  X, 
  ArrowRight,
  ShieldAlert
} from "lucide-react";

const TIERS = [
  {
    id: "guest",
    name: "Guest",
    price: "FREE",
    description: "Basic entry into the Vybe Network archives.",
    features: [
      "Access Public Discovery",
      "Standard Signal Scan",
      "General Network Alerts",
      "3 Personnel Requests / Day",
    ],
    button: "Current Tier",
    active: true,
    color: "zinc-500"
  },
  {
    id: "prime",
    name: "Prime",
    price: "$19",
    description: "Enhanced operational capacity for active handlers.",
    features: [
      "Unlimited Personnel Requests",
      "Exclusive Event Intel",
      "Priority Booking Slots",
      "Advanced Personnel Filtering",
      "Stealth Browsing Protocol"
    ],
    button: "Upgrade Signal",
    active: false,
    hot: true,
    color: "red-600"
  },
  {
    id: "vybe",
    name: "VYBE",
    price: "$49",
    description: "Maximum clearance. Full access to the Backroom archives.",
    features: [
      "Everything in Prime",
      "The Backroom Access",
      "Direct Line Concierge",
      "Verified Handler Status",
      "Priority Talent Deployment"
    ],
    button: "Full Authority",
    active: false,
    color: "white"
  }
];

export default function MembershipPage() {
  const router = useRouter();
  const [selectedTier, setSelectedTier] = useState<typeof TIERS[0] | null>(null);

  const handlePaymentRedirect = (method: 'crypto' | 'stripe') => {
    // Replace these URLs with your actual Stripe Payment Links or Crypto Gateway links
    const paymentLinks: any = {
      prime: {
        stripe: "https://buy.stripe.com/your_prime_link",
        crypto: "https://nowpayments.io/payment?id=your_prime_id"
      },
      vybe: {
        stripe: "https://buy.stripe.com/your_vybe_link",
        crypto: "https://nowpayments.io/payment?id=your_vybe_id"
      }
    };

    if (selectedTier) {
      const targetUrl = paymentLinks[selectedTier.id][method];
      window.location.href = targetUrl;
    }
  };

  return (
    <main className="min-h-screen bg-[#050505] text-white p-6 pb-24 font-sans selection:bg-red-600/30">
      
      {/* HEADER */}
      <div className="flex items-center justify-between mb-10">
        <button onClick={() => router.back()} className="p-3 bg-zinc-900/50 rounded-2xl border border-white/5 hover:border-red-600/50 transition-all group">
          <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
        </button>
        <div className="flex flex-col items-center text-center">
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
      <div className="space-y-6 max-w-md mx-auto">
        {TIERS.map((tier, index) => (
          <motion.div
            key={tier.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`relative p-8 rounded-[3rem] border-2 transition-all duration-500 ${
              tier.hot 
                ? 'bg-zinc-900/40 border-red-600 shadow-[0_0_40px_rgba(220,38,38,0.1)]' 
                : tier.name === "VYBE"
                  ? 'bg-gradient-to-br from-zinc-900 to-black border-white/20'
                  : 'bg-zinc-900/20 border-white/5'
            }`}
          >
            {tier.hot && (
              <div className="absolute top-6 right-8 bg-red-600 text-white text-[7px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-full animate-pulse">
                High Demand
              </div>
            )}

            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className={`text-3xl font-black italic uppercase tracking-tighter ${tier.hot ? 'text-red-600' : 'text-white'}`}>
                  {tier.name}
                </h3>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-2xl font-black italic">{tier.price}</span>
                  {tier.price !== "FREE" && <span className="text-[8px] text-zinc-600 font-bold">/PERIOD</span>}
                </div>
              </div>
              <div className={`p-4 rounded-3xl bg-black/50 border border-white/5 ${tier.hot ? 'text-red-600' : 'text-zinc-700'}`}>
                {tier.name === "Guest" && <Zap size={22} />}
                {tier.name === "Prime" && <Flame size={22} />}
                {tier.name === "VYBE" && <Crown size={22} />}
              </div>
            </div>

            <ul className="space-y-4 mb-10 mt-6">
              {tier.features.map((feat) => (
                <li key={feat} className="flex items-center gap-4">
                  <Check size={12} className={tier.hot ? 'text-red-600' : 'text-zinc-500'} />
                  <span className="text-[10px] font-black uppercase tracking-widest text-zinc-300">{feat}</span>
                </li>
              ))}
            </ul>

            <button 
              onClick={() => !tier.active && setSelectedTier(tier)}
              disabled={tier.active}
              className={`w-full py-5 rounded-[2rem] font-black italic uppercase tracking-[0.3em] text-[10px] transition-all active:scale-95 ${
                tier.active 
                  ? 'bg-zinc-800/50 text-zinc-600 border border-white/5 cursor-default' 
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

      {/* PAYMENT MODAL */}
      <AnimatePresence>
        {selectedTier && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setSelectedTier(null)}
              className="absolute inset-0 bg-black/90 backdrop-blur-md"
            />
            
            <motion.div 
              initial={{ y: "100%" }} 
              animate={{ y: 0 }} 
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="relative w-full max-w-sm bg-zinc-900 border border-white/10 rounded-[3.5rem] p-8 shadow-2xl overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-red-600 to-transparent opacity-50" />
              
              <button onClick={() => setSelectedTier(null)} className="absolute top-6 right-8 text-zinc-500 hover:text-white">
                <X size={20} />
              </button>

              <div className="text-center mb-8">
                <ShieldAlert size={32} className="mx-auto text-red-600 mb-4 animate-pulse" />
                <h3 className="text-xl font-black italic uppercase tracking-tighter text-white">Select Protocol</h3>
                <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-2">
                  Level: {selectedTier.name} • {selectedTier.price}
                </p>
              </div>

              <div className="space-y-4">
                {/* STRIPE / CARD */}
                <button 
                  onClick={() => handlePaymentRedirect('stripe')}
                  className="w-full bg-white text-black py-5 rounded-2xl flex items-center justify-between px-6 hover:scale-[1.02] transition-all group"
                >
                  <div className="flex items-center gap-4">
                    <CreditCard size={20} />
                    <span className="text-[10px] font-black uppercase tracking-widest">Card / PayPal</span>
                  </div>
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </button>

                {/* CRYPTO */}
                <button 
                  onClick={() => handlePaymentRedirect('crypto')}
                  className="w-full bg-zinc-800 text-white py-5 rounded-2xl flex items-center justify-between px-6 border border-white/5 hover:border-orange-500/50 hover:scale-[1.02] transition-all group"
                >
                  <div className="flex items-center gap-4">
                    <Bitcoin size={20} className="text-orange-500" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Crypto Gateway</span>
                  </div>
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

              <p className="mt-8 text-[8px] text-zinc-600 text-center font-black uppercase tracking-[0.3em] leading-loose">
                Secure 256-bit encryption active <br/> Anonymous Billing Protocol enabled
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