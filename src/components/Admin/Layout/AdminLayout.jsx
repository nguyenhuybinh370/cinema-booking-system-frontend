
import { useState } from 'react';
import { Menu } from 'lucide-react';
import AdminSidebar from './AdminSidebar';

const AdminLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="admin-app min-h-screen bg-[var(--admin-canvas)] text-[var(--admin-text)]">
      <AdminSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {isSidebarOpen && (
        <button
          type="button"
          aria-label="Đóng menu quản trị"
          className="admin-sidebar-backdrop"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <div className="min-h-screen lg:pl-[248px]">
        <header className="admin-mobile-header lg:hidden">
          <button
            type="button"
            className="admin-icon-button"
            aria-label="Mở menu quản trị"
            onClick={() => setIsSidebarOpen(true)}
          >
            <Menu size={20} strokeWidth={1.8} />
          </button>
          <span className="admin-wordmark">NEX<span>CINEMA</span></span>
        </header>

        <main className="px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          <div className="mx-auto max-w-[1440px]">{children}</div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
