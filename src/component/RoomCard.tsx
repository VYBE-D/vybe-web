import { motion } from "framer-motion";

export default function RoomCard({ room }: any) {
  return (
    <motion.div
      whileTap={{ scale: 0.98 }}
      className="bg-gray-900 p-3 rounded-xl flex justify-between items-center"
    >
      <div>
        <p className="font-semibold">{room.name}</p>
        <p className="text-sm text-gray-400">${room.price}</p>
      </div>
      <button className="bg-yellow-500 text-black px-4 py-1 rounded-lg">
        Reserve
      </button>
    </motion.div>
  );
}
