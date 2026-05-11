import React, { useEffect, useState } from 'react';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonRefresher,
  IonRefresherContent,
  RefresherEventDetail,
} from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { ShoppingBag, CheckCircle, Clock, IndianRupee, TrendingUp, User, LogOut, Printer, PencilRuler, Box, Truck, Layers } from 'lucide-react';
import api from '../../api/api';
import './Dashboard.css';

interface DashboardStats {
  total_orders: number;
  completed_orders: number;
  total_payments: number;
  total_revenue: number;
  monthly_trend: any[];
  payment_distribution: { paid: number; pending: number; overdue: number };
  stage_stats: {
    new_order: number;
    designing: number;
    printing: number;
    packaging: number;
    delivered: number;
  };
}

const Dashboard: React.FC = () => {
  const history = useHistory();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [showMenu, setShowMenu] = useState(false);
  const [userData, setUserData] = useState<any>(null);

  const fetchStats = async () => {
    try {
      const response = await api.get(`/dashboard/stats`);
      if (response.data.success) {
        setStats(response.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch dashboard stats', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const storedUser = localStorage.getItem('auth_user');
    if (storedUser) {
      try {
        setUserData(JSON.parse(storedUser));
      } catch (e) {
        console.error('Failed to parse user data', e);
      }
    }
    fetchStats();
  }, []);

  const handleLogout = () => {
    setShowMenu(false);
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    // Force a full reload to clear all session state
    window.location.href = '/login';
  };

  const handleRefresh = async (event: CustomEvent<RefresherEventDetail>) => {
    await fetchStats();
    event.detail.complete();
  };



  const userInitial = (userData?.name || 'Benny Cards')?.charAt(0).toUpperCase();

  return (
    <IonPage>
      <IonHeader className="ion-no-border">
        <div className="h-10 bg-white" />
        <IonToolbar className="px-2">
          <IonTitle className="font-bold text-xl">Benny Cards</IonTitle>
        </IonToolbar>
        <div className="h-2 bg-white" />
      </IonHeader>

      <IonContent fullscreen className="ion-padding" style={{ '--background': '#FDFCFB' }}>
        <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
          <IonRefresherContent />
        </IonRefresher>

        <div className="space-y-7 pb-8">
          {/* Dashboard Header Section - Premium Stitch Design */}
          <div className="mt-2 flex justify-between items-center px-1">
            <div className="flex flex-col">
              <h2 className="text-4xl font-black text-slate-900 tracking-tight leading-none">
                Hello, {userData?.name?.split(' ')[0] || 'Benny'}!
              </h2>
              <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.25em] mt-3">
                Management Overview
              </p>
            </div>
            
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setShowMenu(!showMenu);
              }}
              style={{ borderRadius: '50%' }}
              className="w-12 h-12 bg-white flex items-center justify-center shadow-xl shadow-teal-100/50 active:scale-95 transition-all overflow-hidden border border-slate-50 cursor-pointer"
            >
              <div className="w-10 h-10 rounded-full bg-[#3cc0c2] flex items-center justify-center text-white font-black text-lg">
                <span className="select-none">{userInitial}</span>
              </div>
            </button>
          </div>

          <div className="space-y-6">
            {/* Top Stats Card - Total Orders */}
            <div className="bg-[#EBF9F9] p-8 rounded-[2.5rem] relative overflow-hidden border border-teal-50">
              <div className="relative z-10">
                <p className="text-[10px] font-black text-teal-600 uppercase tracking-[0.2em] mb-2">Total Orders</p>
                <h3 className="text-5xl font-black text-slate-900 tracking-tighter">
                  {stats?.total_orders?.toLocaleString() || "0"}
                </h3>
                <div className="mt-4 inline-flex items-center gap-1.5 text-teal-600 font-bold text-[11px]">
                  <TrendingUp size={12} strokeWidth={3} />
                  <span>+15.3% vs last month</span>
                </div>
              </div>
              <div className="absolute right-8 top-1/2 -translate-y-1/2 w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center text-teal-500">
                <Layers size={32} strokeWidth={2.5} />
              </div>
            </div>

            {/* Grid Layout Section */}
            <div className="grid grid-cols-2 gap-4">
              {/* Left Column */}
              <div className="space-y-4">
                {/* New Orders - Tall Card */}
                <div className="bg-white p-6 rounded-[2.5rem] border border-slate-50 shadow-sm flex flex-col justify-between min-h-[220px]">
                  <div className="w-12 h-12 bg-teal-50 rounded-2xl flex items-center justify-center text-teal-500">
                    <ShoppingBag size={24} strokeWidth={2.5} />
                  </div>
                  <div>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">New Orders</p>
                    <h3 className="text-4xl font-black text-slate-900 tracking-tight mt-1">
                      {stats?.stage_stats?.new_order?.toLocaleString() || "0"}
                    </h3>
                  </div>
                  <div className="inline-flex items-center w-fit px-3 py-1.5 rounded-full bg-teal-50 text-teal-600 text-[10px] font-black">
                    +12.5%
                  </div>
                </div>

                {/* Packaging - Small Card */}
                <div className="bg-white p-6 rounded-[2.5rem] border border-slate-50 shadow-sm flex items-center justify-between">
                  <div className="space-y-1">
                    <h3 className="text-2xl font-black text-slate-900">
                      {stats?.stage_stats?.packaging?.toLocaleString() || "0"}
                    </h3>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Packaging</p>
                  </div>
                  <div className="w-10 h-10 bg-teal-50 rounded-xl flex items-center justify-center text-teal-500">
                    <Box size={20} strokeWidth={2.5} />
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-4">
                {/* Designing - Small Card */}
                <div className="bg-white p-6 rounded-[2.5rem] border border-slate-50 shadow-sm flex items-center justify-between">
                  <div className="space-y-1">
                    <h3 className="text-2xl font-black text-slate-900">
                      {stats?.stage_stats?.designing?.toLocaleString() || "0"}
                    </h3>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Designing</p>
                  </div>
                  <div className="w-10 h-10 bg-teal-50 rounded-xl flex items-center justify-center text-teal-500">
                    <PencilRuler size={20} strokeWidth={2.5} />
                  </div>
                </div>

                {/* Printing - Small Card */}
                <div className="bg-white p-6 rounded-[2.5rem] border border-slate-50 shadow-sm flex items-center justify-between">
                  <div className="space-y-1">
                    <h3 className="text-2xl font-black text-slate-900">
                      {stats?.stage_stats?.printing?.toLocaleString() || "0"}
                    </h3>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Printing</p>
                  </div>
                  <div className="w-10 h-10 bg-teal-50 rounded-xl flex items-center justify-center text-teal-500">
                    <Printer size={20} strokeWidth={2.5} />
                  </div>
                </div>

                {/* Delivered - Small Card */}
                <div className="bg-white p-6 rounded-[2.5rem] border border-slate-50 shadow-sm flex items-center justify-between">
                  <div className="space-y-1">
                    <h3 className="text-2xl font-black text-slate-900">
                      {stats?.stage_stats?.delivered?.toLocaleString() || "0"}
                    </h3>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Delivered</p>
                  </div>
                  <div className="w-10 h-10 bg-teal-50 rounded-xl flex items-center justify-center text-teal-500">
                    <Truck size={20} strokeWidth={2.5} />
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </IonContent>

      {/* FIXED MENU OVERLAY SYSTEM */}
      {showMenu && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/5 z-[9999]" 
            onClick={() => setShowMenu(false)}
          />
          
          {/* Menu Card */}
          <div className="fixed right-4 top-[175px] w-64 bg-white rounded-[2rem] shadow-[0_30px_60px_rgba(0,0,0,0.25)] border border-slate-100 z-[10000] overflow-hidden animate-in fade-in zoom-in duration-200">
            {/* Menu Header */}
            <div className="p-5 bg-slate-50/80 border-b border-slate-100">
              <div className="flex items-center gap-4">
                <div 
                  style={{ borderRadius: '50%' }}
                  className="w-12 h-12 bg-[#3cc0c2] flex items-center justify-center text-white font-black text-xl shadow-lg shadow-[#3cc0c2]/20 shrink-0"
                >
                  <span className="text-white select-none">{userInitial}</span>
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-base font-black text-slate-800 leading-tight truncate">
                    {userData?.name || 'Benny Cards'}
                  </span>
                  <span className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-wider truncate">
                    {userData?.email || 'admin@gmail.com'}
                  </span>
                </div>
              </div>
            </div>

            {/* Menu Actions */}
            <div className="p-3 space-y-1">
              <button 
                onClick={(e) => { 
                  e.stopPropagation();
                  setShowMenu(false); 
                  setTimeout(() => {
                    history.push('/profile');
                  }, 10);
                }}
                className="w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl hover:bg-slate-50 text-slate-600 transition-all active:scale-[0.98]"
              >
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#3cc0c2] flex items-center justify-center shrink-0">
                  <User size={20} />
                </div>
                <span className="text-sm font-bold">View Profile</span>
              </button>
              
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  handleLogout();
                }}
                className="w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl hover:bg-rose-50 text-rose-500 transition-all active:scale-[0.98]"
              >
                <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-500 flex items-center justify-center shrink-0">
                  <LogOut size={20} />
                </div>
                <span className="text-sm font-bold">Sign Out</span>
              </button>
            </div>
          </div>
        </>
      )}
    </IonPage>
  );
};

export default Dashboard;
