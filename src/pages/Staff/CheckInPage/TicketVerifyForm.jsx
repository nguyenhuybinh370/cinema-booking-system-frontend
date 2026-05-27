import { Search, RefreshCw } from "lucide-react";

const TicketVerifyForm = ({ ticketId, status, inputRef, onChange, onSubmit }) => {
  return (
    <div className="w-full max-w-2xl mx-auto">
      <form onSubmit={onSubmit} className="relative">
        <input
          ref={inputRef}
          type="text"
          value={ticketId}
          onChange={onChange}
          placeholder="QUÉT MÃ QR HOẶC NHẬP MÃ VÉ UUID VÀO ĐÂY..."
          disabled={status === "PROCESSING"}
          className="w-full bg-[#131A2A]/80 border border-purple-500/50 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 text-white placeholder-purple-300/40 text-center py-4 px-12 rounded-full font-mono text-sm tracking-wider focus:outline-none transition-all duration-300 shadow-[0_0_15px_rgba(168,85,247,0.15)] uppercase"
          autoComplete="off"
        />
        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-purple-400">
          {status === "PROCESSING" ? (
            <RefreshCw className="w-5 h-5 animate-spin" />
          ) : (
            <Search className="w-5 h-5" />
          )}
        </div>
      </form>
    </div>
  );
};

export default TicketVerifyForm;
