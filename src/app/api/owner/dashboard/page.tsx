"use client";

import { useEffect, useState } from "react";
import LogoutButton from "@/components/LogoutButton";

export default function StoreOwnerDashboard() {
  const [storeData, setStoreData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) return;

    const user = JSON.parse(storedUser);

    // TODO: Replace with logic to get the store owned by this user
    // For simplicity, assuming one store per owner
    fetch(`/api/owner/stores/${user.storeId}/ratings`)
      .then((res) => res.json())
      .then((data) => {
        setStoreData(data);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading...</p>;
  if (!storeData) return <p>No store found for this user.</p>;

  return (
    <div className="max-w-3xl mx-auto mt-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Store Owner Dashboard</h1>
        <LogoutButton />
      </div>

      <div className="mb-4 p-4 border rounded shadow">
        <h2 className="text-xl font-semibold">{storeData.store.name}</h2>
        <p className="text-gray-600">{storeData.store.address}</p>
        <p className="mt-2">
          ⭐ Average Rating: {storeData.avgRating ?? "No ratings yet"}
        </p>
      </div>

      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-3">User Ratings</h2>
        {storeData.ratings.length === 0 ? (
          <p>No ratings yet.</p>
        ) : (
          <table className="w-full border rounded">
            <thead>
              <tr className="bg-gray-200">
                <th className="border px-4 py-2">User Name</th>
                <th className="border px-4 py-2">Email</th>
                <th className="border px-4 py-2">Rating</th>
              </tr>
            </thead>
            <tbody>
              {storeData.ratings.map((r: any) => (
                <tr key={r.id}>
                  <td className="border px-4 py-2">{r.user.name}</td>
                  <td className="border px-4 py-2">{r.user.email}</td>
                  <td className="border px-4 py-2">{r.score} ⭐</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
