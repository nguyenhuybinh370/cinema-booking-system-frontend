import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';

const AdminPageHeader = ({ 
  title, 
  subtitle, 
  action, 
  backPath, 
  onBack 
}) => {
  const navigate = useNavigate();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else if (backPath) {
      navigate(backPath);
    }
  };

  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
      <div className="flex items-center gap-4">
        {(backPath || onBack) && (
          <button 
            onClick={handleBack}
            className="p-3 bg-white/5 hover:bg-white/10 border border-white/5 rounded-2xl text-slate-400 hover:text-white transition-all active:scale-95 shrink-0"
          >
            <ChevronLeft size={20} />
          </button>
        )}
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
            {title}
          </h1>
          {subtitle && (
            <p className="text-slate-500 font-semibold text-sm mt-1">{subtitle}</p>
          )}
        </div>
      </div>
      
      {action && (
        <div className="flex items-center gap-3 w-full md:w-auto">
          {action}
        </div>
      )}
    </div>
  );
};

export default AdminPageHeader;
