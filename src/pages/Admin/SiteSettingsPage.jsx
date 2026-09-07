import { useEffect, useMemo, useState } from 'react';
import { ArrowDown, ArrowUp, ExternalLink, Eye, Plus, Save, Trash2 } from 'lucide-react';
import AdminLayout from '../../components/Admin/Layout/AdminLayout';
import AdminButton from '../../components/Admin/Common/AdminButton';
import AdminConfirmDialog from '../../components/Admin/Common/AdminConfirmDialog';
import AdminPageHeader from '../../components/Admin/Common/AdminPageHeader';
import FormField from '../../components/Admin/Common/FormField';
import StickyFormActions from '../../components/Admin/Common/StickyFormActions';
import SitePreview from '../../components/Admin/Site/SitePreview';
import { initialSiteSettings } from '../../constants/siteSettingsData';
import { showSuccess } from '../../utils/toastHelper';

const pageConfigs = {
  header: { title: 'Header & Điều hướng', subtitle: 'Cấu hình thanh điều hướng hiển thị trên website.' },
  footer: { title: 'Footer', subtitle: 'Quản lý thông tin liên hệ, nhóm liên kết và mạng xã hội.' },
  cinema: { title: 'Thông tin rạp', subtitle: 'Nội dung giới thiệu và thông tin liên hệ công khai.' },
  location: { title: 'Vị trí & Google Maps', subtitle: 'Cấu hình vị trí có cấu trúc và bản đồ nhúng an toàn.' },
  settings: { title: 'Cài đặt', subtitle: 'Thiết lập chung cho khu vực quản trị và website.' },
};

const fieldConfigs = {
  footer: [
    { name: 'description', label: 'Mô tả thương hiệu', type: 'textarea', span: 2 }, { name: 'hotline', label: 'Hotline', required: true }, { name: 'email', label: 'Email', type: 'email', required: true },
    { name: 'aboutLinks', label: 'Nhóm “Về chúng tôi”', type: 'textarea', helper: 'Mỗi dòng theo định dạng: Nhãn|/duong-dan' }, { name: 'policyLinks', label: 'Nhóm “Chính sách”', type: 'textarea', helper: 'Mỗi dòng theo định dạng: Nhãn|/duong-dan' },
    { name: 'facebook', label: 'Facebook URL' }, { name: 'youtube', label: 'YouTube URL' }, { name: 'copyright', label: 'Copyright', span: 2 },
  ],
  cinema: [
    { name: 'name', label: 'Tên rạp', required: true }, { name: 'hotline', label: 'Hotline', required: true }, { name: 'email', label: 'Email', type: 'email', required: true }, { name: 'openingHours', label: 'Giờ mở cửa', required: true },
    { name: 'address', label: 'Địa chỉ', required: true, span: 2 }, { name: 'description', label: 'Mô tả', type: 'textarea', span: 2 }, { name: 'galleryUrl', label: 'Ảnh đại diện URL', span: 2, helper: 'Dùng cho khu vực giới thiệu rạp trên website.' },
  ],
  location: [
    { name: 'displayAddress', label: 'Địa chỉ hiển thị', required: true, span: 2 }, { name: 'latitude', label: 'Vĩ độ', required: true }, { name: 'longitude', label: 'Kinh độ', required: true }, { name: 'googleMapsUrl', label: 'Google Maps URL', type: 'url', span: 2 },
  ],
  settings: [
    { name: 'siteName', label: 'Tên website', required: true }, { name: 'supportEmail', label: 'Email hỗ trợ', type: 'email', required: true }, { name: 'defaultLanguage', label: 'Ngôn ngữ mặc định' }, { name: 'timezone', label: 'Múi giờ' },
  ],
};

const SiteSettingsPage = ({ kind }) => {
  const config = pageConfigs[kind];
  const [values, setValues] = useState(initialSiteSettings[kind]);
  const [errors, setErrors] = useState({});
  const [isDirty, setIsDirty] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [pendingDelete, setPendingDelete] = useState(null);

  useEffect(() => {
    const warnUnsaved = (event) => { if (isDirty) { event.preventDefault(); event.returnValue = ''; } };
    window.addEventListener('beforeunload', warnUnsaved);
    return () => window.removeEventListener('beforeunload', warnUnsaved);
  }, [isDirty]);

  const mapCoordinatesValid = useMemo(() => {
    if (kind !== 'location') return true;
    const latitude = Number(values.latitude);
    const longitude = Number(values.longitude);
    return Number.isFinite(latitude) && latitude >= -90 && latitude <= 90 && Number.isFinite(longitude) && longitude >= -180 && longitude <= 180;
  }, [kind, values]);
  const mapEmbedUrl = mapCoordinatesValid && kind === 'location' ? `https://www.google.com/maps?q=${encodeURIComponent(`${values.latitude},${values.longitude}`)}&output=embed` : '';

  const setValue = (name, value) => { setValues((current) => ({ ...current, [name]: value })); setErrors((current) => ({ ...current, [name]: undefined })); setIsDirty(true); };
  const moveNavigation = (id, direction) => setValues((current) => {
    const index = current.navigation.findIndex((item) => item.id === id);
    const nextIndex = index + direction;
    if (nextIndex < 0 || nextIndex >= current.navigation.length) return current;
    const navigation = [...current.navigation];
    [navigation[index], navigation[nextIndex]] = [navigation[nextIndex], navigation[index]];
    return { ...current, navigation };
  });
  const updateNavigation = (id, patch) => { setValues((current) => ({ ...current, navigation: current.navigation.map((item) => item.id === id ? { ...item, ...patch } : item) })); setIsDirty(true); };
  const addNavigation = () => { setValues((current) => ({ ...current, navigation: [...current.navigation, { id: `nav-${Date.now()}`, label: 'Mục mới', url: '/', visible: true, newTab: false }] })); setIsDirty(true); };

  const handleSubmit = (event) => {
    event.preventDefault();
    const nextErrors = {};
    (fieldConfigs[kind] || []).forEach((field) => { if (field.required && !String(values[field.name] || '').trim()) nextErrors[field.name] = `${field.label} là thông tin bắt buộc.`; });
    if (kind === 'location' && !mapCoordinatesValid) nextErrors.latitude = 'Tọa độ không hợp lệ. Vĩ độ từ -90 đến 90, kinh độ từ -180 đến 180.';
    if (Object.keys(nextErrors).length) { setErrors(nextErrors); return; }
    setIsSaving(true);
    window.setTimeout(() => { setIsSaving(false); setIsDirty(false); showSuccess('Đã lưu cấu hình website.'); }, 450);
  };

  return (
    <AdminLayout>
      <form onSubmit={handleSubmit} noValidate>
        <AdminPageHeader title={config.title} subtitle={config.subtitle} action={kind !== 'settings' && <AdminButton variant="outline" icon={Eye} onClick={() => showSuccess('Bản xem trước đã được cập nhật.')}>Xem trước</AdminButton>} />
        {kind === 'header' ? (
          <div className="admin-site-layout">
            <section className="admin-form-section">
              <div className="admin-form-section-heading"><h2>Thông tin Header</h2><p>Chỉ hiển thị các trường đã được cấu hình.</p></div>
              <div className="admin-form-grid"><FormField label="Logo URL"><input value={values.logoUrl} onChange={(event) => setValue('logoUrl', event.target.value)} /></FormField><FormField label="Hotline"><input value={values.hotline} onChange={(event) => setValue('hotline', event.target.value)} /></FormField><FormField label="Nhãn CTA"><input value={values.ctaLabel} onChange={(event) => setValue('ctaLabel', event.target.value)} /></FormField><FormField label="CTA URL"><input value={values.ctaUrl} onChange={(event) => setValue('ctaUrl', event.target.value)} /></FormField></div>
            </section>
            <section className="admin-form-section">
              <div className="admin-form-section-heading admin-section-heading-row"><div><h2>Điều hướng</h2><p>Kéo thứ tự bằng nút lên/xuống; tối đa một cấp menu.</p></div><AdminButton variant="outline" icon={Plus} onClick={addNavigation}>Thêm mục</AdminButton></div>
              <div className="admin-navigation-editor">{values.navigation.map((item) => <div key={item.id}><span className="admin-nav-order"><button type="button" onClick={() => { moveNavigation(item.id, -1); setIsDirty(true); }} aria-label="Di chuyển lên"><ArrowUp size={15} /></button><button type="button" onClick={() => { moveNavigation(item.id, 1); setIsDirty(true); }} aria-label="Di chuyển xuống"><ArrowDown size={15} /></button></span><input aria-label="Nhãn điều hướng" value={item.label} onChange={(event) => updateNavigation(item.id, { label: event.target.value })} /><input aria-label="Đường dẫn điều hướng" value={item.url} onChange={(event) => updateNavigation(item.id, { url: event.target.value })} /><span className="admin-nav-options"><label><input type="checkbox" checked={item.visible} onChange={(event) => updateNavigation(item.id, { visible: event.target.checked })} /> Hiển thị</label><label><input type="checkbox" checked={item.newTab} onChange={(event) => updateNavigation(item.id, { newTab: event.target.checked })} /> Tab mới</label></span><button type="button" className="admin-table-action admin-table-action--danger" onClick={() => setPendingDelete(item)} aria-label={`Xóa ${item.label}`}><Trash2 size={16} /></button></div>)}</div>
            </section>
            <section className="admin-form-section"><div className="admin-form-section-heading"><h2>Xem trước Header</h2></div><SitePreview kind="header" values={values} /></section>
          </div>
        ) : (
          <div className="admin-site-layout">
            <section className="admin-form-section"><div className="admin-form-section-heading"><h2>{kind === 'location' ? 'Thông tin vị trí' : 'Nội dung cấu hình'}</h2></div><div className="admin-form-grid">{fieldConfigs[kind].map((field) => <FormField key={field.name} label={field.label} required={field.required} helperText={field.helper} error={errors[field.name]} className={field.span === 2 ? 'sm:col-span-2' : ''}>{field.type === 'textarea' ? <textarea value={values[field.name]} onChange={(event) => setValue(field.name, event.target.value)} /> : <input type={field.type || 'text'} value={values[field.name]} onChange={(event) => setValue(field.name, event.target.value)} />}</FormField>)}</div></section>
            {kind === 'location' ? <section className="admin-form-section"><div className="admin-form-section-heading admin-section-heading-row"><div><h2>Xem trước bản đồ</h2><p>Iframe được tạo an toàn từ tọa độ, không dùng HTML tùy ý.</p></div>{values.googleMapsUrl && <AdminButton variant="outline" icon={ExternalLink} onClick={() => window.open(values.googleMapsUrl, '_blank', 'noopener,noreferrer')}>Mở trên Google Maps</AdminButton>}</div>{mapEmbedUrl ? <iframe className="admin-map-preview" title="Vị trí NexCinema" src={mapEmbedUrl} loading="lazy" referrerPolicy="no-referrer-when-downgrade" /> : <div className="admin-map-error">Nhập tọa độ hợp lệ để xem bản đồ.</div>}</section> : kind !== 'settings' && <section className="admin-form-section"><div className="admin-form-section-heading"><h2>Xem trước</h2><p>Nội dung gần đúng với khu vực hiển thị trên website.</p></div><SitePreview kind={kind} values={values} /></section>}
          </div>
        )}
        <StickyFormActions statusText={isDirty ? 'Có thay đổi chưa được lưu' : 'Cấu hình đã được lưu'}><AdminButton variant="ghost" onClick={() => { setValues(initialSiteSettings[kind]); setIsDirty(false); }}>Hủy thay đổi</AdminButton><AdminButton type="submit" icon={Save} disabled={isSaving}>{isSaving ? 'Đang lưu…' : 'Lưu thay đổi'}</AdminButton></StickyFormActions>
      </form>
      <AdminConfirmDialog isOpen={Boolean(pendingDelete)} title={pendingDelete ? `Xóa mục “${pendingDelete.label}”?` : 'Xóa mục điều hướng?'} message="Mục này sẽ không còn xuất hiện trong Header website." confirmText="Xóa mục" onConfirm={() => { setValues((current) => ({ ...current, navigation: current.navigation.filter((item) => item.id !== pendingDelete.id) })); setPendingDelete(null); setIsDirty(true); }} onCancel={() => setPendingDelete(null)} />
    </AdminLayout>
  );
};

export default SiteSettingsPage;
