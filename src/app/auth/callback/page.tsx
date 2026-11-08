"use client";

import { useEffect } from "react";
import { supabase } from "../../../lib/supabase";
import { completeDeferredProfile } from "../../../lib/profile-onboarding";
import { useRouter } from "next/navigation";

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    const finishLogin = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        await completeDeferredProfile(data.session.user);
        router.push("/home");
      }
    };
    void finishLogin();
  }, [router]);

  return <main className="vybe-auth" aria-busy="true">
    <div className="vybe-auth__card text-center">
      <div className="font-black italic text-4xl tracking-tighter text-[#303135] mb-8">VYBE<span className="text-[#b94142]">.</span></div>
      <div className="space-y-4 animate-pulse" aria-hidden="true">
        <div className="h-8 rounded-xl bg-white/60 w-3/4 mx-auto"/>
        <div className="h-3 rounded-xl bg-white/60 w-1/2 mx-auto"/>
      </div>
      <p className="mt-8 text-xs uppercase font-black tracking-widest text-[#666870]">Verifying your access…</p>
    </div>
  </main>;
}
