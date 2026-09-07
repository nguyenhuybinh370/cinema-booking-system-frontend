import { Inbox, RefreshCw } from 'lucide-react';
import AdminButton from './AdminButton';

export const AdminEmptyState = ({ title = 'Chưa có dữ liệu', description, actionLabel, onAction }) => (
  <div className="admin-state">
    <Inbox size={28} strokeWidth={1.6} aria-hidden="true" />
    <h3>{title}</h3>
    {description && <p>{description}</p>}
    {actionLabel && <AdminButton onClick={onAction}>{actionLabel}</AdminButton>}
  </div>
);

export const AdminErrorState = ({ onRetry }) => (
  <div className="admin-state admin-state--error" role="alert">
    <h3>Không thể tải dữ liệu</h3>
    <p>Đã có lỗi xảy ra. Vui lòng thử lại sau ít phút.</p>
    {onRetry && <AdminButton variant="outline" icon={RefreshCw} onClick={onRetry}>Thử lại</AdminButton>}
  </div>
);

export const AdminLoadingSkeleton = ({ rows = 4 }) => (
  <div className="admin-skeleton" aria-label="Đang tải dữ liệu" aria-busy="true">
    {Array.from({ length: rows }, (_, index) => <span key={index} />)}
  </div>
);
