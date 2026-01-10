export default function ActivityCard({ onViewHistory }: { onViewHistory: () => void }) {
  return (
    <div className="bg-white/5 border border-white/10 p-6 rounded-3xl">
      {/* ... your card UI ... */}
      <button onClick={onViewHistory} className="text-xs font-bold text-zinc-500 uppercase tracking-widest">
        View all history
      </button>
    </div>
  );
}