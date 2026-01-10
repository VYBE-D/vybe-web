import BidGirlCard from "../../../../component/BidGirlCard";
import RoomCard from "../../../../component/RoomCard";

const girls = [
  { id: "1", name: "Anna", photo: "/g1.jpg", minBid: 200 },
  { id: "2", name: "Bella", photo: "/g2.jpg", minBid: 300 },
];

const rooms = [
  { id: "r1", name: "VIP Room", price: 500 },
  { id: "r2", name: "Private Suite", price: 900 },
];

export default function EventDetailsPage() {
  return (
    <main className="pb-20">
      {/* Header */}
      <div className="h-56 bg-gray-900 flex items-end p-4">
        <h1 className="text-xl font-bold">Night Vibes Party</h1>
      </div>

      {/* Girls */}
      <section className="p-4">
        <h2 className="font-semibold mb-3">Top Girls</h2>
        <div className="grid grid-cols-2 gap-3">
          {girls.map((girl) => (
            <BidGirlCard key={girl.id} girl={girl} />
          ))}
        </div>
      </section>

      {/* Rooms */}
      <section className="p-4">
        <h2 className="font-semibold mb-3">Available Rooms</h2>
        <div className="space-y-3">
          {rooms.map((room) => (
            <RoomCard key={room.id} room={room} />
          ))}
        </div>
      </section>
    </main>
  );
}
