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
  IonSpinner
} from '@ionic/react';
import { ShoppingBag, ChevronRight, Filter, Search } from 'lucide-react';
import api from '../api/api';

interface Order {
  id: number;
  order_number: string;
  customer_name: string;
  total_amount: number;
  status: string;
  order_date: string;
  items_count?: number;
}

const Orders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

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
    switch (status.toLowerCase()) {
      case 'completed':
      case 'delivered':
        return 'bg-emerald-100 text-emerald-700';
      case 'pending':
        return 'bg-amber-100 text-amber-700';
      case 'processing':
      case 'designing':
      case 'printing':
        return 'bg-blue-100 text-blue-700';
      case 'cancelled':
        return 'bg-rose-100 text-rose-700';
      default:
        return 'bg-slate-100 text-slate-700';
    }
  };

  const filteredOrders = orders.filter(order => 
    order.customer_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.order_number?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <IonPage>
      <IonHeader className="ion-no-border">
        <IonToolbar className="px-2">
          <IonTitle className="font-bold text-xl">Orders</IonTitle>
        </IonToolbar>
        <div className="px-4 pb-2 bg-white">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
            <input 
              type="text" 
              placeholder="Search by name or order #" 
              className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all shadow-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
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
              <div key={order.id} className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden active:scale-[0.98] transition-transform">
                <div className="p-5 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="bg-indigo-50 p-3 rounded-2xl text-indigo-600">
                      <ShoppingBag size={20} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">#{order.order_number}</span>
                        <div className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${getStatusColor(order.status)}`}>
                          {order.status}
                        </div>
                      </div>
                      <h3 className="text-base font-black text-slate-900 mt-1">{order.customer_name}</h3>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                        {new Date(order.order_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </p>
                    </div>
                  </div>
                  <div className="text-right flex flex-col items-end">
                    <span className="text-base font-black text-slate-900">₹{Number(order.total_amount).toLocaleString()}</span>
                    <ChevronRight size={16} className="text-slate-300 mt-1" />
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
