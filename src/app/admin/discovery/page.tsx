"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../../lib/supabase";
import { MessageSquare, Upload, Trash2, ArrowLeft, Loader2, Camera, UserX, X, Lock, Globe } from "lucide-react";

export default function PostTalentPage() {
  const router = useRouter();
  
  const [talents, setTalents] = useState<any[]>([]);
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [role, setRole] = useState("");
  const [category, setCategory] = useState("New Face");
  const [isBackroom, setIsBackroom] = useState(false); // NEW: Backroom Toggle

  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchTalents = async () => {
    const { data } = await supabase.from("discovery").select("*").order("created_at", { ascending: false });
    if (data) setTalents(data);
  };

  useEffect(() => {
    fetchTalents();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      setFiles((prev) => [...prev, ...selectedFiles].slice(0, 6));
      const newPreviews = selectedFiles.map(file => URL.createObjectURL(file));
      setPreviews((prev) => [...prev, ...newPreviews].slice(0, 6));
    }
  };

  const removeImage = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
    setPreviews(previews.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (files.length === 0) return alert("Please select at least one image.");
    setLoading(true);

    try {
      const uploadedUrls = [];
      for (const file of files) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `uploads/${fileName}`;

        const { error: uploadError } = await supabase.storage.from('talent-images').upload(filePath, file);
        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage.from('talent-images').getPublicUrl(filePath);
        uploadedUrls.push(urlData.publicUrl);
      }

      const { error: dbError } = await supabase.from("discovery").insert([{ 
        name, 
        bio, 
        role,
        image_url: uploadedUrls[0],
        gallery: uploadedUrls, 
        // If isBackroom is true, we set category specifically to 'Backroom'
        category: isBackroom ? "Backroom" : category,
        is_backroom: isBackroom // Ensure this column exists in your Supabase table
      }]);

      if (dbError) throw dbError;

      setName(""); setBio(""); setRole(""); setFiles([]); setPreviews([]); setIsBackroom(false);
      fetchTalents();
      alert(isBackroom ? "Personnel deployed to Backroom!" : "Personnel deployed to Discovery!");
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure?")) return;
    const { error } = await supabase.from("discovery").delete().eq("id", id);
    if (!error) setTalents(talents.filter(t => t.id !== id));
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
        
        {/* FORM SECTION */}
        <section>
            <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-red-600 mb-4 ml-4">Deployment Form</h2>
            <form onSubmit={handleSubmit} className="bg-zinc-900 border border-white/5 p-8 rounded-[3rem] space-y-6">
            
            {/* BACKROOM TOGGLE SWITCH */}
            <div className="flex items-center justify-between bg-black/40 p-4 rounded-2xl border border-white/5">
                <div className="flex items-center gap-3">
                    {isBackroom ? <Lock className="text-red-600" size={18}/> : <Globe className="text-zinc-500" size={18}/>}
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-widest leading-none">Access Level</p>
                        <p className={`text-[9px] font-bold ${isBackroom ? 'text-red-600' : 'text-zinc-500'}`}>
                            {isBackroom ? "PRIVATE BACKROOM" : "PUBLIC DISCOVERY"}
                        </p>
                    </div>
                </div>
                <button 
                    type="button"
                    onClick={() => setIsBackroom(!isBackroom)}
                    className={`w-12 h-6 rounded-full transition-colors relative ${isBackroom ? 'bg-red-600' : 'bg-zinc-700'}`}
                >
                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${isBackroom ? 'left-7' : 'left-1'}`} />
                </button>
            </div>

            <div className="grid grid-cols-3 gap-2">
                {previews.map((src, index) => (
                  <div key={index} className="relative h-24 bg-black rounded-xl overflow-hidden border border-white/10">
                    <img src={src} className="w-full h-full object-cover" />
                    <button type="button" onClick={() => removeImage(index)} className="absolute top-1 right-1 bg-red-600 rounded-full p-1"><X size={12}/></button>
                  </div>
                ))}
                {previews.length < 6 && (
                  <div className="h-24 border-2 border-dashed border-white/10 rounded-xl flex items-center justify-center relative hover:border-red-600 transition">
                    <Camera size={20} className="text-gray-600" />
                    <input type="file" multiple accept="image/*" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer" />
                  </div>
                )}
            </div>

            <div className="space-y-4">
              <input required value={name} onChange={e => setName(e.target.value)} placeholder="Personnel Name" className="w-full bg-black border border-white/10 p-4 rounded-2xl outline-none focus:border-red-600" />
              <input value={role} onChange={e => setRole(e.target.value)} placeholder="Role (e.g. GFE, Elite Escort)" className="w-full bg-black border border-white/10 p-4 rounded-2xl outline-none focus:border-red-600 text-red-500 font-bold" />
              
              {/* Category selector is disabled if it's a Backroom post */}
              <select 
                disabled={isBackroom}
                value={isBackroom ? "Backroom" : category} 
                onChange={e => setCategory(e.target.value)} 
                className={`w-full bg-black border border-white/10 p-4 rounded-2xl outline-none ${isBackroom ? 'opacity-50 grayscale' : ''}`}
              >
                  <option>Vybe</option>
                  <option>Featured</option>
                  <option>Elite</option>
                  <option>New Face</option>
              </select>

              <textarea required value={bio} onChange={e => setBio(e.target.value)} rows={3} className="w-full bg-black border border-white/10 p-4 rounded-2xl outline-none" placeholder="Biography..." />
            </div>

            <button disabled={loading} className={`w-full py-5 rounded-2xl font-black uppercase tracking-widest flex justify-center gap-2 transition-all ${isBackroom ? 'bg-red-600 text-white' : 'bg-white text-black'}`}>
                {loading ? <Loader2 className="animate-spin"/> : <><Upload size={18}/> {isBackroom ? "Secure to Backroom" : "Deploy Profile"}</>}
            </button>
            </form>
        </section>

        {/* LIST SECTION */}
        <section>
            <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 mb-4 ml-4">Active Personnel ({talents.length})</h2>
            <div className="space-y-4 max-h-[700px] overflow-y-auto pr-2">
                {talents.map((girl) => (
                    <div key={girl.id} className="bg-zinc-900/50 border border-white/5 p-4 rounded-3xl flex items-center justify-between group">
                        <div className="flex items-center gap-4">
                            <div className="relative">
                                <img src={girl.image_url} className="w-12 h-12 rounded-xl object-cover border border-white/10" />
                                {girl.category === "Backroom" && (
                                    <div className="absolute -top-1 -right-1 bg-red-600 rounded-full p-1 border border-black">
                                        <Lock size={8}/>
                                    </div>
                                )}
                            </div>
                            <div>
                                <h3 className="font-black uppercase italic text-sm leading-none mb-1">{girl.name}</h3>
                                <div className="flex items-center gap-2">
                                    <p className="text-[9px] text-red-600 font-bold uppercase tracking-widest">{girl.role || girl.category}</p>
                                    {girl.category === "Backroom" && <span className="text-[8px] bg-red-600/10 text-red-600 px-1 rounded font-black tracking-tighter">SECURE</span>}
                                </div>
                            </div>
                        </div>
                        <button onClick={() => handleDelete(girl.id)} className="p-3 text-gray-600 hover:text-red-500 transition"><Trash2 size={18} /></button>
                    </div>
                ))}
            </div>
        </section>
      </div>
    </main>
  );
}