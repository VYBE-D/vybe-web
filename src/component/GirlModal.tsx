"use client";

import { motion } from "framer-motion";

export default function GirlModal({ girl, onClose }: any) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-black/70 z-50 flex items-end"
    >
      <motion.div
        initial={{ y: 400 }}
        animate={{ y: 0 }}
        className="bg-black w-full max-h-[90vh] rounded-t-2xl overflow-y-auto"
      >
        <div className="p-4 flex justify-between">
          <h2>{girl.name}, {girl.age}</h2>
          <button onClick={onClose}>✕</button>
        </div>

        {girl.photos.map((p: string) => (
          <img key={p} src={p} className="w-full rounded-xl px-4 mb-2" />
        ))}

        <p className="p-4 text-gray-300">{girl.bio}</p>

        <div className="p-4">
          <button className="w-full bg-yellow-500 text-black py-3 rounded-xl">
            Send Request
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
