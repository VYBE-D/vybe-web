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
        router.replace("auth/login");
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
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        Checking admin access…
      </div>
    );
  }

  return <>{children}</>;
}
