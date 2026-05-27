import { useState, useEffect, useMemo } from 'react';
import AdminLayout from '../../components/Admin/Layout/AdminLayout';
import Modal from '../../components/Admin/Common/Modal';
import AdminTable from '../../components/Admin/Common/AdminTable';
import adminService from '../../services/adminService';
import useAdminForm from '../../hooks/useAdminForm';
import { Plus, Eye, Trash2, Edit2 } from 'lucide-react';

const SeatMapTemplates = () => {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [previewTemplate, setPreviewTemplate] = useState(null);
  const [editingTemplate, setEditingTemplate] = useState(null);

  const initialFormState = {
    MaSoDoGhe: '',
    TongHang: 10,
    TongCot: 12,
    CauTruc: '{"aisles": {"rows": [], "cols": [4, 9]}}',
    KhaDung: 1
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
    setFormData,
    handleChange,
    handleSubmit,
    resetForm
  } = useAdminForm(initialFormState, async (data) => {
    try {
      if (editingTemplate) {
        await adminService.updateSeatMap(editingTemplate.MaSoDoGhe, {
          TenSoDo: data.MaSoDoGhe,
          TongHang: Number(data.TongHang),
          TongCot: Number(data.TongCot),
          CauTruc: data.CauTruc,
          KhaDung: data.KhaDung === 1
        });
        alert("Cập nhật sơ đồ mẫu thành công!");
      } else {
        await adminService.addSeatMap({
          TenSoDo: data.MaSoDoGhe,
          TongHang: Number(data.TongHang),
          TongCot: Number(data.TongCot),
          CauTruc: data.CauTruc
        });
        alert("Tạo sơ đồ mẫu mới thành công!");
      }
      await loadData();
      setIsModalOpen(false);
      setEditingTemplate(null);
      resetForm();
    } catch (err) {
      alert(`Lỗi: ${err.message}`);
    }
  });

  const handleOpenAddModal = () => {
    setEditingTemplate(null);
    setFormData(initialFormState);
    setIsModalOpen(true);
  };

  const handleEdit = (template) => {
    setEditingTemplate(template);
    setFormData({
      MaSoDoGhe: template.MaSoDoGhe,
      TongHang: template.TongHang,
      TongCot: template.TongCot,
      CauTruc: template.CauTruc,
      KhaDung: template.KhaDung ?? 1
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa sơ đồ mẫu ${id}?`)) {
      try {
        await adminService.deleteSeatMap(id);
        alert("Xóa sơ đồ mẫu thành công!");
        await loadData();
      } catch (err) {
        alert(`Lỗi khi xóa: ${err.message}`);
      }
    }
  };

  const columns = [
    { header: 'Mã sơ đồ', accessor: 'MaSoDoGhe', className: 'font-mono font-bold text-white' },
    { header: 'Tên sơ đồ', accessor: 'TenSoDo', className: 'text-slate-400' },
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
            className="p-2 hover:bg-white/5 text-blue-500 hover:text-blue-400 rounded-xl transition-all cursor-pointer"
            title="Xem trước"
          >
            <Eye size={18} />
          </button>
          <button 
            onClick={() => handleEdit(t)}
            className="p-2 hover:bg-white/5 text-emerald-500 hover:text-emerald-400 rounded-xl transition-all cursor-pointer"
            title="Sửa"
          >
            <Edit2 size={18} />
          </button>
          <button 
            onClick={() => handleDelete(t.MaSoDoGhe)}
            className="p-2 hover:bg-white/5 text-red-500 hover:text-red-400 rounded-xl transition-all cursor-pointer"
            title="Xóa"
          >
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
    
    if (CauTruc) {
      try {
        struct = typeof CauTruc === 'string' ? JSON.parse(CauTruc) : CauTruc;
      } catch (e) { 
        console.error("JSON Parse error", e); 
      }
    }

    const result = [];
    for (let r = 0; r < TongHang; r++) {
      const row = [];
      const rowChar = String.fromCharCode(65 + r);
      for (let c = 0; c < TongCot; c++) {
        let isAisle = struct?.aisles?.cols?.includes(c + 1) || struct?.aisles?.rows?.includes(r + 1);
        if (!isAisle && struct?.aisles?.custom) {
          const customRow = struct.aisles.custom.find(item => item.row === r);
          if (customRow) {
            isAisle = customRow.cols.includes(c) || customRow.cols.includes(c + 1);
          }
        }
        row.push({
          id: `${rowChar}${c + 1}`,
          isAisle
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
          onClick={handleOpenAddModal}
          className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-red-500/20 flex items-center gap-2 cursor-pointer"
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

      {/* Create/Edit Modal */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => {
          setIsModalOpen(false);
          setEditingTemplate(null);
        }}
        title={editingTemplate ? "Cập nhật sơ đồ mẫu" : "Tạo sơ đồ mẫu mới"}
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Mã sơ đồ (MaSoDoGhe)</label>
            <input 
              type="text" name="MaSoDoGhe" required
              className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white font-mono disabled:opacity-50"
              value={formData.MaSoDoGhe} onChange={handleChange}
              placeholder="VD: SM10x12"
              disabled={!!editingTemplate}
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

          {editingTemplate && (
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Khả dụng (KhaDung)</label>
              <select 
                name="KhaDung"
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:border-red-500 transition-colors text-sm text-slate-300"
                value={formData.KhaDung}
                onChange={handleChange}
              >
                <option value={1} className="bg-[#0f1117]">1 (Khả dụng)</option>
                <option value={0} className="bg-[#0f1117]">0 (Chưa khả dụng)</option>
              </select>
            </div>
          )}

          <div className="flex gap-4 pt-4 border-t border-white/5">
            <button 
              type="button" 
              onClick={() => {
                setIsModalOpen(false);
                setEditingTemplate(null);
              }} 
              className="flex-grow py-3 rounded-xl font-bold text-slate-400 hover:bg-white/5 transition-all cursor-pointer"
            >
              Hủy
            </button>
            <button type="submit" className="flex-grow py-3 rounded-xl font-bold bg-red-500 hover:bg-red-600 transition-all cursor-pointer">Lưu mẫu</button>
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
