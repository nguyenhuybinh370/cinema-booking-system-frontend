import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import axiosClient from '../../../api/axiosClient';
import AdminConfirmDialog from '../Common/AdminConfirmDialog';
import {
  BarChart3, CalendarDays, ChevronRight, CircleUserRound, Clock3,
  Film, Grid3X3, LogOut, ReceiptText, Theater,
  UserRoundCog, WalletCards, X,
} from 'lucide-react';

const navigationGroups = [
  {
    label: 'Tổng quan',
    items: [{ name: 'Tổng quan', icon: BarChart3, path: '/admin/stats' }],
  },
  {
    label: 'Quản lý rạp',
    items: [
      { name: 'Phim', icon: Film, path: '/admin/movies' },
      { name: 'Suất chiếu', icon: CalendarDays, path: '/admin/showtimes' },
      { name: 'Phòng chiếu', icon: Theater, path: '/admin/rooms' },
      { name: 'Sơ đồ mẫu', icon: Grid3X3, path: '/admin/seat-templates' },
      { name: 'Bảng giá', icon: WalletCards, path: '/admin/pricing' },
    ],
  },
  {
    label: 'Hệ thống',
    items: [
      { name: 'Nhân viên', icon: UserRoundCog, path: '/admin/personnel' },
      { name: 'Ca làm việc', icon: Clock3, path: '/admin/shifts' },
      { name: 'Khách hàng', icon: CircleUserRound, path: '/admin/customers' },
      { name: 'Giao dịch', icon: ReceiptText, path: '/admin/transactions' },
    ],
  },
];

const AdminSidebar = ({ isOpen = false, onClose }) => {
  const userName = localStorage.getItem('userName') || 'Quản trị viên';
  const userRole = localStorage.getItem('userRole') || 'ADMIN';
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const initials = userName.trim().split(/\s+/).slice(-2).map((part) => part[0]).join('').toUpperCase();

  const handleLogoutSubmit = async () => {
    setIsLoggingOut(true);
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) await axiosClient.post('/auth/logout', { refreshToken });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoggingOut(false);
      setIsConfirmOpen(false);
      ['accessToken', 'refreshToken', 'userRole', 'userName', 'userCode'].forEach((key) => localStorage.removeItem(key));
      window.location.href = '/login';
    }
  };

  return (
    <>
      <aside className={`admin-sidebar ${isOpen ? 'admin-sidebar--open' : ''}`} aria-label="Điều hướng quản trị">
        <div className="admin-brand">
          <div className="admin-brand-mark" aria-hidden="true"><span /><span /></div>
          <div>
            <div className="admin-wordmark">NEX<span>CINEMA</span></div>
            <div className="admin-brand-caption">Bảng điều khiển</div>
          </div>
          <button type="button" className="admin-sidebar-close lg:hidden" onClick={onClose} aria-label="Đóng menu">
            <X size={20} />
          </button>
        </div>

        <nav className="admin-navigation">
          {navigationGroups.map((group) => (
            <div key={group.label} className="admin-nav-group">
              <p>{group.label}</p>
              {group.items.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={onClose}
                  className={({ isActive }) => `admin-nav-link ${isActive ? 'admin-nav-link--active' : ''}`}
                >
                  <item.icon size={18} strokeWidth={1.7} aria-hidden="true" />
                  <span>{item.name}</span>
                  <ChevronRight className="admin-nav-chevron" size={14} aria-hidden="true" />
                </NavLink>
              ))}
            </div>
          ))}
        </nav>

        <div className="admin-account">
          <div className="admin-account-summary">
            <span className="admin-avatar">{initials || 'QT'}</span>
            <span className="min-w-0 flex-1">
              <strong>{userName}</strong>
              <small>{userRole === 'ADMIN' ? 'Quản trị hệ thống' : userRole}</small>
            </span>
          </div>
          <button type="button" className="admin-logout" onClick={() => setIsConfirmOpen(true)}>
            <LogOut size={17} strokeWidth={1.8} />
            Đăng xuất
          </button>
        </div>
      </aside>

      <AdminConfirmDialog
        isOpen={isConfirmOpen}
        title="Đăng xuất khỏi NexCinema?"
        message="Phiên làm việc hiện tại sẽ kết thúc. Bạn cần đăng nhập lại để tiếp tục quản trị."
        confirmText="Đăng xuất"
        cancelText="Ở lại"
        variant="danger"
        isLoading={isLoggingOut}
        onConfirm={handleLogoutSubmit}
        onCancel={() => setIsConfirmOpen(false)}
      />
    </>
  );
};

export default AdminSidebar;
