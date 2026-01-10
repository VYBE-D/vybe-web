export default function MembershipCard({ onUpgrade }: { onUpgrade: () => void }) {
  return (
    <div className="bg-white/5 border border-white/10 p-6 rounded-3xl">
      {/* ... your card UI ... */}
      <button onClick={onUpgrade} className="w-full py-3 bg-white text-black font-black italic uppercase rounded-full">
        Upgrade Member
      </button>
    </div>
  );
}