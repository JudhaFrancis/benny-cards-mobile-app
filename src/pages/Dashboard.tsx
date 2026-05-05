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
import { ShoppingCart, CheckCircle, Clock, IndianRupee, TrendingUp, User, LogOut } from 'lucide-react';
import api from '../api/api';
import './Dashboard.css';

interface DashboardStats {
  total_orders: number;
  completed_orders: number;
  total_payments: number;
  total_revenue: number;
  monthly_trend: any[];
  payment_distribution: { paid: number; pending: number; overdue: number };
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

  const statCards = [
    {
      title: "Total Orders",
      value: stats?.total_orders.toLocaleString() || "0",
      icon: ShoppingCart,
      color: "bg-blue-500",
      trend: "+12.5%"
    },
    {
      title: "Completed",
      value: stats?.completed_orders.toLocaleString() || "0",
      icon: CheckCircle,
      color: "bg-emerald-500",
      trend: "+8.2%"
    },
    {
      title: "Payments",
      value: stats?.total_payments.toLocaleString() || "0",
      icon: Clock,
      color: "bg-amber-500",
      trend: "-3.1%"
    },
    {
      title: "Revenue",
      value: `₹${Number(stats?.total_revenue || 0).toLocaleString()}`,
      icon: IndianRupee,
      color: "bg-indigo-500",
      trend: "+15.3%"
    }
  ];

  const userInitial = (userData?.name || 'Benny Cards')?.charAt(0).toUpperCase();

  return (
    <IonPage>
      <IonHeader className="ion-no-border">
        <IonToolbar className="px-2 relative">
          <IonTitle className="font-bold text-xl">Benny Cards</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen className="ion-padding" style={{ '--background': '#FDFCFB' }}>
        <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
          <IonRefresherContent />
        </IonRefresher>

        <div className="space-y-6 pb-8">
          {/* Dashboard Header Section */}
          <div className="mt-6 flex justify-between items-center relative">
            <div className="flex flex-col justify-center">
              <h2 className="text-3xl font-black text-slate-900 tracking-tight leading-tight">Dashboard</h2>
              <p className="text-sm text-slate-500 font-medium mt-1">Management Overview</p>
            </div>
            
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setShowMenu(!showMenu);
              }}
              style={{ borderRadius: '50%' }}
              className="w-12 h-12 bg-[#3cc0c2] flex items-center justify-center text-white font-black text-xl shadow-lg active:scale-95 transition-all overflow-hidden border-0 cursor-pointer"
            >
              <span className="text-white select-none">
                {userInitial}
              </span>
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {statCards.map((card, index) => (
              <div key={index} className="bg-white p-5 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col space-y-4">
                <div className={`w-11 h-11 rounded-[1.25rem] flex items-center justify-center text-white shadow-lg shadow-current/20`} style={{ backgroundColor: '#3cc0c2' }}>
                  <card.icon size={22} />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{card.title}</p>
                  <h3 className="text-2xl font-black text-slate-900 mt-1">{card.value}</h3>
                </div>
                <div className="flex items-center gap-1.5 pt-1">
                  <div className={`p-1 rounded-full ${card.trend.startsWith('+') ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>
                    <TrendingUp size={10} />
                  </div>
                  <span className={`text-[11px] font-black ${card.trend.startsWith('+') ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {card.trend}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* System Status Section */}
          <div className="bg-slate-900 rounded-[2.5rem] p-6 text-white shadow-xl shadow-slate-900/20 overflow-hidden relative group">
            <div className="absolute -right-4 -top-4 w-32 h-32 bg-[#3cc0c2]/10 rounded-full blur-3xl group-hover:bg-[#3cc0c2]/20 transition-all"></div>
            <div className="relative z-10 flex flex-col space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">System Status</span>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></div>
                  <span className="text-[10px] font-bold uppercase tracking-widest">Active</span>
                </div>
              </div>
              <h3 className="text-xl font-bold tracking-tight">Operations are running smoothly today.</h3>
              <button className="bg-[#3cc0c2] text-white py-3 rounded-2xl text-xs font-bold uppercase tracking-widest hover:scale-105 active:scale-95 transition-all w-full">
                View Live Monitor
              </button>
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
