"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function StoreDetailsPage() {
  const { id } = useParams();
  const [store, setStore] = useState<any>(null);

  useEffect(() => {
    fetch(`/api/stores/${id}`)
      .then((res) => res.json())
      .then((data) => setStore(data));
  }, [id]);

  if (!store) return <p>Loading...</p>;

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold">{store.name}</h1>
      <p className="text-gray-600">{store.address}</p>
      <p className="mt-2">⭐ Avg Rating: {store.avgRating ?? "No ratings yet"}</p>

      <a
        href={`/stores/${id}/rate`}
        className="inline-block mt-4 bg-green-500 text-white px-4 py-2 rounded"
      >
        Rate this Store
      </a>
    </div>
  );
}
