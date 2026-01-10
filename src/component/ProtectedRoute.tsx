"use client";

import { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../lib/supabase";

interface ProtectedRouteProps {
  children: ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        router.replace("/"); // redirect to signup/login
      } else {
        setLoading(false);
      }
    };

    checkSession();
  }, [router]);

  if (loading) return <div className="text-white min-h-screen flex justify-center items-center">Loading...</div>;

  return <>{children}</>;
}
