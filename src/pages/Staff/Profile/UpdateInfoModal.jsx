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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200 p-4">
      <div className="bg-[var(--navy-light)] border border-white/20 rounded-3xl p-8 max-w-lg w-full shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-white/50 hover:text-white"
        >
          <X size={24} />
        </button>

        <h2 className="text-2xl font-bold uppercase tracking-widest text-[var(--btn-neon)] mb-6">
          Cập nhật thông tin
        </h2>

        <form onSubmit={onSave} className="space-y-4">
          <div>
            <label className="block text-xs uppercase text-white/50 mb-1 pl-1">
              Họ và Tên
            </label>
            <input
              type="text"
              required
              value={formData.fullName}
              onChange={(e) =>
                setFormData({ ...formData, fullName: e.target.value })
              }
              className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[var(--btn-neon)] transition-colors"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs uppercase text-white/50 mb-1 pl-1">
                Số điện thoại
              </label>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[var(--btn-neon)] transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs uppercase text-white/50 mb-1 pl-1">
                Giới tính
              </label>
              <select
                value={formData.gender}
                onChange={(e) =>
                  setFormData({ ...formData, gender: e.target.value })
                }
                className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[var(--btn-neon)] transition-colors appearance-none"
              >
                <option value="Nam" className="bg-[var(--navy-deep)]">
                  Nam
                </option>
                <option value="Nữ" className="bg-[var(--navy-deep)]">
                  Nữ
                </option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase text-white/50 mb-1 pl-1">
              Ngày sinh
            </label>
            <input
              type="date"
              required
              value={formData.dob}
              onChange={(e) =>
                setFormData({ ...formData, dob: e.target.value })
              }
              className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[var(--btn-neon)] transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs uppercase text-white/50 mb-1 pl-1">
              Email
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[var(--btn-neon)] transition-colors"
            />
          </div>

          <div className="flex gap-4 pt-6 mt-6 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 rounded-full font-bold text-white/50 hover:bg-white/5 hover:text-white transition-colors"
            >
              Hủy bỏ
            </button>
            <button type="submit" className="flex-1 btn-bright">
              Lưu Thay Đổi
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateInfoModal;
