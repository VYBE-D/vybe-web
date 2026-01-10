"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Settings, Edit2, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { supabase } from "../../../lib/supabase";

import MembershipCard from "../../../component/profile/MembershipCard";
import ActivityCard from "../../../component/profile/ActivityCard";
import ProfilePreview from "../../../component/profile/ProfilePreview";

export default function ProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState({
    nickname: "",
    photos: [] as string[],
  });

  useEffect(() => {
    async function fetchProfile() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          router.push("/");
          return;
        }

        const { data, error } = await supabase
          .from("profiles")
          .select("nickname, photos")
          .eq("id", user.id)
          .single();

        if (error) throw error;

        if (data) {
          setProfile({
            nickname: data.nickname || "NO NAME",
            photos: data.photos || [],
          });
        }
      } catch (err) {
        console.error("Profile Load Error:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, [router]);

  // Handlers for the cards
  const handleUpgrade = () => router.push("/membership/upgrade");
  const handleViewHistory = () => router.push("/profile/history");

  return (
    <main className="min-h-screen bg-black text-white relative overflow-hidden pb-24 font-sans">
      
      {/* 🔮 Background Glow Effects */}
      <div className="absolute top-[-10%] left-[-20%] w-[500px] h-[500px] bg-purple-900/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-20%] w-[500px] h-[500px] bg-red-900/10 rounded-full blur-[120px] pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 px-4 pt-6"
      >
        {/* 1️⃣ HEADER SECTION */}
        <header className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-tr from-red-600 to-fuchsia-600 rounded-full opacity-40 blur-md group-hover:opacity-100 transition duration-1000"></div>
              <div className="relative w-20 h-20 rounded-full p-[2px] bg-zinc-900">
                {loading ? (
                   <div className="w-full h-full rounded-full bg-zinc-800 animate-pulse" />
                ) : (
                  <img
                    src={profile.photos[0] || "/default-avatar.png"} 
                    alt="Avatar"
                    className="w-full h-full rounded-full object-cover border-2 border-black"
                  />
                )}
              </div>
            </div>

            <div className="flex flex-col">
              {loading ? (
                <div className="h-6 w-24 bg-zinc-800 animate-pulse rounded-md" />
              ) : (
                <h2 className="text-2xl font-black italic uppercase tracking-tighter">
                  {profile.nickname}
                </h2>
              )}
              
              <button 
                onClick={() => router.push("/profile/edit")}
                className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-400 bg-white/5 hover:bg-white/10 border border-white/5 px-4 py-2 rounded-full mt-2 transition-all w-fit"
              >
                <Edit2 size={10} />
                <span>Edit Profile</span>
              </button>
            </div>
          </div>

          <button 
            onClick={() => router.push("/settings")}
            className="p-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full backdrop-blur-md transition-all active:scale-90"
          >
            <Settings size={22} strokeWidth={2.5} />
          </button>
        </header>

        {/* 2️⃣ CONTENT SECTION */}
        <div className="space-y-6">
          <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
            {/* Added onUpgrade prop */}
            <MembershipCard onUpgrade={handleUpgrade} />
          </motion.section>

          <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
             {/* Added onViewHistory prop */}
             <ActivityCard onViewHistory={handleViewHistory} />
          </motion.section>

          <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="pb-6">
            {/* THIS FIXES THE RED UNDERLINE: Pass photos correctly */}
            <ProfilePreview photos={profile.photos} />
          </motion.section>
        </div>
      </motion.div>
    </main>
  );
}