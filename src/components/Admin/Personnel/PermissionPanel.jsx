import { X } from 'lucide-react';

const PERMISSIONS = [
  'Quản lý phòng chiếu', 'Quản lý phim', 'Cấu hình sơ đồ ghế',
  'Cấu hình bảng giá', 'Quản lý Nhân viên', 'Quản lý suất chiếu', 'Xem thống kê',
];

const PermissionPanel = ({ isOpen, onClose, selectedStaff, staffPermissions, onToggle, onSave }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[150] flex justify-end">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md bg-[#0f1117] h-screen shadow-2xl border-l border-white/10 p-8 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-xl font-bold text-white">Phân quyền hệ thống</h3>
          <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-xl cursor-pointer"><X size={20} /></button>
        </div>

        {/* Staff info */}
        <div className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl mb-8 border border-white/5">
          <div className="w-12 h-12 rounded-full bg-red-500 flex items-center justify-center text-white font-black text-xl">
            {selectedStaff?.HoTen.charAt(0)}
          </div>
          <div>
            <h4 className="font-bold text-white">{selectedStaff?.HoTen}</h4>
            <p className="text-xs text-slate-500">{selectedStaff?.Role} • {selectedStaff?.ChucVu}</p>
          </div>
        </div>

        {/* Permissions list */}
        <div className="space-y-1 flex-grow overflow-y-auto pr-1 no-scrollbar">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-600 mb-4">Danh sách quyền hạn</p>
          {PERMISSIONS.map((perm) => (
            <label key={perm} className="flex items-center justify-between p-4 rounded-xl hover:bg-white/[0.02] cursor-pointer border border-transparent hover:border-white/5 transition-all group">
              <span className="text-sm text-slate-300 group-hover:text-white">{perm}</span>
              <input type="checkbox" className="w-5 h-5 rounded border-white/10 bg-white/5 accent-red-500 cursor-pointer"
                checked={staffPermissions.includes(perm)} onChange={() => onToggle(perm)} />
            </label>
          ))}
        </div>

        {/* Save */}
        <div className="pt-6 border-t border-white/5 mt-4">
          <button onClick={onSave}
            className="w-full py-4 bg-red-500 hover:bg-red-600 text-white rounded-2xl font-bold shadow-lg shadow-red-500/20 uppercase tracking-widest text-xs cursor-pointer">
            Cập nhật quyền hạn
          </button>
        </div>
      </div>
    </div>
  );
};

export { PERMISSIONS };
export default PermissionPanel;
