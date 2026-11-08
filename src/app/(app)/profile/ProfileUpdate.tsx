"use client";

import { useState, useEffect } from "react";
import { supabase } from "../../../lib/supabase";

export default function ProfileUpdate() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [nickname, setNickname] = useState("");
  const [city, setCity] = useState("");
  const [photos, setPhotos] = useState<File[]>([]);

  useEffect(() => {
    async function fetchProfile() {
      const user = supabase.auth.getUser();
      const { data } = await supabase.from("profiles").select("*").eq("id", (await user).data.user?.id).single();
      if (data) {
        setProfile(data);
        setNickname(data.nickname);
        setCity(data.city);
      }
      setLoading(false);
    }
    fetchProfile();
  }, []);

  const uploadPhotos = async () => {
    const urls: string[] = [];
    if (!profile) return [];
    for (const file of photos) {
      const ext = file.name.split(".").pop();
      const path = `${profile.id}/${crypto.randomUUID()}.${ext}`;
      await supabase.storage.from("users").upload(path, file);
      const { data } = supabase.storage.from("users").getPublicUrl(path);
      urls.push(data.publicUrl);
    }
    return urls;
  };

  const updateProfile = async () => {
    const photoUrls = await uploadPhotos();
    const { error } = await supabase.from("profiles").update({
      nickname,
      city,
      photos: [...(profile.photos || []), ...photoUrls],
    }).eq("id", profile.id);
    if (error) alert(error.message);
    else alert("Profile updated!");
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="p-4 bg-gray-900 rounded-xl space-y-3">
      <input className="input" placeholder="Nickname" value={nickname} onChange={(e) => setNickname(e.target.value)} />
      <input className="input" placeholder="City" value={city} onChange={(e) => setCity(e.target.value)} />
      <input type="file" multiple onChange={(e) => setPhotos([...photos, ...(e.target.files ? Array.from(e.target.files) : [])])} />
      <button className="w-full bg-red-600 py-2 rounded-full" onClick={updateProfile}>Update Profile</button>
    </div>
  );
}
