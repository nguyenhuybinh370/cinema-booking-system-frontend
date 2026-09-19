import { ArrowLeft, Home } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const errorContent = {
  403: { eyebrow: 'Quyền truy cập', title: 'Bạn không có quyền vào trang này', description: 'Tài khoản hiện tại chưa được cấp quyền cho khu vực bạn vừa yêu cầu.' },
  404: { eyebrow: 'Không tìm thấy', title: 'Trang này không còn ở đây', description: 'Đường dẫn có thể đã thay đổi hoặc nội dung đã được di chuyển.' },
};

const SystemErrorPage = ({ code }) => {
  const navigate = useNavigate();
  const content = errorContent[code];

  return (
    <main className="system-error-page">
      <section className="system-error-card">
        <div className="system-error-brand" aria-label="NexCinema">NEX<span>CINEMA</span></div>
        <p className="system-error-eyebrow">{content.eyebrow}</p>
        <strong className="system-error-code" aria-hidden="true">{code}</strong>
        <h1>{content.title}</h1>
        <p className="system-error-description">{content.description}</p>
        <div className="system-error-actions">
          <button type="button" onClick={() => navigate(-1)}><ArrowLeft size={17} />Quay lại</button>
          <Link to="/"><Home size={17} />Về trang chủ</Link>
        </div>
      </section>
    </main>
  );
};

export default SystemErrorPage;
