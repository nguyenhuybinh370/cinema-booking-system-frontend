import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { QRCodeSVG } from 'qrcode.react';
import { Copy, Check, ExternalLink, X, Clock, AlertCircle, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { getPayOSPaymentStatus } from '../../api/paymentApi';
import { formatVND } from '../../utils/formatHelper';

const isImageUrl = (url) => {
  if (typeof url !== 'string') return false;
  return url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:image/');
};

const isBase64Image = (str) => {
  if (typeof str !== 'string') return false;
  return /^[A-Za-z0-9+/]+={0,2}$/.test(str) && str.length > 100;
};

const PayOSModal = ({
  isOpen,
  onClose,
  maGiaoDich,
  qrCode,
  checkoutUrl,
  orderCode,
  amount,
  expiresAt,
  onSuccess,
  onCancel,
  onTimeout
}) => {
  const [copied, setCopied] = useState(false);
  const [timeLeft, setTimeLeft] = useState(600); // Default 10 minutes (600s)

  // Copy order code to clipboard helper
  const handleCopyCode = () => {
    if (!orderCode) return;
    navigator.clipboard.writeText(orderCode.toString());
    setCopied(true);
    toast.success("Đã sao chép mã đơn hàng!");
    setTimeout(() => setCopied(false), 2000);
  };

  // Countdown timer logic
  useEffect(() => {
    if (!isOpen) return;

    if (expiresAt) {
      // PayOS expiresAt is a timestamp (or date string)
      const targetTime = typeof expiresAt === 'number' 
        ? expiresAt 
        : new Date(expiresAt).getTime();

      const updateTimer = () => {
        const now = Date.now();
        const diffSeconds = Math.max(0, Math.floor((targetTime - now) / 1000));
        setTimeLeft(diffSeconds);

        if (diffSeconds <= 0) {
          onTimeout();
        }
      };

      updateTimer();
      const timerInterval = setInterval(updateTimer, 1000);
      return () => clearInterval(timerInterval);
    } else {
      // Fallback 10 minutes countdown
      setTimeLeft(600);
      const timerInterval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerInterval);
            onTimeout();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timerInterval);
    }
  }, [isOpen, expiresAt]);

  // Polling logic
  useEffect(() => {
    if (!isOpen || !maGiaoDich) return;

    let isMounted = true;

    const checkStatus = async () => {
      try {
        const response = await getPayOSPaymentStatus(maGiaoDich);
        if (!isMounted) return;

        // Backend response format: status: "PENDING" | "PAID" | "FAILED" | "CANCELLED"
        const status = response.status || response.data?.status;

        if (status === 'PAID') {
          toast.success("Thanh toán thành công!");
          onSuccess(response);
        } else if (status === 'FAILED' || status === 'CANCELLED') {
          toast.error("Giao dịch thanh toán đã bị hủy hoặc thất bại.");
          onCancel();
        }
      } catch (err) {
        console.error("Lỗi khi kiểm tra trạng thái PayOS:", err);
      }
    };

    // Poll immediately, then every 3 seconds
    checkStatus();
    const pollInterval = setInterval(checkStatus, 3000);

    return () => {
      isMounted = false;
      clearInterval(pollInterval);
    };
  }, [isOpen, maGiaoDich]);

  if (!isOpen) return null;

  const minutes = Math.floor(timeLeft / 60).toString().padStart(2, '0');
  const seconds = (timeLeft % 60).toString().padStart(2, '0');

  const renderQRCodeContent = () => {
    // Case A: valid image URL
    if (qrCode && isImageUrl(qrCode)) {
      return (
        <img 
          src={qrCode} 
          alt="PayOS QR Code" 
          className="w-full h-full object-contain"
        />
      );
    }

    // Case B: raw base64 without prefix
    if (qrCode && isBase64Image(qrCode)) {
      return (
        <img 
          src={`data:image/png;base64,${qrCode}`} 
          alt="PayOS QR Code" 
          className="w-full h-full object-contain"
        />
      );
    }

    // Case C: VietQR string (usually what PayOS returns)
    if (qrCode && typeof qrCode === 'string' && qrCode.length > 0) {
      return (
        <QRCodeSVG 
          value={qrCode}
          size={256}
          className="w-full h-full object-contain"
          bgColor="#ffffff"
          fgColor="#000000"
          level="M"
        />
      );
    }

    // Fallback: Generate QR from checkoutUrl
    if (checkoutUrl) {
      return (
        <QRCodeSVG 
          value={checkoutUrl}
          size={256}
          className="w-full h-full object-contain"
          bgColor="#ffffff"
          fgColor="#000000"
          level="M"
        />
      );
    }

    // Case D: Failure / No QR data
    return (
      <div className="flex flex-col items-center justify-center text-center p-4 gap-2 text-red-400">
        <AlertCircle size={32} />
        <span className="text-xs font-bold leading-normal">
          Không nhận được dữ liệu QR thanh toán từ hệ thống.
        </span>
      </div>
    );
  };

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-md animate-in fade-in duration-300"
        onClick={onCancel}
      />
      
      {/* Container Modal Glassmorphism */}
      <div className="relative z-[10000] w-full max-w-lg bg-zinc-900/90 border border-white/10 rounded-2xl p-6 md:p-8 flex flex-col gap-6 shadow-2xl overflow-y-auto max-h-[90vh] text-left text-white backdrop-blur-md animate-in zoom-in-95 duration-300">
        
        {/* Nút Đóng Modal */}
        <button 
          onClick={onCancel}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors cursor-pointer"
        >
          <X size={20} />
        </button>

        {/* Tiêu đề & Đồng hồ đếm ngược */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 text-blue-400">
            <span className="w-2.5 h-2.5 bg-blue-500 rounded-full animate-ping"></span>
            <span className="text-xs uppercase tracking-widest font-black">Cổng Thanh Toán PayOS</span>
          </div>
          <h2 className="text-xl md:text-2xl font-black uppercase tracking-tight text-white mt-1">Quét Mã QR Thanh Toán</h2>
        </div>

        {/* Timer Box */}
        <div className="flex items-center justify-between px-4 py-3 bg-blue-950/20 border border-blue-500/20 rounded-xl text-blue-300 font-bold text-sm">
          <div className="flex items-center gap-2">
            <Clock size={16} className="animate-spin-slow" />
            <span className="text-xs uppercase tracking-wider">Thời gian giữ vé còn lại:</span>
          </div>
          <span className="font-mono text-base tracking-widest">{minutes}:{seconds}</span>
        </div>

        {/* Nội dung thanh toán QR */}
        <div className="flex flex-col md:flex-row items-center gap-6 justify-center bg-white/5 p-4 rounded-xl border border-white/5">
          {/* QR Code Container */}
          <div className="w-56 h-56 md:w-64 md:h-64 bg-white p-3 rounded-xl flex items-center justify-center shrink-0 shadow-lg overflow-hidden">
            {renderQRCodeContent()}
          </div>

          {/* Chi tiết đơn hàng */}
          <div className="flex flex-col gap-3 flex-1 w-full">
            <div className="flex flex-col">
              <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Số tiền cần thanh toán</span>
              <span className="text-2xl font-black text-yellow-400">{formatVND(amount)}</span>
            </div>

            <div className="flex flex-col">
              <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Mã đơn hàng</span>
              <div className="flex items-center gap-2 mt-1">
                <span className="font-mono text-base font-bold tracking-wider text-white">{orderCode || '-------'}</span>
                <button 
                  onClick={handleCopyCode}
                  className="p-1 hover:bg-white/10 rounded-md transition-colors cursor-pointer text-gray-400 hover:text-white"
                  title="Sao chép mã đơn hàng"
                >
                  {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Nội dung chuyển khoản</span>
              <span className="text-xs font-medium text-gray-200 bg-white/5 px-2 py-1 rounded-md border border-white/5 w-fit">
                DAT VE PHIM {maGiaoDich ? maGiaoDich.substring(0, 8).toUpperCase() : '------'}
              </span>
            </div>
          </div>
        </div>

        {/* Hướng dẫn sử dụng */}
        <div className="flex flex-col gap-3 bg-white/5 p-4 rounded-xl border border-white/5 text-xs text-gray-300">
          <h4 className="font-bold text-gray-200 uppercase tracking-wider text-[10px]">Hướng dẫn thanh toán:</h4>
          <ol className="list-decimal list-inside flex flex-col gap-2 leading-relaxed">
            <li>Mở ứng dụng ngân hàng hoặc ví điện tử hỗ trợ QR Pay.</li>
            <li>Quét mã QR hiển thị ở trên.</li>
            <li>Kiểm tra thông tin giao dịch chính xác số tiền và bấm xác nhận chuyển khoản.</li>
            <li>Hệ thống sẽ tự động duyệt vé sau khi nhận được tiền (thường từ 3 - 5 giây).</li>
          </ol>
          <div className="flex items-center gap-1.5 text-blue-300 font-semibold mt-1">
            <AlertCircle size={12} />
            <span>Đã mở app ngân hàng? Bạn có thể mở trực tiếp trang thanh toán bên dưới.</span>
          </div>
        </div>

        {/* Trạng thái giao dịch chờ xử lý */}
        <div className="flex items-center justify-center gap-2.5 py-1 text-xs text-gray-400 font-bold">
          <Loader2 className="animate-spin text-blue-500" size={16} />
          <span>Hệ thống đang chờ bạn quét mã thanh toán...</span>
        </div>

        {/* Nút hành động */}
        <div className="flex flex-col sm:flex-row gap-3 mt-2">
          <a
            href={checkoutUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-4 rounded-xl transition-all shadow-[0_0_15px_rgba(59,130,246,0.2)] text-sm cursor-pointer"
          >
            Mở trang thanh toán <ExternalLink size={14} />
          </a>
          <button
            onClick={onCancel}
            className="flex-1 bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/10 font-bold py-3 px-4 rounded-xl transition-all text-sm cursor-pointer"
          >
            Hủy thanh toán
          </button>
        </div>

      </div>
    </div>,
    document.body
  );
};

export default PayOSModal;
