import { X, AlertTriangle, HelpCircle } from "lucide-react";
import { createPortal } from "react-dom";

const ConfirmDialog = ({
  isOpen,
  title,
  message,
  confirmText = "Xác nhận",
  cancelText = "Hủy bỏ",
  variant = "default", // default, danger, warning
  isLoading = false,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  // Variant color definitions
  let iconColor = "text-purple-400 bg-purple-500/10 border-purple-500/20";
  let confirmBtnColor = "bg-purple-600 hover:bg-purple-500 text-white";
  if (variant === "danger") {
    iconColor = "text-red-400 bg-red-500/10 border-red-500/20";
    confirmBtnColor = "bg-red-600 hover:bg-red-500 text-white shadow-[0_0_15px_rgba(239,68,68,0.2)]";
  } else if (variant === "warning") {
    iconColor = "text-amber-400 bg-amber-500/10 border-amber-500/20";
    confirmBtnColor = "bg-[#FFB000] hover:bg-[#FFB000]/80 text-slate-950 font-bold shadow-[0_0_15px_rgba(255,176,0,0.2)]";
  }

  const dialogContent = (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in duration-200 p-4" role="dialog" aria-modal="true">
      <div className="bg-[#131A2A] border border-white/[0.08] rounded-2xl p-8 max-w-sm w-full shadow-2xl relative z-[10000] animate-in zoom-in-95 duration-200">
        <button
          onClick={onCancel}
          disabled={isLoading}
          className="absolute top-6 right-6 text-slate-400 hover:text-white transition-colors cursor-pointer disabled:opacity-50"
        >
          <X size={20} />
        </button>

        <div className="flex flex-col items-center text-center mt-2">
          <div className={`p-4 rounded-full border mb-4 ${iconColor}`}>
            {variant === "danger" || variant === "warning" ? (
              <AlertTriangle size={28} />
            ) : (
              <HelpCircle size={28} />
            )}
          </div>

          <h2 className="text-lg font-black uppercase tracking-widest text-white mb-2">
            {title}
          </h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            {message}
          </p>

          <div className="flex gap-3 w-full mt-7">
            <button
              onClick={onCancel}
              disabled={isLoading}
              className="flex-1 py-2.5 rounded-full font-bold text-xs text-slate-400 hover:bg-white/5 hover:text-white transition-all border border-white/10 cursor-pointer disabled:opacity-50"
            >
              {cancelText}
            </button>
            <button
              onClick={onConfirm}
              disabled={isLoading}
              className={`flex-1 py-2.5 rounded-full font-bold text-xs uppercase tracking-wider transition-all cursor-pointer disabled:opacity-50 flex justify-center items-center gap-1.5 ${confirmBtnColor}`}
            >
              {isLoading && (
                <div className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
              )}
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(dialogContent, document.body);
};

export default ConfirmDialog;
