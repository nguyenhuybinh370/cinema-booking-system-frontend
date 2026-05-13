import { useState, useEffect, useMemo } from 'react';
import AdminLayout from '../../components/Admin/Layout/AdminLayout';
import Modal from '../../components/Admin/Common/Modal';
import AdminTable from '../../components/Admin/Common/AdminTable';
import adminService from '../../services/adminService';
import useAdminForm from '../../hooks/useAdminForm';
import { Plus, Eye, Code, Trash2 } from 'lucide-react';

const SeatMapTemplates = () => {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [previewTemplate, setPreviewTemplate] = useState(null);

  const initialFormState = {
    MaSoDoGhe: '',
    TongHang: 10,
    TongCot: 12,
    CauTruc: '{"aisles": {"rows": [], "cols": [4, 9]}}'
  };

  const loadData = async () => {
    setLoading(true);
    const data = await adminService.getSeatMaps();
    setTemplates(data);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const {
    formData,
    handleChange,
    handleSubmit,
    resetForm
  } = useAdminForm(initialFormState, async (data) => {
    // In a real app, this would call adminService.addSeatMap
    // For now, we simulate
    setTemplates(prev => [...prev, data]);
    setIsModalOpen(false);
    resetForm();
  });

  const columns = [
    { header: 'Mã sơ đồ', accessor: 'MaSoDoGhe', className: 'font-mono font-bold text-white' },
    { header: 'Số hàng', accessor: 'TongHang', className: 'text-slate-400' },
    { header: 'Số cột', accessor: 'TongCot', className: 'text-slate-400' },
    { 
      header: 'Tổng số ghế', 
      render: (t) => <span className="font-bold text-emerald-500">{t.TongHang * t.TongCot}</span> 
    },
    {
      header: 'Hành động',
      className: 'text-right',
      render: (t) => (
        <div className="flex justify-end gap-2">
          <button 
            onClick={() => setPreviewTemplate(t)}
            className="p-2 hover:bg-white/5 text-blue-500 hover:text-blue-400 rounded-xl transition-all"
            title="Xem trước"
          >
            <Eye size={18} />
          </button>
          <button className="p-2 hover:bg-white/5 text-slate-500 hover:text-white rounded-xl transition-all">
            <Code size={18} />
          </button>
          <button className="p-2 hover:bg-white/5 text-red-500 hover:text-red-400 rounded-xl transition-all">
            <Trash2 size={18} />
          </button>
        </div>
      )
    }
  ];

  // Preview Matrix Logic
  const previewMatrix = useMemo(() => {
    if (!previewTemplate) return [];
    const { TongHang, TongCot, CauTruc } = previewTemplate;
    let struct = { aisles: { rows: [], cols: [] } };
    try {
      struct = typeof CauTruc === 'string' ? JSON.parse(CauTruc) : CauTruc;
    } catch (e) { console.error("JSON Parse error", e); }

    const result = [];
    for (let r = 0; r < TongHang; r++) {
      const row = [];
      const rowChar = String.fromCharCode(65 + r);
      for (let c = 0; c < TongCot; c++) {
        row.push({
          id: `${rowChar}${c + 1}`,
          isAisle: struct.aisles?.cols?.includes(c + 1) || struct.aisles?.rows?.includes(r + 1)
        });
      }
      result.push(row);
    }
    return result;
  }, [previewTemplate]);

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white text-glow">Sơ đồ ghế mẫu</h1>
          <p className="text-slate-500 font-medium">Quản lý các khuôn mẫu sơ đồ ghế (Template) dùng khi tạo phòng chiếu.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-red-500/20 flex items-center gap-2"
        >
          <Plus size={20} />
          Tạo mẫu mới
        </button>
      </div>

      {loading ? (
        <div className="bg-white/5 border border-white/5 rounded-3xl h-64 animate-pulse"></div>
      ) : (
        <AdminTable columns={columns} data={templates} rowKey="MaSoDoGhe" />
      )}

      {/* Create Modal */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title="Tạo sơ đồ mẫu mới"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Mã sơ đồ (MaSoDoGhe)</label>
            <input 
              type="text" name="MaSoDoGhe" required
              className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white font-mono"
              value={formData.MaSoDoGhe} onChange={handleChange}
              placeholder="VD: SM10x12"
            />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Tổng số hàng</label>
              <input 
                type="number" name="TongHang" required
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white"
                value={formData.TongHang} onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Tổng số cột</label>
              <input 
                type="number" name="TongCot" required
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white"
                value={formData.TongCot} onChange={handleChange}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Cấu trúc (JSON)</label>
            <textarea 
              name="CauTruc"
              className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white font-mono text-xs min-h-[100px]"
              value={formData.CauTruc} onChange={handleChange}
            ></textarea>
            <p className="text-[10px] text-slate-600">Định nghĩa vị trí lối đi (aisles) theo cột hoặc hàng.</p>
          </div>

          <div className="flex gap-4 pt-4 border-t border-white/5">
            <button type="button" onClick={() => setIsModalOpen(false)} className="flex-grow py-3 rounded-xl font-bold text-slate-400 hover:bg-white/5 transition-all">Hủy</button>
            <button type="submit" className="flex-grow py-3 rounded-xl font-bold bg-red-500 hover:bg-red-600 transition-all">Lưu mẫu</button>
          </div>
        </form>
      </Modal>

      {/* Preview Modal */}
      <Modal
        isOpen={!!previewTemplate}
        onClose={() => setPreviewTemplate(null)}
        title={`Xem trước: ${previewTemplate?.MaSoDoGhe}`}
      >
        <div className="flex flex-col items-center p-8">
          <div className="w-full max-w-md h-1 bg-slate-800 rounded-full mb-12 relative">
            <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-black text-slate-600 uppercase tracking-widest">Screen</span>
          </div>
          
          <div 
            className="inline-grid gap-1.5 p-4 bg-black/20 rounded-2xl border border-white/5"
            style={{ gridTemplateColumns: `repeat(${previewTemplate?.TongCot}, minmax(0, 1fr))` }}
          >
            {previewMatrix.flat().map((cell, i) => (
              <div 
                key={i}
                className={`w-6 h-6 rounded-sm border flex items-center justify-center text-[8px] font-bold ${
                  cell.isAisle ? 'bg-transparent border-transparent text-slate-800' : 'bg-slate-700 border-slate-600 text-slate-400'
                }`}
              >
                {!cell.isAisle && cell.id}
              </div>
            ))}
          </div>
        </div>
      </Modal>
    </AdminLayout>
  );
};

export default SeatMapTemplates;
