"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAdmin = async () => {
      const { data: auth } = await supabase.auth.getUser();

      if (!auth.user) {
        router.replace("/auth/login");
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", auth.user.id)
        .single();

      if (!profile || profile.role !== "admin") {
        router.replace("/home");
        return;
      }

      setLoading(false);
    };

    checkAdmin();
  }, []);

  if (loading) {
    return (
      <div className="vybe-route min-h-screen flex items-center justify-center" aria-busy="true">
        <div className="w-full max-w-md p-8 space-y-5 animate-pulse">
          <div className="h-10 w-48 rounded-2xl bg-white/70" />
          <div className="h-40 rounded-3xl bg-white/70" />
          <span className="sr-only">Checking admin access</span>
        </div>
      </div>
    );
  }

  return <div className="vybe-route vybe-admin-shell">{children}</div>;
}
