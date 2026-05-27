
const KPICard = ({ title, value, icon: Icon, trend, color }) => (
  <div className="bg-[#0f1117] border border-white/5 rounded-3xl p-6 shadow-xl group hover:border-white/10 transition-all">
    <div className="flex justify-between items-start mb-4">
      <div className={`p-3 rounded-2xl ${color} bg-opacity-10`}>
        <Icon className={color.replace('bg-', 'text-')} size={24} />
      </div>
      {trend && (
        <span className="text-[10px] font-black text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-lg">
          +{trend}%
        </span>
      )}
    </div>
    <h3 className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1">{title}</h3>
    <p className="text-2xl font-black text-white">{value}</p>
  </div>
);

export default KPICard;
