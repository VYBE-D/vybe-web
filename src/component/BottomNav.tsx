"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { supabase } from "../lib/supabase";
import { Home, Compass, MessageCircle, ShoppingBag, User, ShieldAlert } from "lucide-react";

export default function BottomNav() {
  const pathname = usePathname();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    async function getRole() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .single();
        
        if (data?.role === "admin") {
          setIsAdmin(true);
        }
      }
    }
    getRole();
  }, []);

  // Base tabs everyone sees
  const tabs = [
    { href: "/home", icon: Home, label: "Home" },
    { href: "/explore", icon: Compass, label: "Explore" },
    { href: "/chat", icon: MessageCircle, label: "Chat" },
    { href: "/store", icon: ShoppingBag, label: "Store" },
  ];

  // Add the dynamic final tab
  const finalTab = isAdmin 
    ? { href: "/admin", icon: ShieldAlert, label: "Vault" } 
    : { href: "/profile", icon: User, label: "Profile" };

  const allTabs = [...tabs, finalTab];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 px-4 pb-6">
      <div className="mx-auto max-w-lg rounded-[2.5rem] border border-white/10 bg-black/60 backdrop-blur-2xl shadow-2xl">
        <div className="flex h-20 items-center justify-around px-2">
          {allTabs.map(({ href, icon: Icon, label }) => {
            const active = pathname === href;
            const isVault = label === "Vault";

            return (
              <Link key={href} href={href} className="flex-1">
                <motion.div
                  whileTap={{ scale: 0.9 }}
                  className="relative flex flex-col items-center justify-center"
                >
                  {/* Active Background Glow */}
                  {active && (
                    <motion.div
                      layoutId="navGlow"
                      className={`absolute -top-2 h-10 w-10 blur-xl rounded-full ${
                        isVault ? "bg-red-600/30" : "bg-white/10"
                      }`}
                    />
                  )}

                  <Icon
                    size={22}
                    className={`relative z-10 transition-colors duration-300 ${
                      active 
                        ? (isVault ? "text-red-500" : "text-white") 
                        : "text-gray-500"
                    }`}
                  />

                  <span
                    className={`mt-1.5 text-[10px] font-black uppercase tracking-tighter transition-colors ${
                      active ? "text-white" : "text-gray-600"
                    }`}
                  >
                    {label}
                  </span>

                  {/* Red indicator for Admin Vault specifically */}
                  {isVault && !active && (
                    <div className="absolute top-0 right-1/4 h-1.5 w-1.5 rounded-full bg-red-600 animate-pulse" />
                  )}
                </motion.div>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}