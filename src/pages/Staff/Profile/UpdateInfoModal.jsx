import { X } from "lucide-react";

const UpdateInfoModal = ({
  isOpen,
  onClose,
  formData,
  setFormData,
  onSave,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm animate-in fade-in duration-200 p-4">
      <div className="bg-[#131A2A] border border-white/10 rounded-3xl p-8 max-w-lg w-full shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-slate-500 hover:text-white transition-colors cursor-pointer"
        >
          <X size={20} />
        </button>

        <h2 className="text-xl font-extrabold uppercase tracking-widest text-[var(--btn-neon)] mb-6 text-glow">
          Cập nhật thông tin
        </h2>

        <form onSubmit={onSave} className="space-y-4">
          <div>
            <label className="block text-[10px] uppercase text-slate-500 font-black mb-1.5 pl-1 tracking-wider">
              Họ và Tên
            </label>
            <input
              type="text"
              required
              value={formData.fullName}
              onChange={(e) =>
                setFormData({ ...formData, fullName: e.target.value })
              }
              className="w-full bg-slate-950/60 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[var(--btn-neon)] focus:ring-1 focus:ring-[var(--btn-neon)]/30 transition-all font-medium"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] uppercase text-slate-500 font-black mb-1.5 pl-1 tracking-wider">
                Số điện thoại
              </label>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                className="w-full bg-slate-950/60 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[var(--btn-neon)] focus:ring-1 focus:ring-[var(--btn-neon)]/30 transition-all font-mono"
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase text-slate-500 font-black mb-1.5 pl-1 tracking-wider">
                Giới tính
              </label>
              <select
                value={formData.gender}
                onChange={(e) =>
                  setFormData({ ...formData, gender: e.target.value })
                }
                className="w-full bg-slate-950/60 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[var(--btn-neon)] focus:ring-1 focus:ring-[var(--btn-neon)]/30 transition-all font-medium appearance-none"
              >
                <option value="Nam" className="bg-[#131A2A] text-white">
                  Nam
                </option>
                <option value="Nữ" className="bg-[#131A2A] text-white">
                  Nữ
                </option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[10px] uppercase text-slate-500 font-black mb-1.5 pl-1 tracking-wider">
              Ngày sinh
            </label>
            <input
              type="date"
              required
              value={formData.dob}
              onChange={(e) =>
                setFormData({ ...formData, dob: e.target.value })
              }
              className="w-full bg-slate-950/60 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[var(--btn-neon)] focus:ring-1 focus:ring-[var(--btn-neon)]/30 transition-all font-mono"
            />
          </div>

          <div>
            <label className="block text-[10px] uppercase text-slate-500 font-black mb-1.5 pl-1 tracking-wider">
              Email
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="w-full bg-slate-950/60 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[var(--btn-neon)] focus:ring-1 focus:ring-[var(--btn-neon)]/30 transition-all font-medium"
            />
          </div>

          <div className="flex gap-4 pt-6 mt-6 border-t border-white/5">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 rounded-full font-bold text-slate-400 bg-white/5 hover:bg-white/10 hover:text-white transition-all duration-300 uppercase text-[10px] tracking-wider border border-white/5 cursor-pointer"
            >
              Hủy bỏ
            </button>
            <button type="submit" className="flex-1 btn-bright text-[10px] tracking-wider">
              Lưu Thay Đổi
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateInfoModal;
