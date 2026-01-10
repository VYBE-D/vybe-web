import { motion } from "framer-motion";

type Girl = {
  id: string;
  name: string;
  age: number;
  photos: string[];
  bio: string;
};

type Props = {
  girl: Girl;
  onClick: () => void;
};

export default function GirlCard({ girl, onClick }: Props) {
  return (
    <motion.div
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className="bg-gray-900 rounded-xl overflow-hidden cursor-pointer"
    >
      <img
        src={girl.photos[0]}
        className="h-56 w-full object-cover"
        alt={girl.name}
      />
      <div className="p-2 font-semibold">
        {girl.name}, {girl.age}
      </div>
    </motion.div>
  );
}
