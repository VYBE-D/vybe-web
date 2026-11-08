"use client";

import { useRouter } from "next/navigation";
import { ChevronLeft, ShieldCheck, EyeOff, Trash2, Lock, Fingerprint, Database, Share2 } from "lucide-react";

export default function PrivacyPolicyPage() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-[#050505] text-white p-6 pb-24 font-sans">
      <div className="max-w-3xl mx-auto">
        
        {/* HEADER */}
        <header className="flex items-center justify-between mb-12 sticky top-0 bg-[#050505]/90 backdrop-blur-md py-4 z-50 border-b border-white/5">
          <button onClick={() => router.back()} className="p-2 bg-white/5 rounded-full border border-white/10 hover:bg-red-600/20 transition-colors">
            <ChevronLeft size={24} />
          </button>
          <div className="text-center">
            <h1 className="text-xl font-black italic uppercase tracking-tighter">Privacy Protocol</h1>
            <p className="text-[8px] text-zinc-500 font-bold uppercase tracking-[0.4em]">Operational Security: 2026.1</p>
          </div>
          <div className="w-10" />
        </header>

        <div className="space-y-12 text-zinc-400 text-sm leading-relaxed pb-32">
          
          {/* INTRODUCTION */}
          <section className="space-y-4">
            <h2 className="text-3xl font-black italic text-white uppercase tracking-tighter">Your Data. Your Discretion.</h2>
            <p className="text-zinc-300 text-base">
              At Vybe, privacy isn't a feature—it is our core infrastructure. We understand the sensitive nature of intimacy and alternative lifestyles. This Privacy Protocol outlines how we minimize your digital footprint while providing a secure network.
            </p>
          </section>

          {/* TABLE OF CONTENTS */}
          <section className="bg-white/5 border border-white/10 p-6 rounded-3xl">
            <h3 className="text-white font-bold uppercase tracking-widest text-[10px] mb-4">Core Privacy Pillars</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[11px] font-bold uppercase tracking-tighter text-zinc-500">
              <div className="flex items-center gap-2"><Fingerprint size={14} className="text-red-600"/> Data Collection</div>
              <div className="flex items-center gap-2"><EyeOff size={14} className="text-red-600"/> Zero-Tracking Policy</div>
              <div className="flex items-center gap-2"><Lock size={14} className="text-red-600"/> Encryption Standards</div>
              <div className="flex items-center gap-2"><Share2 size={14} className="text-red-600"/> Third-Party Disclosure</div>
              <div className="flex items-center gap-2"><Trash2 size={14} className="text-red-600"/> Data Retention & Deletion</div>
              <div className="flex items-center gap-2"><Database size={14} className="text-red-600"/> Regional Compliance</div>
            </div>
          </section>

          {/* 1. DATA COLLECTION */}
          <section className="space-y-4">
            <h3 className="text-white font-black uppercase italic tracking-widest text-sm flex items-center gap-3">
              <span className="text-red-600 text-2xl">01</span> Information We Collect
            </h3>
            <p>We collect only the minimum intel required to maintain your account and ensure safety:</p>
            <ul className="space-y-2 list-disc list-inside text-zinc-500 pl-2">
              <li><strong className="text-zinc-300">Account Intel:</strong> Valid email and age verification data.</li>
              <li><strong className="text-zinc-300">Profile Content:</strong> Photos, bios, and preferences you voluntarily provide.</li>
              <li><strong className="text-zinc-300">Real-Time Data:</strong> Geolocation (only while app is active) to show nearby links.</li>
              <li><strong className="text-zinc-300">Communication:</strong> Encrypted in-app messages to facilitate link-ups.</li>
            </ul>
          </section>

          {/* 2. HOW WE USE DATA */}
          <section className="space-y-4 border-l-2 border-red-600 pl-6">
            <h3 className="text-white font-black uppercase italic tracking-widest text-sm flex items-center gap-3">
              <span className="text-red-600 text-2xl">02</span> Usage of Intel
            </h3>
            <p>Your data is used strictly to power the Vybe ecosystem:</p>
            <ul className="space-y-2 text-xs uppercase font-bold tracking-tight">
              <li>• To facilitate consensual matches and link-ups.</li>
              <li>• To detect and ban bots, scammers, and bad actors.</li>
              <li>• To process secure, anonymous payments for premium features.</li>
              <li>• To improve the technical stability of the network.</li>
            </ul>
          </section>

          {/* 3. ENCRYPTION & SECURITY */}
          <section className="space-y-4 bg-zinc-900/50 p-8 rounded-3xl border border-white/5">
            <div className="flex items-center gap-2 mb-2">
              <Lock size={18} className="text-red-600" />
              <h3 className="text-white font-black uppercase italic tracking-widest text-sm">Encryption Standards</h3>
            </div>
            <p>
              All communications on Vybe are encrypted in transit. We utilize industry-standard TLS (Transport Layer Security) to prevent interception. Our databases are partitioned so that personal identifiers are separated from behavioral data.
            </p>
            <div className="bg-red-950/20 border border-red-900/50 p-4 rounded-xl">
               <p className="text-red-500 font-black uppercase text-[10px] tracking-widest leading-tight italic text-center">
                SHADOW ADMINS DO NOT HAVE ACCESS TO YOUR RAW PASSWORDS. 
              </p>
            </div>
          </section>

          {/* 4. NO THIRD-PARTY SALES */}
          <section className="space-y-4">
            <h3 className="text-white font-black uppercase italic tracking-widest text-sm flex items-center gap-3">
              <span className="text-red-600 text-2xl">04</span> Third-Party Disclosure
            </h3>
            <p className="text-white font-bold italic">We do not sell, rent, or trade your personal data to advertisers or data brokers.</p>
            <p>
              Information is only shared with third-party providers who assist in operating the Service (e.g., payment processors or cloud storage). These providers are contractually bound to the same discretion levels as Vybe.
            </p>
          </section>

          {/* 5. DATA RETENTION & DELETION */}
          <section className="space-y-4">
            <h3 className="text-white font-black uppercase italic tracking-widest text-sm flex items-center gap-3">
              <span className="text-red-600 text-2xl">05</span> Right to Erasure
            </h3>
            <p>
              In our network, "Gone means Gone." When you delete your account, we initiate an immediate purging process of your profile and media content. 
            </p>
            <p className="text-xs">
              Note: Certain logs may be retained for up to 30 days for safety auditing (to prevent banned users from returning) or as required by law for financial record keeping.
            </p>
          </section>

          {/* 6. COOKIES & TRACKING */}
          <section className="space-y-4">
            <h3 className="text-white font-black uppercase italic tracking-widest text-sm flex items-center gap-3">
              <span className="text-red-600 text-2xl">06</span> Cookies & Device Data
            </h3>
            <p>
              We use session cookies to keep you logged in. We do not use cross-site tracking or pixels (like Meta or Google pixels) to track your activity outside of the Vybe application.
            </p>
          </section>

          {/* 7. CONTACT & COMPLIANCE */}
          <section className="space-y-4 border-t border-white/5 pt-10">
            <h3 className="text-white font-black uppercase italic tracking-widest text-sm">Compliance & Contact</h3>
            <p>
              Vybe complies with international privacy frameworks (including GDPR where applicable). If you have questions regarding your data or wish to file a formal request for information, contact our privacy officer via the in-app support portal.
            </p>
          </section>

          {/* FINAL STAMP */}
          <footer className="pt-20 text-center space-y-6">
            <div className="flex justify-center gap-4">
              <ShieldCheck size={30} className="text-zinc-800" />
              <EyeOff size={30} className="text-zinc-800" />
            </div>
            <p className="text-[10px] font-black uppercase tracking-[0.6em] text-zinc-600">
              Discretion is Absolute
            </p>
            <p className="text-[11px] font-black text-red-600 uppercase tracking-widest italic">
              © vybe — All Rights Reserved • 2026
            </p>
          </footer>

        </div>
      </div>
    </main>
  );
}