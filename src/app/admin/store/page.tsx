"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../../lib/supabase";
import { ShoppingBag, Plus, Trash2, Loader2, Camera, ArrowLeft, AlertTriangle } from "lucide-react";

export default function AdminStore() {
  const router = useRouter();
  const [products, setProducts] = useState<any[]>([]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [bucketError, setBucketError] = useState(false);

  useEffect(() => { 
    fetchProducts();
    checkBucket();
  }, []);

  const checkBucket = async () => {
    const { data, error } = await supabase.storage.getBucket('store-inventory');
    if (error) setBucketError(true);
  };

  const fetchProducts = async () => {
    const { data } = await supabase.from("products").select("*").order("created_at", { ascending: false });
    if (data) setProducts(data);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return alert("Select an image first.");
    setLoading(true);

    try {
      // 1. Upload to store-inventory bucket
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('store-inventory')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // 2. Get Public URL
      const { data: urlData } = supabase.storage
        .from('store-inventory')
        .getPublicUrl(fileName);

      // 3. Update Database
      const { error: dbError } = await supabase.from("products").insert([{ 
        name, 
        price: parseFloat(price), 
        image_url: urlData.publicUrl 
      }]);

      if (dbError) throw dbError;

      // Reset
      setName(""); setPrice(""); setFile(null); setPreview(null);
      fetchProducts();
      alert("Inventory Updated!");

    } catch (err: any) {
      console.error(err);
      alert("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (id: string) => {
    if (!confirm("Delete this item?")) return;
    await supabase.from("products").delete().eq("id", id);
    fetchProducts();
  };

  return (
    <main className="min-h-screen bg-black text-white p-6">
      
      {/* BUCKET WARNING */}
      {bucketError && (
        <div className="max-w-5xl mx-auto mb-6 bg-red-600/20 border border-red-600 p-4 rounded-2xl flex items-center gap-3 text-red-500 font-bold text-xs uppercase tracking-widest">
          <AlertTriangle size={20} />
          Error: Bucket 'store-inventory' not found. Please create it in Supabase Storage.
        </div>
      )}

      <div className="max-w-5xl mx-auto flex justify-between items-center mb-10 bg-zinc-900/50 p-6 rounded-[2rem] border border-white/10">
        <h1 className="text-xl font-black italic uppercase tracking-tighter flex items-center gap-2">
          <ShoppingBag className="text-red-600" /> Store Manager
        </h1>
        <button onClick={() => router.push("/admin")} className="bg-zinc-800 p-3 rounded-xl hover:bg-white/10 transition">
          <ArrowLeft size={18}/>
        </button>
      </div>

      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* FORM */}
        <form onSubmit={handleUpload} className="bg-zinc-900 border border-white/5 p-8 rounded-[3rem] space-y-6 h-fit">
          <div className="flex flex-col items-center justify-center border-2 border-dashed border-white/10 rounded-[2rem] p-6 hover:border-red-600 transition relative">
            {preview ? (
              <img src={preview} className="w-full h-32 object-contain rounded-xl" />
            ) : (
              <Camera size={32} className="text-gray-600 mb-2" />
            )}
            <input type="file" accept="image/*" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer" />
          </div>

          <input required value={name} onChange={e => setName(e.target.value)} placeholder="Item Name" className="w-full bg-black border border-white/10 p-4 rounded-2xl outline-none" />
          <input required type="number" value={price} onChange={e => setPrice(e.target.value)} placeholder="Price ($)" className="w-full bg-black border border-white/10 p-4 rounded-2xl outline-none" />

          <button disabled={loading || bucketError} className="w-full bg-white text-black py-5 rounded-2xl font-black uppercase tracking-widest disabled:opacity-30">
            {loading ? <Loader2 className="animate-spin mx-auto"/> : "Add to Inventory"}
          </button>
        </form>

        {/* LIST */}
        <div className="space-y-4">
          <h2 className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-4">Live Inventory</h2>
          <div className="grid grid-cols-1 gap-3">
            {products.map(item => (
              <div key={item.id} className="flex items-center justify-between bg-zinc-900/50 border border-white/5 p-4 rounded-3xl">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-black rounded-lg overflow-hidden">
                     <img src={item.image_url} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <p className="font-black uppercase text-sm">{item.name}</p>
                    <p className="text-red-600 font-bold text-xs">${item.price}</p>
                  </div>
                </div>
                <button onClick={() => deleteProduct(item.id)} className="p-3 text-gray-600 hover:text-red-500 transition">
                  <Trash2 size={18}/>
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}