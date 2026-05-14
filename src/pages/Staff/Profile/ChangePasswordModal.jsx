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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200 p-4">
      <div className="bg-[var(--navy-light)] border border-white/20 rounded-3xl p-8 max-md w-full shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-white/50 hover:text-white"
        >
          <X size={24} />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-[var(--btn-neon)]/10 rounded-xl text-[var(--btn-neon)]">
            <Lock size={24} />
          </div>
          <h2 className="text-2xl font-bold uppercase tracking-widest text-[var(--btn-neon)]">
            Đổi Mật Khẩu
          </h2>
        </div>

        <form onSubmit={onSave} className="space-y-5">
          <div>
            <label className="block text-xs uppercase text-white/50 mb-1 pl-1">
              Mật khẩu hiện tại
            </label>
            <input
              type="password"
              required
              value={formData.oldPassword}
              onChange={(e) =>
                setFormData({ ...formData, oldPassword: e.target.value })
              }
              className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[var(--btn-neon)] transition-colors font-mono tracking-widest"
            />
          </div>

          <div>
            <label className="block text-xs uppercase text-white/50 mb-1 pl-1">
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
              className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[var(--btn-neon)] transition-colors font-mono tracking-widest"
            />
          </div>

          <div>
            <label className="block text-xs uppercase text-white/50 mb-1 pl-1">
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
              className={`w-full bg-black/20 border rounded-xl px-4 py-3 text-white focus:outline-none transition-colors font-mono tracking-widest
                ${
                  formData.confirmPassword &&
                  formData.confirmPassword !== formData.newPassword
                    ? "border-red-500 focus:border-red-500"
                    : "border-white/10 focus:border-[var(--btn-neon)]"
                }
              `}
            />
            {formData.confirmPassword &&
              formData.confirmPassword !== formData.newPassword && (
                <p className="text-red-400 text-xs mt-1 pl-1 animate-pulse">
                  Mật khẩu xác nhận không khớp!
                </p>
              )}
          </div>

          <div className="flex gap-4 pt-6 mt-6 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 rounded-full font-bold text-white/50 hover:bg-white/5 hover:text-white transition-colors"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              disabled={isInvalid}
              className="flex-1 btn-bright disabled:opacity-50 disabled:cursor-not-allowed"
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
