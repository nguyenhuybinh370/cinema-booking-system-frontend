const SitePreview = ({ kind, values }) => {
  if (kind === 'footer') {
    return (
      <div className="site-footer-preview">
        <section><strong>NEX<span>CINEMA</span></strong><p>{values.description}</p><small>{values.hotline} · {values.email}</small></section>
        <section><b>Về chúng tôi</b>{values.aboutLinks.map((item) => <span key={item.id}>{item.label}</span>)}</section>
        <section><b>Chính sách</b>{values.policyLinks.map((item) => <span key={item.id}>{item.label}</span>)}</section>
        <small className="site-footer-copyright">{values.copyright}</small>
      </div>
    );
  }

  if (kind === 'cinema') {
    return (
      <div className="site-cinema-preview">
        <span>Thông tin rạp</span><h3>{values.name}</h3><p>{values.description}</p>
        <dl><div><dt>Địa chỉ</dt><dd>{values.address}</dd></div><div><dt>Giờ hoạt động</dt><dd>{values.openingTime} – {values.closingTime}</dd></div><div><dt>Liên hệ</dt><dd>{values.hotline} · {values.email}</dd></div></dl>
      </div>
    );
  }

  return null;
};

export default SitePreview;
