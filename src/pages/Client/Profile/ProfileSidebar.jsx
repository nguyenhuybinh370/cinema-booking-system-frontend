import { Ticket, History, RotateCcw, User, LogOut } from 'lucide-react';
import { assets } from '../../../assets/assets';

/**
 * ProfileSidebar — left column navigation panel.
 * Receives all display data and callbacks via props.
 * No API calls, no state.
 */
const ProfileSidebar = ({
  userInfo,
  activeTab,
  onTabChange,
  upcomingCount,
  pastCount,
  refundCount,
  onLogout,
}) => {
  const navItems = [
    {
      key: 'account',
      icon: <User size={18} className="shrink-0" />,
      label: 'Thông tin khách hàng',
    },
    {
      key: 'upcoming',
      icon: <Ticket size={18} className="shrink-0" />,
      label: `Vé Sắp Xem (${upcomingCount})`,
    },
    {
      key: 'past',
      icon: <History size={18} className="shrink-0" />,
      label: `Lịch sử mua hàng (${pastCount})`,
    },
    {
      key: 'refunds',
      icon: <RotateCcw size={18} className="shrink-0" />,
      label: `Yêu cầu hoàn tiền (${refundCount})`,
    },
  ];

  return (
    <div className="w-full lg:w-[280px] shrink-0 bg-[#3f3e85]/20 backdrop-blur-md rounded-3xl p-6 border border-white/5 text-center flex flex-col items-center gap-4 shadow-2xl">
      {/* Avatar */}
      <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-yellow-400 shadow-[0_0_20px_rgba(253,224,71,0.2)]">
        <img
          src={assets.profile || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150"}
          alt="User Avatar"
          className="w-full h-full object-cover"
        />
      </div>

      {/* User name / username */}
      <div className="text-center w-full mb-2">
        <h2 className="text-xl font-bold text-white tracking-wide truncate">
          {userInfo.name || 'Đang tải...'}
        </h2>
        <p className="text-[10px] text-gray-500 font-medium mt-0.5">@{userInfo.username}</p>
      </div>

      <div className="w-full h-px bg-white/5 my-1" />

      {/* Navigation */}
      <div className="w-full flex flex-col gap-1 text-left">
        {navItems.map(({ key, icon, label }) => (
          <button
            key={key}
            onClick={() => onTabChange(key)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
              activeTab === key
                ? 'bg-white/10 text-yellow-400 font-bold'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            {icon}
            <span className="whitespace-nowrap">{label}</span>
          </button>
        ))}

        <div className="w-full h-px bg-white/5 my-2" />

        {/* Logout */}
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-rose-500 hover:bg-rose-500/10 transition-all cursor-pointer"
        >
          <LogOut size={18} className="shrink-0" />
          <span className="whitespace-nowrap">Đăng xuất</span>
        </button>
      </div>
    </div>
  );
};

export default ProfileSidebar;
