export default function GirlSkeleton() {
  return (
    <div className="bg-gray-800 rounded-xl overflow-hidden animate-pulse">
      <div className="h-56 bg-gray-700" />
      <div className="p-2 space-y-2">
        <div className="h-4 bg-gray-700 rounded w-3/4" />
        <div className="h-4 bg-gray-700 rounded w-1/2" />
      </div>
    </div>
  );
}
