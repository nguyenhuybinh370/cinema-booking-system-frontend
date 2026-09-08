import { useEffect, useMemo, useState } from 'react';
import { ExternalLink, Eye, Plus, Save, Trash2 } from 'lucide-react';
import AdminLayout from '../../components/Admin/Layout/AdminLayout';
import AdminButton from '../../components/Admin/Common/AdminButton';
import AdminPageHeader from '../../components/Admin/Common/AdminPageHeader';
import FormField from '../../components/Admin/Common/FormField';
import StickyFormActions from '../../components/Admin/Common/StickyFormActions';
import SitePreview from '../../components/Admin/Site/SitePreview';
import { initialSiteSettings } from '../../constants/siteSettingsData';
import { showSuccess } from '../../utils/toastHelper';

const pageConfigs = {
  footer: { title: 'Footer', subtitle: 'Quản lý thông tin liên hệ, nhóm liên kết và mạng xã hội.' },
  cinema: { title: 'Thông tin rạp', subtitle: 'Nội dung giới thiệu và thông tin liên hệ công khai.' },
  location: { title: 'Vị trí & Google Maps', subtitle: 'Dùng một link nhúng an toàn để hiển thị bản đồ.' },
  settings: { title: 'Cài đặt', subtitle: 'Thiết lập chung cho khu vực quản trị và website.' },
};

const fieldConfigs = {
  footer: [
    { name: 'description', label: 'Mô tả thương hiệu', type: 'textarea', span: 2 },
    { name: 'hotline', label: 'Hotline', required: true },
    { name: 'email', label: 'Email', type: 'email', required: true },
    { name: 'facebook', label: 'Facebook URL', type: 'url' },
    { name: 'youtube', label: 'YouTube URL', type: 'url' },
    { name: 'copyright', label: 'Copyright', span: 2 },
  ],
  cinema: [
    { name: 'name', label: 'Tên rạp', required: true },
    { name: 'hotline', label: 'Hotline', required: true },
    { name: 'email', label: 'Email', type: 'email', required: true },
    { name: 'address', label: 'Địa chỉ', required: true },
    { name: 'openingTime', label: 'Giờ mở cửa', type: 'time', required: true },
    { name: 'closingTime', label: 'Giờ đóng cửa', type: 'time', required: true },
    { name: 'description', label: 'Mô tả', type: 'textarea', span: 2 },
    { name: 'galleryUrl', label: 'Ảnh đại diện URL', type: 'url', span: 2 },
  ],
  location: [
    { name: 'embedUrl', label: 'Link nhúng bản đồ', type: 'url', required: true, span: 2, helper: 'Dán URL trong thuộc tính src của mã nhúng Google Maps.' },
  ],
  settings: [
    { name: 'siteName', label: 'Tên website', required: true },
    { name: 'supportEmail', label: 'Email hỗ trợ', type: 'email', required: true },
    { name: 'defaultLanguage', label: 'Ngôn ngữ mặc định' },
    { name: 'timezone', label: 'Múi giờ' },
  ],
};

const isSafeMapEmbed = (value = '') => {
  try {
    const url = new URL(value);
    return url.protocol === 'https:' && ['google.com', 'www.google.com', 'maps.google.com'].includes(url.hostname) && (url.pathname.includes('/maps') || url.searchParams.get('output') === 'embed');
  } catch {
    return false;
  }
};

const LinkListEditor = ({ title, value, onChange }) => {
  const update = (id, patch) => onChange(value.map((item) => item.id === id ? { ...item, ...patch } : item));
  return (
    <section className="admin-link-list">
      <div className="admin-section-heading-row">
        <div><h3>{title}</h3><p>Mỗi URL gồm tên hiển thị và liên kết đích.</p></div>
        <AdminButton variant="outline" icon={Plus} onClick={() => onChange([...value, { id: `link-${Date.now()}`, label: '', url: '' }])}>Thêm URL</AdminButton>
      </div>
      <div className="admin-link-list__rows">
        {value.map((item) => (
          <div className="admin-link-list__row" key={item.id}>
            <FormField label="Tên hiển thị" required><input value={item.label} onChange={(event) => update(item.id, { label: event.target.value })} /></FormField>
            <FormField label="Liên kết" required><input type="url" value={item.url} onChange={(event) => update(item.id, { url: event.target.value })} /></FormField>
            <button type="button" className="admin-table-action admin-table-action--danger" onClick={() => onChange(value.filter((entry) => entry.id !== item.id))} aria-label={`Xóa ${item.label || 'URL'}`}><Trash2 size={16} /></button>
          </div>
        ))}
      </div>
    </section>
  );
};

const SiteSettingsPage = ({ kind }) => {
  const config = pageConfigs[kind];
  const [values, setValues] = useState(initialSiteSettings[kind]);
  const [errors, setErrors] = useState({});
  const [isDirty, setIsDirty] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const mapEmbedValid = useMemo(() => kind !== 'location' || isSafeMapEmbed(values.embedUrl), [kind, values.embedUrl]);

  useEffect(() => {
    const warnUnsaved = (event) => { if (isDirty) { event.preventDefault(); event.returnValue = ''; } };
    window.addEventListener('beforeunload', warnUnsaved);
    return () => window.removeEventListener('beforeunload', warnUnsaved);
  }, [isDirty]);

  const setValue = (name, value) => {
    setValues((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: undefined }));
    setIsDirty(true);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const nextErrors = {};
    fieldConfigs[kind].forEach((field) => {
      if (field.required && !String(values[field.name] || '').trim()) nextErrors[field.name] = `${field.label} là thông tin bắt buộc.`;
    });
    if (kind === 'location' && !mapEmbedValid) nextErrors.embedUrl = 'Link nhúng Google Maps không hợp lệ hoặc không an toàn.';
    if (Object.keys(nextErrors).length) { setErrors(nextErrors); return; }
    setIsSaving(true);
    window.setTimeout(() => { setIsSaving(false); setIsDirty(false); showSuccess('Đã lưu cấu hình website.'); }, 450);
  };

  return (
    <AdminLayout>
      <form onSubmit={handleSubmit} noValidate>
        <AdminPageHeader title={config.title} subtitle={config.subtitle} action={kind !== 'settings' && <AdminButton variant="outline" icon={Eye} onClick={() => showSuccess('Bản xem trước đã được cập nhật.')}>Xem trước</AdminButton>} />
        <div className="admin-site-layout">
          <section className="admin-form-section">
            <div className="admin-form-section-heading"><h2>{kind === 'location' ? 'Bản đồ nhúng' : 'Nội dung cấu hình'}</h2></div>
            <div className="admin-form-grid">
              {fieldConfigs[kind].map((field) => <FormField key={field.name} label={field.label} required={field.required} helperText={field.helper} error={errors[field.name]} className={field.span === 2 ? 'sm:col-span-2' : ''}>{field.type === 'textarea' ? <textarea value={values[field.name]} onChange={(event) => setValue(field.name, event.target.value)} /> : <input type={field.type || 'text'} value={values[field.name]} onChange={(event) => setValue(field.name, event.target.value)} />}</FormField>)}
            </div>
          </section>

          {kind === 'footer' && <section className="admin-form-section admin-link-groups"><div className="admin-form-section-heading"><h2>URL Footer</h2><p>Tên hiển thị và liên kết được quản lý tách biệt để dễ kiểm tra.</p></div><LinkListEditor title="Về chúng tôi" value={values.aboutLinks} onChange={(value) => setValue('aboutLinks', value)} /><LinkListEditor title="Chính sách" value={values.policyLinks} onChange={(value) => setValue('policyLinks', value)} /></section>}

          {kind === 'location' ? <section className="admin-form-section"><div className="admin-form-section-heading admin-section-heading-row"><div><h2>Xem trước bản đồ</h2><p>Chỉ URL nhúng từ Google Maps qua HTTPS được chấp nhận.</p></div>{mapEmbedValid && <AdminButton variant="outline" icon={ExternalLink} onClick={() => window.open(values.embedUrl, '_blank', 'noopener,noreferrer')}>Mở link</AdminButton>}</div>{mapEmbedValid ? <iframe className="admin-map-preview" title="Vị trí NexCinema" src={values.embedUrl} loading="lazy" referrerPolicy="no-referrer-when-downgrade" /> : <div className="admin-map-error">Nhập link nhúng hợp lệ để xem bản đồ.</div>}</section> : kind !== 'settings' && <section className="admin-form-section"><div className="admin-form-section-heading"><h2>Xem trước</h2><p>Nội dung gần đúng với khu vực hiển thị trên website.</p></div><SitePreview kind={kind} values={values} /></section>}
        </div>
        <StickyFormActions statusText={isDirty ? 'Có thay đổi chưa được lưu' : 'Cấu hình đã được lưu'}><AdminButton variant="ghost" onClick={() => { setValues(initialSiteSettings[kind]); setErrors({}); setIsDirty(false); }}>Hủy thay đổi</AdminButton><AdminButton type="submit" icon={Save} disabled={isSaving}>{isSaving ? 'Đang lưu…' : 'Lưu thay đổi'}</AdminButton></StickyFormActions>
      </form>
    </AdminLayout>
  );
};

export default SiteSettingsPage;
