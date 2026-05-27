import Modal from '../Common/Modal';
import { AlertCircle, Film, User, Users } from 'lucide-react';

const MovieModal = ({ isOpen, onClose, editingMovie, formData, errors, onChange, onSubmit }) => (
  <Modal isOpen={isOpen} onClose={onClose} title={editingMovie ? 'Cập nhật phim' : 'Thêm phim mới'}>
    <form onSubmit={onSubmit} className="space-y-6 max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar">
      {errors?.submit && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs p-4 rounded-xl flex items-center gap-2">
          <AlertCircle size={16} className="shrink-0" /> <span>{errors.submit}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Poster + KhaDung */}
        <div className="lg:col-span-4 space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block">Ảnh Poster (HinhAnh)</label>
            <div className="aspect-[2/3] w-full rounded-2xl overflow-hidden bg-white/5 border border-white/10 relative">
              {formData.HinhAnh ? (
                <img src={formData.HinhAnh} className="w-full h-full object-cover" alt="Preview" />
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-600 gap-2">
                  <Film size={32} /><span className="text-xs font-bold">Chưa có ảnh poster</span>
                </div>
              )}
            </div>
            <input type="text" name="HinhAnh" placeholder="Nhập link URL hình ảnh poster..."
              className="w-full bg-white/[0.04] border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all text-xs text-white placeholder:text-slate-500"
              value={formData.HinhAnh} onChange={onChange} />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block">Khả dụng (KhaDung)</label>
            <select name="KhaDung" value={formData.KhaDung} onChange={onChange}
              className="w-full bg-white/[0.04] border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all text-sm text-slate-200 font-bold [&>option]:bg-[#0a0d14] cursor-pointer">
              <option value={1}>1 (Khả dụng)</option>
              <option value={0}>0 (Chưa khả dụng)</option>
            </select>
          </div>
        </div>

        {/* Right: Info fields */}
        <div className="lg:col-span-8 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Tên phim */}
            <div className="md:col-span-2 space-y-1">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Tên phim (TenPhim)</label>
              <input type="text" name="TenPhim" required placeholder="VD: Lật Mặt 7"
                className="w-full bg-white/[0.04] border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all text-sm font-bold text-white placeholder:text-slate-500"
                value={formData.TenPhim} onChange={onChange} />
            </div>
            {/* Thời lượng */}
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Thời lượng (phút)</label>
              <input type="number" name="ThoiLuong" required min="1" placeholder="120"
                className="w-full bg-white/[0.04] border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all text-sm text-white placeholder:text-slate-500"
                value={formData.ThoiLuong} onChange={onChange} />
            </div>
            {/* Thể loại */}
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Thể loại</label>
              <input type="text" name="TheLoai" required placeholder="Hành động, Tâm lý"
                className="w-full bg-white/[0.04] border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all text-sm text-white placeholder:text-slate-500"
                value={formData.TheLoai} onChange={onChange} />
            </div>
            {/* Giới hạn tuổi */}
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Giới hạn độ tuổi</label>
              <select name="GioiHanTuoi" value={formData.GioiHanTuoi} onChange={onChange}
                className="w-full bg-white/[0.04] border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all text-sm text-slate-200 font-bold [&>option]:bg-[#0a0d14] cursor-pointer">
                {['P', 'C13', 'C16', 'C18'].map(g => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </div>
            {/* Trailer */}
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Trailer</label>
              <input type="text" name="Trailer" required placeholder="https://youtube.com/..."
                className="w-full bg-white/[0.04] border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all text-sm text-white placeholder:text-slate-500"
                value={formData.Trailer} onChange={onChange} />
            </div>
            {/* Ngày khởi chiếu */}
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Ngày khởi chiếu</label>
              <input type="date" name="NgayKhoiChieu" required
                className="w-full bg-white/[0.04] border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all text-sm text-slate-200"
                value={formData.NgayKhoiChieu} onChange={onChange} />
            </div>
            {/* Ngày kết thúc */}
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Ngày kết thúc chiếu</label>
              <input type="date" name="NgayKetThuc"
                className="w-full bg-white/[0.04] border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all text-sm text-slate-200"
                value={formData.NgayKetThuc} onChange={onChange} />
            </div>
            {/* Đạo diễn */}
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Đạo diễn</label>
              <input type="text" name="DaoDien" placeholder="Lý Hải"
                className="w-full bg-white/[0.04] border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all text-sm text-white placeholder:text-slate-500"
                value={formData.DaoDien} onChange={onChange} />
            </div>
            {/* Diễn viên */}
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Diễn viên</label>
              <input type="text" name="DienVien" placeholder="Trương Minh Cường, Đinh Y Nhung"
                className="w-full bg-white/[0.04] border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all text-sm text-white placeholder:text-slate-500"
                value={formData.DienVien} onChange={onChange} />
            </div>
          </div>

          {/* Nội dung */}
          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Mô tả nội dung</label>
            <textarea name="NoiDung" rows={4} placeholder="Tóm tắt cốt truyện..."
              className="w-full bg-white/[0.04] border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all text-sm resize-none text-white placeholder:text-slate-500"
              value={formData.NoiDung} onChange={onChange} />
          </div>
        </div>
      </div>

      {editingMovie && (
        <div className="grid grid-cols-2 gap-6 text-[10px] text-slate-500 font-mono bg-white/[0.01] p-3 rounded-lg border border-white/5">
          <div>Ngày tạo: {editingMovie.NgayTao || '--:--'}</div>
          <div>Ngày cập nhật: {editingMovie.NgayCapNhat || 'Chưa cập nhật'}</div>
        </div>
      )}

      <div className="flex gap-4 pt-4 border-t border-white/5">
        <button type="button" onClick={onClose} className="flex-grow py-3 px-6 rounded-xl font-bold text-slate-400 hover:bg-white/5 border border-white/5 hover:border-white/10 active:scale-95 uppercase tracking-widest text-xs cursor-pointer">Hủy</button>
        <button type="submit" className="flex-grow py-3 px-6 rounded-xl font-bold bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 transition-all shadow-lg shadow-red-500/20 active:scale-95 uppercase tracking-widest text-xs cursor-pointer text-white">
          {editingMovie ? 'Cập nhật' : 'Lưu phim'}
        </button>
      </div>
    </form>
  </Modal>
);

export default MovieModal;
