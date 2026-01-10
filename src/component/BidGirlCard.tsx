import { motion } from "framer-motion";

export default function BidGirlCard({ girl }: any) {
  return (
    <motion.div
      whileTap={{ scale: 0.97 }}
      className="bg-gray-900 rounded-xl overflow-hidden"
    >
      <img src={girl.photo} className="h-40 w-full object-cover" />
      <div className="p-2">
        <p className="font-semibold">{girl.name}</p>
        <p className="text-sm text-gray-400">From ${girl.minBid}</p>
        <button className="mt-2 w-full bg-pink-600 py-1 rounded-lg">
          Place Bid
        </button>
      </div>
    </motion.div>
  );
}
