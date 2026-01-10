"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../../lib/supabase";
import { MessageSquare, Upload, Trash2, ArrowLeft, Loader2, Camera, UserX } from "lucide-react";

export default function PostTalentPage() {
  const router = useRouter();
  
  // Form & List State
  const [talents, setTalents] = useState<any[]>([]);
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [category, setCategory] = useState("New Face");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  
  const [loading, setLoading] = useState(false);

  // 1. Load Talents for the list
  const fetchTalents = async () => {
    const { data } = await supabase.from("discovery").select("*").order("created_at", { ascending: false });
    if (data) setTalents(data);
  };

  useEffect(() => {
    fetchTalents();
  }, []);

  // 2. Handle File Selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  // 3. Upload & Save
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return alert("Please select an image.");
    setLoading(true);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `uploads/${fileName}`;

      const { error: uploadError } = await supabase.storage.from('talent-images').upload(filePath, file);
      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage.from('talent-images').getPublicUrl(filePath);

      const { error: dbError } = await supabase.from("discovery").insert([{ 
        name, bio, image_url: urlData.publicUrl, category 
      }]);

      if (dbError) throw dbError;

      // Reset & Refresh
      setName(""); setBio(""); setFile(null); setPreview(null);
      fetchTalents();
      alert("Deployed!");
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  // 4. DELETE FUNCTION
  const handleDelete = async (id: string) => {
    const confirmed = confirm("Are you sure you want to remove this profile? All associated chats will be deleted.");
    if (!confirmed) return;

    const { error } = await supabase.from("discovery").delete().eq("id", id);
    
    if (error) {
      alert("Error: " + error.message);
    } else {
      setTalents(talents.filter(t => t.id !== id)); // Update UI instantly
    }
  };

  return (
    <main className="min-h-screen bg-black text-white p-6 pb-20">
      
      {/* HEADER */}
      <div className="max-w-5xl mx-auto flex justify-between items-center mb-10 bg-zinc-900/50 p-6 rounded-[2rem] border border-white/10">
        <h1 className="text-xl font-black italic uppercase tracking-tighter">Talent Command</h1>
        <div className="flex gap-2">
          <button onClick={() => router.push("/admin/inbox")} className="bg-zinc-800 p-3 rounded-xl hover:bg-red-600 transition"><MessageSquare size={18}/></button>
          <button onClick={() => router.push("/admin")} className="bg-zinc-800 p-3 rounded-xl"><ArrowLeft size={18}/></button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10">
        
        {/* LEFT: UPLOAD FORM */}
        <section>
            <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-red-600 mb-4 ml-4">Deployment Form</h2>
            <form onSubmit={handleSubmit} className="bg-zinc-900 border border-white/5 p-8 rounded-[3rem] space-y-6">
            <div className="flex flex-col items-center justify-center border-2 border-dashed border-white/10 rounded-[2rem] p-6 hover:border-red-600 transition relative overflow-hidden">
                {preview ? (
                <img src={preview} className="w-full h-40 object-cover rounded-2xl border-2 border-red-600" />
                ) : (
                <Camera size={32} className="text-gray-600 mb-2" />
                )}
                <input type="file" accept="image/*" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer" />
            </div>

            <input required value={name} onChange={e => setName(e.target.value)} placeholder="Personnel Name" className="w-full bg-black border border-white/10 p-4 rounded-2xl outline-none" />
            
            <select value={category} onChange={e => setCategory(e.target.value)} className="w-full bg-black border border-white/10 p-4 rounded-2xl outline-none">
                <option>New Face</option><option>Featured</option><option>Elite</option>
            </select>

            <textarea required value={bio} onChange={e => setBio(e.target.value)} rows={3} className="w-full bg-black border border-white/10 p-4 rounded-2xl outline-none" placeholder="Biography..." />

            <button disabled={loading} className="w-full bg-white text-black py-5 rounded-2xl font-black uppercase tracking-widest flex justify-center gap-2">
                {loading ? <Loader2 className="animate-spin"/> : <><Upload size={18}/> Add to Grid</>}
            </button>
            </form>
        </section>

        {/* RIGHT: MANAGE / DELETE LIST */}
        <section>
            <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 mb-4 ml-4">Active Personnel ({talents.length})</h2>
            <div className="space-y-4 max-h-[700px] overflow-y-auto pr-2">
                {talents.map((girl) => (
                    <div key={girl.id} className="bg-zinc-900/50 border border-white/5 p-4 rounded-3xl flex items-center justify-between group">
                        <div className="flex items-center gap-4">
                            <img src={girl.image_url} className="w-12 h-12 rounded-xl object-cover border border-white/10" />
                            <div>
                                <h3 className="font-black uppercase italic text-sm">{girl.name}</h3>
                                <p className="text-[9px] text-red-600 font-bold uppercase tracking-widest">{girl.category}</p>
                            </div>
                        </div>
                        
                        <button 
                            onClick={() => handleDelete(girl.id)}
                            className="p-3 text-gray-600 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition"
                        >
                            <Trash2 size={18} />
                        </button>
                    </div>
                ))}

                {talents.length === 0 && (
                    <div className="text-center py-20 bg-zinc-900/20 rounded-[3rem] border border-dashed border-white/5">
                        <UserX className="mx-auto text-gray-800 mb-2" size={40} />
                        <p className="text-[10px] font-bold text-gray-700 uppercase">No active personnel found</p>
                    </div>
                )}
            </div>
        </section>

      </div>
    </main>
  );
}