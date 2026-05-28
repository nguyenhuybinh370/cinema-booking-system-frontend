
import AdminSidebar from './AdminSidebar';

const AdminLayout = ({ children }) => {
  return (
    <div className="flex min-h-screen text-slate-200 font-sans">
      <AdminSidebar />
      <main className="flex-grow p-8 overflow-y-auto bg-black/[0.15]">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
