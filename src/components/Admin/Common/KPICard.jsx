
const KPICard = ({ title, value, icon: Icon, trend, color }) => (
  <div className="admin-metric-card">
    <div className="mb-4 flex items-start justify-between">
      <div className={`admin-metric-icon ${color} bg-opacity-10`}>
        <Icon className={color.replace('bg-', 'text-')} size={20} strokeWidth={1.8} />
      </div>
      {trend && (
        <span className="admin-trend">
          +{trend}%
        </span>
      )}
    </div>
    <h3 className="mb-1 text-sm font-medium text-[var(--admin-text-secondary)]">{title}</h3>
    <p className="text-2xl font-bold tracking-[-0.02em] text-[var(--admin-text)]">{value}</p>
  </div>
);

export default KPICard;
