"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function StoresPage() {
  const [stores, setStores] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/stores")
      .then((res) => res.json())
      .then((data) => setStores(data));
  }, []);

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">All Stores</h1>
      <ul className="space-y-3">
        {stores.map((store) => (
          <li key={store.id} className="p-4 border rounded-lg">
            <Link href={`/stores/${store.id}`} className="text-lg font-semibold text-blue-600">
              {store.name}
            </Link>
            <p className="text-gray-600">{store.address}</p>
            <p>⭐ {store.avgRating ?? "No ratings yet"}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
