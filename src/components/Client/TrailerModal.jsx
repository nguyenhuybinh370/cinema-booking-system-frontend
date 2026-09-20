import { useEffect } from 'react';
import { X } from 'lucide-react';

const TrailerModal = ({ embedUrl, onClose }) => {
  useEffect(() => {
    if (!embedUrl) return undefined;
    const previousOverflow = document.body.style.overflow;
    const closeOnEscape = (event) => event.key === 'Escape' && onClose();
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', closeOnEscape);
    };
  }, [embedUrl, onClose]);

  if (!embedUrl) return null;

  return (
    <div className="fixed inset-0 z-100 grid place-items-center bg-black/90 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-label="Trailer phim">
      <div className="relative aspect-video w-full max-w-5xl overflow-hidden rounded-2xl border border-white/10 bg-black shadow-2xl">
        <button type="button" onClick={onClose} className="client-icon-button absolute right-3 top-3 z-10 bg-black/70" aria-label="Đóng trailer"><X size={20} /></button>
        <iframe className="size-full" src={embedUrl} title="Trailer phim" allow="autoplay; encrypted-media; picture-in-picture" allowFullScreen />
      </div>
    </div>
  );
};

export default TrailerModal;
