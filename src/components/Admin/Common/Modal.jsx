
import { X } from 'lucide-react';

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
        onClick={onClose}
      ></div>
      <div className="relative bg-[#0a0d14]/95 backdrop-blur-xl border border-white/10 hover:border-white/15 rounded-3xl w-full max-w-2xl shadow-[0_0_50px_rgba(0,0,0,0.85)] border-red-500/10 animate-in zoom-in duration-200 overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-white/5 bg-white/[0.01]">
          <h3 className="text-xl font-black text-white tracking-tight bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">{title}</h3>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-white/5 border border-transparent hover:border-white/5 rounded-xl text-slate-400 hover:text-white transition-all active:scale-95 cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>
        <div className="p-6 max-h-[75vh] overflow-y-auto custom-scrollbar">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
