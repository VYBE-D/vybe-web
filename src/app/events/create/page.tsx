"use client";

import { useState } from "react";
import { db, storage } from "../../../lib/firebase";
import { collection, addDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export default function EventCreate() {
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [slots, setSlots] = useState<number>(15);
  const [photos, setPhotos] = useState<File[]>([]);

  const uploadPhotos = async () => {
    const urls: string[] = [];
    for (const f of photos) {
      const rf = ref(storage, 'events/${f.name}');
      await uploadBytes(rf, f);
      urls.push(await getDownloadURL(rf));
    }
    return urls;
  };

  const handleSubmit = async () => {
    const urls = await uploadPhotos();
    await addDoc(collection(db, "events"), {
      name,
      date,
      slots,
      photos: urls,
      createdAt: new Date(),
    });
    alert("Event created!");
    setName(""); setDate(""); setSlots(15); setPhotos([]);
  };

  return (
    <main className="bg-black min-h-screen text-white p-6">
      <h1 className="text-3xl font-bold mb-6">Create Event</h1>
      <div className="flex flex-col gap-4 max-w-md">
        <input
          placeholder="Event Name"
          value={name}
          onChange={e => setName(e.target.value)}
          className="p-2 rounded bg-zinc-900"
        />
        <input
          type="date"
          value={date}
          onChange={e => setDate(e.target.value)}
          className="p-2 rounded bg-zinc-900"
        />
        <input
          type="number"
          value={slots}
          onChange={e => setSlots(Number(e.target.value))}
          className="p-2 rounded bg-zinc-900"
          min={1}
        />
        <label className="flex items-center justify-center border-2 border-dashed border-red-600 rounded-xl aspect-square cursor-pointer">
          <span className="text-4xl text-red-600">+</span>
          <input
            type="file"
            multiple
            accept="image/*"
            hidden
            onChange={e => setPhotos([...photos, ...(e.target.files ? Array.from(e.target.files) : [])])}
          />
        </label>
        <div className="flex gap-2 mt-2">
          {photos.map((p, i) => (
            <img key={i} src={URL.createObjectURL(p)} className="w-20 h-20 object-cover rounded-xl" />
          ))}
        </div>
        <button
          onClick={handleSubmit}
          className="py-3 rounded-full bg-red-600 mt-4"
        >
          Create Event
        </button>
      </div>
    </main>
  );
}