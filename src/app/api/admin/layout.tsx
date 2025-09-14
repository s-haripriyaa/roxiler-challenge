export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white p-4">
        <h1 className="text-xl font-bold mb-6">Admin Panel</h1>
        <nav className="flex flex-col gap-3">
          <a href="/admin/dashboard">📊 Dashboard</a>
          <a href="/admin/users">👤 Users</a>
          <a href="/admin/stores">🏪 Stores</a>
        </nav>
      </aside>

      {/* Content */}
      <main className="flex-1 p-6 bg-gray-50">{children}</main>
    </div>
  );
}
