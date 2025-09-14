"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface RateStorePageProps {
  params: { id: string };
}

export default function RateStorePage({ params }: RateStorePageProps) {
  const storeId = params.id; // safe for now
  const [rating, setRating] = useState(1); // default 1–5
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch(`/api/stores/${storeId}/rating`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ score: rating, comment }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Rating failed");
      } else {
        router.push(`/stores/${storeId}`);
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-8">
      <h1 className="text-3xl font-bold mb-6">Rate Store</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full max-w-sm">
        <label className="flex flex-col gap-1">
          Rating (1-5)
          <input
            type="number"
            value={rating}
            onChange={(e) => setRating(Number(e.target.value))}
            min={1}
            max={5}
            required
            className="p-2 border rounded"
          />
        </label>

        <label className="flex flex-col gap-1">
          Comment (optional)
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="p-2 border rounded"
          />
        </label>

        <button
          type="submit"
          disabled={loading}
          className="p-2 bg-blue-500 text-white rounded"
        >
          {loading ? "Submitting..." : "Submit"}
        </button>

        {error && <p className="text-red-500 mt-2">{error}</p>}
      </form>
    </main>
  );
}
