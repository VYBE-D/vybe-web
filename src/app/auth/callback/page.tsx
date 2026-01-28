"use client";

import { useEffect } from "react";
import { supabase } from "../../../lib/supabase";
import { useRouter } from "next/navigation";

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    const finishLogin = async () => {
      const { data } = await supabase.auth.getSession();

      if (data.session) {
        router.push("/home"); // or /pending
      }
    };

    finishLogin();
  }, []);

  return <p>Verifying your access…</p>;
}
