"use client";

import { useRouter } from "next/navigation";
import { Shield, Flame, Sparkles, Zap, EyeOff, Lock, Ghost } from "lucide-react";

export default function LandingPage() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-black text-white selection:bg-red-500/30">
      
      {/* 🔮 Background Glow */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-5%], right-[-10%] w-[600px] h-[600px] bg-red-900/10 rounded-full blur-[150px]" />
        <div className="absolute bottom-[5%] left-[-10%] w-[500px] h-[500px] bg-purple-900/15 rounded-full blur-[150px]" />
      </div>

      {/* 1️⃣ NAVIGATION */}
      <nav className="relative z-20 flex items-center justify-between px-8 py-8 max-w-7xl mx-auto">
        <div className="text-2xl font-black tracking-tighter italic uppercase">Vybe</div>
        <div className="flex items-center gap-6">
          <button onClick={() => router.push("/auth/login")} className="text-xs font-bold uppercase tracking-widest text-gray-500 hover:text-white transition">Log In</button>
          <button 
            onClick={() => router.push("/auth/signup")}
            className="bg-red-600 hover:bg-red-700 px-8 py-2.5 rounded-full text-xs font-extrabold uppercase tracking-widest transition shadow-lg shadow-red-900/40"
          >
            Enter Vybe
          </button>
        </div>
      </nav>

      {/* 2️⃣ HERO SECTION */}
      <section className="relative z-10 px-6 pt-16 pb-24 max-w-5xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8">
          <Lock size={12} className="text-red-500" />
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">Discrete & Verified Community</span>
        </div>

        <h1 className="text-5xl md:text-8xl font-black leading-[0.9] mb-8 tracking-tighter uppercase italic">
          Chase Your <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 via-pink-600 to-red-600">
            Fantasies.
          </span>
        </h1>
        
        <p className="text-gray-300 text-lg md:text-2xl mb-12 max-w-3xl mx-auto leading-relaxed font-medium">
          No endless swiping. No vanilla small talk. Just a beautifully diverse space for 
          <span className="text-white underline decoration-red-600 decoration-2 underline-offset-4 ml-1">kink and fetish exploration</span>. 
          Help people feel comfortable with their deepest desires.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
          <button 
            onClick={() => router.push("/auth/signup")}
            className="w-full sm:w-72 py-5 bg-white text-black rounded-2xl font-black text-xl hover:scale-105 transition-all shadow-2xl uppercase italic"
          >
            Start Exploring
          </button>
          <button 
            onClick={() => router.push("/auth/login")}
            className="w-full sm:w-72 py-5 bg-white/5 border border-white/10 backdrop-blur-xl rounded-2xl font-black text-xl hover:bg-white/10 transition-all uppercase italic"
          >
            Access Vault
          </button>
        </div>

        <div className="mt-16 flex flex-col items-center gap-1 opacity-50">
          <span className="text-3xl font-black tracking-tighter italic">1,240,520</span>
          <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-red-500">Exploring Their Kinks Today</span>
        </div>
      </section>

      {/* 3️⃣ THE CORE VALUES SECTION */}
      <section className="relative z-10 px-6 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pb-32">
        <ValueCard 
          icon={<EyeOff className="text-red-500" />} 
          title="Privacy First" 
          desc="We don't sell your data. Your fantasies belong to you and no one else." 
        />
        <ValueCard 
          icon={<Flame className="text-orange-500" />} 
          title="Not a Dating App" 
          desc="This isn't for casual dating. It's a place to find play partners, masters, and subs." 
        />
        <ValueCard 
          icon={<Ghost className="text-purple-500" />} 
          title="Underground Events" 
          desc="Discover the best workshops, social mixers, and private parties near you." 
        />
        <ValueCard 
          icon={<Zap className="text-yellow-400" />} 
          title="Authentic Self" 
          desc="Express your kinks without judgment in a community that understands you." 
        />
      </section>

      {/* 4️⃣ CALL TO ACTION */}
      <section className="relative z-10 py-20 bg-white/5 border-y border-white/10 backdrop-blur-sm text-center">
        <h2 className="text-3xl md:text-5xl font-black mb-6 italic uppercase tracking-tighter italic">Own Your Desires.</h2>
        <p className="text-gray-400 max-w-xl mx-auto mb-10 text-sm md:text-base px-4 font-medium">
          Thousands of members have found their perfect play partners on Vybe. 
          Your sexual journey starts here.
        </p>
        <button 
          onClick={() => router.push("/auth/signup")}
          className="px-12 py-4 bg-red-600 rounded-full font-black uppercase tracking-widest hover:bg-red-500 transition shadow-lg shadow-red-600/30"
        >
          Join The Underground
        </button>
      </section>

      <footer className="py-12 text-center opacity-30">
        <p className="text-[10px] uppercase tracking-[0.8em]">By Kinksters, For Kinksters</p>
      </footer>
    </main>
  );
}

function ValueCard({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <div className="p-8 rounded-[2rem] border border-white/10 bg-white/5 backdrop-blur-md hover:bg-white/10 transition-all">
      <div className="mb-6">{icon}</div>
      <h3 className="text-lg font-bold mb-3 uppercase tracking-tight italic">{title}</h3>
      <p className="text-gray-400 text-sm leading-relaxed font-medium">{desc}</p>
    </div>
  );
}