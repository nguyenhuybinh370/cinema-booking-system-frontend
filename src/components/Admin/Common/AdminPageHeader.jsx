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
    <header className="admin-page-header">
      <div className="flex items-center gap-4">
        {(backPath || onBack) && (
          <button
            type="button"
            onClick={handleBack}
            className="admin-icon-button shrink-0"
            aria-label="Quay lại"
          >
            <ChevronLeft size={20} />
          </button>
        )}
        <div>
          <h1 className="admin-page-title">
            {title}
          </h1>
          {subtitle && (
            <p className="admin-page-subtitle">{subtitle}</p>
          )}
        </div>
      </div>
      
      {action && (
        <div className="flex items-center gap-3 w-full md:w-auto">
          {action}
        </div>
      )}
    </header>
  );
};

export default AdminPageHeader;
