"use client";

import { useSiteFeatures } from "../../context/SiteFeaturesContext";

export default function MembershipCard({ onUpgrade }: { onUpgrade: () => void }) {
  const { features } = useSiteFeatures();
  return (
    <div className="bg-white/5 border border-white/10 p-6 rounded-3xl">
      {features.subscriptions_enabled ? (
        <button onClick={onUpgrade} className="w-full py-3 bg-white text-black font-black italic uppercase rounded-full">
          Upgrade Member
        </button>
      ) : (
        <div className="py-3 text-center">
          <p className="text-xs font-black uppercase tracking-widest text-zinc-300">Upgrades temporarily paused</p>
          <p className="mt-2 text-xs text-zinc-500">Your membership information is preserved.</p>
        </div>
      )}
    </div>
  );
}