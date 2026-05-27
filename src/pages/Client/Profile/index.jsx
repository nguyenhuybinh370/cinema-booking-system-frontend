import { useState, useEffect } from 'react';
import { Star, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { useNavigate, useLocation } from 'react-router-dom';
import axiosClient from '../../../api/axiosClient';
import { getCustomerProfile, updateCustomerProfile, changeCustomerPassword } from '../../../api/accountApi';
import { getBookingHistory, getBookingDetail } from '../../../api/bookingHistoryApi';
import { cancelBooking, requestRefund, getMyRefundRequests } from '../../../api/refundApi';
import { getShowtimeStartFromBooking } from '../../../utils/showtimeHelper';

// Sub-components
import ProfileSidebar from './ProfileSidebar';
import ProfileInfoTab from './ProfileInfoTab';
import BookingHistoryTab from './BookingHistoryTab';
import BookingDetailModal from './BookingDetailModal';
import RefundRequestsTab from './RefundRequestsTab';
import CancelBookingModal from './CancelBookingModal';
import RefundRequestModal from './RefundRequestModal';
import ConfirmDialog from '../../../components/common/ConfirmDialog';

// ─────────────────────────────────────────────
// Helper: parse "YYYY-MM-DD" from backend date
// ─────────────────────────────────────────────
const parseDate = (dStr) => {
  if (!dStr) return '';
  const d = new Date(dStr);
  if (isNaN(d.getTime())) return '';
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
};

// ─────────────────────────────────────────────
// Profile container — owns all state & API calls
// ─────────────────────────────────────────────
const Profile = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('account');
  const [isLogoutConfirmOpen, setIsLogoutConfirmOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // --- REVIEW STATE (legacy, kept for backward compat) ---
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [hoverRating, setHoverRating] = useState(0);

  // --- PROFILE STATE ---
  const [profileLoading, setProfileLoading] = useState(true);
  const [profileError, setProfileError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);

  const [userInfo, setUserInfo] = useState({
    name: '', dob: '', phone: '', email: '', username: '', gender: ''
  });

  const [passwordData, setPasswordData] = useState({
    oldPassword: '', newPassword: '', confirmPassword: ''
  });

  // --- BOOKING HISTORY STATE ---
  const [bookings, setBookings] = useState([]);
  const [bookingsLoading, setBookingsLoading] = useState(true);
  const [bookingsError, setBookingsError] = useState(null);

  const [bookingDetail, setBookingDetail] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [copiedTicketId, setCopiedTicketId] = useState('');

  // --- REFUND STATE ---
  const [refundRequests, setRefundRequests] = useState([]);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [isSubmittingCancel, setIsSubmittingCancel] = useState(false);
  const [isRefundRequestOpen, setIsRefundRequestOpen] = useState(false);
  const [refundReason, setRefundReason] = useState('');
  const [isSubmittingRefund, setIsSubmittingRefund] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState(null);

  // ─── Computed ──────────────────────────────
  const now = new Date();

  const upcomingTickets = bookings.filter(item => {
    const s = getShowtimeStartFromBooking(item);
    return item.TrangThai === 'DA_THANH_TOAN' && s && s >= now;
  });
  const pastTickets = bookings.filter(item => {
    const s = getShowtimeStartFromBooking(item);
    return !s || item.TrangThai !== 'DA_THANH_TOAN' || s < now;
  });

  // ─── Data fetching ──────────────────────────
  const fetchBookingsAndRefunds = async (showLoading = true) => {
    if (showLoading) setBookingsLoading(true);
    setBookingsError(null);
    try {
      const [bookingsRes, refundsRes] = await Promise.all([
        getBookingHistory({ page: 1, limit: 100 }),
        getMyRefundRequests({ page: 1, limit: 100 })
      ]);
      setBookings(bookingsRes.data || []);
      setRefundRequests(refundsRes.data || []);
    } catch (err) {
      console.error('Lỗi khi tải lịch sử đặt vé hoặc hoàn tiền:', err);
      setBookingsError(err?.message || 'Không thể tải dữ liệu đặt vé.');
    } finally {
      if (showLoading) setBookingsLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setProfileLoading(true);
      setProfileError(null);
      try {
        const data = await getCustomerProfile();
        setUserInfo({
          name: data.HoTen || '',
          dob: parseDate(data.NgaySinh),
          phone: data.SoDienThoai || '',
          email: data.Email || '',
          username: data.TenDangNhap || '',
          gender: data.GioiTinh === true ? 'Nam' : data.GioiTinh === false ? 'Nữ' : ''
        });
        localStorage.setItem('userName', data.HoTen || '');
        localStorage.setItem('userInfo', JSON.stringify(data));
      } catch (err) {
        console.error('Lỗi khi lấy thông tin tài khoản:', err);
        setProfileError(err?.message || 'Không thể tải thông tin tài khoản.');
      } finally {
        setProfileLoading(false);
      }
      await fetchBookingsAndRefunds(true);
    };
    fetchData();
  }, [location.key]);

  // Sync tab from navigation state (e.g. from TicketConfirmation)
  useEffect(() => {
    if (location.state?.activeTab) {
      setActiveTab(location.state.activeTab);
    }
  }, [location.state]);

  // ─── Booking detail ─────────────────────────
  const handleOpenDetail = async (maPhieuDat) => {
    setIsDetailOpen(true);
    setDetailLoading(true);
    setBookingDetail(null);
    try {
      const data = await getBookingDetail(maPhieuDat);
      setBookingDetail(data);
    } catch (err) {
      console.error('Lỗi khi tải chi tiết phiếu đặt:', err);
      toast.error(err?.message || 'Không thể tải chi tiết phiếu đặt.');
      setIsDetailOpen(false);
    } finally {
      setDetailLoading(false);
    }
  };

  // ─── Copy ticket ID ─────────────────────────
  const handleCopyTicketId = (id) => {
    navigator.clipboard.writeText(id);
    setCopiedTicketId(id);
    toast.success('Đã sao chép mã vé!');
    setTimeout(() => setCopiedTicketId(''), 2000);
  };

  // ─── Cancel booking ─────────────────────────
  const handleOpenCancelModal = (maPhieuDat) => {
    setSelectedBookingId(maPhieuDat);
    setCancelReason('');
    setIsCancelModalOpen(true);
  };

  const handleCancelBookingSubmit = async (e) => {
    e.preventDefault();
    if (!selectedBookingId) return;
    setIsSubmittingCancel(true);
    const toastId = toast.loading('Đang xử lý hủy vé...');
    try {
      const payload = {};
      if (cancelReason.trim()) {
        payload.LyDoHoan = cancelReason.trim();
      }
      await cancelBooking(selectedBookingId, payload);
      toast.success('Hủy vé thành công, yêu cầu hoàn tiền đang chờ duyệt!');
      setIsCancelModalOpen(false);
      await fetchBookingsAndRefunds(false);
      if (isDetailOpen && bookingDetail?.MaPhieuDat === selectedBookingId) {
        handleOpenDetail(selectedBookingId);
      }
    } catch (err) {
      console.error('Lỗi khi hủy vé:', err);
      toast.error(err.response?.data?.message || err.message || 'Hủy vé thất bại.');
    } finally {
      setIsSubmittingCancel(false);
      toast.dismiss(toastId);
    }
  };

  // ─── Refund request ─────────────────────────
  const handleOpenRefundModal = (maPhieuDat) => {
    setSelectedBookingId(maPhieuDat);
    setRefundReason('');
    setIsRefundRequestOpen(true);
  };

  const handleRefundSubmit = async (e) => {
    e.preventDefault();
    if (!selectedBookingId) return;
    if (!refundReason.trim()) {
      toast.error('Vui lòng nhập lý do hoàn tiền.');
      return;
    }
    setIsSubmittingRefund(true);
    const toastId = toast.loading('Đang gửi yêu cầu hoàn tiền...');
    try {
      await requestRefund({ MaPhieuDat: selectedBookingId, LyDo: refundReason.trim() });
      toast.success('Gửi yêu cầu hoàn tiền thành công!');
      setIsRefundRequestOpen(false);
      await fetchBookingsAndRefunds(false);
      if (isDetailOpen && bookingDetail?.MaPhieuDat === selectedBookingId) {
        handleOpenDetail(selectedBookingId);
      }
    } catch (err) {
      console.error('Lỗi khi yêu cầu hoàn tiền:', err);
      toast.error(err.response?.data?.message || err.message || 'Gửi yêu cầu hoàn tiền thất bại.');
    } finally {
      setIsSubmittingRefund(false);
      toast.dismiss(toastId);
    }
  };

  // ─── Save profile info ──────────────────────
  const handleSaveInfo = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        HoTen: userInfo.name || undefined,
        Email: userInfo.email || undefined,
        SoDienThoai: userInfo.phone || undefined,
      };
      if (userInfo.gender === 'Nam') payload.GioiTinh = true;
      else if (userInfo.gender === 'Nữ') payload.GioiTinh = false;
      if (userInfo.dob) payload.NgaySinh = userInfo.dob;

      const updated = await updateCustomerProfile(payload);
      setUserInfo({
        name: updated.HoTen || '',
        dob: parseDate(updated.NgaySinh),
        phone: updated.SoDienThoai || '',
        email: updated.Email || '',
        username: updated.TenDangNhap || userInfo.username,
        gender: updated.GioiTinh === true ? 'Nam' : updated.GioiTinh === false ? 'Nữ' : ''
      });
      localStorage.setItem('userName', updated.HoTen || '');
      localStorage.setItem('userInfo', JSON.stringify(updated));
      toast.success('Lưu thông tin khách hàng thành công!');
    } catch (err) {
      console.error('Lỗi cập nhật thông tin:', err);
      toast.error(err?.message || 'Cập nhật thông tin thất bại!');
    } finally {
      setSaving(false);
    }
  };

  // ─── Change password ────────────────────────
  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword.length < 6) {
      toast.error('Mật khẩu mới phải có ít nhất 6 ký tự!');
      return;
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('Mật khẩu xác thực mới không trùng khớp!');
      return;
    }
    if (passwordData.newPassword === passwordData.oldPassword) {
      toast.error('Mật khẩu mới phải khác mật khẩu cũ!');
      return;
    }
    setChangingPassword(true);
    try {
      await changeCustomerPassword({
        MatKhauCu: passwordData.oldPassword,
        MatKhauMoi: passwordData.newPassword,
        XacNhanMatKhauMoi: passwordData.confirmPassword
      });
      toast.success('Đổi mật khẩu thành công! Vui lòng đăng nhập lại.');
      setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });
      setTimeout(() => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('userRole');
        localStorage.removeItem('userName');
        localStorage.removeItem('userCode');
        localStorage.removeItem('userInfo');
        navigate('/login');
      }, 1500);
    } catch (err) {
      console.error('Lỗi đổi mật khẩu:', err);
      toast.error(err?.message || 'Đổi mật khẩu thất bại!');
    } finally {
      setChangingPassword(false);
    }
  };

  // ─── Logout ─────────────────────────────────
  const handleLogoutSubmit = async () => {
    setIsLoggingOut(true);
    const toastId = toast.loading('Đang đăng xuất...');
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        await axiosClient.post('/auth/logout', { refreshToken });
      }
    } catch (e) {
      console.error('Logout API error:', e);
    } finally {
      setIsLoggingOut(false);
      setIsLogoutConfirmOpen(false);
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('userRole');
      localStorage.removeItem('userName');
      localStorage.removeItem('userCode');
      localStorage.removeItem('userInfo');
      toast.dismiss(toastId);
      toast.success('Đã đăng xuất tài khoản!');
      navigate('/login');
    }
  };

  // ─── Review (legacy stub) ────────────────────
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

  // ────────────────────────────────────────────
  return (
    <div className="min-h-screen pt-28 pb-16 px-6 md:px-16 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-10 items-start">

      {/* SIDEBAR */}
      <ProfileSidebar
        userInfo={userInfo}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        upcomingCount={upcomingTickets.length}
        pastCount={pastTickets.length}
        refundCount={refundRequests.length}
        onLogout={() => setIsLogoutConfirmOpen(true)}
      />

      {/* MAIN CONTENT */}
      <div className="w-full min-w-0 flex flex-col gap-6 text-left">

        {activeTab === 'account' && (
          <ProfileInfoTab
            profileLoading={profileLoading}
            profileError={profileError}
            userInfo={userInfo}
            setUserInfo={setUserInfo}
            saving={saving}
            onSaveInfo={handleSaveInfo}
            passwordData={passwordData}
            setPasswordData={setPasswordData}
            changingPassword={changingPassword}
            onUpdatePassword={handleUpdatePassword}
          />
        )}

        {(activeTab === 'upcoming' || activeTab === 'past') && (
          <BookingHistoryTab
            activeTab={activeTab}
            bookings={bookings}
            bookingsLoading={bookingsLoading}
            bookingsError={bookingsError}
            refundRequests={refundRequests}
            now={now}
            onViewDetail={handleOpenDetail}
            onCancelBooking={handleOpenCancelModal}
            onRefundRequest={handleOpenRefundModal}
            onReview={openReviewModal}
          />
        )}

        {activeTab === 'refunds' && (
          <RefundRequestsTab
            refundRequests={refundRequests}
            bookingsLoading={bookingsLoading}
            onViewDetail={handleOpenDetail}
          />
        )}
      </div>

      {/* MODALS */}
      <BookingDetailModal
        isOpen={isDetailOpen}
        detailLoading={detailLoading}
        bookingDetail={bookingDetail}
        refundRequests={refundRequests}
        copiedTicketId={copiedTicketId}
        onClose={() => setIsDetailOpen(false)}
        onCopyTicketId={handleCopyTicketId}
        onCancelBooking={handleOpenCancelModal}
        onRefundRequest={handleOpenRefundModal}
      />

      <CancelBookingModal
        isOpen={isCancelModalOpen}
        cancelReason={cancelReason}
        onCancelReasonChange={setCancelReason}
        isSubmitting={isSubmittingCancel}
        onClose={() => setIsCancelModalOpen(false)}
        onSubmit={handleCancelBookingSubmit}
      />

      <RefundRequestModal
        isOpen={isRefundRequestOpen}
        refundReason={refundReason}
        onRefundReasonChange={setRefundReason}
        isSubmitting={isSubmittingRefund}
        onClose={() => setIsRefundRequestOpen(false)}
        onSubmit={handleRefundSubmit}
      />

      {/* LEGACY REVIEW MODAL (unchanged) */}
      {isReviewOpen && (
        <div className="fixed inset-0 z-100 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="relative w-full max-w-md bg-[#020617]/95 backdrop-blur-xl border border-white/10 p-6 rounded-3xl shadow-2xl animate-in zoom-in-95 duration-300">
            <button onClick={() => setIsReviewOpen(false)} className="absolute top-4 right-4 p-2 bg-white/5 hover:bg-red-600 rounded-full text-white transition-colors cursor-pointer">
              <X size={16} />
            </button>
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
                        key={star} type="button"
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        className="text-gray-600 hover:scale-120 transition-transform cursor-pointer"
                      >
                        <Star size={28} fill={isLit ? '#fde047' : 'transparent'} className={isLit ? 'text-[#fde047] drop-shadow-[0_0_8px_rgba(253,224,71,0.5)]' : 'text-gray-500'} />
                      </button>
                    );
                  })}
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-400 pl-1">Nhận xét của bạn</label>
                <textarea required rows="4" placeholder="Hãy chia sẻ cảm nghĩ của bạn về nội dung bộ phim, diễn xuất, âm thanh kỹ xảo nhé..." value={comment} onChange={(e) => setComment(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:bg-white/10 transition-all resize-none leading-relaxed" />
              </div>
              <button type="submit" className="btn-bright w-full py-3 rounded-xl normal-case font-bold text-base shadow-[0_0_20px_rgba(253,224,71,0.3)] cursor-pointer mt-2">Gửi Đánh Giá Ngay</button>
            </form>
          </div>
        </div>
      )}

      <ConfirmDialog
        isOpen={isLogoutConfirmOpen}
        title="Xác nhận đăng xuất"
        message="Bạn có chắc chắn muốn đăng xuất khỏi tài khoản của mình không?"
        confirmText="Đăng xuất"
        cancelText="Hủy bỏ"
        variant="danger"
        isLoading={isLoggingOut}
        onConfirm={handleLogoutSubmit}
        onCancel={() => setIsLogoutConfirmOpen(false)}
      />
    </div>
  );
};

export default Profile;
