"use client";
import AdminNavbar from "@/components/AdminNavbar"; // adjust path if needed


import { useEffect, useState } from "react";

export default function DashboardPage() {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    fetch("/api/admin/dashboard")
      .then((res) => res.json())
      .then(setStats);
  }, []);

  if (!stats) return <p>Loading...</p>;

  return (
    <div>
      {/* ✅ Navbar at the top */}
      <AdminNavbar />

      {/* ✅ Dashboard content */}
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-6">📊 Dashboard</h2>
        <div className="grid grid-cols-3 gap-6">
          <div className="p-6 bg-white rounded shadow">
            <p className="text-gray-600">Total Users</p>
            <p className="text-3xl font-bold text-gray-900">{stats.totalUsers}</p>
          </div>
          <div className="p-6 bg-white rounded shadow">
            <p className="text-gray-600">Total Stores</p>
            <p className="text-3xl font-bold text-gray-900">{stats.totalStores}</p>
          </div>
          <div className="p-6 bg-white rounded shadow">
            <p className="text-gray-600">Total Ratings</p>
            <p className="text-3xl font-bold text-gray-900">{stats.totalRatings}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
