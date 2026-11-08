"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "../../../lib/supabase";
import { completeDeferredProfile } from "../../../lib/profile-onboarding";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      if (data.user) await completeDeferredProfile(data.user);
      router.replace("/home");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Unable to sign in.");
    } finally {
      setLoading(false);
    }
  };

  return <main className="vybe-auth">
    <div className="vybe-auth__card">
      <Link href="/" className="inline-block mb-10 font-black italic text-3xl tracking-tighter text-[#232427]" aria-label="VYBE homepage">VYBE<span className="text-[#b94142]">.</span></Link>
      <div className="mb-9">
        <p className="text-[10px] uppercase tracking-[.23em] font-black text-[#74767c] mb-3">Your space awaits</p>
        <h1 className="text-5xl font-black uppercase tracking-tighter leading-none text-[#34353a]">Welcome<br/>back.</h1>
        <p className="text-[#666870] text-sm mt-5 leading-relaxed">Sign in to continue your VYBE experience.</p>
      </div>
      <form onSubmit={handleLogin} className="space-y-5">
        {error && <p role="alert" className="rounded-xl bg-[#b94142]/10 border border-[#b94142]/30 p-3 text-sm text-[#933436]">{error}</p>}
        <div><label htmlFor="vybe-email" className="block text-xs font-bold uppercase tracking-widest mb-3">Email address</label><input id="vybe-email" type="email" autoComplete="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com" required /></div>
        <div><label htmlFor="vybe-password" className="block text-xs font-bold uppercase tracking-widest mb-3">Password</label><input id="vybe-password" type="password" autoComplete="current-password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Enter your password" required /></div>
        <button type="submit" disabled={loading} aria-busy={loading}>{loading?"Signing in…":"Enter VYBE"}</button>
      </form>
      <p className="text-center text-sm text-[#686a71] mt-9">New here? <Link className="font-black text-[#232427] underline underline-offset-4" href="/auth/signup">Create an account</Link></p>
      <p className="text-center mt-8 text-xs"><Link href="/privacy" className="text-[#777981] hover:underline">Privacy</Link> <span className="mx-3 text-[#aaa]">·</span><Link href="/safety" className="text-[#777981] hover:underline">Safety</Link></p>
    </div>
  </main>;
}
