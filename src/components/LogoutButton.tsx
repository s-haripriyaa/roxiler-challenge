"use client";

import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = () => {
    // Clear cookie by setting it to empty with expired time
    document.cookie = "user=; Max-Age=0; path=/";

    // (Optional) also clear localStorage if you still keep backup there
    localStorage.removeItem("user");

    // Redirect to login page
    router.push("/login");
  };

  return (
    <button
      onClick={handleLogout}
      className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
    >
      Logout
    </button>
  );
}
