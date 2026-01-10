"use client";

import { useEffect, useState } from "react";

interface PhotoStepProps {
  photos: File[];
  setPhotos: (photos: File[]) => void;
  onNext: () => void;
}

export default function PhotoStep({
  photos,
  setPhotos,
  onNext,
}: PhotoStepProps) {
  const [previews, setPreviews] = useState<string[]>([]);

  /* ---------------- PREVIEW SAFE HANDLING ---------------- */
  useEffect(() => {
    const urls = photos.map((file) => URL.createObjectURL(file));
    setPreviews(urls);

    return () => {
      urls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [photos]);

  /* ---------------- FILE SELECT ---------------- */
  const handleSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const selected = Array.from(e.target.files);

    // Limit total photos to 6
    const combined = [...photos, ...selected].slice(0, 6);
    setPhotos(combined);

    // Reset input so same file can be selected again
    e.target.value = "";
  };

  return (
    <div className="w-full max-w-md bg-zinc-900 rounded-2xl p-6 text-white">
      <h1 className="text-2xl font-bold mb-2">Add your photos</h1>
      <p className="text-gray-400 mb-6">
        Upload at least 2 photos (max 6)
      </p>

      <div className="grid grid-cols-3 gap-3 mb-6">
        {photos.length < 6 && (
          <label className="flex items-center justify-center border-2 border-dashed border-red-600 rounded-xl aspect-square cursor-pointer">
            <span className="text-4xl text-red-600">+</span>
            <input
              type="file"
              multiple
              accept="image/*"
              hidden
              onChange={handleSelect}
            />
          </label>
        )}

        {previews.map((src, i) => (
          <img
            key={i}
            src={src}
            className="rounded-xl object-cover aspect-square"
            alt={`photo-${i}`}
          />
        ))}
      </div>

      <button
        disabled={photos.length < 2}
        onClick={onNext}
        className={`w-full py-4 rounded-full transition ${
          photos.length >= 2
            ? "bg-red-600 hover:bg-red-700"
            : "bg-zinc-700 text-gray-400 cursor-not-allowed"
        }`}
      >
        Continue
      </button>
    </div>
  );
}

