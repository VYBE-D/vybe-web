"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { supabase } from "../lib/supabase";
import { useSiteFeatures } from "../context/SiteFeaturesContext";
import { Home, Compass, MessageCircle, ShoppingBag, User, ShieldAlert } from "lucide-react";

export default function BottomNav() {
  const pathname = usePathname();
  const { features } = useSiteFeatures();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    let mounted = true;
    async function getRole() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase.from("profiles").select("role").eq("id", user.id).single();
      if (mounted) setIsAdmin(data?.role === "admin");
    }
    void getRole();
    return () => { mounted = false; };
  }, []);

  const tabs = [
    { href: "/home", icon: Home, label: "Home" },
    { href: "/explore", icon: Compass, label: "Explore" },
    { href: "/chat", icon: MessageCircle, label: "Chat" },
    { href: "/store", icon: ShoppingBag, label: "Store" },
  ];
  const finalTab = isAdmin
    ? { href: "/admin", icon: ShieldAlert, label: "Vault" }
    : features.profile_tab_enabled
      ? { href: "/profile", icon: User, label: "Profile" }
      : null;
  const allTabs = finalTab ? [...tabs, finalTab] : tabs;

  return (
    <nav className="vybe-nav" aria-label="Member navigation">
      <div className="vybe-nav__inner">
        {allTabs.map(({href,icon:Icon,label}) => {
          const active=pathname===href || pathname.startsWith(href + "/");
          return <Link key={href} href={href} aria-current={active?"page":undefined} data-active={active} data-vault={label==="Vault"} className="vybe-nav__item">
            <Icon size={22} strokeWidth={active?2.4:1.8} aria-hidden="true"/><span>{label}</span>
          </Link>;
        })}
      </div>
    </nav>
  );
}
