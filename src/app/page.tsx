"use client";

import { useRouter } from "next/navigation";
import { Shield, Flame, Sparkles, Zap, EyeOff, Lock, Ghost, ArrowRight, ChevronRight } from "lucide-react";

export default function LandingPage() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-[#050505] text-white selection:bg-red-500/30 overflow-x-hidden">
      
      {/* 🔮 Grainy Noise Overlay & Glows */}
      <div className="fixed inset-0 pointer-events-none z-50 opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[800px] h-[800px] bg-red-900/10 rounded-full blur-[180px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-zinc-900/20 rounded-full blur-[150px]" />
      </div>

      {/* 1️⃣ NAVIGATION */}
      <nav className="relative z-[60] flex items-center justify-between px-6 py-10 max-w-7xl mx-auto">
        <div className="group cursor-pointer">
          <div className="text-3xl font-black tracking-tighter italic uppercase leading-none">
            Vybe<span className="text-red-600">.</span>
          </div>
          <div className="h-[1px] w-0 group-hover:w-full bg-red-600 transition-all duration-500" />
        </div>
        
        <div className="flex items-center gap-8">
          <button 
            onClick={() => router.push("/auth/login")} 
            className="hidden md:block text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 hover:text-white transition"
          >
            Access Vault
          </button>
          <button 
            onClick={() => router.push("/auth/signup")}
            className="group relative bg-white text-black px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-[0.2em] transition-all hover:scale-105 active:scale-95"
          >
            Join Society
          </button>
        </div>
      </nav>

      {/* 2️⃣ HERO SECTION */}
      <section className="relative z-10 px-6 pt-20 pb-32 max-w-7xl mx-auto">
        <div className="flex flex-col items-center text-center">
            <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-zinc-900/50 border border-white/5 mb-10 backdrop-blur-md">
                <div className="w-1.5 h-1.5 rounded-full bg-red-600 animate-ping" />
                <span className="text-[9px] font-black uppercase tracking-[0.3em] text-zinc-400">System Status: Encrypted & Private</span>
            </div>

            <h1 className="text-[12vw] md:text-[9vw] font-black leading-[0.85] tracking-tighter uppercase italic mb-12">
                Chase Your <br />
                <span className="relative inline-block text-transparent bg-clip-text bg-gradient-to-b from-white via-zinc-400 to-zinc-800">
                    Fantasies.
                </span>
            </h1>

            <div className="max-w-2xl mb-16 relative">
                <p className="text-zinc-400 text-lg md:text-xl leading-relaxed font-medium italic">
                    "A beautifully diverse space for the scene—not spectators. 
                    Built for <span className="text-white underline decoration-red-600 underline-offset-8">those who practice</span>, not those who just watch."
                </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4 w-full max-w-xl">
                <button 
                    onClick={() => router.push("/auth/signup")}
                    className="w-full group bg-red-600 hover:bg-red-700 py-6 rounded-2xl flex items-center justify-center gap-3 transition-all duration-300 shadow-[0_0_40px_rgba(220,38,38,0.2)]"
                >
                    <span className="font-black text-lg uppercase italic tracking-wider">Start Exploring</span>
                    <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </button>
                <button 
                    onClick={() => router.push("/auth/login")}
                    className="w-full bg-zinc-900/50 border border-white/5 py-6 rounded-2xl font-black text-lg uppercase italic tracking-wider hover:bg-zinc-800 transition-all"
                >
                    Login
                </button>
            </div>
        </div>
      </section>

      {/* 3️⃣ THE CORE PROTOCOL (Bento Grid Redesign) */}
      <section className="relative z-10 px-6 max-w-7xl mx-auto pb-40">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 h-full">
            
            {/* Main Card */}
            <div className="md:col-span-8 p-10 rounded-[2.5rem] bg-zinc-900/30 border border-white/5 backdrop-blur-xl flex flex-col justify-between group hover:border-red-600/20 transition-all">
                <div>
                    <div className="bg-red-600/10 w-12 h-12 rounded-2xl flex items-center justify-center mb-8">
                        <Shield className="text-red-500" size={24} />
                    </div>
                    <h3 className="text-4xl font-black uppercase italic tracking-tighter mb-4">Privacy is our <br/> Only Religion</h3>
                    <p className="text-zinc-500 max-w-md font-medium leading-relaxed">
                        We don’t sell data. We don’t track habits. Your fantasies belong to you and stay on your device. Zero collection, zero compromise.
                    </p>
                </div>
                <div className="mt-12 flex items-center gap-2 text-zinc-500 group-hover:text-white transition-colors">
                    <span className="text-[10px] font-black uppercase tracking-[0.3em]">Read the Protocol</span>
                    <ChevronRight size={14} />
                </div>
            </div>

            {/* Small Side Card 1 */}
            <div className="md:col-span-4 p-10 rounded-[2.5rem] bg-zinc-900/30 border border-white/5 backdrop-blur-xl flex flex-col justify-between group hover:border-orange-600/20 transition-all">
                <Flame className="text-orange-500 mb-8" size={32} />
                <div>
                    <h3 className="text-xl font-black uppercase italic tracking-tighter mb-2">Not Dating</h3>
                    <p className="text-zinc-500 text-sm font-medium">No small talk. Find playmates, masters, and subs instantly.</p>
                </div>
            </div>

            {/* Small Side Card 2 */}
            <div className="md:col-span-4 p-10 rounded-[2.5rem] bg-white text-black flex flex-col justify-between group hover:scale-[1.02] transition-all">
                <Ghost size={32} />
                <div>
                    <h3 className="text-xl font-black uppercase italic tracking-tighter mb-2">Underground</h3>
                    <p className="text-zinc-800/60 text-sm font-bold">Workshops, private mixers, and secret parties near you.</p>
                </div>
            </div>

            {/* Wide Bottom Card */}
            <div className="md:col-span-8 p-10 rounded-[2.5rem] bg-zinc-900/30 border border-white/5 backdrop-blur-xl flex flex-col md:flex-row gap-8 items-center justify-between group hover:border-yellow-400/20 transition-all">
                <div className="max-w-xs text-center md:text-left">
                    <h3 className="text-2xl font-black uppercase italic tracking-tighter mb-2">The Real You</h3>
                    <p className="text-zinc-500 text-sm font-medium">Express your kinks without judgment in a community that speaks your language.</p>
                </div>
                <Zap size={60} className="text-yellow-400 opacity-20 group-hover:opacity-100 transition-opacity" />
            </div>

        </div>
      </section>

      {/* 4️⃣ CALL TO ACTION */}
      <section className="relative z-10 py-32 overflow-hidden">
        <div className="absolute inset-0 bg-red-600 opacity-[0.03] animate-pulse" />
        <div className="max-w-4xl mx-auto text-center px-6 relative">
            <h2 className="text-6xl md:text-8xl font-black mb-8 italic uppercase tracking-tightest leading-[0.8]">
                Own Your <br/> Desires<span className="text-red-600">.</span>
            </h2>
            <p className="text-zinc-500 max-w-lg mx-auto mb-12 text-sm md:text-lg font-medium leading-relaxed italic">
                Beyond polite society. Built in the shadows. <br/>Your sexual journey begins the moment you enter.
            </p>
            <button 
                onClick={() => router.push("/auth/signup")}
                className="group px-16 py-6 bg-white text-black rounded-full font-black uppercase tracking-[0.3em] hover:bg-zinc-200 transition-all shadow-[0_0_50px_rgba(255,255,255,0.1)] flex items-center justify-center gap-4 mx-auto"
            >
                Start Registration
                <ArrowRight size={18} />
            </button>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-20 border-t border-white/5 bg-black/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-10">
            <div className="text-xl font-black italic uppercase">Vybe</div>
            <p className="text-[10px] uppercase tracking-[0.6em] text-zinc-600 text-center">
                Beyond Polite Society, Built In The Shadow
            </p>
            <div className="flex gap-6">
                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-white cursor-pointer transition">Terms</span>
                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-white cursor-pointer transition">Privacy</span>
            </div>
        </div>
      </footer>
    </main>
  );
}