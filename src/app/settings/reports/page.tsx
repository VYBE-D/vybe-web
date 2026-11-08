"use client";
import { useState, useEffect } from "react";
import { supabase } from "../../../lib/supabase";
import { useRouter } from "next/navigation";

export default function ReportHistory() {
  const [reports, setReports] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchReports = async () => {
      const { data: userData } = await supabase.auth.getUser();
      if (userData?.user) {
        const { data } = await supabase
          .from("reports")
          .select("*")
          .eq("reporter_id", userData.user.id)
          .order("created_at", { ascending: false });
        if (data) setReports(data);
      }
    };
    fetchReports();
  }, []);

  return (
    <main className="min-h-screen bg-black flex justify-center p-4">
      <div className="w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 text-white self-start">
        <button onClick={() => router.back()} className="text-sm text-gray-400 mb-4">← Back</button>
        <h1 className="text-xl font-bold mb-6">Report History</h1>
        <div className="space-y-3">
          {reports.length === 0 ? (
            <p className="text-gray-500 text-sm">No reports filed.</p>
          ) : (
            reports.map((r) => (
              <div key={r.id} className="p-4 bg-white/5 border border-white/10 rounded-2xl">
                <p className="text-sm font-medium">Status: {r.status || "Pending"}</p>
                <p className="text-xs text-gray-400">{new Date(r.created_at).toLocaleDateString()}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </main>
  );
}