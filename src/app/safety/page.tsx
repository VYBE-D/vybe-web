"use client";

import { useRouter } from "next/navigation";
import { ChevronLeft, ShieldAlert, EyeOff, UserSearch, Fingerprint, Lock, Siren } from "lucide-react";
import { motion } from "framer-motion";

const PROTOCOLS = [
  {
    icon: <Fingerprint className="text-red-600" />,
    title: "Vetting & Verification",
    desc: "Only connect with profiles that have completed the verification process. Look for the red checkmark badge next to their name."
  },
  {
    icon: <UserSearch className="text-red-600" />,
    title: "Reverse Recon",
    desc: "Use the 'View Public Vybe' to check their history. Only link with 'Verified' members or those with a successful link-up history in the network and to check their rating"
  },
  {
    icon: <EyeOff className="text-red-600" />,
    title: "Identity Protection",
    desc: "Keep your last name, workplace, and social media private. Use the in-app chat until you are physically meeting. Avoid sharing your main phone number."
  },
  {
    icon: <Lock className="text-red-600" />,
    title: "The 'Neutral Ground' Rule",
    desc: "For the first link, always meet at a hotel bar or neutral lounge. Never go straight to a private apartment or invite a stranger to your primary residence or we host."
  },
  {
    icon: <ShieldAlert className="text-red-600" />,
    title: "Financial Security",
    desc: "Never send transport fare or 'commitment' deposits upfront. Real members of this network do not ask for digital transfers before a physical meeting."
  }
];

export default function SafetyTipsPage() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-[#050505] text-white p-6 pb-24 font-sans">
      
      <div className="max-w-2xl mx-auto">
        {/* HEADER */}
        <header className="flex items-center justify-between mb-10">
          <button 
            onClick={() => router.back()} 
            className="p-2 bg-white/5 rounded-full border border-white/10"
          >
            <ChevronLeft size={24} />
          </button>
          <div className="text-right">
            <h1 className="text-[10px] font-black uppercase tracking-[0.4em] text-red-600">Level 4 Protocol</h1>
            <p className="text-lg font-black italic uppercase tracking-tighter">Field Security</p>
          </div>
        </header>

        {/* SECURITY ALERT BOX */}
        <div className="bg-zinc-900 border-l-4 border-red-600 p-6 mb-10">
          <div className="flex items-center gap-3 mb-2">
            <Siren size={20} className="text-red-600" />
            <h2 className="font-black uppercase italic text-sm">Anti-Extortion Warning</h2>
          </div>
          <p className="text-[11px] text-zinc-400 leading-relaxed font-bold uppercase tracking-tight">
            Be wary of anyone attempting to record the link-up or asking for sensitive personal details. 
            If you feel a setup is occurring, terminate the link immediately and report the profile to the Shadow Admins.
          </p>
        </div>

        {/* PROTOCOLS LIST */}
        <div className="space-y-4">
          {PROTOCOLS.map((item, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/5 border border-white/5 p-5 rounded-2xl flex gap-4 hover:border-red-600/30 transition-colors"
            >
              <div className="shrink-0">{item.icon}</div>
              <div>
                <h3 className="font-black italic uppercase tracking-tight text-white text-sm mb-1">{item.title}</h3>
                <p className="text-[11px] text-zinc-500 leading-normal font-medium">{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* LOG OUT BUTTON STYLE FOR EMERGENCY */}
        <div className="mt-12">
          <button 
            onClick={() => router.push('/report')}
            className="w-full py-4 bg-red-600/10 border border-red-600/40 rounded-2xl text-red-600 font-black italic uppercase tracking-widest text-xs hover:bg-red-600 hover:text-white transition-all"
          >
            Report a Suspicious Profile
          </button>
        </div>

        <p className="mt-12 text-[8px] text-center text-zinc-800 font-black uppercase tracking-[0.5em]">
          NO TRACE • NO DRAMA • STAY SECURE
        </p>
      </div>
    </main>
  );
}