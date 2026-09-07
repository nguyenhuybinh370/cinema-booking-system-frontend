import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowDown, ArrowUp, Pencil, Plus, Trash2 } from 'lucide-react';
import AdminLayout from '../../components/Admin/Layout/AdminLayout';
import AdminButton from '../../components/Admin/Common/AdminButton';
import AdminConfirmDialog from '../../components/Admin/Common/AdminConfirmDialog';
import AdminPageHeader from '../../components/Admin/Common/AdminPageHeader';
import AdminPagination from '../../components/Admin/Common/AdminPagination';
import AdminTable from '../../components/Admin/Common/AdminTable';
import AdminToolbar from '../../components/Admin/Common/AdminToolbar';
import StatusBadge from '../../components/Admin/Common/StatusBadge';
import { banners, blogPosts } from '../../constants/adminContentData';
import { showSuccess } from '../../utils/toastHelper';

const configs = {
  blog: { title: 'Blog', subtitle: 'Soạn thảo và xuất bản nội dung điện ảnh.', createLabel: 'Viết bài', basePath: '/admin/blog', rows: blogPosts },
  banner: { title: 'Banner', subtitle: 'Quản lý chiến dịch hình ảnh trên website.', createLabel: 'Thêm banner', basePath: '/admin/site/banners', rows: banners },
};

const ContentListPage = ({ kind }) => {
  const config = configs[kind];
  const navigate = useNavigate();
  const [rows, setRows] = useState(config.rows);
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('Tất cả');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [pendingDelete, setPendingDelete] = useState(null);

  const filteredRows = useMemo(() => rows.filter((row) => {
    const text = [row.title, row.name, row.author, row.placement, ...(row.tags || [])].filter(Boolean).join(' ').toLowerCase();
    return text.includes(query.toLowerCase()) && (status === 'Tất cả' || row.status === status);
  }), [query, rows, status]);
  const paginatedRows = filteredRows.slice((page - 1) * pageSize, page * pageSize);

  const moveBanner = (bannerId, direction) => {
    setRows((currentRows) => {
      const index = currentRows.findIndex((row) => row.id === bannerId);
      const nextIndex = index + direction;
      if (nextIndex < 0 || nextIndex >= currentRows.length) return currentRows;
      const nextRows = [...currentRows];
      [nextRows[index], nextRows[nextIndex]] = [nextRows[nextIndex], nextRows[index]];
      return nextRows.map((row, rowIndex) => ({ ...row, order: rowIndex + 1 }));
    });
  };

  const actions = (row) => (
    <div className="flex justify-end gap-1">
      {kind === 'banner' && <><button type="button" className="admin-table-action" aria-label={`Đưa ${row.name} lên`} onClick={() => moveBanner(row.id, -1)}><ArrowUp size={15} /></button><button type="button" className="admin-table-action" aria-label={`Đưa ${row.name} xuống`} onClick={() => moveBanner(row.id, 1)}><ArrowDown size={15} /></button></>}
      <button type="button" className="admin-table-action" aria-label="Chỉnh sửa" onClick={() => navigate(`${config.basePath}/${row.id}`)}><Pencil size={16} /></button>
      <button type="button" className="admin-table-action admin-table-action--danger" aria-label="Xóa" onClick={() => setPendingDelete(row)}><Trash2 size={16} /></button>
    </div>
  );

  const columns = kind === 'blog' ? [
    { header: 'Bài viết', render: (row) => <div className="admin-content-title"><strong>{row.title}</strong><small>{row.author}</small></div> },
    { header: 'Tags', render: (row) => row.tags.join(', ') },
    { header: 'Trạng thái', render: (row) => <StatusBadge status={row.status} /> },
    { header: 'Xuất bản', accessor: 'publishedAt' },
    { header: 'Cập nhật', accessor: 'updatedAt' },
    { header: '', className: 'w-[90px] text-right', render: actions },
  ] : [
    { header: 'Banner', render: (row) => <div className="admin-content-title"><strong>{row.name}</strong><small>{row.placement}</small></div> },
    { header: 'Trạng thái', render: (row) => <StatusBadge status={row.status} /> },
    { header: 'Thời gian hiển thị', accessor: 'schedule' },
    { header: 'Thứ tự', render: (row) => `#${row.order}` },
    { header: 'Cập nhật', accessor: 'updatedAt' },
    { header: '', className: 'w-[150px] text-right', render: actions },
  ];

  const handleDelete = () => {
    const label = pendingDelete.title || pendingDelete.name;
    setRows((currentRows) => currentRows.filter((row) => row.id !== pendingDelete.id));
    setPendingDelete(null);
    showSuccess(`Đã xóa “${label}”.`);
  };

  return (
    <AdminLayout>
      <AdminPageHeader title={config.title} subtitle={config.subtitle} action={<AdminButton icon={Plus} onClick={() => navigate(`${config.basePath}/new`)}>{config.createLabel}</AdminButton>} />
      <AdminToolbar searchPlaceholder={`Tìm kiếm ${config.title.toLowerCase()}...`} searchValue={query} onSearchChange={(value) => { setQuery(value); setPage(1); }} filterSlot={<select className="admin-input min-w-44" value={status} onChange={(event) => { setStatus(event.target.value); setPage(1); }}>{['Tất cả', 'Bản nháp', 'Đã lên lịch', 'Đã xuất bản', 'Đang hoạt động'].map((value) => <option key={value}>{value}</option>)}</select>} />
      <AdminTable columns={columns} data={paginatedRows} rowKey="id" />
      <AdminPagination page={page} pageSize={pageSize} total={filteredRows.length} onPageChange={setPage} onPageSizeChange={(value) => { setPageSize(value); setPage(1); }} />
      <AdminConfirmDialog isOpen={Boolean(pendingDelete)} title={pendingDelete ? `Xóa “${pendingDelete.title || pendingDelete.name}”?` : 'Xóa nội dung?'} message={kind === 'blog' ? 'Bài viết sẽ không còn xuất hiện trên website. Hành động này không thể hoàn tác.' : 'Banner sẽ bị gỡ khỏi tất cả vị trí đang hiển thị trên website.'} confirmText={kind === 'blog' ? 'Xóa bài viết' : 'Xóa banner'} onConfirm={handleDelete} onCancel={() => setPendingDelete(null)} />
    </AdminLayout>
  );
};

export default ContentListPage;
