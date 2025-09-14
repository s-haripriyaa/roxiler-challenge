"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function UpdatePasswordPage() {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleUpdate = async () => {
    setMessage("");
    setError("");

    // Basic frontend validation
    if (newPassword !== confirmPassword) {
      setError("New password and confirm password do not match.");
      return;
    }

    // Password pattern: 8-16 chars, at least one uppercase & one special char
    const pwRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,16}$/;
    if (!pwRegex.test(newPassword)) {
      setError(
        "Password must be 8-16 characters, include at least one uppercase letter and one special character."
      );
      return;
    }

    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      setError("You must be logged in to update password.");
      return;
    }

    const user = JSON.parse(storedUser);

    try {
      const res = await fetch("/api/auth/update-password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          oldPassword,
          newPassword,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("Password updated successfully!");
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        setError(data.error || "Failed to update password");
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Update Password</h1>

      {message && <p className="text-green-500 mb-2">{message}</p>}
      {error && <p className="text-red-500 mb-2">{error}</p>}

      <input
        type="password"
        placeholder="Old Password"
        className="w-full border p-2 mb-3 rounded"
        value={oldPassword}
        onChange={(e) => setOldPassword(e.target.value)}
      />

      <input
        type="password"
        placeholder="New Password"
        className="w-full border p-2 mb-3 rounded"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
      />

      <input
        type="password"
        placeholder="Confirm New Password"
        className="w-full border p-2 mb-4 rounded"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
      />

      <button
        onClick={handleUpdate}
        className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
      >
        Update Password
      </button>
    </div>
  );
}
