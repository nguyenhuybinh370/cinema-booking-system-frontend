import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AdminLayout from '../../components/Admin/Layout/AdminLayout';
import AdminPageHeader from '../../components/Admin/Common/AdminPageHeader';
import { AdminErrorState, AdminLoadingSkeleton } from '../../components/Admin/Common/AdminState';
import MovieModal from '../../components/Admin/Movies/MovieModal';
import movieService from '../../services/admin/movieService';
import { showSuccess } from '../../utils/toastHelper';

const emptyMovie = { TenPhim: '', ThoiLuong: 120, TheLoai: '', NgayKhoiChieu: '', NgayKetThuc: '', DaoDien: '', DienVien: '', GioiHanTuoi: 'P', NoiDung: '', Trailer: '', HinhAnh: '', KhaDung: 1 };

export default function MovieEditor() {
  const { id } = useParams();
  return <MovieEditorForm key={id || 'new'} id={id} />;
}

function MovieEditorForm({ id }) {
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [form, setForm] = useState(emptyMovie);
  const [loading, setLoading] = useState(Boolean(id));
  const [loadError, setLoadError] = useState(false);
  const [retry, setRetry] = useState(0);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const submitting = useRef(false);

  useEffect(() => {
    let ignore = false;
    if (id) movieService.getMovie(id)
      .then(result => { if (!ignore) { setMovie(result); setForm({ ...result, NgayKetThuc: result.NgayKetThuc || '' }); } })
      .catch(() => { if (!ignore) setLoadError(true); })
      .finally(() => { if (!ignore) setLoading(false); });
    return () => { ignore = true; };
  }, [id, retry]);

  const close = () => { if (!submitting.current) navigate('/admin/movies'); };
  const submit = async (event) => {
    event.preventDefault();
    if (submitting.current) return;
    if (form.NgayKetThuc && form.NgayKetThuc < form.NgayKhoiChieu) {
      setErrors({ submit: 'Ngày kết thúc phải từ ngày khởi chiếu trở đi.' });
      return;
    }
    submitting.current = true;
    setSaving(true);
    setErrors({});
    try {
      if (id) await movieService.updateMovie(id, form);
      else await movieService.addMovie(form);
      showSuccess(id ? 'Đã cập nhật phim.' : 'Đã thêm phim.');
      navigate('/admin/movies');
    } catch (error) {
      setErrors({ submit: error.response?.data?.message || error.message || 'Không thể lưu phim.' });
    } finally {
      submitting.current = false;
      setSaving(false);
    }
  };

  return <AdminLayout>
    <AdminPageHeader title={id ? 'Cập nhật phim' : 'Thêm phim'} subtitle="Dữ liệu được lưu qua API quản trị." />
    {loading ? <AdminLoadingSkeleton /> : loadError ? <AdminErrorState onRetry={() => { setLoading(true); setLoadError(false); setRetry(value => value + 1); }} /> :
      <MovieModal isOpen onClose={close} editingMovie={movie} formData={form} errors={errors} isSubmitting={saving} onSubmit={submit}
        onChange={({ target }) => setForm(current => ({ ...current, [target.name]: target.name === 'KhaDung' ? Number(target.value) : target.value }))} />}
  </AdminLayout>;
}
