const parseLinks = (value = '') => value.split('\n').map((line) => line.split('|')).filter(([label, url]) => label?.trim() && url?.trim());

const SitePreview = ({ kind, values }) => {
  if (kind === 'header') {
    return (
      <div className="site-header-preview">
        <strong>NEX<span>CINEMA</span></strong>
        <nav>{values.navigation.filter((item) => item.visible).map((item) => <span key={item.id}>{item.label}</span>)}</nav>
        <em>{values.ctaLabel || 'Đặt vé'}</em>
      </div>
    );
  }

  if (kind === 'footer') {
    return (
      <div className="site-footer-preview">
        <section><strong>NEX<span>CINEMA</span></strong><p>{values.description}</p><small>{values.hotline} · {values.email}</small></section>
        <section><b>Về chúng tôi</b>{parseLinks(values.aboutLinks).map(([label]) => <span key={label}>{label}</span>)}</section>
        <section><b>Chính sách</b>{parseLinks(values.policyLinks).map(([label]) => <span key={label}>{label}</span>)}</section>
        <small className="site-footer-copyright">{values.copyright}</small>
      </div>
    );
  }

  if (kind === 'cinema') {
    return (
      <div className="site-cinema-preview">
        <span>Thông tin rạp</span><h3>{values.name}</h3><p>{values.description}</p>
        <dl><div><dt>Địa chỉ</dt><dd>{values.address}</dd></div><div><dt>Giờ mở cửa</dt><dd>{values.openingHours}</dd></div><div><dt>Liên hệ</dt><dd>{values.hotline} · {values.email}</dd></div></dl>
      </div>
    );
  }

  return null;
};

export default SitePreview;
