"use client";

import { useRouter } from "next/navigation";
import { Flame, Eye } from "lucide-react";

interface ProfilePreviewProps {
  photos: string[];
}

export default function ProfilePreview({ photos }: ProfilePreviewProps) {
  const router = useRouter();

  // This handles the navigation to your PublicProfileView page
  const handleNavigate = () => {
    router.push("/profile/view"); 
  };

  return (
    <div className="space-y-3">
      <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-600 ml-1">
        Presence
      </h3>
      
      <div 
        onClick={handleNavigate}
        className="group relative w-full aspect-[16/9] rounded-[2.5rem] overflow-hidden border border-white/5 bg-[#0A0A0A] cursor-pointer transition-all duration-500 hover:border-red-600/30"
      >
        {/* Background Image with Underground Grayscale Effect */}
        <img 
          src={photos[0] || "/default-avatar.png"} 
          className="w-full h-full object-cover opacity-40 grayscale group-hover:grayscale-0 group-hover:scale-110 group-hover:opacity-60 transition-all duration-1000"
          alt="Public Preview"
        />

        {/* Cinematic Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-transparent" />

        {/* Content */}
        <div className="absolute inset-0 p-8 flex flex-col justify-end">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-red-600 p-1.5 rounded-full animate-pulse shadow-[0_0_15px_rgba(220,38,38,0.5)]">
              <Eye size={12} className="text-white" strokeWidth={3} />
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-red-500">
              Live Preview
            </span>
          </div>

          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-black italic uppercase tracking-tighter group-hover:text-red-600 transition-colors">
              View Public Vybe
            </h2>
            <div className="translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-500">
              <Flame size={24} className="text-red-600" fill="currentColor" />
            </div>
          </div>
        </div>

        {/* Decorative Inner Border */}
        <div className="absolute inset-4 border border-white/5 rounded-[1.8rem] pointer-events-none group-hover:border-red-600/10 transition-colors" />
      </div>

      <p className="text-[9px] text-center text-zinc-800 font-bold uppercase tracking-[0.3em] mt-2">
        Tap to see how your shadow appears to others
      </p>
    </div>
  );
}