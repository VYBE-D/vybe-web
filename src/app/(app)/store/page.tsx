"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabase";
import { ShoppingBag, Plus, Check, Package, ArrowRight, ShieldCheck, Zap, Flame } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

export default function UserStore() {
  const [activeTab, setActiveTab] = useState<"supply" | "arsenal">("supply");
  const [products, setProducts] = useState<any[]>([]);
  const [inventory, setInventory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState<any[]>([]);

  useEffect(() => {
    fetchStoreData();
    const savedCart = localStorage.getItem("mission_cart");
    if (savedCart) setCart(JSON.parse(savedCart));
  }, []);

  const fetchStoreData = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();

    // 1. Fetch available Store Products
    const { data: storeProducts } = await supabase.from("products").select("*").order("name");
    
    // 2. Fetch User's Arsenal (Joined with Products table for images/names)
    if (user) {
      const { data: owned } = await supabase
        .from("user_inventory")
        .select(`
          id,
          product:products (
            id,
            name,
            image_url
          )
        `)
        .eq("user_id", user.id);
        
      if (owned) setInventory(owned);
    }

    if (storeProducts) setProducts(storeProducts);
    setLoading(false);
  };

  const toggleCart = (product: any) => {
    let newCart;
    const exists = cart.find((item) => item.id === product.id);
    if (exists) {
      newCart = cart.filter((item) => item.id !== product.id);
    } else {
      newCart = [...cart, product];
    }
    setCart(newCart);
    localStorage.setItem("mission_cart", JSON.stringify(newCart));
  };

  if (loading) return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }}>
        <Zap className="text-white" size={32} />
      </motion.div>
    </div>
  );

  return (
    <main className="min-h-screen bg-black text-white pb-40 font-sans relative selection:bg-white/20">
      
      {/* 🌑 DARK GLASS AMBIENCE */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[50%] h-[50%] bg-zinc-800/10 blur-[120px] rounded-full" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-[0.03]" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 pt-12">
        
        {/* HEADER & TABS */}
        <header className="flex flex-col items-center mb-12">
          <div className="flex items-center gap-2 mb-4">
             <Flame size={20} className="text-zinc-600" />
             <span className="text-[10px] font-black uppercase tracking-[0.5em] text-zinc-600">Vybe Logistics</span>
          </div>
          <h1 className="text-4xl font-black italic uppercase tracking-tighter mb-8 bg-gradient-to-b from-white to-zinc-600 bg-clip-text text-transparent">
            Supply Drop
          </h1>
          
          {/* Glass Tab Switcher */}
          <div className="bg-white/[0.03] border border-white/10 p-1.5 rounded-2xl flex gap-1 backdrop-blur-3xl shadow-2xl">
            <button 
              onClick={() => setActiveTab("supply")}
              className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300 ${
                activeTab === "supply" ? "bg-white text-black" : "text-zinc-500 hover:text-white"
              }`}
            >
              The Shop
            </button>
            <button 
              onClick={() => setActiveTab("arsenal")}
              className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300 ${
                activeTab === "arsenal" ? "bg-white text-black" : "text-zinc-500 hover:text-white"
              }`}
            >
              My Arsenal ({inventory.length})
            </button>
          </div>
        </header>

        <AnimatePresence mode="wait">
          {/* 🛒 TAB 1: SHOP */}
          {activeTab === "supply" && (
            <motion.div 
              key="supply"
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-6"
            >
              {products.map((item) => {
                const inCart = cart.some((p) => p.id === item.id);
                return (
                  <div key={item.id} className="group bg-zinc-900/20 border border-white/5 rounded-[2.5rem] overflow-hidden backdrop-blur-md">
                    <div className="aspect-square relative overflow-hidden bg-black/40">
                      <img src={item.image_url} className="w-full h-full object-cover opacity-70 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700" />
                      <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
                        <span className="text-[10px] font-black text-white">${item.price}</span>
                      </div>
                    </div>
                    <div className="p-5">
                      <h3 className="text-[10px] font-black uppercase tracking-widest text-zinc-300 mb-4 truncate">{item.name}</h3>
                      <button 
                        onClick={() => toggleCart(item)}
                        className={`w-full py-3 rounded-xl font-black uppercase text-[9px] tracking-widest transition-all ${
                          inCart ? "bg-white text-black" : "bg-white/5 text-zinc-500 hover:bg-white/10"
                        }`}
                      >
                        {inCart ? "Acquired" : "Request"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </motion.div>
          )}

          {/* 🎒 TAB 2: ARSENAL */}
          {activeTab === "arsenal" && (
            <motion.div 
              key="arsenal"
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-6"
            >
              {inventory.length > 0 ? (
                inventory.map((item) => (
                  <div key={item.id} className="bg-white/[0.03] border border-white/10 rounded-[2.5rem] p-5 flex flex-col items-center text-center">
                    <div className="w-24 h-24 mb-4 relative">
                      <img src={item.product?.image_url} className="w-full h-full object-cover rounded-2xl grayscale opacity-50" />
                      <div className="absolute -top-2 -right-2 bg-black border border-white/20 p-1.5 rounded-full">
                        <ShieldCheck size={12} className="text-white" />
                      </div>
                    </div>
                    <h3 className="text-[10px] font-black uppercase tracking-widest text-white mb-2">{item.product?.name}</h3>
                    <span className="text-[8px] font-bold uppercase text-zinc-600 tracking-tighter">Ready for deployment</span>
                  </div>
                ))
              ) : (
                <div className="col-span-full py-32 text-center opacity-20">
                  <Package size={48} className="mx-auto mb-4" />
                  <p className="text-xs font-black uppercase tracking-[0.3em]">Arsenal is Empty</p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 🚀 CHECKOUT BAR (Hides Bottom Nav) */}
      <AnimatePresence>
        {cart.length > 0 && (
          <motion.div 
            initial={{ y: 100 }} animate={{ y: 0 }} exit={{ y: 100 }}
            className="fixed bottom-0 left-0 w-full z-[100] bg-[#050505] border-t border-white/10 px-8 py-8 shadow-[0_-20px_50px_rgba(0,0,0,0.9)]"
          >
            <div className="max-w-6xl mx-auto flex items-center justify-between">
              <div>
                <p className="text-[9px] font-black uppercase tracking-widest text-zinc-500 mb-1">Total Requisition</p>
                <p className="text-3xl font-black italic">${cart.reduce((sum, item) => sum + item.price, 0)}</p>
              </div>
              <Link 
                href="/checkout" 
                className="bg-white text-black px-10 py-4 rounded-2xl font-black uppercase text-xs tracking-widest flex items-center gap-2 active:scale-95 transition-transform"
              >
                Authorize <ArrowRight size={16} />
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}