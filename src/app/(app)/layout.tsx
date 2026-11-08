"use client";

import { ReactNode, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useRouter } from "next/navigation";
import BottomNav from "../../component/BottomNav";

export default function AppLayout({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) router.replace("/auth/login");
  }, [user, loading, router]);

  if (loading) {
    return <div className="vybe-shell" aria-busy="true" aria-label="Loading your VYBE experience">
      <div className="mx-auto max-w-5xl px-5 py-12 animate-pulse">
        <div className="h-10 w-40 rounded-2xl bg-white/60 mb-10" />
        <div className="h-44 rounded-3xl bg-white/50 mb-6" />
        <div className="grid gap-5 grid-cols-2"><div className="h-48 rounded-3xl bg-white/50"/><div className="h-48 rounded-3xl bg-white/50"/></div>
      </div>
    </div>;
  }

  if (!user) return null;

  return <div className="vybe-shell">{children}<BottomNav /></div>;
}
