"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabase";
import { ShoppingBag, Plus, Check, Loader2, ArrowRight, Package } from "lucide-react";
import Link from "next/link";

export default function UserStore() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState<any[]>([]);

  useEffect(() => {
    fetchProducts();
    // Load existing cart from local storage if any
    const savedCart = localStorage.getItem("mission_cart");
    if (savedCart) setCart(JSON.parse(savedCart));
  }, []);

  const fetchProducts = async () => {
    const { data } = await supabase.from("products").select("*").order("name");
    if (data) setProducts(data);
    setLoading(false);
  };

  const toggleCart = (product: any) => {
    let newCart;
    if (cart.find((item) => item.id === product.id)) {
      newCart = cart.filter((item) => item.id !== product.id);
    } else {
      newCart = [...cart, product];
    }
    setCart(newCart);
    localStorage.setItem("mission_cart", JSON.stringify(newCart));
  };

  if (loading) return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <Loader2 className="animate-spin text-red-600" size={40} />
    </div>
  );

  return (
    <main className="min-h-screen bg-black text-white p-6 pb-32">
      {/* HEADER */}
      <div className="max-w-6xl mx-auto mb-12 pt-10 text-center">
        <h1 className="text-5xl font-black italic uppercase tracking-tighter mb-2">Mission Essentials</h1>
        <p className="text-gray-500 text-[10px] font-bold uppercase tracking-[0.4em]">Premium Add-ons & Logistics</p>
      </div>

      {/* PRODUCT GRID */}
      <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((item) => {
          const inCart = cart.find((p) => p.id === item.id);
          return (
            <div key={item.id} className="group relative bg-zinc-900/40 border border-white/5 rounded-[2.5rem] overflow-hidden hover:border-red-600/50 transition-all duration-500">
              <div className="aspect-square overflow-hidden">
                <img 
                  src={item.image_url} 
                  className="w-full h-full object-cover group-hover:scale-110 transition duration-700 opacity-80 group-hover:opacity-100" 
                  alt={item.name} 
                />
              </div>
              
              <div className="p-6">
                <h3 className="font-black italic uppercase text-sm mb-1 truncate">{item.name}</h3>
                <p className="text-red-600 font-black text-lg mb-4">${item.price}</p>
                
                <button 
                  onClick={() => toggleCart(item)}
                  className={`w-full py-3 rounded-xl font-black uppercase text-[10px] tracking-widest transition-all flex items-center justify-center gap-2 ${
                    inCart 
                    ? "bg-red-600 text-white" 
                    : "bg-white text-black hover:bg-gray-200"
                  }`}
                >
                  {inCart ? <><Check size={14}/> Added</> : <><Plus size={14}/> Add to Mission</>}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {products.length === 0 && (
        <div className="text-center py-40">
          <Package className="mx-auto text-zinc-800 mb-4" size={60} />
          <p className="text-gray-600 font-bold uppercase tracking-widest text-xs">Inventory currently offline</p>
        </div>
      )}

      {/* FLOATING CHECKOUT BAR */}
      {cart.length > 0 && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 w-[90%] max-w-md bg-white text-black p-4 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex items-center justify-between animate-in slide-in-from-bottom-10">
          <div className="pl-4">
            <p className="text-[10px] font-black uppercase tracking-widest opacity-50 leading-none">Cart Total</p>
            <p className="text-xl font-black italic">
              ${cart.reduce((sum, item) => sum + item.price, 0)}
            </p>
          </div>
          <Link href="/home" className="bg-red-600 text-white px-8 py-4 rounded-2xl font-black uppercase text-xs tracking-widest flex items-center gap-2 hover:bg-red-700 transition">
            Book Now <ArrowRight size={16} />
          </Link>
        </div>
      )}
    </main>
  );
}