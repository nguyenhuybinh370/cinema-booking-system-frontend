import { useEffect, useMemo, useState } from 'react';
import { Eye, Save } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import AdminLayout from '../../components/Admin/Layout/AdminLayout';
import AdminButton from '../../components/Admin/Common/AdminButton';
import AdminPageHeader from '../../components/Admin/Common/AdminPageHeader';
import FormField from '../../components/Admin/Common/FormField';
import StickyFormActions from '../../components/Admin/Common/StickyFormActions';
import { adminEditorConfigs } from '../../constants/adminEditorConfigs';
import { showSuccess } from '../../utils/toastHelper';
import { slugify } from '../../utils/slugify';

const EditorAside = ({ kind, values }) => {
  if (kind === 'banner') {
    return (
      <aside className="admin-editor-aside">
        <h2>Xem trước banner</h2>
        <p>Bản xem trước tập trung giúp kiểm tra nhanh nội dung trước khi lưu.</p>
        <div className="admin-banner-preview" style={values.desktopImage ? { backgroundImage: `linear-gradient(90deg, rgb(0 0 0 / 70%), rgb(0 0 0 / 10%)), url(${values.desktopImage})` } : undefined}>
          <strong>{values.heading || 'Tiêu đề banner'}</strong>
          <span>{values.description || 'Mô tả ngắn của chiến dịch.'}</span>
          {values.ctaLabel && <em>{values.ctaLabel}</em>}
        </div>
      </aside>
    );
  }

  if (kind === 'blog') {
    return (
      <aside className="admin-editor-aside">
        <h2>Kiểm tra trước khi đăng</h2>
        <p>Đảm bảo bài viết đầy đủ và dễ tìm kiếm.</p>
        <div className="admin-publish-checklist">
          <span data-ready={Boolean(values.title)}>Tiêu đề</span>
          <span data-ready={Boolean(values.excerpt)}>Tóm tắt</span>
          <span data-ready={Boolean(values.coverUrl)}>Ảnh bìa</span>
          <span data-ready={Boolean(values.body)}>Nội dung</span>
        </div>
      </aside>
    );
  }

  return (
    <aside className="admin-editor-aside">
      <h2>{kind === 'movie' ? 'Diễn viên liên kết' : 'Các phim đã tham gia'}</h2>
      <p>{kind === 'movie' ? 'Quản lý vai diễn mà không lặp lại hồ sơ diễn viên.' : 'Quan hệ này được quản lý tập trung từ nội dung phim.'}</p>
      <div className="admin-related-list">
        {(kind === 'movie' ? ['Robert Downey Jr. · Tony Stark', 'Scarlett Johansson · Natasha Romanoff'] : ['Avengers: Endgame', 'Iron Man 3']).map((label) => <span key={label}>{label}</span>)}
      </div>
      <AdminButton variant="outline" className="w-full">{kind === 'movie' ? 'Thêm diễn viên' : 'Xem danh sách phim'}</AdminButton>
    </aside>
  );
};

const EntityEditor = ({ kind }) => {
  const config = adminEditorConfigs[kind];
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);
  const startingValues = useMemo(() => isEditing ? config.editValues : config.initialValues, [config, isEditing]);
  const [values, setValues] = useState(startingValues);
  const [errors, setErrors] = useState({});
  const [isDirty, setIsDirty] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const handleBeforeUnload = (event) => {
      if (!isDirty) return;
      event.preventDefault();
      event.returnValue = '';
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isDirty]);

  const handleChange = (field, value) => {
    setValues((currentValues) => {
      const nextValues = { ...currentValues, [field.name]: value };
      const titleField = kind === 'actor' ? 'name' : 'title';
      if (field.name === titleField && (!isDirty || currentValues.slug === slugify(currentValues[titleField]))) {
        nextValues.slug = slugify(value);
      }
      return nextValues;
    });
    setErrors((currentErrors) => ({ ...currentErrors, [field.name]: undefined }));
    setIsDirty(true);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const nextErrors = {};
    config.sections.flatMap((section) => section.fields).forEach((field) => {
      if (field.required && !String(values[field.name] || '').trim()) nextErrors[field.name] = `${field.label} là thông tin bắt buộc.`;
    });
    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      return;
    }
    setIsSaving(true);
    window.setTimeout(() => {
      setIsSaving(false);
      setIsDirty(false);
      showSuccess(`Đã lưu ${config.entityLabel} thành công.`);
      navigate(config.listPath);
    }, 450);
  };

  const pageTitle = isEditing ? `Chỉnh sửa ${config.entityLabel}` : `Thêm ${config.entityLabel}`;

  return (
    <AdminLayout>
      <form onSubmit={handleSubmit} noValidate>
        <AdminPageHeader
          title={pageTitle}
          subtitle={isEditing ? 'Cập nhật thông tin và nội dung hiển thị.' : 'Tạo nội dung mới trong hệ thống quản trị.'}
          backPath={config.listPath}
          action={<AdminButton variant="outline" icon={Eye} onClick={() => showSuccess('Đã cập nhật bản xem trước.')}>Xem trước</AdminButton>}
        />

        <div className="admin-editor-layout">
          <div className="admin-editor-main">
            {config.sections.map((section) => (
              <section className="admin-form-section" key={section.title}>
                <div className="admin-form-section-heading"><h2>{section.title}</h2>{section.description && <p>{section.description}</p>}</div>
                <div className="admin-form-grid">
                  {section.fields.map((field) => (
                    <FormField key={field.name} label={field.label} required={field.required} helperText={field.helperText} error={errors[field.name]} className={field.span === 2 ? 'sm:col-span-2' : ''}>
                      {field.prefix && <span className="admin-input-prefix">{field.prefix}</span>}
                      {field.type === 'richtext' ? (
                        <div className="admin-rich-editor">
                          <div className="admin-rich-toolbar" aria-label="Công cụ định dạng"><button type="button">H2</button><button type="button"><strong>B</strong></button><button type="button"><em>I</em></button><button type="button">• Danh sách</button><button type="button">Liên kết</button></div>
                          <textarea value={values[field.name]} onChange={(event) => handleChange(field, event.target.value)} />
                        </div>
                      ) : field.type === 'textarea' ? (
                        <textarea value={values[field.name]} onChange={(event) => handleChange(field, event.target.value)} />
                      ) : field.type === 'select' ? (
                        <select value={values[field.name]} onChange={(event) => handleChange(field, event.target.value)}>{field.options.map((option) => <option key={option}>{option}</option>)}</select>
                      ) : (
                        <input type={field.type || 'text'} value={values[field.name]} onChange={(event) => handleChange(field, event.target.value)} />
                      )}
                    </FormField>
                  ))}
                </div>
              </section>
            ))}
          </div>

          <EditorAside kind={kind} values={values} />
        </div>

        <StickyFormActions statusText={isDirty ? 'Có thay đổi chưa được lưu' : 'Không có thay đổi mới'}>
          <AdminButton variant="ghost" onClick={() => navigate(config.listPath)}>Hủy</AdminButton>
          <AdminButton type="submit" icon={Save} disabled={isSaving}>{isSaving ? 'Đang lưu…' : isEditing ? 'Lưu thay đổi' : 'Tạo mới'}</AdminButton>
        </StickyFormActions>
      </form>
    </AdminLayout>
  );
};

export default EntityEditor;
