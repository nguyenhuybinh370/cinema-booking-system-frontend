import { useState } from 'react';
import AdminLayout from '../../../components/Admin/Layout/AdminLayout';
import AdminPageHeader from '../../../components/Admin/Common/AdminPageHeader';
import BookingTransactionsTab from './BookingTransactionsTab';
import RefundRequestsTab from './RefundRequestsTab';

export default function Transactions() {
  const [activeTab, setActiveTab] = useState('transactions');
  const tabs = [{ id: 'transactions', label: 'Giao dịch' }, { id: 'refunds', label: 'Yêu cầu hoàn tiền' }];
  return (
    <AdminLayout>
      <AdminPageHeader title="Quản lý giao dịch & Hoàn tiền" subtitle="Theo dõi thanh toán vé và ghi nhận xử lý hoàn tiền của khách hàng." />
      <div className="flex border-b border-white/10 mb-8 gap-2" role="tablist" aria-label="Quản lý giao dịch">
        {tabs.map(tab => (
          <button key={tab.id} id={tab.id + '-tab'} role="tab" aria-selected={activeTab === tab.id} aria-controls={tab.id + '-panel'} onClick={() => setActiveTab(tab.id)} className={`pb-4 px-6 font-bold text-sm cursor-pointer ${activeTab === tab.id ? 'text-red-500' : 'text-slate-500'}`}>
            {tab.label}
          </button>
        ))}
      </div>
      <div id="transactions-panel" role="tabpanel" aria-labelledby="transactions-tab" hidden={activeTab !== 'transactions'}><BookingTransactionsTab /></div>
      <div id="refunds-panel" role="tabpanel" aria-labelledby="refunds-tab" hidden={activeTab !== 'refunds'}><RefundRequestsTab activeTab={activeTab} /></div>
    </AdminLayout>
  );
}

