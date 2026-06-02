import React, { useEffect, useState } from 'react';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonRefresher,
  IonRefresherContent,
  IonSearchbar,
  RefresherEventDetail,
  IonBadge,
  IonSpinner,
  IonFooter,
  IonModal,
  IonDatetime,
  IonButton,
  IonButtons
} from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { ShoppingBag, Calendar as CalendarIcon, Search, X, ChevronLeft, ChevronRight } from 'lucide-react';
import api from '../../api/api';
import { formatDate } from '../../utils/dateUtils';
import './Orders.css';

interface Order {
  id: number;
  order_number: string;
  customer_details?: {
    name: string;
  };
  total_amount: number;
  status: string;
  resolved_status: string;
  order_date: string;
  items_count?: number;
  quantity?: number | string;
  total_quantity?: number | string;
  delivery_date?: string;
}

const Orders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [filterDate, setFilterDate] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [tempDate, setTempDate] = useState(new Date().toISOString().split('T')[0]);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [total, setTotal] = useState(0);
  const history = useHistory();

  const statuses = [
    'All', 'New Order', 'Confirmed', 
    'Designing in Progress', 'Designed', 
    'Printing in Progress', 'Printed', 
    'Packing in Progress', 'Packed', 
    'Out for Delivery', 'Delivered'
  ];

  const fetchOrders = async (page = 1) => {
    try {
      setLoading(true);
      const response = await api.get(`/orders`, {
        params: {
          page: page,
          per_page: 20,
          status: selectedStatus !== 'All' ? selectedStatus : undefined,
          search: searchQuery || undefined,
          start_date: filterDate || undefined,
          end_date: filterDate || undefined
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
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders(1);
  }, [selectedStatus, searchQuery, filterDate]);

  const handleRefresh = async (event: CustomEvent<RefresherEventDetail>) => {
    await fetchOrders(1);
    event.detail.complete();
  };

  const getStatusColor = (status: string) => {
    const s = status?.toLowerCase() || '';
    if (s.includes('delivered') || s.includes('completed')) return 'bg-emerald-100 text-emerald-700';
    if (s.includes('pending') || s.includes('new order')) return 'bg-amber-100 text-amber-700';
    if (s.includes('progress') || s.includes('designing') || s.includes('printing') || s.includes('packing')) return 'bg-blue-100 text-blue-700';
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

  const filteredOrders = orders; // Now filtered on server side

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

  const handleDateConfirm = () => {
    if (tempDate) {
      // tempDate from IonDatetime is usually ISO string or YYYY-MM-DD
      const dateOnly = tempDate.split('T')[0];
      setFilterDate(dateOnly);
    }
    setShowDatePicker(false);
  };

  return (
    <IonPage className="orders-container">
      <IonHeader className="ion-no-border">
        <IonToolbar className="px-2 pb-1 pt-1">
          <IonTitle className="font-bold text-xl ion-text-center">Orders</IonTitle>
        </IonToolbar>
        <div className="search-wrapper">
          <div className="search-input-container">
            <div className="search-field">
              <Search className="search-icon" size={20} />
              <input 
                type="text" 
                placeholder="Search orders..." 
                className="search-input"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="clear-button"
                >
                  <X size={16} />
                </button>
              )}
            </div>
            <div className="relative">
              <button 
                className={`filter-button ${filterDate ? 'active' : ''}`}
                onClick={() => setShowDatePicker(true)}
              >
                <CalendarIcon size={20} className={filterDate ? 'text-indigo-600' : ''} />
              </button>
            </div>
          </div>

          <IonModal 
            isOpen={showDatePicker} 
            onDidDismiss={() => setShowDatePicker(false)}
            className="date-picker-modal"
            style={{ '--height': 'auto', '--width': '88%', '--max-width': '320px', '--border-radius': '2rem' }}
          >
            <div className="bg-white flex flex-col shadow-2xl">
              {/* Premium Header */}
              <div className="px-4 pt-4 pb-0 flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-black text-slate-900 tracking-tight">Select Date</h3>
                </div>
                <button 
                  onClick={() => setShowDatePicker(false)} 
                  className="w-8 h-8 flex items-center justify-center bg-slate-50 rounded-xl text-slate-400 active:scale-90 transition-all hover:bg-slate-100"
                >
                  <X size={18} strokeWidth={2.5} />
                </button>
              </div>
              
              <div className="px-2">
                <IonDatetime
                  presentation="date"
                  mode="md"
                  value={tempDate || filterDate || new Date().toISOString().split('T')[0]}
                  onIonChange={e => setTempDate(e.detail.value as string)}
                  color="primary"
                  highlightedDates={[
                    {
                      date: new Date().toISOString().split('T')[0],
                      textColor: '#ffffff',
                      backgroundColor: '#3cc0c2',
                    }
                  ]}
                  style={{ 
                    '--background': '#ffffff',
                    '--ion-background-color': '#ffffff',
                    '--ion-item-background': '#ffffff',
                    '--ion-text-color': '#000000',
                    '--ion-color-primary': '#3cc0c2',
                    'background': '#ffffff',
                    'color': '#000000',
                    'borderRadius': '20px',
                    'minHeight': '250px'
                  } as any}
                  className="custom-calendar"
                />
              </div>

              {/* Action Buttons */}
              <div className="px-4 py-2 flex gap-3 pb-5">
                <button 
                  onClick={() => {
                    setFilterDate('');
                    setShowDatePicker(false);
                  }}
                  className="flex-1 h-10 flex items-center justify-center rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 bg-slate-50 active:scale-95 transition-all"
                >
                  Clear
                </button>
                <button 
                  onClick={handleDateConfirm}
                  className="flex-1 h-10 flex items-center justify-center bg-[#3cc0c2] text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-teal-100 active:scale-95 transition-all"
                >
                  Set Date
                </button>
              </div>
            </div>
          </IonModal>

          {/* Active Date Chip */}
          {filterDate && (
            <div className="flex items-center gap-2 mt-3 animate-in fade-in slide-in-from-top-2 duration-300">
              <div className="flex items-center gap-2 bg-teal-50 border border-teal-100 px-3 py-1.5 rounded-full shadow-sm">
                <CalendarIcon size={12} className="text-[#3cc0c2]" />
                <span className="text-[11px] font-black text-[#3cc0c2]">
                  {formatDate(filterDate)}
                </span>
                <button 
                  onClick={() => setFilterDate('')}
                  className="ml-1 p-0.5 hover:bg-teal-100 rounded-full text-teal-400 hover:text-[#3cc0c2] transition-colors"
                >
                  <X size={12} strokeWidth={3} />
                </button>
              </div>
            </div>
          )}

          {/* Horizontal Status Chips */}
          <div className="status-chips-container">
            {statuses.map((status) => (
              <button
                key={status}
                onClick={() => setSelectedStatus(status)}
                className={`status-chip ${selectedStatus === status ? 'active' : 'inactive'}`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>
      </IonHeader>
      <IonContent fullscreen className="ion-padding">
        <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
          <IonRefresherContent />
        </IonRefresher>

        <div className="space-y-6 pb-8 mt-2">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 space-y-4">
              <IonSpinner name="crescent" className="text-indigo-600" />
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Loading Orders...</p>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 space-y-4">
              <div className="bg-slate-50 p-6 rounded-full">
                <ShoppingBag size={48} className="text-slate-300" />
              </div>
              <p className="text-sm font-bold text-slate-500">No orders found.</p>
            </div>
          ) : (
            filteredOrders.map((order) => (
              <div 
                key={order.id} 
                className="order-card"
                onClick={() => history.push(`/orders/${order.id}`)}
              >
                {/* Color Status Bar */}
                <div className={`absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl ${getStatusIndicatorColor(order.resolved_status)}`} />
                
                <div className="order-card-content">
                  {/* Top Row: Order ID and Status */}
                  <div className="flex justify-between items-center w-full mb-1.5 gap-1">
                    <span className="order-number">#{order.order_number}</span>
                    <div className="flex flex-col items-end gap-1">
                      <div className={`order-status-badge ${getStatusColor(order.resolved_status)}`}>
                        {order.resolved_status}
                      </div>
                      {(order.delivery_date && order.delivery_date !== 'N/A' && order.delivery_date !== 'N/a' && order.delivery_date !== '-') && (
                        <div className="flex items-center gap-1.5 bg-emerald-50 px-2 py-0.5 rounded-md text-[8px] font-black text-emerald-600 border border-emerald-100 shadow-sm">
                          <CalendarIcon size={10} strokeWidth={3} />
                          {formatDate(order.delivery_date)}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Bottom Row: Customer Details and Amount */}
                  <div className="flex justify-between items-end w-full gap-3 mt-1">
                    <div className="order-details-text flex-1">
                      <h3 className="customer-name">
                        {order.customer_details?.name || 'Walking Customer'}
                      </h3>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="order-date">
                          {formatDate(order.order_date)}
                        </span>
                        {((order.quantity !== undefined && order.quantity !== null) || (order.total_quantity !== undefined && order.total_quantity !== null)) && (
                          <div className="flex items-center gap-1 bg-slate-100 px-1.5 py-0.5 rounded text-[9px] font-black text-slate-500">
                            QTY: {order.quantity ?? order.total_quantity}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-end">
                      <div className="order-amount">₹{Number(order.total_amount).toLocaleString()}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))
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

export default Orders;
