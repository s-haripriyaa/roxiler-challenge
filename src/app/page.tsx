"use client";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-8">
      <h1 className="text-4xl font-bold mb-6">Welcome to Store Rating App</h1>

      <div className="flex gap-6">
        <Link href="/signup" className="bg-blue-500 text-white px-4 py-2 rounded">
          Sign Up
        </Link>
        <Link href="/login" className="bg-green-500 text-white px-4 py-2 rounded">
          Login
        </Link>
        <Link href="/stores" className="bg-purple-500 text-white px-4 py-2 rounded">
          Browse Stores
        </Link>
      </div>
    </main>
  );
}
