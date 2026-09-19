import { AlertTriangle, X } from 'lucide-react';
import { createPortal } from 'react-dom';
import AdminButton from './AdminButton';

const AdminConfirmDialog = ({
  isOpen,
  title,
  message,
  confirmText = 'Xác nhận',
  cancelText = 'Hủy',
  variant = 'danger',
  isLoading = false,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  return createPortal(
    <div className="admin-confirm-layer" role="dialog" aria-modal="true" aria-labelledby="admin-confirm-title">
      <button type="button" className="admin-confirm-backdrop" aria-label="Đóng hộp thoại" onClick={onCancel} />
      <section className="admin-confirm-panel">
        <button type="button" className="admin-confirm-close" onClick={onCancel} disabled={isLoading} aria-label="Đóng">
          <X size={19} />
        </button>
        <span className={`admin-confirm-icon admin-confirm-icon--${variant}`} aria-hidden="true">
          <AlertTriangle size={22} strokeWidth={1.8} />
        </span>
        <h2 id="admin-confirm-title">{title}</h2>
        <p>{message}</p>
        <div className="admin-confirm-actions">
          <AdminButton variant="outline" onClick={onCancel} disabled={isLoading}>{cancelText}</AdminButton>
          <AdminButton variant={variant === 'danger' ? 'danger' : 'primary'} onClick={onConfirm} disabled={isLoading}>
            {isLoading ? 'Đang xử lý…' : confirmText}
          </AdminButton>
        </div>
      </section>
    </div>,
    document.body,
  );
};

export default AdminConfirmDialog;
