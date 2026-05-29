import { useEffect, useState, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Loader2, XCircle, AlertCircle, Home, User } from 'lucide-react';
import toast from 'react-hot-toast';
import { getVNPayPaymentStatus } from '../../api/paymentApi';
import { getBookingDetail } from '../../api/bookingHistoryApi';
import TicketConfirmation from './TicketConfirmation';

const formatTime = (isoString) => {
  if (!isoString) return '00:00';
  const date = new Date(isoString);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
};

const VNPayReturn = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [statusState, setStatusState] = useState('polling'); // 'polling' | 'success' | 'failed' | 'timeout'
  const [bookingDetail, setBookingDetail] = useState(null);
  
  const maGiaoDich = searchParams.get('maGiaoDich') || searchParams.get('vnp_TxnRef');
  const hasPolled = useRef(false);

  useEffect(() => {
    if (!maGiaoDich) {
      setStatusState('failed');
      setLoading(false);
      toast.error('Không tìm thấy mã giao dịch thanh toán!');
      return;
    }

    if (hasPolled.current) return;
    hasPolled.current = true;

    let pollAttempts = 0;
    const maxAttempts = 20; // 20 * 2.5s = 50s
    let intervalId = null;

    const checkStatus = async () => {
      try {
        pollAttempts++;
        const res = await getVNPayPaymentStatus(maGiaoDich);
        
        if (res.status === 'THANH_CONG') {
          clearInterval(intervalId);
          // Fetch booking details
          const detailRes = await getBookingDetail(res.maPhieuDat);
          setBookingDetail(detailRes);
          setStatusState('success');
          setLoading(false);
          toast.success('Thanh toán thành công!');
        } else if (res.status === 'THAT_BAI' || res.status === 'DA_HUY') {
          clearInterval(intervalId);
          setStatusState('failed');
          setLoading(false);
          toast.error('Giao dịch thanh toán thất bại hoặc đã bị hủy.');
        } else {
          // Still pending
          if (pollAttempts >= maxAttempts) {
            clearInterval(intervalId);
            setStatusState('timeout');
            setLoading(false);
          }
        }
      } catch (err) {
        console.error('Error checking VNPay status:', err);
        if (pollAttempts >= maxAttempts) {
          clearInterval(intervalId);
          setStatusState('timeout');
          setLoading(false);
        }
      }
    };

    // Run first check immediately
    checkStatus();

    // Start interval
    intervalId = setInterval(checkStatus, 2500);

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [maGiaoDich]);

  if (loading || statusState === 'polling') {
    return (
      <div className="min-h-screen bg-[#090514] text-white flex flex-col items-center justify-center p-6 text-center">
        <div className="bg-[#1b1223]/60 backdrop-blur-md border border-white/5 p-10 rounded-3xl max-w-md w-full flex flex-col items-center gap-6 shadow-2xl">
          <Loader2 className="w-16 h-16 text-[#ff436e] animate-spin" />
          <h2 className="text-2xl font-black uppercase tracking-wider italic text-white">Xác nhận thanh toán</h2>
          <p className="text-gray-400 text-sm">
            Đang xác nhận kết quả thanh toán từ cổng VNPay. Vui lòng không đóng trình duyệt hoặc tải lại trang...
          </p>
        </div>
      </div>
    );
  }

  if (statusState === 'success' && bookingDetail) {
    // Transform booking details for TicketConfirmation
    const firstDetail = bookingDetail.ChiTietDatVes?.[0];
    const movie = firstDetail?.SuatChieu?.Phim;
    const selectedDateId = firstDetail?.SuatChieu?.NgayChieu 
      ? new Date(firstDetail.SuatChieu.NgayChieu).toLocaleDateString('vi-VN') 
      : '';
    const currentSlot = firstDetail?.SuatChieu;
    const selectedSeats = bookingDetail.ChiTietDatVes?.map(ct => ct.Ghe) || [];

    return (
      <TicketConfirmation
        movie={movie}
        selectedDateId={selectedDateId}
        currentSlot={currentSlot}
        selectedSeats={selectedSeats}
        formatTime={formatTime}
        bookingResult={bookingDetail}
        onHome={() => navigate('/')}
      />
    );
  }

  if (statusState === 'failed') {
    return (
      <div className="min-h-screen bg-[#090514] text-white flex flex-col items-center justify-center p-6 text-center">
        <div className="bg-[#1b1223]/60 backdrop-blur-md border border-white/5 p-10 rounded-3xl max-w-md w-full flex flex-col items-center gap-6 shadow-2xl">
          <div className="w-16 h-16 bg-red-500/20 text-red-500 rounded-full flex items-center justify-center border border-red-500/30">
            <XCircle size={36} />
          </div>
          <h2 className="text-2xl font-black uppercase tracking-wider italic text-red-500">Thanh Toán Thất Bại</h2>
          <p className="text-gray-400 text-sm">
            Giao dịch thanh toán VNPay của bạn đã thất bại hoặc bị hủy bỏ. Vui lòng chọn lại suất chiếu khác hoặc thực hiện lại thanh toán.
          </p>
          <div className="flex flex-col gap-3 w-full mt-4">
            <button 
              onClick={() => navigate('/')}
              className="w-full bg-[#ff436e] hover:bg-[#e0325a] text-white font-bold py-3 rounded-xl transition-all text-xs uppercase flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(255,67,110,0.3)] cursor-pointer"
            >
              <Home size={16} /> Quay về Trang chủ
            </button>
            <button 
              onClick={() => navigate('/profile', { state: { activeTab: 'upcoming' } })}
              className="w-full bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10 font-bold py-3 rounded-xl transition-all text-xs uppercase flex items-center justify-center gap-2 cursor-pointer"
            >
              <User size={16} /> Lịch sử đặt vé
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Timeout state
  return (
    <div className="min-h-screen bg-[#090514] text-white flex flex-col items-center justify-center p-6 text-center">
      <div className="bg-[#1b1223]/60 backdrop-blur-md border border-white/5 p-10 rounded-3xl max-w-md w-full flex flex-col items-center gap-6 shadow-2xl">
        <div className="w-16 h-16 bg-yellow-500/20 text-yellow-500 rounded-full flex items-center justify-center border border-yellow-500/30 animate-pulse">
          <AlertCircle size={36} />
        </div>
        <h2 className="text-2xl font-black uppercase tracking-wider italic text-yellow-500">Đang Xử Lý Giao Dịch</h2>
        <p className="text-gray-400 text-sm">
          Giao dịch đang được xử lý hoặc mất quá nhiều thời gian để phản hồi. Vui lòng kiểm tra lại trạng thái trong lịch sử đặt vé của bạn sau ít phút.
        </p>
        <div className="flex flex-col gap-3 w-full mt-4">
          <button 
            onClick={() => navigate('/')}
            className="w-full bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10 font-bold py-3 rounded-xl transition-all text-xs uppercase flex items-center justify-center gap-2 cursor-pointer"
          >
            <Home size={16} /> Quay về Trang chủ
          </button>
          <button 
            onClick={() => navigate('/profile', { state: { activeTab: 'upcoming' } })}
            className="w-full bg-[#ff436e] hover:bg-[#e0325a] text-white font-bold py-3 rounded-xl transition-all text-xs uppercase flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(255,67,110,0.3)] cursor-pointer"
          >
            <User size={16} /> Kiểm tra Lịch sử đặt vé
          </button>
        </div>
      </div>
    </div>
  );
};

export default VNPayReturn;
