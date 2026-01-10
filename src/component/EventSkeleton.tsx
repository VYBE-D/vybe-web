export default function EventSkeleton() {
  return (
    <div className="bg-gray-800 rounded-xl animate-pulse overflow-hidden">
      <div className="h-40 bg-gray-700" />
      <div className="p-3 space-y-2">
        <div className="h-4 bg-gray-700 rounded w-3/4" />
        <div className="h-4 bg-gray-700 rounded w-1/2" />
      </div>
    </div>
  );
}
