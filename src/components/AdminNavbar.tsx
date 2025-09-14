"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AdminNavbar() {
  const pathname = usePathname();

  const links = [
    { label: "Dashboard", href: "/admin/dashboard" },
    { label: "Users", href: "/admin/users" },
    { label: "Stores", href: "/admin/stores" },
    { label: "Filters", href: "/admin/stores/filters" },
  ];

  return (
    <nav className="bg-gray-800 text-white px-6 py-3 flex gap-6">
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={`hover:text-green-400 transition ${
            pathname === link.href ? "text-green-400 font-semibold" : ""
          }`}
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
}
