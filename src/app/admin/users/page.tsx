"use client";

import { useEffect, useState } from "react";

export default function UsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [editing, setEditing] = useState<any | null>(null);
  const [form, setForm] = useState({ name: "", email: "", role: "USER" });

  // Fetch all users
  const loadUsers = () => {
    fetch("/api/admin/users")
      .then((res) => res.json())
      .then(setUsers);
  };

  useEffect(() => {
    loadUsers();
  }, []);

  // Delete user
  const deleteUser = async (id: number) => {
    await fetch(`/api/admin/users/${id}`, { method: "DELETE" });
    loadUsers();
  };

  // Start editing
  const startEdit = (user: any) => {
    setEditing(user.id);
    setForm({ name: user.name, email: user.email, role: user.role });
  };

  // Save update
  const saveEdit = async (id: number) => {
    await fetch(`/api/admin/users/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setEditing(null);
    loadUsers();
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">👤 Users</h2>
      <table className="w-full bg-white border">
        <thead>
          <tr className="bg-gray-200 text-left text-gray-900">
            <th className="p-2 border">Name</th>
            <th className="p-2 border">Email</th>
            <th className="p-2 border">Role</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id}>
              <td className="p-2 border text-gray-900">
                {editing === u.id ? (
                  <input
                    className="border p-1"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                ) : (
                  u.name
                )}
              </td>
              <td className="p-2 border text-gray-900">
                {editing === u.id ? (
                  <input
                    className="border p-1"
                    value={form.email}
                    onChange={(e) =>
                      setForm({ ...form, email: e.target.value })
                    }
                  />
                ) : (
                  u.email
                )}
              </td>
              <td className="p-2 border text-gray-900">
                {editing === u.id ? (
                  <select
                    value={form.role}
                    onChange={(e) => setForm({ ...form, role: e.target.value })}
                    className="border p-1"
                  >
                    <option value="ADMIN">ADMIN</option>
                    <option value="USER">USER</option>
                    <option value="OWNER">OWNER</option>
                  </select>
                ) : (
                  u.role
                )}
              </td>
              <td className="p-2 border">
                {editing === u.id ? (
                  <button
                    className="bg-green-500 text-white px-3 py-1 rounded mr-2"
                    onClick={() => saveEdit(u.id)}
                  >
                    Save
                  </button>
                ) : (
                  <button
                    className="bg-blue-500 text-white px-3 py-1 rounded mr-2"
                    onClick={() => startEdit(u)}
                  >
                    Edit
                  </button>
                )}
                <button
                  className="bg-red-500 text-white px-3 py-1 rounded"
                  onClick={() => deleteUser(u.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
