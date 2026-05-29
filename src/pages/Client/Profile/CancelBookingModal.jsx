import { useState } from 'react';
import { X, Landmark } from 'lucide-react';

const POPULAR_BANKS = [
  { code: 'MB', name: 'MBBank (Ngân hàng Quân đội)' },
  { code: 'VCB', name: 'Vietcombank (Ngân hàng Ngoại thương)' },
  { code: 'TCB', name: 'Techcombank (Ngân hàng Kỹ thương)' },
  { code: 'BIDV', name: 'BIDV (Ngân hàng Đầu tư và Phát triển)' },
  { code: 'CTG', name: 'VietinBank (Ngân hàng Công thương)' },
  { code: 'AGR', name: 'Agribank (Ngân hàng Nông nghiệp)' },
  { code: 'ACB', name: 'ACB (Ngân hàng Á Châu)' },
  { code: 'TPB', name: 'TPBank (Ngân hàng Tiên Phong)' },
  { code: 'VPB', name: 'VPBank (Ngân hàng Thịnh Vượng)' },
  { code: 'STB', name: 'Sacombank (Ngân hàng Sài Gòn Thương Tín)' },
  { code: 'OTHER', name: 'Khác (Nhập thủ công)' }
];

/**
 * CancelBookingModal — confirmation dialog for canceling a booking.
 * All state and submit logic come from the Profile container.
 */
const CancelBookingModal = ({
  isOpen,
  cancelReason,
  onCancelReasonChange,
  isSubmitting,
  onClose,
  onSubmit,
}) => {
  const [selectedBank, setSelectedBank] = useState('');
  const [customBank, setCustomBank] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [accountHolder, setAccountHolder] = useState('');
  const [errors, setErrors] = useState({});

  if (!isOpen) return null;

  const handleBankChange = (e) => {
    setSelectedBank(e.target.value);
    if (e.target.value !== 'OTHER') {
      setCustomBank('');
    }
  };

  const handleAccountHolderChange = (e) => {
    setAccountHolder(e.target.value.toUpperCase());
  };

  const validate = () => {
    const newErrors = {};
    const finalBank = selectedBank === 'OTHER' ? customBank.trim() : selectedBank;
    
    if (!finalBank) {
      newErrors.bank = 'Vui lòng chọn hoặc nhập tên ngân hàng.';
    }
    if (!accountNumber.trim()) {
      newErrors.accountNumber = 'Vui lòng nhập số tài khoản.';
    }
    if (!accountHolder.trim()) {
      newErrors.accountHolder = 'Vui lòng nhập tên chủ tài khoản.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const finalBank = selectedBank === 'OTHER' ? customBank.trim() : selectedBank;
    onSubmit(e, {
      TenNganHang: finalBank,
      SoTaiKhoan: accountNumber.trim(),
      TenChuTaiKhoan: accountHolder.trim(),
    });
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-300">
      <div className="relative w-full max-w-md bg-[#020617]/95 backdrop-blur-xl border border-white/10 p-6 rounded-3xl shadow-2xl animate-in zoom-in-95 duration-300 text-left">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 bg-white/5 hover:bg-red-600 rounded-full text-white transition-colors cursor-pointer"
        >
          <X size={16} />
        </button>

        <div className="mb-4">
          <h3 className="text-xl font-bold text-white uppercase tracking-tight mb-1 flex items-center gap-2">
            <Landmark className="text-rose-500" size={20} />
            Xác nhận hủy vé
          </h3>
          <p className="text-xs text-red-400 font-semibold leading-relaxed mt-1">
            Lưu ý: Thao tác này sẽ hủy vé xem phim của bạn. Một yêu cầu hoàn tiền tương ứng sẽ tự động được gửi tới ban quản trị để duyệt.
          </p>
        </div>

        <form onSubmit={handleFormSubmit} className="flex flex-col gap-4">
          {/* Bank Info Fields */}
          <div className="bg-white/5 border border-white/5 rounded-2xl p-4 flex flex-col gap-3">
            <h4 className="text-xs font-bold text-rose-400 uppercase tracking-wider mb-1">
              Thông tin nhận hoàn tiền
            </h4>

            {/* Bank Select */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400 pl-1">
                Ngân hàng <span className="text-rose-500">*</span>
              </label>
              <select
                value={selectedBank}
                onChange={handleBankChange}
                className="w-full bg-slate-900 border border-white/10 rounded-xl p-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-red-500 transition-all"
              >
                <option value="">-- Chọn ngân hàng --</option>
                {POPULAR_BANKS.map((b) => (
                  <option key={b.code} value={b.code === 'OTHER' ? 'OTHER' : b.name}>
                    {b.name}
                  </option>
                ))}
              </select>
              {errors.bank && <span className="text-[10px] text-rose-500 pl-1">{errors.bank}</span>}
            </div>

            {/* Custom Bank Input */}
            {selectedBank === 'OTHER' && (
              <div className="flex flex-col gap-1.5 animate-in slide-in-from-top-2 duration-200">
                <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400 pl-1">
                  Nhập tên ngân hàng khác <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Ví dụ: Shinhan Bank, HSBC..."
                  value={customBank}
                  onChange={(e) => setCustomBank(e.target.value)}
                  className="w-full bg-slate-900 border border-white/10 rounded-xl p-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-red-500 transition-all"
                />
              </div>
            )}

            {/* Account Number */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400 pl-1">
                Số tài khoản <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Nhập số tài khoản..."
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value.replace(/[^a-zA-Z0-9]/g, ''))}
                className="w-full bg-slate-900 border border-white/10 rounded-xl p-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-red-500 transition-all"
              />
              {errors.accountNumber && <span className="text-[10px] text-rose-500 pl-1">{errors.accountNumber}</span>}
            </div>

            {/* Account Holder Name */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400 pl-1">
                Tên chủ tài khoản (Không dấu) <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Ví dụ: NGUYEN VAN A"
                value={accountHolder}
                onChange={handleAccountHolderChange}
                className="w-full bg-slate-900 border border-white/10 rounded-xl p-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-red-500 transition-all uppercase"
              />
              {errors.accountHolder && <span className="text-[10px] text-rose-500 pl-1">{errors.accountHolder}</span>}
            </div>
          </div>

          {/* Reason Field */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400 pl-1">
              Lý do hủy vé (Không bắt buộc)
            </label>
            <textarea
              rows="2"
              placeholder="Nhập lý do hủy vé của bạn..."
              value={cancelReason}
              onChange={(e) => onCancelReasonChange(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white/10 transition-all resize-none leading-relaxed"
            />
          </div>

          <div className="flex justify-end gap-3 mt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-5 py-2.5 bg-white/5 hover:bg-white/10 rounded-xl text-xs font-bold text-gray-400 hover:text-white transition-all cursor-pointer"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 transition-all active:scale-95 cursor-pointer shadow-[0_0_15px_rgba(225,29,72,0.4)]"
            >
              {isSubmitting ? 'Đang xử lý...' : 'Xác nhận hủy'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CancelBookingModal;
