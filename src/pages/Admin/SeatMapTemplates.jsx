import { useState, useEffect, useMemo } from 'react';
import AdminLayout from '../../components/Admin/Layout/AdminLayout';
import Modal from '../../components/Admin/Common/Modal';
import AdminTable from '../../components/Admin/Common/AdminTable';
import adminService from '../../services/adminService';
import useAdminForm from '../../hooks/useAdminForm';
import { Plus, Eye, Trash2, Edit2 } from 'lucide-react';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import { showSuccess, showError } from '../../utils/toastHelper';
import AdminPageHeader from '../../components/Admin/Common/AdminPageHeader';
import { useClientPagination } from '../../hooks/useClientPagination';
import AdminToolbar from '../../components/Admin/Common/AdminToolbar';
import AdminPagination from '../../components/Admin/Common/AdminPagination';

const SeatMapTemplates = () => {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [previewTemplate, setPreviewTemplate] = useState(null);
  const [editingTemplate, setEditingTemplate] = useState(null);
  const [confirmState, setConfirmState] = useState({ isOpen: false, data: null });
  const [isDeleting, setIsDeleting] = useState(false);

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
        showSuccess("Cập nhật sơ đồ mẫu thành công!");
      } else {
        await adminService.addSeatMap({
          TenSoDo: data.MaSoDoGhe,
          TongHang: Number(data.TongHang),
          TongCot: Number(data.TongCot),
          CauTruc: data.CauTruc
        });
        showSuccess("Tạo sơ đồ mẫu mới thành công!");
      }
      await loadData();
      setIsModalOpen(false);
      setEditingTemplate(null);
      resetForm();
    } catch (err) {
      showError(`Lỗi: ${err.message}`);
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

  const handleDelete = (id) => {
    setConfirmState({ isOpen: true, data: id });
  };

  const handleConfirmDelete = async () => {
    const id = confirmState.data;
    setIsDeleting(true);
    try {
      await adminService.deleteSeatMap(id);
      showSuccess("Xóa sơ đồ mẫu thành công!");
      await loadData();
    } catch (err) {
      showError(`Lỗi khi xóa: ${err.message}`);
    } finally {
      setIsDeleting(false);
      setConfirmState({ isOpen: false, data: null });
    }
  };

  const {
    searchQuery,
    setSearchQuery,
    filters,
    setFilterVal,
    page,
    setPage,
    pageSize,
    setPageSize,
    totalItems,
    paginatedItems
  } = useClientPagination(
    templates,
    ['TenSoDo', 'MaSoDoGhe'],
    (t, f) => {
      const matchKhaDung = !f.activeStatus || f.activeStatus === 'All' || t.KhaDung === Number(f.activeStatus);
      return matchKhaDung;
    }
  );

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
            className="p-2 bg-white/5 hover:bg-white/10 border border-white/5 text-blue-500 hover:text-blue-400 rounded-xl transition-all cursor-pointer"
            title="Xem trước"
          >
            <Eye size={16} />
          </button>
          <button 
            onClick={() => handleEdit(t)}
            className="p-2 bg-white/5 hover:bg-white/10 border border-white/5 text-emerald-500 hover:text-emerald-400 rounded-xl transition-all cursor-pointer"
            title="Sửa"
          >
            <Edit2 size={16} />
          </button>
          <button 
            onClick={() => handleDelete(t.MaSoDoGhe)}
            className="p-2 bg-white/5 hover:bg-white/10 border border-white/5 text-red-500 hover:text-red-400 rounded-xl transition-all cursor-pointer"
            title="Xóa"
          >
            <Trash2 size={16} />
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
      <AdminPageHeader
        title="Sơ đồ ghế mẫu"
        subtitle="Quản lý các khuôn mẫu sơ đồ ghế (Template) dùng khi tạo phòng chiếu."
        action={
          <button 
            onClick={handleOpenAddModal}
            className="w-full md:w-auto bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-red-500/20 active:scale-95 flex items-center justify-center gap-2 cursor-pointer text-sm"
          >
            <Plus size={18} />
            Tạo mẫu mới
          </button>
        }
      />

      {/* Filters and search using AdminToolbar */}
      <AdminToolbar
        searchPlaceholder="Tìm theo tên sơ đồ hoặc mã sơ đồ..."
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        filterSlot={
          <>
            {/* Active Status filter */}
            <select
              value={filters.activeStatus || 'All'}
              onChange={e => setFilterVal('activeStatus', e.target.value)}
              className="bg-white/[0.04] border border-white/10 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-300 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all cursor-pointer [&>option]:bg-[#0a0d14]"
            >
              <option value="All">Tất cả trạng thái</option>
              <option value={1}>Khả dụng</option>
              <option value={0}>Không khả dụng</option>
            </select>
          </>
        }
      />

      {loading ? (
        <div className="bg-white/5 border border-white/5 rounded-3xl h-64 animate-pulse"></div>
      ) : paginatedItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 text-slate-500 bg-white/[0.02] border border-white/10 rounded-3xl text-sm font-semibold">
          Không tìm thấy dữ liệu phù hợp
        </div>
      ) : (
        <>
          <AdminTable columns={columns} data={paginatedItems} rowKey="MaSoDoGhe" />
          <AdminPagination
            page={page}
            pageSize={pageSize}
            total={totalItems}
            onPageChange={setPage}
            onPageSizeChange={setPageSize}
          />
        </>
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
              className="w-full bg-white/[0.04] border border-white/10 rounded-xl py-3 px-4 text-white font-mono disabled:opacity-50 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all"
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
                className="w-full bg-white/[0.04] border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all"
                value={formData.TongHang} onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Tổng số cột</label>
              <input 
                type="number" name="TongCot" required
                className="w-full bg-white/[0.04] border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all"
                value={formData.TongCot} onChange={handleChange}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Cấu trúc (JSON)</label>
            <textarea 
              name="CauTruc"
              className="w-full bg-white/[0.04] border border-white/10 rounded-xl py-3 px-4 text-white font-mono text-xs min-h-[100px] focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all"
              value={formData.CauTruc} onChange={handleChange}
            ></textarea>
            <p className="text-[10px] text-slate-600">Định nghĩa vị trí lối đi (aisles) theo cột hoặc hàng.</p>
          </div>

          {editingTemplate && (
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Khả dụng (KhaDung)</label>
              <select 
                name="KhaDung"
                className="w-full bg-white/[0.04] border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all text-sm text-slate-300 [&>option]:bg-[#0a0d14]"
                value={formData.KhaDung}
                onChange={handleChange}
              >
                <option value={1}>1 (Khả dụng)</option>
                <option value={0}>0 (Chưa khả dụng)</option>
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
              className="flex-grow py-3 rounded-xl font-bold border border-white/10 hover:bg-white/5 hover:text-white transition-all text-xs uppercase tracking-widest cursor-pointer text-slate-400"
            >
              Hủy
            </button>
            <button type="submit" className="flex-grow py-3 rounded-xl font-bold bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white shadow-lg shadow-red-500/20 transition-all text-xs uppercase tracking-widest cursor-pointer">Lưu mẫu</button>
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
          <div className="w-full max-w-md h-1 bg-slate-700 rounded-full mb-12 relative">
            <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-black text-slate-500 uppercase tracking-[0.8em]">Screen</span>
          </div>
          
          <div 
            className="inline-grid gap-1.5 p-4 bg-black/40 rounded-2xl border border-white/5 overflow-auto max-w-full custom-scrollbar"
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

      <ConfirmDialog
        isOpen={confirmState.isOpen}
        title="Xóa sơ đồ mẫu"
        message={`Bạn có chắc chắn muốn xóa sơ đồ mẫu ${confirmState.data}?`}
        confirmText="Xóa"
        cancelText="Hủy"
        variant="danger"
        isLoading={isDeleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => setConfirmState({ isOpen: false, data: null })}
      />
    </AdminLayout>
  );
};

export default SeatMapTemplates;
