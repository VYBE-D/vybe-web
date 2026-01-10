"use client";

import { useState, useEffect } from "react";
import { supabase } from "../../../lib/supabase";
import HomeGrid from "../../../component/HomeGrid";

export default function HomePage() {
  const [girls, setGirls] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchGirls() {
      try {
        // Updated to fetch from 'discovery' table
        const { data, error } = await supabase
          .from("discovery")
          .select("*")
          .order("created_at", { ascending: false });
          
        if (error) throw error;
        if (data) setGirls(data);
      } catch (err) {
        console.error("Failed to fetch discovery feed:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchGirls();
  }, []);

  if (loading)
    return (
      <div className="bg-black min-h-screen flex justify-center items-center">
        <div className="text-red-600 font-black italic animate-pulse tracking-[0.3em] uppercase">
          Scanning Archives...
        </div>
      </div>
    );

  return (
    <main className="bg-black min-h-screen text-white p-4 pb-24">
      <header className="py-8 text-center">
        <h1 className="text-3xl font-black italic uppercase tracking-tighter">Discovery</h1>
        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.4em] mt-1">Available Talent</p>
      </header>

      {girls.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 border border-dashed border-white/10 rounded-[3rem]">
          <p className="text-gray-600 font-bold uppercase text-[10px] tracking-widest">No profiles active in this sector.</p>
        </div>
      ) : (
        <HomeGrid girls={girls} />
      )}
    </main>
  );
}