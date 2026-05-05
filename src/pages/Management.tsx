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
import { Layers, User, Palette, Printer, Box, Truck, ChevronRight } from 'lucide-react';
import api from '../api/api';
import './Orders.css'; // Reuse the premium card styles

interface Order {
  id: number;
  order_number: string;
  customer_name: string;
  status: string;
  current_stage_status?: string;
  order_date: string;
}

const Management: React.FC = () => {
  const history = useHistory();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStage, setSelectedStage] = useState('client-information');

  const stages = [
    { id: 'client-information', label: 'Client', icon: User, color: 'bg-blue-500', text: 'text-blue-700', border: 'bg-blue-100' },
    { id: 'designing', label: 'Design', icon: Palette, color: 'bg-purple-500', text: 'text-purple-700', border: 'bg-purple-100' },
    { id: 'printing', label: 'Print', icon: Printer, color: 'bg-amber-500', text: 'text-amber-700', border: 'bg-amber-100' },
    { id: 'packaging', label: 'Pack', icon: Box, color: 'bg-emerald-500', text: 'text-emerald-700', border: 'bg-emerald-100' },
    { id: 'delivery', label: 'Deliver', icon: Truck, color: 'bg-rose-500', text: 'text-rose-700', border: 'bg-rose-100' },
  ];

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/orders`, {
        params: { stage: selectedStage }
      });
      if (response.data.success) {
        setOrders(response.data.data.data || []);
      }
    } catch (error) {
      console.error('Error fetching stage orders:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [selectedStage]);

  const handleRefresh = async (event: CustomEvent<RefresherEventDetail>) => {
    await fetchOrders();
    event.detail.complete();
  };

  const currentStage = stages.find(s => s.id === selectedStage);

  return (
    <IonPage className="orders-container">
      <IonHeader className="ion-no-border">
        <IonToolbar className="px-2">
          <IonTitle className="font-bold text-xl">Management</IonTitle>
        </IonToolbar>
        <div className="bg-white px-2 pb-4">
          <div className="flex overflow-x-auto no-scrollbar gap-3 px-3 py-2">
            {stages.map((stage) => (
              <button
                key={stage.id}
                onClick={() => setSelectedStage(stage.id)}
                className={`flex flex-col items-center justify-center min-w-[80px] p-4 rounded-[2rem] transition-all duration-500 ${
                  selectedStage === stage.id 
                    ? 'bg-slate-900 text-white shadow-2xl shadow-slate-900/40 scale-105' 
                    : 'bg-slate-50 text-slate-400 hover:bg-slate-100'
                }`}
              >
                <div className={`p-2 rounded-full ${selectedStage === stage.id ? 'bg-white/10' : ''}`}>
                  <stage.icon size={22} className={selectedStage === stage.id ? 'text-white' : stage.text.replace('700', '500')} />
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest mt-2">{stage.label}</span>
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
              <h2 className="text-base font-black text-slate-900 uppercase tracking-widest">
                {currentStage?.label} Queue
              </h2>
            </div>
            <span className="text-[11px] font-black text-slate-500 bg-white border border-slate-100 px-3 py-1.5 rounded-2xl uppercase tracking-widest shadow-sm">
              {orders.length} Active
            </span>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-24 space-y-4">
              <IonSpinner name="crescent" color="primary" />
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest animate-pulse">Syncing Queue...</p>
            </div>
          ) : orders.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-[3rem] border border-dashed border-slate-200 m-3 shadow-sm">
              <div className="bg-slate-50 p-6 rounded-full mb-4">
                <Layers size={40} className="text-slate-200" />
              </div>
              <p className="text-sm font-black text-slate-400 uppercase tracking-widest text-center">Queue is empty</p>
            </div>
          ) : (
            <div className="px-1 space-y-4">
              {orders.map((order) => (
                <div 
                  key={order.id} 
                  className="order-card !mb-0 border-none shadow-md shadow-slate-200/50"
                  onClick={() => history.push(`/orders/${order.id}`)}
                >
                  <div className={`status-indicator ${currentStage?.color}`} style={{ backgroundColor: 'currentColor' }} />
                  
                  <div className="order-card-content !py-6">
                    <div className="flex justify-between items-center w-full mb-2 gap-1">
                      <span className="order-number font-black text-[11px] tracking-wider text-slate-400 uppercase">
                        #{order.order_number}
                      </span>
                      <div className={`order-status-badge !px-3 !py-1 !rounded-full !text-[10px] ${currentStage?.border} ${currentStage?.text}`}>
                        {order.current_stage_status || 'Waiting'}
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-end w-full gap-3">
                      <div className="order-details-text">
                        <h3 className="customer-name !text-lg !font-black !text-slate-900 !mb-1">
                          {order.customer_name || (order as any).customer_details?.name || 'New Client'}
                        </h3>
                        <div className="flex items-center gap-2">
                          <span className="order-date !text-[11px] !font-bold">
                            {order.order_date ? new Date(order.order_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : 'Today'}
                          </span>
                          <div className="w-1 h-1 rounded-full bg-slate-300" />
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Standard Process</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-center w-10 h-10 rounded-2xl bg-slate-50 text-slate-300">
                        <ChevronRight size={20} />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Management;
