import React, { useEffect, useState } from 'react';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonRefresher,
  IonRefresherContent,
  IonSegment,
  IonSegmentButton,
  IonLabel,
  RefresherEventDetail,
  IonSpinner
} from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { Layers, User, Palette, Printer, Box, Truck, ChevronRight, ChevronLeft } from 'lucide-react';
import api from '../api/api';
import './Orders.css'; // Reuse the premium card styles

interface Order {
  id: number;
  order_number: string;
  customer_name: string;
  status: string;
  resolved_status: string;
  current_stage_status?: string;
  order_date: string;
  delivery_date?: string;
  created_at: string;
  client_information?: { status: string };
  designing?: { status: string };
  printing?: { status: string };
  packaging?: { status: string };
  dispatch_delivery?: { status: string };
}

const Management: React.FC = () => {
  const history = useHistory();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStage, setSelectedStage] = useState('client-information');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [total, setTotal] = useState(0);

  const stages = [
    { id: 'client-information', label: 'Client', icon: User, color: 'bg-blue-500', text: 'text-blue-700', border: 'bg-blue-100' },
    { id: 'designing', label: 'Design', icon: Palette, color: 'bg-purple-500', text: 'text-purple-700', border: 'bg-purple-100' },
    { id: 'printing', label: 'Print', icon: Printer, color: 'bg-amber-500', text: 'text-amber-700', border: 'bg-amber-100' },
    { id: 'packaging', label: 'Pack', icon: Box, color: 'bg-emerald-500', text: 'text-emerald-700', border: 'bg-emerald-100' },
    { id: 'delivery', label: 'Deliver', icon: Truck, color: 'bg-rose-500', text: 'text-rose-700', border: 'bg-rose-100' },
  ];

  const fetchOrders = async (page = 1) => {
    setLoading(true);
    try {
      const response = await api.get(`/orders`, {
        params: {
          stage: selectedStage,
          page: page,
          per_page: 20,
          status: selectedStatus !== 'All' ? selectedStatus : undefined
        }
      });
      if (response.data.success) {
        const paginatedData = response.data.data;
        setOrders(paginatedData.data || []);
        setCurrentPage(paginatedData.current_page);
        setLastPage(paginatedData.last_page);
        setTotal(paginatedData.total);
      }
    } catch (error) {
      console.error('Error fetching stage orders:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders(1);
  }, [selectedStage, selectedStatus]);

  const handleRefresh = async (event: CustomEvent<RefresherEventDetail>) => {
    await fetchOrders(1);
    event.detail.complete();
  };

  const getStatusColor = (status: string) => {
    const s = status?.toLowerCase() || '';
    if (s.includes('delivered') || s.includes('completed')) return 'bg-emerald-100 text-emerald-700';
    if (s.includes('pending') || s.includes('new order')) return 'bg-amber-100 text-amber-700';
    if (s.includes('progress') || s.includes('process') || s.includes('designing') || s.includes('printing') || s.includes('packing')) return 'bg-blue-100 text-blue-700';
    if (s.includes('confirmed') || s.includes('designed') || s.includes('printed') || s.includes('packed')) return 'bg-indigo-100 text-indigo-700';
    if (s.includes('out for delivery')) return 'bg-purple-100 text-purple-700';
    if (s.includes('cancelled')) return 'bg-rose-100 text-rose-700';
    return 'bg-slate-100 text-slate-700';
  };

  const getStatusIndicatorColor = (status: string) => {
    const s = status?.toLowerCase() || '';
    if (s.includes('delivered') || s.includes('completed')) return 'bg-emerald-500';
    if (s.includes('pending') || s.includes('new order')) return 'bg-amber-500';
    if (s.includes('progress') || s.includes('process') || s.includes('designing') || s.includes('printing') || s.includes('packing')) return 'bg-blue-500';
    if (s.includes('confirmed') || s.includes('designed') || s.includes('printed') || s.includes('packed')) return 'bg-indigo-500';
    if (s.includes('out for delivery')) return 'bg-purple-500';
    if (s.includes('cancelled')) return 'bg-rose-500';
    return 'bg-slate-300';
  };

  const getStageStatus = (order: Order) => {
    switch (selectedStage) {
      case 'client-information': return order.client_information?.status;
      case 'designing': return order.designing?.status;
      case 'printing': return order.printing?.status;
      case 'packaging': return order.packaging?.status;
      case 'delivery': return order.dispatch_delivery?.status;
      default: return null;
    }
  };

  const getAssignedDate = (order: Order) => {
    let dateStr = null;
    switch (selectedStage) {
      case 'client-information':
        dateStr = order.order_date || order.created_at;
        break;
      case 'designing':
        dateStr = (order as any).designing?.work_assign?.assigned_date;
        break;
      case 'printing':
        dateStr = (order as any).printing?.printing_status?.confirmed_date ||
          (order as any).printing?.printing_status?.assigned_date;
        break;
      case 'packaging':
        dateStr = (order as any).packaging?.packaging_logistics?.date;
        break;
      case 'delivery':
        dateStr = (order as any).dispatch_delivery?.dispatch_mode?.date;
        break;
    }

    if (!dateStr) return null;
    try {
      return new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
    } catch (e) {
      return null;
    }
  };

  const currentStage = stages.find(s => s.id === selectedStage);
  const internalStatuses = ['All', 'Pending', 'Process', 'Completed'];

  const filteredOrders = orders.filter(order => {
    if (selectedStatus === 'All') return true;
    const stageStatus = getStageStatus(order);
    return stageStatus === selectedStatus;
  });

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];

    if (lastPage <= 5) {
      for (let i = 1; i <= lastPage; i++) pages.push(i);
      return pages;
    }

    // Always show 1 and 2
    pages.push(1);
    pages.push(2);

    if (currentPage > 3) {
      pages.push('...');
    }

    if (currentPage > 2 && currentPage < lastPage) {
      pages.push(currentPage);
    }

    if (currentPage < lastPage - 1) {
      pages.push('...');
    }

    // Always show last page
    pages.push(lastPage);

    // Deduplicate while preserving order
    return pages.filter((item, index) => pages.indexOf(item) === index);
  };

  return (
    <IonPage className="orders-container">
      <IonHeader className="ion-no-border">
        <div className="h-5 bg-white" />
        <IonToolbar className="px-2">
          <IonTitle className="font-bold text-lg">Management</IonTitle>
        </IonToolbar>
        <div className="h-2 bg-white" />
        <div className="bg-white px-2 pb-4">
          <div className="flex overflow-x-auto no-scrollbar gap-3 px-3 py-2">
            {stages.map((stage) => (
              <button
                key={stage.id}
                onClick={() => setSelectedStage(stage.id)}
                className={`flex flex-col items-center justify-center min-w-[75px] py-3 px-2 rounded-[2.5rem] transition-all duration-500 relative ${selectedStage === stage.id
                  ? 'bg-white shadow-xl shadow-slate-200/60 scale-105 border border-slate-50'
                  : 'bg-transparent border border-transparent'
                  }`}
              >
                <div className={`p-3 rounded-[1.25rem] transition-all duration-500 ${selectedStage === stage.id ? stage.color + ' text-white shadow-lg shadow-current/20' : 'bg-slate-50 text-slate-300'
                  }`}>
                  <stage.icon size={20} className="transition-transform duration-500" />
                </div>
                <span className={`text-[8px] font-black uppercase tracking-[0.2em] mt-2.5 transition-colors duration-500 ${selectedStage === stage.id ? 'text-slate-900' : 'text-slate-400'
                  }`}>
                  {stage.label}
                </span>
                {selectedStage === stage.id && (
                  <div className={`absolute -bottom-1 w-1 h-1 rounded-full ${stage.color}`} />
                )}
              </button>
            ))}
          </div>
        </div>
      </IonHeader>
      <IonContent fullscreen className="ion-padding !bg-slate-50/50">
        <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
          <IonRefresherContent />
        </IonRefresher>

        <div className="space-y-5 pb-8 pt-2">
          <div className="flex items-center justify-between px-3">
            <div className="flex items-center gap-3">
              <div className={`w-1 h-6 rounded-full ${currentStage?.color}`} />
              <h2 className="text-[12px] font-bold text-slate-800 tracking-tight">
                {currentStage?.label} Queue
              </h2>
            </div>
            <span className="text-[9px] font-black text-slate-500 bg-white border border-slate-100 px-3 py-1.5 rounded-2xl uppercase tracking-widest shadow-sm">
              {filteredOrders.length} Active
            </span>
          </div>

          {/* Status Chips Filter */}
          <div className="status-chips-container !mt-1">
            {internalStatuses.map((status) => (
              <button
                key={status}
                onClick={() => setSelectedStatus(status)}
                className={`status-chip ${selectedStatus === status ? 'active' : 'inactive'}`}
              >
                {status}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-24 space-y-4">
              <IonSpinner name="crescent" color="primary" />
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest animate-pulse">Syncing Queue...</p>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-[3rem] border border-dashed border-slate-200 m-3 shadow-sm">
              <div className="bg-slate-50 p-6 rounded-full mb-4">
                <Layers size={40} className="text-slate-200" />
              </div>
              <p className="text-sm font-black text-slate-400 uppercase tracking-widest text-center">No {selectedStatus} items</p>
            </div>
          ) : (
            <div className="px-1 space-y-4">
              {filteredOrders.map((order) => (
                <div
                  key={order.id}
                  className="order-card"
                  onClick={() => history.push(`/management/${order.id}?stage=${selectedStage}`)}
                >
                  <div className={`absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl ${getStatusIndicatorColor(getStageStatus(order) || order.resolved_status)}`} />

                  <div className="order-card-content">
                    <div className="flex justify-between items-center w-full mb-1.5 gap-1">
                      <span className="order-number">#{order.order_number}</span>
                      <div className={`order-status-badge ${getStatusColor(getStageStatus(order) || order.resolved_status)}`}>
                        {getStageStatus(order) || order.resolved_status || 'Waiting'}
                      </div>
                    </div>

                    <div className="flex justify-between items-center w-full gap-3">
                      <div className="order-details-text">
                        <h3 className="customer-name">
                          {order.customer_name || (order as any).customer_details?.name || 'New Client'}
                        </h3>
                        <span className="order-date">
                          {getAssignedDate(order) || 'Just Assigned'}
                        </span>
                      </div>

                      <div className="order-amount">₹{Number((order as any).total_amount || 0).toLocaleString()}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination Controls */}
          {!loading && lastPage > 1 && (
            <div className="flex justify-end px-4 mt-4 mb-8">
              <div className="flex items-center gap-2">
                <button
                  disabled={currentPage === 1}
                  onClick={() => fetchOrders(currentPage - 1)}
                  className={`flex items-center justify-center w-7 h-7 rounded-full transition-all ${currentPage === 1 ? 'text-slate-200 bg-transparent' : 'text-[#3cc0c2] bg-white shadow-sm border border-slate-100 active:scale-90'}`}
                >
                  <ChevronLeft size={14} strokeWidth={3} />
                </button>

                <div className="flex items-center gap-1">
                  {getPageNumbers().map((p, i) => (
                    <button
                      key={i}
                      disabled={p === '...'}
                      onClick={() => typeof p === 'number' && fetchOrders(p)}
                      className={`flex items-center justify-center w-7 h-7 rounded-full text-[10px] font-black transition-all duration-300
                        ${p === currentPage ? 'bg-[#3cc0c2] text-white shadow-md shadow-teal-100 scale-110' :
                          p === '...' ? 'text-slate-300' : 'text-slate-400 hover:text-slate-700 bg-white shadow-xs border border-slate-50'}`}
                    >
                      {p}
                    </button>
                  ))}
                </div>

                <button
                  disabled={currentPage === lastPage}
                  onClick={() => fetchOrders(currentPage + 1)}
                  className={`flex items-center justify-center w-7 h-7 rounded-full transition-all ${currentPage === lastPage ? 'text-slate-200 bg-transparent' : 'text-[#3cc0c2] bg-white shadow-sm border border-slate-100 active:scale-90'}`}
                >
                  <ChevronRight size={14} strokeWidth={3} />
                </button>
              </div>
            </div>
          )}
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Management;
