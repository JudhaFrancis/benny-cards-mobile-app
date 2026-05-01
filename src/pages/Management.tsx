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
import { Layers, User, Palette, Printer, Box, Truck, ChevronRight } from 'lucide-react';
import api from '../api/api';

interface Order {
  id: number;
  order_number: string;
  customer_name: string;
  status: string;
  current_stage_status?: string;
}

const Management: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStage, setSelectedStage] = useState('client-information');

  const stages = [
    { id: 'client-information', label: 'Client', icon: User, color: 'text-blue-500' },
    { id: 'designing', label: 'Design', icon: Palette, color: 'text-purple-500' },
    { id: 'printing', label: 'Print', icon: Printer, color: 'text-amber-500' },
    { id: 'packaging', label: 'Pack', icon: Box, color: 'text-emerald-500' },
    { id: 'delivery', label: 'Deliver', icon: Truck, color: 'text-rose-500' },
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

  return (
    <IonPage>
      <IonHeader className="ion-no-border">
        <IonToolbar className="px-2">
          <IonTitle className="font-bold text-xl">Management</IonTitle>
        </IonToolbar>
        <div className="bg-white px-2 pb-2">
          <div className="flex overflow-x-auto no-scrollbar gap-2 px-2 py-1">
            {stages.map((stage) => (
              <button
                key={stage.id}
                onClick={() => setSelectedStage(stage.id)}
                className={`flex flex-col items-center justify-center min-w-[70px] p-3 rounded-2xl transition-all ${
                  selectedStage === stage.id 
                    ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/20 scale-105' 
                    : 'bg-slate-50 text-slate-400 hover:bg-slate-100'
                }`}
              >
                <stage.icon size={18} className={selectedStage === stage.id ? 'text-white' : stage.color} />
                <span className="text-[10px] font-black uppercase tracking-widest mt-2">{stage.label}</span>
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
          <div className="flex items-center justify-between px-2">
            <h2 className="text-sm font-black text-slate-900 uppercase tracking-[0.2em]">
              {stages.find(s => s.id === selectedStage)?.label} Queue
            </h2>
            <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded-lg uppercase tracking-widest">
              {orders.length} Orders
            </span>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 space-y-4">
              <IonSpinner name="crescent" className="text-slate-900" />
            </div>
          ) : orders.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 bg-slate-50 rounded-[2.5rem] border border-dashed border-slate-200">
              <Layers size={40} className="text-slate-200" />
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-4">No orders in this stage</p>
            </div>
          ) : (
            orders.map((order) => (
              <div key={order.id} className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden active:scale-[0.98] transition-transform">
                <div className="p-5 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-2xl ${stages.find(s => s.id === selectedStage)?.color.replace('text', 'bg')}/10 ${stages.find(s => s.id === selectedStage)?.color}`}>
                      {React.createElement(stages.find(s => s.id === selectedStage)?.icon || Layers, { size: 20 })}
                    </div>
                    <div>
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">#{order.order_number}</span>
                      <h3 className="text-base font-black text-slate-900 mt-0.5">{order.customer_name}</h3>
                      <div className="flex items-center gap-1.5 mt-1">
                        <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">In Progress</span>
                      </div>
                    </div>
                  </div>
                  <ChevronRight size={18} className="text-slate-300" />
                </div>
              </div>
            ))
          )}
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Management;
