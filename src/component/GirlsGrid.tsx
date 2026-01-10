"use client";

import { useEffect, useState } from "react";
import GirlCard from "../component/GirlCard";
import GirlModal from "../component/GirlModal";
import { Girl } from "../types/girl";

export default function GirlsGrid() {
  const [girls, setGirls] = useState<Girl[]>([]);
  const [activeGirl, setActiveGirl] = useState<Girl | null>(null);

  // Mock data - replace with your Firebase data later
  useEffect(() => {
    setGirls([
      {
        id: "1",
        name: "Anna",
        age: 22,
        bio: "Chill and fun, loves music and traveling.",
        photos: ["/g1.jpg", "/g1b.jpg"],
      },
      {
        id: "2",
        name: "Bella",
        age: 24,
        bio: "Nightlife lover, foodie, and loves adventures.",
        photos: ["/g2.jpg", "/g2b.jpg"],
      },
      {
        id: "3",
        name: "Cara",
        age: 21,
        bio: "Bookworm, coffee enthusiast, and chill vibes.",
        photos: ["/g3.jpg", "/g3b.jpg"],
      },
      {
        id: "4",
        name: "Diana",
        age: 25,
        bio: "Gym lover, outgoing, and always up for fun.",
        photos: ["/g4.jpg", "/g4b.jpg"],
      },
    ]);
  }, []);

  return (
    <>
      {/* Grid view */}
      <div className="grid grid-cols-2 gap-3 px-3">
        {girls.map((girl) => (
          <GirlCard
            key={girl.id}
            girl={girl}                // ✅ Type-safe prop
            onClick={() => setActiveGirl(girl)}
          />
        ))}
      </div>

      {/* Modal */}
      {activeGirl && (
        <GirlModal
          girl={activeGirl}            // ✅ Type-safe prop
          onClose={() => setActiveGirl(null)}
        />
      )}
    </>
  );
}
