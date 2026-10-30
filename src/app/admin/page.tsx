"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";
import { useSiteFeatures } from "../../context/SiteFeaturesContext";
import type { SiteFeatureKey } from "../../lib/features";
import { 
  MessageSquare, 
  PlusCircle, 
  ShieldCheck, 
  Calendar,
  ArrowRight,
  LogOut,
  ShoppingBag,
  ToggleLeft,
  AlertCircle // Feature controls
} from "lucide-react";

export default function AdminDashboard() {
  const router = useRouter();
  const { features, available, loading: featuresLoading, setFeaturesFromSave } = useSiteFeatures();
  const [saving, setSaving] = useState<SiteFeatureKey | null>(null);
  const [featureError, setFeatureError] = useState("");

  const changeFeature = async (key: SiteFeatureKey) => {
    if (saving || !available) return;
    setFeatureError("");
    setSaving(key);
    try {
      const { data } = await supabase.auth.getSession();
      const token = data.session?.access_token;
      if (!token) throw new Error("Sign in again to manage website settings.");
      const response = await fetch("/api/site-features", {
        method: "PATCH",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify({ key, enabled: !features[key] }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Unable to save changes");
      setFeaturesFromSave(result.features);
    } catch (error) {
      setFeatureError(error instanceof Error ? error.message : "Could not update settings");
    } finally { setSaving(null); }
  };

  const featureControls: { key: SiteFeatureKey; title: string; description: string }[] = [
    { key: "subscriptions_enabled", title: "Subscriptions", description: "Allow new membership upgrades. Existing memberships are preserved." },
    { key: "profile_tab_enabled", title: "Profile tab", description: "Show the Profile navigation tab and its pages to members. Admin Vault remains available." },
    { key: "extra_registration_enabled", title: "Extra registration pages", description: "Nickname, interests, consent and photos. Email/password, 18+ confirmation and Host/Me remain required." },
  ];
  // 2. Added storeCount to state
  const [stats, setStats] = useState({ talentCount: 0, chatCount: 0, eventCount: 0, storeCount: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getStats() {
      // Fetch Talent Count
      const { count: talent } = await supabase.from("discovery").select("*", { count: 'exact', head: true });

      // Fetch Chat Count
      const { count: chats } = await supabase.from("conversations").select("*", { count: 'exact', head: true });

      // Fetch Events Count
      const { count: events } = await supabase.from("events").select("*", { count: 'exact', head: true });

      // 3. Fetch Store Product Count
      const { count: products } = await supabase.from("products").select("*", { count: 'exact', head: true });

      setStats({
        talentCount: talent || 0,
        chatCount: chats || 0,
        eventCount: events || 0,
        storeCount: products || 0 // Added this
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
      href: "/admin/events",
      color: "bg-amber-500",
      count: stats.eventCount
    },
    // 4. Added the Store Item here
    {
      title: "Store",
      desc: "Manage shop inventory",
      icon: ShoppingBag,
      href: "/admin/store",
      color: "bg-emerald-600",
      count: stats.storeCount
    }
  ];

  return (
    <main className="min-h-screen bg-black text-white p-6">
      {/* HEADER */}
      <div className="max-w-6xl mx-auto flex justify-between items-start mb-12">
        <div>
          <div className="flex items-center gap-2 text-red-600 mb-2 font-black uppercase text-[10px] tracking-widest">
            <ShieldCheck size={16} /> Admin Command
          </div>
          <h1 className="text-4xl font-black italic uppercase tracking-tighter">Command Center</h1>
        </div>
        <button onClick={() => { supabase.auth.signOut(); router.push('/home'); }} className="p-3 bg-zinc-900 rounded-xl hover:bg-red-600 transition">
          <LogOut size={20} />
        </button>
      </div>

      <section className="max-w-6xl mx-auto mb-8 rounded-2xl border border-white/10 bg-zinc-900/50 px-5 py-6" aria-label="Site feature switches">
        <div className="mb-5 flex items-center gap-2">
          <ToggleLeft size={19} className="text-red-500" />
          <h2 className="text-base font-black uppercase tracking-widest">Website controls</h2>
        </div>
        <p className="mb-5 text-xs text-zinc-400">Turn features off temporarily without deleting their code or existing data.</p>
        {!featuresLoading && !available && (
          <p role="status" className="mb-5 flex items-start gap-2 rounded-xl bg-amber-900/20 p-4 text-xs text-amber-200">
            <AlertCircle size={16} className="shrink-0" /> Settings cannot be saved until Supabase is online and the site settings migration is installed. All switches show their safe OFF fallback.
          </p>
        )}
        {featureError && <p role="alert" className="mb-5 rounded-xl bg-red-900/20 p-4 text-xs text-red-300">{featureError}</p>}
        <div className="divide-y divide-white/10">
          {featureControls.map((control) => (
            <div key={control.key} className="flex items-center justify-between gap-5 py-5">
              <div>
                <h3 className="text-sm font-semibold">{control.title}</h3>
                <p className="mt-1 max-w-xl text-xs leading-relaxed text-zinc-500">{control.description}</p>
              </div>
              <button type="button" role="switch" aria-label={control.title}
                aria-checked={features[control.key]}
                disabled={!available || featuresLoading || saving !== null}
                onClick={() => void changeFeature(control.key)}
                className={`relative h-8 w-14 shrink-0 rounded-full border transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${features[control.key] ? "border-emerald-500 bg-emerald-600" : "border-zinc-700 bg-zinc-800"}`}>
                <span className={`absolute top-1 h-6 w-6 rounded-full bg-white transition-all ${features[control.key] ? "left-7" : "left-1"}`} />
              </button>
            </div>
          ))}
        </div>
        <p className="mt-2 text-[11px] text-zinc-500">OFF = hidden or unavailable. Settings save for everyone when the backend is online. This does not cancel pre-existing recurring payment agreements.</p>
      </section>

      {/* GRID OPTIONS - Changed grid-cols-3 to grid-cols-2 lg:grid-cols-4 to fit the 4th item better */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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
                {loading ? "—" : item.count}
              </span>
              <ArrowRight className="text-gray-700 group-hover:text-red-600 group-hover:translate-x-2 transition-all" />
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}