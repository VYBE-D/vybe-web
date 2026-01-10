export default function EventCard({ event }: any) {
  return (
    <div className="bg-gray-900 rounded-xl overflow-hidden">
      <img src={event.cover} className="h-40 w-full object-cover" />
      <div className="p-3">
        <h3>{event.title}</h3>
        <p className="text-gray-400 text-sm">{event.date}</p>
      </div>
    </div>
  );
}
