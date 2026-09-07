import { ImagePlus, Trash2, Upload } from 'lucide-react';
import { useRef, useState } from 'react';
import AdminButton from './AdminButton';

const MAX_FILE_SIZE = 5 * 1024 * 1024;

const ImageUploader = ({ id, value, onChange, aspectRatio = '16:9' }) => {
  const inputRef = useRef(null);
  const [error, setError] = useState('');

  const handleFile = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setError('Chỉ chấp nhận tệp hình ảnh.');
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      setError('Ảnh không được vượt quá 5 MB.');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => { onChange(String(reader.result)); setError(''); };
    reader.readAsDataURL(file);
  };

  return (
    <div className="admin-image-uploader">
      <input id={id} ref={inputRef} className="sr-only" type="file" accept="image/*" onChange={handleFile} />
      <div className="admin-upload-preview" data-aspect={aspectRatio}>
        {value ? <img src={value} alt="Bản xem trước ảnh tải lên" /> : <span><ImagePlus size={24} strokeWidth={1.6} />Chưa có ảnh</span>}
      </div>
      <div className="admin-upload-meta">
        <span>PNG, JPG hoặc WEBP · tối đa 5 MB · tỷ lệ {aspectRatio}</span>
        <div><AdminButton variant="outline" icon={Upload} onClick={() => inputRef.current?.click()}>{value ? 'Thay ảnh' : 'Tải ảnh lên'}</AdminButton>{value && <AdminButton variant="ghost" icon={Trash2} onClick={() => onChange('')}>Xóa</AdminButton>}</div>
      </div>
      {error && <p className="admin-field-error" role="alert">{error}</p>}
    </div>
  );
};

export default ImageUploader;
