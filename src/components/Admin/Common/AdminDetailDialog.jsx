import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

const hiddenKeys = /^(id|ma[A-Z_]|uuid)/i;

const formatLabel = (key) => key.replace(/([a-z])([A-Z])/g, '$1 $2').replaceAll('_', ' ');

const AdminDetailDialog = ({ item, title, onClose }) => {
  if (!item) return null;
  const details = Object.entries(item).filter(([key, value]) => !hiddenKeys.test(key) && value !== '' && value !== null && value !== undefined);

  return createPortal(
    <div className="admin-confirm-layer" role="dialog" aria-modal="true" aria-labelledby="admin-detail-title">
      <button type="button" className="admin-confirm-backdrop" aria-label="Đóng chi tiết" onClick={onClose} />
      <section className="admin-detail-panel">
        <header><div><span>Thông tin chi tiết</span><h2 id="admin-detail-title">{title}</h2></div><button type="button" className="admin-confirm-close" onClick={onClose} aria-label="Đóng"><X size={19} /></button></header>
        <dl>{details.map(([key, value]) => <div key={key}><dt>{formatLabel(key)}</dt><dd>{Array.isArray(value) ? value.join(', ') : String(value)}</dd></div>)}</dl>
      </section>
    </div>,
    document.body,
  );
};

export default AdminDetailDialog;
