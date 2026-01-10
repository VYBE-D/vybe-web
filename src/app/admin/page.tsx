"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";
import { 
  Users, 
  MessageSquare, 
  PlusCircle, 
  ShieldCheck, 
  Calendar,
  ArrowRight,
  LogOut,
  Loader2
} from "lucide-react";

export default function AdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState({ talentCount: 0, chatCount: 0, eventCount: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getStats() {
      // 1. Fetch Talent Count
      const { count: talent } = await supabase.from("discovery").select("*", { count: 'exact', head: true });

      // 2. Fetch Chat Count
      const { count: chats } = await supabase.from("conversations").select("*", { count: 'exact', head: true });

      // 3. Fetch Events Count (Assuming you have an 'events' table)
      const { count: events } = await supabase.from("events").select("*", { count: 'exact', head: true });

      setStats({
        talentCount: talent || 0,
        chatCount: chats || 0,
        eventCount: events || 0
      });
      setLoading(false);
    }
    getStats();
  }, []);

  const menuItems = [
    {
      title: "Personnel",
      desc: "Manage discovery profiles",
      icon: PlusCircle,
      href: "/admin/discovery",
      color: "bg-blue-600",
      count: stats.talentCount
    },
    {
      title: "Inbox",
      desc: "Client communications",
      icon: MessageSquare,
      href: "/admin/inbox",
      color: "bg-red-600",
      count: stats.chatCount
    },
    {
      title: "Events",
      desc: "Scheduled bookings & dates",
      icon: Calendar,
      href: "/admin/events", // Redirects to your events tab
      color: "bg-amber-500",
      count: stats.eventCount
    }
  ];

  if (loading) return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <Loader2 className="animate-spin text-red-600" size={40} />
    </div>
  );

  return (
    <main className="min-h-screen bg-black text-white p-6">
      {/* HEADER */}
      <div className="max-w-6xl mx-auto flex justify-between items-start mb-12">
        <div>
          <div className="flex items-center gap-2 text-red-600 mb-2 font-black uppercase text-[10px] tracking-widest">
            <ShieldCheck size={16} /> Admin Command
          </div>
          <h1 className="text-4xl font-black italic uppercase italic tracking-tighter">Command Center</h1>
        </div>
        <button onClick={() => { supabase.auth.signOut(); router.push('/home'); }} className="p-3 bg-zinc-900 rounded-xl hover:bg-red-600 transition">
          <LogOut size={20} />
        </button>
      </div>

      {/* GRID OPTIONS */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        {menuItems.map((item) => (
          <div 
            key={item.title}
            onClick={() => router.push(item.href)}
            className="group bg-zinc-900/50 border border-white/5 p-8 rounded-[2.5rem] cursor-pointer hover:border-red-600 transition-all duration-300"
          >
            <div className={`w-12 h-12 ${item.color} rounded-2xl flex items-center justify-center mb-6`}>
              <item.icon size={24} className="text-white" />
            </div>
            
            <h2 className="text-2xl font-black italic uppercase mb-1">{item.title}</h2>
            <p className="text-xs text-gray-500 mb-6">{item.desc}</p>
            
            <div className="flex justify-between items-center">
              <span className="text-3xl font-black text-white/10 group-hover:text-white transition-colors">
                {item.count}
              </span>
              <ArrowRight className="text-gray-700 group-hover:text-red-600 group-hover:translate-x-2 transition-all" />
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}