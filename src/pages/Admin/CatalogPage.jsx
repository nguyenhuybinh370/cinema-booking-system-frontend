import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import AdminLayout from '../../components/Admin/Layout/AdminLayout';
import AdminButton from '../../components/Admin/Common/AdminButton';
import AdminConfirmDialog from '../../components/Admin/Common/AdminConfirmDialog';
import AdminPageHeader from '../../components/Admin/Common/AdminPageHeader';
import AdminPagination from '../../components/Admin/Common/AdminPagination';
import AdminTable from '../../components/Admin/Common/AdminTable';
import AdminToolbar from '../../components/Admin/Common/AdminToolbar';
import StatusBadge from '../../components/Admin/Common/StatusBadge';
import { actors, genres } from '../../constants/adminContentData';
import { showSuccess } from '../../utils/toastHelper';

const configs = {
  actors: {
    title: 'Diễn viên',
    subtitle: 'Quản lý hồ sơ diễn viên và các phim liên kết.',
    createLabel: 'Thêm diễn viên',
    createPath: '/admin/actors/new',
    rows: actors,
  },
  genres: {
    title: 'Thể loại',
    subtitle: 'Chuẩn hóa phân loại phim hiển thị trên website.',
    createLabel: 'Thêm thể loại',
    rows: genres,
  },
};

const CatalogPage = ({ resource }) => {
  const config = configs[resource];
  const navigate = useNavigate();
  const [rows, setRows] = useState(config.rows);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [pendingDelete, setPendingDelete] = useState(null);

  const filteredRows = useMemo(() => rows.filter((row) => (
    [row.name, row.slug, row.country, row.contentType].filter(Boolean).join(' ').toLowerCase().includes(searchQuery.toLowerCase())
  )), [rows, searchQuery]);
  const paginatedRows = filteredRows.slice((page - 1) * pageSize, page * pageSize);

  const handleCreate = () => {
    if (config.createPath) navigate(config.createPath);
    else showSuccess(`Đã mở biểu mẫu ${config.createLabel.toLowerCase()}.`);
  };

  const handleDelete = () => {
    setRows((currentRows) => currentRows.filter((row) => row.id !== pendingDelete.id));
    showSuccess(`Đã xóa “${pendingDelete.name}”.`);
    setPendingDelete(null);
  };

  const actionColumn = {
    header: '',
    className: 'w-[96px] text-right',
    render: (row) => (
      <div className="flex justify-end gap-1">
        <button
          type="button"
          className="admin-table-action"
          aria-label={`Chỉnh sửa ${row.name}`}
          onClick={() => resource === 'actors' ? navigate(`/admin/actors/${row.id}`) : showSuccess(`Đã mở “${row.name}” để chỉnh sửa.`)}
        ><Pencil size={16} strokeWidth={1.8} /></button>
        <button type="button" className="admin-table-action admin-table-action--danger" aria-label={`Xóa ${row.name}`} onClick={() => setPendingDelete(row)}>
          <Trash2 size={16} strokeWidth={1.8} />
        </button>
      </div>
    ),
  };

  const columns = resource === 'actors' ? [
    { header: 'Diễn viên', render: (row) => <div className="admin-person-cell"><span>{row.name.split(' ').slice(-2).map((part) => part[0]).join('')}</span><div><strong>{row.name}</strong><small>{row.internationalName}</small></div></div> },
    { header: 'Quốc gia', accessor: 'country' },
    { header: 'Phim liên kết', render: (row) => `${row.movieCount} phim` },
    { header: 'Trạng thái', render: (row) => <StatusBadge status={row.status} /> },
    { header: 'Cập nhật', accessor: 'updatedAt' },
    actionColumn,
  ] : [
    { header: 'Tên thể loại', render: (row) => <strong className="text-sm font-semibold">{row.name}</strong> },
    { header: 'Slug', render: (row) => <code className="admin-code">/{row.slug}</code> },
    { header: 'Đang sử dụng', render: (row) => `${row.usageCount} nội dung` },
    { header: 'Trạng thái', render: (row) => <StatusBadge status={row.status} /> },
    { header: 'Cập nhật', accessor: 'updatedAt' },
    actionColumn,
  ];

  return (
    <AdminLayout>
      <AdminPageHeader title={config.title} subtitle={config.subtitle} action={<AdminButton icon={Plus} onClick={handleCreate}>{config.createLabel}</AdminButton>} />
      <AdminToolbar searchPlaceholder={`Tìm kiếm ${config.title.toLowerCase()}...`} searchValue={searchQuery} onSearchChange={(value) => { setSearchQuery(value); setPage(1); }} />
      <AdminTable columns={columns} data={paginatedRows} rowKey="id" />
      <AdminPagination page={page} pageSize={pageSize} total={filteredRows.length} onPageChange={setPage} onPageSizeChange={(value) => { setPageSize(value); setPage(1); }} />

      <AdminConfirmDialog
        isOpen={Boolean(pendingDelete)}
        title={pendingDelete ? `Xóa “${pendingDelete.name}”?` : 'Xóa mục này?'}
        message={pendingDelete?.usageCount ? `Mục này đang được sử dụng bởi ${pendingDelete.usageCount} nội dung. Các liên kết hiện tại có thể bị ảnh hưởng.` : 'Mục này sẽ không còn xuất hiện trong khu vực quản trị và website.'}
        confirmText="Xóa"
        onConfirm={handleDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </AdminLayout>
  );
};

export default CatalogPage;
