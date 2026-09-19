
import { X } from 'lucide-react';

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="admin-modal-layer" role="dialog" aria-modal="true" aria-label={title}>
      <div 
        className="admin-modal-backdrop"
        onClick={onClose}
      ></div>
      <div className="admin-modal-panel">
        <div className="admin-modal-header">
          <h3 className="text-xl font-semibold tracking-[-0.02em]">{title}</h3>
          <button 
            onClick={onClose}
            className="admin-icon-button"
            aria-label="Đóng"
            title="Đóng"
          >
            <X size={20} />
          </button>
        </div>
        <div className="max-h-[75vh] overflow-y-auto p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
