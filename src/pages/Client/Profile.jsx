import { useState, useEffect } from 'react';
import { Ticket, History, Star, MessageSquare, X, Calendar, MapPin, CreditCard, User, LogOut, Copy, Check, ExternalLink } from 'lucide-react';
import { assets } from '../../assets/assets';
import { formatVND } from '../../utils/formatHelper';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import axiosClient from '../../api/axiosClient';
import { getCustomerProfile, updateCustomerProfile, changeCustomerPassword } from '../../api/accountApi';
import { getBookingHistory, getBookingDetail } from '../../api/bookingHistoryApi';
import { getMovieVisuals } from '../../utils/visualHelper';

const Profile = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('account'); 
  
  // --- STATE QUẢN LÝ BIỂU MẪU ĐÁNH GIÁ ---
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [hoverRating, setHoverRating] = useState(0);

  // --- STATE QUẢN LÝ PROFILE TỪ BACKEND ---
  const [profileLoading, setProfileLoading] = useState(true);
  const [profileError, setProfileError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);

  const [userInfo, setUserInfo] = useState({
    name: '',
    dob: '',
    phone: '',
    email: '',
    username: '',
    gender: ''
  });

  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // --- STATE QUẢN LÝ LỊCH SỬ ĐẶT VÉ ---
  const [bookings, setBookings] = useState([]);
  const [bookingsLoading, setBookingsLoading] = useState(true);
  const [bookingsError, setBookingsError] = useState(null);

  const [bookingDetail, setBookingDetail] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [copiedTicketId, setCopiedTicketId] = useState("");

  // --- FETCH PROFILE & BOOKINGS FROM BACKEND ON MOUNT ---
  useEffect(() => {
    const fetchData = async () => {
      // Fetch Profile
      setProfileLoading(true);
      setProfileError(null);
      try {
        const parseDate = (dStr) => {
          if (!dStr) return '';
          const d = new Date(dStr);
          if (isNaN(d.getTime())) return '';
          const yyyy = d.getFullYear();
          const mm = String(d.getMonth() + 1).padStart(2, '0');
          const dd = String(d.getDate()).padStart(2, '0');
          return `${yyyy}-${mm}-${dd}`;
        };

        const data = await getCustomerProfile();
        const mapped = {
          name: data.HoTen || '',
          dob: parseDate(data.NgaySinh),
          phone: data.SoDienThoai || '',
          email: data.Email || '',
          username: data.TenDangNhap || '',
          gender: data.GioiTinh === true ? 'Nam' : data.GioiTinh === false ? 'Nữ' : ''
        };
        setUserInfo(mapped);

        // Sync localStorage for Navbar display
        localStorage.setItem("userName", data.HoTen || '');
        localStorage.setItem("userInfo", JSON.stringify(data));
      } catch (err) {
        console.error("Lỗi khi lấy thông tin tài khoản:", err);
        setProfileError(err?.message || "Không thể tải thông tin tài khoản.");
      } finally {
        setProfileLoading(false);
      }

      // Fetch Booking History
      setBookingsLoading(true);
      setBookingsError(null);
      try {
        const res = await getBookingHistory({ page: 1, limit: 100 });
        setBookings(res.data || []);
      } catch (err) {
        console.error("Lỗi khi tải lịch sử đặt vé:", err);
        setBookingsError(err?.message || "Không thể tải lịch sử đặt vé.");
      } finally {
        setBookingsLoading(false);
      }
    };
    fetchData();
  }, []);

  // Helper to open details modal
  const handleOpenDetail = async (maPhieuDat) => {
    setIsDetailOpen(true);
    setDetailLoading(true);
    setBookingDetail(null);
    try {
      const data = await getBookingDetail(maPhieuDat);
      setBookingDetail(data);
    } catch (err) {
      console.error("Lỗi khi tải chi tiết phiếu đặt:", err);
      toast.error(err?.message || "Không thể tải chi tiết phiếu đặt.");
      setIsDetailOpen(false);
    } finally {
      setDetailLoading(false);
    }
  };

  // Helper to copy ticket ID to clipboard
  const handleCopyTicketId = (id) => {
    navigator.clipboard.writeText(id);
    setCopiedTicketId(id);
    toast.success("Đã sao chép mã vé!");
    setTimeout(() => {
      setCopiedTicketId("");
    }, 2000);
  };

  // Mapping helpers for badges
  const getBookingStatusLabel = (status) => {
    switch (status) {
      case 'CHO_THANH_TOAN': 
        return { text: 'Chờ thanh toán', css: 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20' };
      case 'DA_THANH_TOAN': 
        return { text: 'Đã thanh toán', css: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' };
      case 'DA_HUY': 
        return { text: 'Đã hủy', css: 'bg-gray-500/10 text-gray-400 border border-gray-500/20' };
      default: 
        return { text: status, css: 'bg-white/5 text-gray-400 border border-white/5' };
    }
  };

  const getTransactionStatusLabel = (status) => {
    switch (status) {
      case 'CHO_XU_LY': 
        return { text: 'Chờ xử lý', css: 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20' };
      case 'THANH_CONG': 
        return { text: 'Thành công', css: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' };
      case 'THAT_BAI': 
        return { text: 'Thất bại', css: 'bg-rose-500/10 text-rose-400 border border-rose-500/20' };
      case 'DA_HOAN_TIEN': 
        return { text: 'Đã hoàn tiền', css: 'bg-blue-500/10 text-blue-400 border border-blue-500/20' };
      default: 
        return { text: status, css: 'bg-white/5 text-gray-400 border border-white/5' };
    }
  };

  // Filter bookings using timezone-safe Date comparisons and status
  const now = new Date();
  const upcomingTickets = bookings.filter(item => {
    const showtimeStart = new Date(item.Phim?.GioChieu || item.Phim?.NgayChieu || 0);
    return item.TrangThai === 'DA_THANH_TOAN' && showtimeStart >= now;
  });

  const pastTickets = bookings.filter(item => {
    const showtimeStart = new Date(item.Phim?.GioChieu || item.Phim?.NgayChieu || 0);
    return item.TrangThai !== 'DA_THANH_TOAN' || showtimeStart < now;
  });

  // Xử lý Lưu thông tin cá nhân
  const handleSaveInfo = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        HoTen: userInfo.name || undefined,
        Email: userInfo.email || undefined,
        SoDienThoai: userInfo.phone || undefined,
      };

      if (userInfo.gender === 'Nam') {
        payload.GioiTinh = true;
      } else if (userInfo.gender === 'Nữ') {
        payload.GioiTinh = false;
      }

      if (userInfo.dob) {
        payload.NgaySinh = userInfo.dob;
      }

      const updated = await updateCustomerProfile(payload);

      const parseDate = (dStr) => {
        if (!dStr) return '';
        const d = new Date(dStr);
        if (isNaN(d.getTime())) return '';
        const yyyy = d.getFullYear();
        const mm = String(d.getMonth() + 1).padStart(2, '0');
        const dd = String(d.getDate()).padStart(2, '0');
        return `${yyyy}-${mm}-${dd}`;
      };

      // Re-map response back to local state
      setUserInfo({
        name: updated.HoTen || '',
        dob: parseDate(updated.NgaySinh),
        phone: updated.SoDienThoai || '',
        email: updated.Email || '',
        username: updated.TenDangNhap || userInfo.username,
        gender: updated.GioiTinh === true ? 'Nam' : updated.GioiTinh === false ? 'Nữ' : ''
      });

      // Sync localStorage for Navbar display
      localStorage.setItem("userName", updated.HoTen || '');
      localStorage.setItem("userInfo", JSON.stringify(updated));

      toast.success("Lưu thông tin khách hàng thành công!");
    } catch (err) {
      console.error("Lỗi cập nhật thông tin:", err);
      toast.error(err?.message || "Cập nhật thông tin thất bại!");
    } finally {
      setSaving(false);
    }
  };

  // Xử lý Đổi mật khẩu
  const handleUpdatePassword = async (e) => {
    e.preventDefault();

    if (passwordData.newPassword.length < 6) {
      toast.error("Mật khẩu mới phải có ít nhất 6 ký tự!");
      return;
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("Mật khẩu xác thực mới không trùng khớp!");
      return;
    }
    if (passwordData.newPassword === passwordData.oldPassword) {
      toast.error("Mật khẩu mới phải khác mật khẩu cũ!");
      return;
    }

    setChangingPassword(true);
    try {
      await changeCustomerPassword({
        MatKhauCu: passwordData.oldPassword,
        MatKhauMoi: passwordData.newPassword,
        XacNhanMatKhauMoi: passwordData.confirmPassword
      });

      toast.success("Đổi mật khẩu thành công! Vui lòng đăng nhập lại.");
      setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });

      // Backend revokes refresh tokens on password change, so log out
      setTimeout(() => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("userRole");
        localStorage.removeItem("userName");
        localStorage.removeItem("userCode");
        localStorage.removeItem("userInfo");
        navigate("/login");
      }, 1500);
    } catch (err) {
      console.error("Lỗi đổi mật khẩu:", err);
      toast.error(err?.message || "Đổi mật khẩu thất bại!");
    } finally {
      setChangingPassword(false);
    }
  };

  // Xử lý Đăng xuất
  const handleLogout = async () => {
    toast.loading("Đang đăng xuất...");
    try {
      const refreshToken = localStorage.getItem("refreshToken");
      if (refreshToken) {
        await axiosClient.post("/auth/logout", { refreshToken });
      }
    } catch (e) {
      console.error("Logout API error:", e);
    } finally {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("userRole");
      localStorage.removeItem("userName");
      localStorage.removeItem("userCode");
      localStorage.removeItem("userInfo");
      
      toast.dismiss();
      toast.success("Đã đăng xuất tài khoản!");
      navigate("/login");
    }
  };

  const openReviewModal = (movie) => {
    setSelectedMovie(movie);
    setRating(5);
    setComment('');
    setIsReviewOpen(true);
  };

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    toast.success(`Đánh giá phim ${selectedMovie?.title} thành công!`);
    setIsReviewOpen(false);
  };

  const formatDateTime = (isoString) => {
    if (!isoString) return "";
    const date = new Date(isoString);
    const timeStr = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
    const dateStr = date.toLocaleDateString([], { day: '2-digit', month: '2-digit', year: 'numeric' });
    return `${timeStr} - ${dateStr}`;
  };

  return (
    <div className="min-h-screen pt-28 pb-16 px-6 md:px-16 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr_3fr] gap-10 items-start">
      
      {/* KHỐI TRÁI: THÔNG TIN USER PROFILE (SIDEBAR ĐÃ GỌN NHẸ) */}
      <div className="bg-[#3f3e85]/20 backdrop-blur-md rounded-3xl p-6 border border-white/5 text-center flex flex-col items-center gap-4 shadow-2xl">
        <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-yellow-400 shadow-[0_0_20px_rgba(253,224,71,0.2)]">
          <img 
            src={assets.profile || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150"} 
            alt="User Avatar" 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="text-center w-full mb-2">
          <h2 className="text-xl font-bold text-white tracking-wide truncate">{userInfo.name || 'Đang tải...'}</h2>
          <p className="text-[10px] text-gray-500 font-medium mt-0.5">@{userInfo.username}</p>
        </div>
        
        <div className="w-full h-px bg-white/5 my-1"></div>
        
        {/* Menu Điều Hướng Dọc */}
        <div className="w-full flex flex-col gap-1 text-left">
          <button 
            onClick={() => setActiveTab('account')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
              activeTab === 'account' ? 'bg-white/10 text-yellow-400 font-bold' : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <User size={18} />
            <span>Thông tin khách hàng</span>
          </button>

          <button 
            onClick={() => setActiveTab('upcoming')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
              activeTab === 'upcoming' ? 'bg-white/10 text-yellow-400 font-bold' : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Ticket size={18} />
            <span>Vé Sắp Xem ({upcomingTickets.length})</span>
          </button>
          
          <button 
            onClick={() => setActiveTab('past')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
              activeTab === 'past' ? 'bg-white/10 text-yellow-400 font-bold' : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <History size={18} />
            <span>Lịch sử mua hàng ({pastTickets.length})</span>
          </button>

          <div className="w-full h-px bg-white/5 my-2"></div>

          {/* NÚT ĐĂNG XUẤT TÀI KHOẢN */}
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-rose-500 hover:bg-rose-500/10 transition-all cursor-pointer"
          >
            <LogOut size={18} />
            <span>Đăng xuất</span>
          </button>
        </div>
      </div>

      {/* KHỐI PHẢI: CHI TIẾT NỘI DUNG TỪNG TAB */}
      <div className="w-full flex flex-col gap-6 text-left">
        
        {/* ================= TAB 1: THÔNG TIN KHÁCH HÀNG ================= */}
        {activeTab === 'account' && (
          <div className="flex flex-col gap-8 animate-in fade-in duration-300">
            <h2 className="text-3xl font-black uppercase tracking-wider italic text-white">Thông Tin Khách Hàng</h2>
            
            {profileLoading ? (
              <div className="flex items-center justify-center py-16">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#ff436e]"></div>
                <p className="text-gray-400 ml-4">Đang tải thông tin...</p>
              </div>
            ) : profileError ? (
              <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6 text-center">
                <p className="text-red-400 font-bold">{profileError}</p>
              </div>
            ) : (
              <>
                {/* KHỐI A: THÔNG TIN CÁ NHÂN */}
                <div className="bg-white p-6 rounded-2xl flex flex-col gap-6 text-slate-900 shadow-xl">
                  <h3 className="text-xl font-extrabold border-b border-gray-100 pb-2 uppercase tracking-tight">Thông tin cá nhân</h3>
                  
                  <form onSubmit={handleSaveInfo} className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-bold text-gray-700">Họ và tên</label>
                      <input 
                        type="text" 
                        value={userInfo.name}
                        onChange={(e) => setUserInfo({...userInfo, name: e.target.value})}
                        className="w-full border border-gray-300 bg-gray-50 rounded-lg p-3 text-sm focus:outline-none focus:border-slate-900 font-medium"
                      />
                    </div>

                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-bold text-gray-700">Ngày sinh</label>
                      <input 
                        type="date" 
                        value={userInfo.dob}
                        onChange={(e) => setUserInfo({...userInfo, dob: e.target.value})}
                        className="w-full border border-gray-300 bg-gray-50 rounded-lg p-3 text-sm focus:outline-none focus:border-slate-900 font-medium"
                      />
                    </div>

                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-bold text-gray-700">Số điện thoại</label>
                      <input 
                        type="tel" 
                        value={userInfo.phone}
                        onChange={(e) => setUserInfo({...userInfo, phone: e.target.value})}
                        className="w-full border border-gray-300 bg-gray-50 rounded-lg p-3 text-sm focus:outline-none focus:border-slate-900 font-medium"
                      />
                    </div>

                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-bold text-gray-700">Email</label>
                      <input 
                        type="email" 
                        value={userInfo.email}
                        onChange={(e) => setUserInfo({...userInfo, email: e.target.value})}
                        className="w-full border border-gray-300 bg-gray-50 rounded-lg p-3 text-sm focus:outline-none focus:border-slate-900 font-medium"
                      />
                    </div>

                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-bold text-gray-700">Giới tính</label>
                      <select
                        value={userInfo.gender}
                        onChange={(e) => setUserInfo({...userInfo, gender: e.target.value})}
                        className="w-full border border-gray-300 bg-gray-50 rounded-lg p-3 text-sm focus:outline-none focus:border-slate-900 font-medium"
                      >
                        <option value="">Chưa cập nhật</option>
                        <option value="Nam">Nam</option>
                        <option value="Nữ">Nữ</option>
                      </select>
                    </div>

                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-bold text-gray-700">Tên đăng nhập</label>
                      <input 
                        type="text" 
                        value={userInfo.username}
                        disabled
                        className="w-full border border-gray-200 bg-gray-100 text-gray-500 rounded-lg p-3 text-sm font-medium cursor-not-allowed"
                      />
                    </div>

                    <div className="md:col-span-2 text-left mt-2">
                      <button 
                        type="submit" 
                        disabled={saving}
                        className={`bg-slate-900 hover:bg-slate-800 text-white font-extrabold px-6 py-3 rounded-lg text-sm uppercase tracking-wider transition-all active:scale-95 cursor-pointer ${saving ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        {saving ? 'Đang lưu...' : 'Lưu thông tin'}
                      </button>
                    </div>
                  </form>
                </div>

                {/* KHỐI B: ĐỔI MẬT KHẨU */}
                <div className="bg-white p-6 rounded-2xl flex flex-col gap-6 text-slate-900 shadow-xl">
                  <h3 className="text-xl font-extrabold border-b border-gray-100 pb-2 uppercase tracking-tight">Đổi mật khẩu</h3>
                  
                  <form onSubmit={handleUpdatePassword} className="flex flex-col gap-4">
                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-bold text-gray-700">Mật khẩu cũ <span className="text-rose-500">*</span></label>
                      <input 
                        type="password" 
                        required
                        placeholder="Nhập mật khẩu cũ"
                        value={passwordData.oldPassword}
                        onChange={(e) => setPasswordData({...passwordData, oldPassword: e.target.value})}
                        className="w-full border border-gray-300 bg-gray-50 rounded-lg p-3 text-sm focus:outline-none focus:border-slate-900 font-medium"
                      />
                    </div>

                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-bold text-gray-700">Mật khẩu mới <span className="text-rose-500">*</span></label>
                      <input 
                        type="password" 
                        required
                        placeholder="Nhập mật khẩu mới (tối thiểu 6 ký tự)"
                        value={passwordData.newPassword}
                        onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                        className="w-full border border-gray-300 bg-gray-50 rounded-lg p-3 text-sm focus:outline-none focus:border-slate-900 font-medium"
                      />
                    </div>

                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-bold text-gray-700">Xác thực mật khẩu <span className="text-rose-500">*</span></label>
                      <input 
                        type="password" 
                        required
                        placeholder="Nhập lại mật khẩu mới"
                        value={passwordData.confirmPassword}
                        onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                        className="w-full border border-gray-300 bg-gray-50 rounded-lg p-3 text-sm focus:outline-none focus:border-slate-900 font-medium"
                      />
                    </div>

                    <div className="text-left mt-2">
                      <button 
                        type="submit" 
                        disabled={changingPassword}
                        className={`bg-slate-900 hover:bg-slate-800 text-white font-extrabold px-6 py-3 rounded-lg text-sm uppercase tracking-wider transition-all active:scale-95 cursor-pointer ${changingPassword ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        {changingPassword ? 'Đang xử lý...' : 'Đổi mật khẩu'}
                      </button>
                    </div>
                  </form>
                </div>
              </>
            )}
          </div>
        )}

        {/* ================= TAB 2 & 3: DANH SÁCH VÉ ================= */}
        {activeTab !== 'account' && (
          <div className="flex flex-col gap-6 animate-in fade-in duration-300">
            <h2 className="text-2xl font-black uppercase tracking-wider italic">
              {activeTab === 'upcoming' ? 'Danh sách vé sắp xem' : 'Lịch sử phim đã xem'}
            </h2>

            {bookingsLoading ? (
              <div className="flex items-center justify-center py-20">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#ff436e]"></div>
                <p className="text-gray-400 ml-4">Đang tải lịch sử đặt vé...</p>
              </div>
            ) : bookingsError ? (
              <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6 text-center text-red-400 font-bold">
                {bookingsError}
              </div>
            ) : (
              <div className="flex flex-col gap-5">
                {(activeTab === 'upcoming' ? upcomingTickets : pastTickets).map((booking) => {
                  const visuals = getMovieVisuals({ TenPhim: booking.Phim?.TenPhim });
                  const statusLabel = getBookingStatusLabel(booking.TrangThai);
                  const reconstructedMovie = { title: booking.Phim?.TenPhim };

                  return (
                    <div key={booking.MaPhieuDat} className="glass-effect rounded-2xl border border-white/5 p-5 flex flex-col md:flex-row items-center gap-6 hover:border-white/10 transition-all">
                      <img 
                        src={visuals?.poster || assets.profile} 
                        alt={booking.Phim?.TenPhim} 
                        className="w-20 h-28 object-cover rounded-xl border border-white/10 shrink-0"
                      />
                      <div className="flex-1 min-w-0 flex flex-col gap-2 w-full">
                        <div className="flex items-center gap-3">
                          <h3 className="text-white font-bold text-lg uppercase truncate tracking-tight text-glow">
                            {booking.Phim?.TenPhim || 'Thông tin vé'}
                          </h3>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${statusLabel.css}`}>
                            {statusLabel.text}
                          </span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 text-xs text-gray-400">
                          <p className="flex items-center gap-1.5"><Calendar size={14} className="text-gray-500" />Suất: {formatDateTime(booking.Phim?.GioChieu || booking.Phim?.NgayChieu)}</p>
                          <p className="flex items-center gap-1.5"><MapPin size={14} className="text-gray-500" />Phòng: <span className="text-white font-bold">{booking.Phim?.TenPhong || 'Chưa cập nhật'}</span></p>
                          <p className="flex items-center gap-1.5"><CreditCard size={14} className="text-gray-500" />Tổng tiền: <span className="text-yellow-400 font-bold">{formatVND(booking.TongTien)}</span></p>
                          <p className="flex items-center gap-1.5">Số lượng: <span className="text-gray-300 font-medium">{booking.SoLuongVe} vé</span></p>
                          <p className="flex items-center gap-1.5 col-span-2">Mã phiếu: <span className="text-gray-300 font-mono select-all">{booking.MaPhieuDat}</span></p>
                        </div>
                      </div>
                      <div className="w-full md:w-auto shrink-0 pt-4 md:pt-0 border-t md:border-t-0 md:border-l border-white/5 md:pl-6 flex flex-col items-center justify-center gap-2">
                        <button 
                          onClick={() => handleOpenDetail(booking.MaPhieuDat)}
                          className="w-full sm:w-auto bg-white/10 hover:bg-white/20 text-white font-bold px-5 py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer whitespace-nowrap"
                        >
                          <ExternalLink size={14} /><span>Xem chi tiết</span>
                        </button>
                        {activeTab === 'past' && booking.TrangThai === 'DA_THANH_TOAN' && (
                          <button 
                            onClick={() => openReviewModal(reconstructedMovie)}
                            className="w-full sm:w-auto bg-[#ff436e] hover:bg-[#e0325a] text-white font-bold px-5 py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer whitespace-nowrap shadow-[0_0_15px_rgba(255,67,110,0.3)]"
                          >
                            <MessageSquare size={14} /><span>Đánh giá phim</span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}

                {(activeTab === 'upcoming' ? upcomingTickets : pastTickets).length === 0 && (
                  <div className="glass-effect rounded-2xl border border-white/5 p-12 text-center text-gray-400 text-sm">
                    Bạn hiện chưa có lịch sử đặt vé mục này...
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* --- POPUP MODAL CHI TIẾT ĐẶT VÉ --- */}
      {isDetailOpen && (
        <div className="fixed inset-0 z-100 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-300">
          <div className="relative w-full max-w-2xl bg-[#020617]/95 backdrop-blur-xl border border-white/10 p-6 rounded-3xl shadow-2xl animate-in zoom-in-95 duration-300 my-8">
            <button 
              onClick={() => setIsDetailOpen(false)} 
              className="absolute top-4 right-4 p-2 bg-white/5 hover:bg-red-600 rounded-full text-white transition-colors cursor-pointer z-10"
            >
              <X size={16} />
            </button>
            
            {detailLoading || !bookingDetail ? (
              <div className="flex flex-col items-center justify-center py-20 gap-4">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-yellow-400"></div>
                <p className="text-gray-400 text-sm">Đang tải chi tiết đặt vé...</p>
              </div>
            ) : (
              <div className="flex flex-col gap-6 text-left">
                {/* Header Ticket Block */}
                <div>
                  <span className="text-[10px] font-bold text-yellow-400 tracking-widest uppercase">Chi tiết đặt vé</span>
                  <h3 className="text-2xl font-black text-white uppercase leading-tight tracking-tight text-glow mt-1">
                    {bookingDetail.ChiTietDatVes[0]?.SuatChieu?.Phim?.TenPhim || 'Thông tin vé'}
                  </h3>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-400 mt-2">
                    <p className="flex items-center gap-1"><Calendar size={12} /> Suất: {formatDateTime(bookingDetail.ChiTietDatVes[0]?.SuatChieu?.GioChieu || bookingDetail.ChiTietDatVes[0]?.SuatChieu?.NgayChieu)}</p>
                    <p className="flex items-center gap-1"><MapPin size={12} /> Phòng: {bookingDetail.ChiTietDatVes[0]?.SuatChieu?.PhongChieu?.TenPhong} ({bookingDetail.ChiTietDatVes[0]?.SuatChieu?.PhongChieu?.TenLoaiPhong})</p>
                  </div>
                </div>

                <hr className="border-white/5" />

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                  
                  {/* Left Column: Tickets/Seats List */}
                  <div className="flex flex-col gap-4">
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Danh sách vé ({bookingDetail.ChiTietDatVes.length})</h4>
                    <div className="flex flex-col gap-3 max-h-[300px] overflow-y-auto pr-1 custom-scrollbar">
                      {bookingDetail.ChiTietDatVes.map((ticket) => {
                        const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${ticket.MaChiTietDat}`;
                        return (
                          <div key={ticket.MaChiTietDat} className="bg-white/5 border border-white/5 p-3.5 rounded-2xl flex items-center gap-4 hover:border-white/10 transition-colors">
                            {/* QR Code Container */}
                            <div className="w-20 h-20 bg-white p-1 rounded-xl shrink-0 flex items-center justify-center relative overflow-hidden">
                              <img 
                                src={qrUrl} 
                                alt={`QR Ticket ${ticket.Ghe?.TenGhe}`}
                                className="w-full h-full"
                                onError={(e) => {
                                  e.target.style.display = 'none';
                                  e.target.nextSibling.style.display = 'flex';
                                }}
                              />
                              <div className="absolute inset-0 flex items-center justify-center bg-slate-950 text-white text-[8px] font-mono p-1 text-center leading-none hidden">
                                QR Offline
                              </div>
                            </div>

                            {/* Ticket info */}
                            <div className="flex-1 min-w-0">
                              <div className="flex justify-between items-center mb-0.5">
                                <span className="text-white font-extrabold text-sm">Ghế {ticket.Ghe?.TenGhe}</span>
                                <span className="text-yellow-400 font-bold text-xs">{formatVND(ticket.GiaVe)}</span>
                              </div>
                              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Loại: {ticket.Ghe?.TenLoaiGhe || 'Thường'}</p>
                              
                              {/* Copyable code */}
                              <div className="flex items-center gap-2 mt-2 bg-slate-950/70 py-1 px-2.5 rounded-lg border border-white/5">
                                <span className="text-[9px] text-gray-600 font-bold uppercase tracking-wider shrink-0">Mã vé:</span>
                                <span className="text-[10px] font-mono text-gray-300 truncate select-all">{ticket.MaChiTietDat}</span>
                                <button 
                                  type="button"
                                  onClick={() => handleCopyTicketId(ticket.MaChiTietDat)}
                                  className="p-1 hover:text-white text-gray-400 transition-colors cursor-pointer shrink-0 ml-auto"
                                  title="Sao chép mã vé"
                                >
                                  {copiedTicketId === ticket.MaChiTietDat ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Right Column: Transaction & Billing summary */}
                  <div className="flex flex-col gap-4 bg-white/5 border border-white/5 p-4 rounded-2xl">
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider border-b border-white/5 pb-2">Thông tin hóa đơn</h4>
                    
                    <div className="flex flex-col gap-3 text-xs text-gray-400">
                      <div className="flex justify-between">
                        <span>Mã phiếu đặt:</span>
                        <span className="text-white font-bold select-all truncate max-w-[150px]" title={bookingDetail.MaPhieuDat}>{bookingDetail.MaPhieuDat}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Thời gian lập phiếu:</span>
                        <span className="text-white font-medium">{formatDateTime(bookingDetail.NgayTao)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Trạng thái phiếu:</span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${getBookingStatusLabel(bookingDetail.TrangThai).css}`}>
                          {getBookingStatusLabel(bookingDetail.TrangThai).text}
                        </span>
                      </div>
                      
                      <hr className="border-white/5 my-1" />

                      {bookingDetail.GiaoDichs && bookingDetail.GiaoDichs.length > 0 ? (
                        bookingDetail.GiaoDichs.map((tx) => (
                          <div key={tx.MaGiaoDich} className="flex flex-col gap-2 bg-slate-950/45 p-3 rounded-xl border border-white/5">
                            <div className="flex justify-between font-bold text-white text-[11px]">
                              <span>Thanh toán {tx.PhuongThuc?.toUpperCase()}</span>
                              <span className={getTransactionStatusLabel(tx.TrangThai).text === 'Thành công' ? 'text-emerald-400' : 'text-yellow-400'}>
                                {getTransactionStatusLabel(tx.TrangThai).text}
                              </span>
                            </div>
                            <div className="text-[10px] text-gray-500 flex flex-col gap-1">
                              <p className="truncate">Mã giao dịch: {tx.MaGiaoDichNgoai || tx.MaGiaoDich}</p>
                              <p>Thời gian GD: {formatDateTime(tx.NgayGiaoDich)}</p>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-center text-gray-500 py-2">Chưa có thông tin giao dịch thanh toán.</p>
                      )}

                      <hr className="border-white/5 my-1" />

                      <div className="flex justify-between items-center text-sm">
                        <span className="font-bold text-white">Tổng tiền:</span>
                        <span className="text-lg font-black text-yellow-400">{formatVND(bookingDetail.TongTien)}</span>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* --- POPUP MODAL BIỂU MẪU ĐÁNH GIÁ PHIM TRONG SUỐT --- */}
      {isReviewOpen && (
        <div className="fixed inset-0 z-100 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="relative w-full max-w-md bg-[#020617]/95 backdrop-blur-xl border border-white/10 p-6 rounded-3xl shadow-2xl animate-in zoom-in-95 duration-300">
            <button onClick={() => setIsReviewOpen(false)} className="absolute top-4 right-4 p-2 bg-white/5 hover:bg-red-600 rounded-full text-white transition-colors cursor-pointer"><X size={16} /></button>
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold text-white uppercase tracking-tight mb-1">Đánh giá điện ảnh</h3>
              <p className="text-xs text-yellow-400 font-semibold truncate">Phim: {selectedMovie?.title}</p>
            </div>
            <form onSubmit={handleReviewSubmit} className="flex flex-col gap-5 text-left">
              <div className="flex flex-col items-center gap-2 bg-white/5 p-4 rounded-2xl border border-white/5">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Bạn chấm phim này mấy sao?</p>
                <div className="flex gap-2 mt-1">
                  {[1, 2, 3, 4, 5].map((star) => {
                    const isLit = star <= (hoverRating || rating);
                    return (
                      <button
                        key={star} type="button" onClick={() => setRating(star)} onMouseEnter={() => setHoverRating(star)} onMouseLeave={() => setHoverRating(0)}
                        className="text-gray-600 hover:scale-120 transition-transform cursor-pointer"
                      >
                        <Star size={28} fill={isLit ? "#fde047" : "transparent"} className={isLit ? "text-[#fde047] drop-shadow-[0_0_8px_rgba(253,224,71,0.5)]" : "text-gray-500"}/>
                      </button>
                    );
                  })}
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-400 pl-1">Nhận xét của bạn</label>
                <textarea required rows="4" placeholder="Hãy chia sẻ cảm nghĩ của bạn về nội dung bộ phim, diễn xuất, âm thanh kỹ xảo nhé..." value={comment} onChange={(e) => setComment(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:bg-white/10 transition-all resize-none leading-relaxed"/>
              </div>
              <button type="submit" className="btn-bright w-full py-3 rounded-xl normal-case font-bold text-base shadow-[0_0_20px_rgba(253,224,71,0.3)] cursor-pointer mt-2">Gửi Đánh Giá Ngay</button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default Profile;