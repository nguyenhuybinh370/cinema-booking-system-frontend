import { X, Lock } from "lucide-react";

const ChangePasswordModal = ({
  isOpen,
  onClose,
  formData,
  setFormData,
  onSave,
}) => {
  if (!isOpen) return null;

  const isInvalid =
    !formData.oldPassword ||
    !formData.newPassword ||
    formData.newPassword !== formData.confirmPassword;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm animate-in fade-in duration-200 p-4">
      <div className="bg-[#131A2A] border border-white/10 rounded-3xl p-8 max-w-md w-full shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-slate-500 hover:text-white transition-colors cursor-pointer"
        >
          <X size={20} />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-[#FFB000]/10 rounded-xl text-[#FFB000] border border-[#FFB000]/20 shadow-inner">
            <Lock size={20} />
          </div>
          <h2 className="text-xl font-extrabold uppercase tracking-widest text-[#FFB000] text-glow">
            Đổi Mật Khẩu
          </h2>
        </div>

        <form onSubmit={onSave} className="space-y-5">
          <div>
            <label className="block text-[10px] uppercase text-slate-500 font-black mb-1.5 pl-1 tracking-wider">
              Mật khẩu hiện tại
            </label>
            <input
              type="password"
              required
              value={formData.oldPassword}
              onChange={(e) =>
                setFormData({ ...formData, oldPassword: e.target.value })
              }
              className="w-full bg-slate-950/60 border border-slate-800 focus:border-[#FFB000] focus:ring-1 focus:ring-[#FFB000]/30 rounded-xl px-4 py-3 text-sm text-white focus:outline-none transition-all font-mono tracking-widest"
            />
          </div>

          <div>
            <label className="block text-[10px] uppercase text-slate-500 font-black mb-1.5 pl-1 tracking-wider">
              Mật khẩu mới
            </label>
            <input
              type="password"
              required
              minLength={6}
              value={formData.newPassword}
              onChange={(e) =>
                setFormData({ ...formData, newPassword: e.target.value })
              }
              className="w-full bg-slate-950/60 border border-slate-800 focus:border-[#FFB000] focus:ring-1 focus:ring-[#FFB000]/30 rounded-xl px-4 py-3 text-sm text-white focus:outline-none transition-all font-mono tracking-widest"
            />
          </div>

          <div>
            <label className="block text-[10px] uppercase text-slate-500 font-black mb-1.5 pl-1 tracking-wider">
              Xác nhận mật khẩu mới
            </label>
            <input
              type="password"
              required
              minLength={6}
              value={formData.confirmPassword}
              onChange={(e) =>
                setFormData({ ...formData, confirmPassword: e.target.value })
              }
              className={`w-full bg-slate-950/60 border rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-1 transition-all font-mono tracking-widest
                ${
                  formData.confirmPassword &&
                  formData.confirmPassword !== formData.newPassword
                    ? "border-red-500 focus:border-red-500 focus:ring-red-500/30"
                    : "border-slate-800 focus:border-[#FFB000] focus:ring-[#FFB000]/30"
                }
              `}
            />
            {formData.confirmPassword &&
              formData.confirmPassword !== formData.newPassword && (
                <p className="text-red-400 text-xs mt-1.5 pl-1 animate-pulse font-medium">
                  Mật khẩu xác nhận không khớp!
                </p>
              )}
          </div>

          <div className="flex gap-4 pt-6 mt-6 border-t border-white/5">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 rounded-full font-bold text-slate-400 bg-white/5 hover:bg-white/10 hover:text-white transition-all duration-300 uppercase text-[10px] tracking-wider border border-white/5 cursor-pointer"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              disabled={isInvalid}
              className="flex-1 btn-bright text-[10px] tracking-wider disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Xác nhận đổi
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangePasswordModal;
