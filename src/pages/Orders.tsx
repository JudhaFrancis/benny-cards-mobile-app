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
  IonFooter
} from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { ShoppingBag, Filter, Search, X } from 'lucide-react';
import api from '../api/api';
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
}

const Orders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const history = useHistory();

  const statuses = [
    'All', 'New Order', 'Confirmed', 
    'Designing in Progress', 'Designed', 
    'Printing in Progress', 'Printed', 
    'Packing in Progress', 'Packed', 
    'Out for Delivery', 'Delivered'
  ];

  const fetchOrders = async () => {
    try {
      const response = await api.get(`/orders`);
      if (response.data.success) {
        setOrders(response.data.data.data || []);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleRefresh = async (event: CustomEvent<RefresherEventDetail>) => {
    await fetchOrders();
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

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.customer_details?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.order_number?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = selectedStatus === 'All' || order.resolved_status === selectedStatus;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <IonPage className="orders-container">
      <IonHeader className="ion-no-border">
        <IonToolbar className="px-2">
          <IonTitle>Orders</IonTitle>
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
            <button className="filter-button">
              <Filter size={20} />
            </button>
          </div>

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

        <div className="space-y-4 pb-8">
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
                <div className={`status-indicator ${getStatusColor(order.resolved_status)} !bg-opacity-100`} style={{ backgroundColor: 'currentColor' }} />
                
                <div className="order-card-content">
                  {/* Top Row: Order ID and Status */}
                  <div className="flex justify-between items-center w-full mb-1.5 gap-1">
                    <span className="order-number">#{order.order_number}</span>
                    <div className={`order-status-badge ${getStatusColor(order.resolved_status)}`}>
                      {order.resolved_status}
                    </div>
                  </div>
                  
                  {/* Bottom Row: Customer Details and Amount */}
                  <div className="flex justify-between items-center w-full gap-3">
                    <div className="order-details-text">
                      <h3 className="customer-name">
                        {order.customer_details?.name || 'Walking Customer'}
                      </h3>
                      <span className="order-date">
                        {new Date(order.order_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                    </div>
                    
                    <div className="order-amount">₹{Number(order.total_amount).toLocaleString()}</div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Orders;
