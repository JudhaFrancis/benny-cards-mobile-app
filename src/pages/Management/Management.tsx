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
import { Layers, User, Palette, Printer, Box, Truck, ChevronRight, ChevronLeft, Clock, Calendar, Building2, AlertCircle, Gift } from 'lucide-react';
import api from '../../api/api';
import { formatDate } from '../../utils/dateUtils';
import '../Orders/Orders.css'; // Reuse the premium card styles

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
  client_information?: { 
    status: string;
    order_details?: {
      order_taken_by?: string;
      order_placed_in?: string;
    }
  };
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
  
  const getBranchColor = (branch: string) => {
    return 'bg-slate-50 text-slate-500 border-slate-200/60';
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
        dateStr = (order as any).printing?.printing_status?.confirmed_date;
        break;
      case 'packaging':
        dateStr = (order as any).packaging?.packaging_logistics?.date;
        break;
      case 'delivery':
        dateStr = (order as any).dispatch_delivery?.dispatch_mode?.date;
        break;
    }

    if (!dateStr) return null;
    const formatted = formatDate(dateStr);
    return formatted === 'N/A' ? null : formatted;
  };

  const getAssignedDateLabel = (order: Order) => {
    switch (selectedStage) {
      case 'client-information':
        return 'Ordered';
      case 'designing':
        return 'Assigned';
      case 'printing':
        return 'Confirmed';
      case 'packaging':
        return 'Assigned';
      case 'delivery':
        return 'Delivered';
      default:
        return 'Date';
    }
  };

  const getStageDateBadgeStyle = (stageId: string) => {
    switch (stageId) {
      case 'client-information':
        return {
          bg: 'bg-blue-50 text-blue-600 border-blue-100',
          iconColor: 'text-blue-500'
        };
      case 'designing':
        return {
          bg: 'bg-purple-50 text-purple-600 border-purple-100',
          iconColor: 'text-purple-500'
        };
      case 'printing':
        return {
          bg: 'bg-amber-50 text-amber-600 border-amber-100',
          iconColor: 'text-amber-500'
        };
      case 'packaging':
        return {
          bg: 'bg-indigo-50 text-indigo-600 border-indigo-100',
          iconColor: 'text-indigo-500'
        };
      case 'delivery':
        return {
          bg: 'bg-rose-50 text-rose-600 border-rose-100',
          iconColor: 'text-rose-500'
        };
      default:
        return {
          bg: 'bg-slate-50 text-slate-600 border-slate-100',
          iconColor: 'text-slate-500'
        };
    }
  };

  const getDeadlineHours = (order: Order) => {
    if (selectedStage !== 'designing') return null;
    const hours = (order as any).designing?.work_assign?.deadline_hours;
    if (!hours) return null;
    return hours === 24 || hours === '24' ? '11-24 Hours' : `${hours} Hours`;
  };

  const formatSimpleDate = (dateStr: string | undefined) => {
    return formatDate(dateStr);
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
        <IonToolbar className="px-2 pb-1 pt-1">
          <IonTitle className="font-bold text-xl ion-text-center">Management</IonTitle>
        </IonToolbar>
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

        <div className="space-y-6 pb-8 mt-2">
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
                      <div className="flex flex-col">
                        <span className="order-number">#{order.order_number}</span>
                        {selectedStage === 'client-information' && order.client_information?.order_details?.order_taken_by && (
                          <div className="flex items-center gap-1 text-[8px] font-black text-slate-500 tracking-tight mt-1 self-start">
                            <User size={8} className="text-purple-500" />
                            <span>Assigned By : {order.client_information.order_details.order_taken_by}</span>
                          </div>
                        )}
                        {selectedStage === 'designing' && (order as any).designing?.work_assign?.assigned_to && (
                          <div className="flex items-center gap-1 text-[8px] font-black text-slate-500 tracking-tight mt-1 self-start">
                            <User size={8} className="text-purple-500" />
                            <span>Assigned By : {(order as any).designing.work_assign.assigned_to}</span>
                          </div>
                        )}
                        {selectedStage === 'packaging' && (order as any).packaging?.packaging_logistics?.crafted_by_multiple?.length > 0 && (
                          <div className="flex items-center gap-1 text-[8px] font-black text-slate-500 tracking-tight mt-1 self-start">
                            <User size={8} className="text-purple-500" />
                            <span>Assigned By : {(order as any).packaging.packaging_logistics.crafted_by_multiple.join(', ')}</span>
                          </div>
                        )}
                        {selectedStage === 'delivery' && (order as any).dispatch_delivery?.dispatch_mode?.signature_name && (
                          <div className="flex items-center gap-1 text-[8px] font-black text-slate-500 tracking-tight mt-1 self-start">
                            <User size={8} className="text-purple-500" />
                            <span>Assigned By : {(order as any).dispatch_delivery.dispatch_mode.signature_name}</span>
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col items-end gap-1">
                          <div className={`order-status-badge ${getStatusColor(getStageStatus(order) || order.resolved_status)}`}>
                          {getStageStatus(order) || order.resolved_status || 'Waiting'}
                        </div>
                        {order.delivery_date && (
                          <div className="flex items-center gap-1 px-2 py-0.5 rounded-md text-[8px] font-black bg-emerald-50 text-emerald-600 border border-emerald-100 uppercase tracking-tight shadow-sm">
                            <Calendar size={8} className="text-emerald-600" /> {formatSimpleDate(order.delivery_date)}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex justify-between items-center w-full gap-3">
                      <div className="order-details-text">
                        <h3 className="customer-name">
                          {order.customer_name || (order as any).customer_details?.name || 'New Client'}
                        </h3>
                        <div className="flex flex-wrap items-center gap-2 mt-1">
                          {getAssignedDate(order) && (
                            <div className="flex items-center gap-1 text-[9px] font-bold text-slate-500">
                              <span>{getAssignedDateLabel(order)}:</span>
                              {(() => {
                                const badgeStyle = getStageDateBadgeStyle(selectedStage);
                                return (
                                  <div className={`flex items-center gap-1 px-2 py-0.5 rounded-md text-[8px] font-black border uppercase tracking-tight shadow-sm ${badgeStyle.bg}`}>
                                    <Calendar size={8} className={badgeStyle.iconColor} />
                                    <span>{getAssignedDate(order)}</span>
                                  </div>
                                );
                              })()}
                            </div>
                          )}
                          
                          {selectedStage === 'client-information' && order.client_information?.order_details?.order_placed_in && (
                            <div className={`flex items-center gap-1 px-2 py-0.5 rounded-md text-[8px] font-black border uppercase tracking-tight shadow-sm ${getBranchColor(order.client_information.order_details.order_placed_in)}`}>
                              {order.client_information.order_details.order_placed_in}
                            </div>
                          )}
                          
                          {selectedStage === 'designing' && getDeadlineHours(order) && (
                            <div className="flex items-center gap-1 bg-rose-50 px-2 py-1 rounded-md text-[9px] font-black text-rose-600 border border-rose-100 tracking-tight">
                              <Clock size={8} /> {getDeadlineHours(order)}
                            </div>
                          )}
                        </div>
                      </div>

                      {selectedStage !== 'designing' && (
                        <div className="order-amount">₹{Number((order as any).total_amount || 0).toLocaleString()}</div>
                      )}
                    </div>

                    {(() => {
                      if (selectedStage !== 'client-information') return null;
                      
                      const totalQty = (order as any).client_information?.card_specs?.quantity || (order as any).total_quantity;
                      const cardOptions = (order as any).client_information?.card_specs?.card_options;
                      
                      if (!totalQty && !cardOptions) return null;
                      
                      return (
                        <div className="mt-2 space-y-1.5 text-[9px] font-bold text-slate-500">
                          {totalQty && (
                            <div className="flex flex-wrap items-center justify-between gap-2 pt-0.5 w-full">
                              <div className="flex items-center gap-1">
                                <span>Total Qty:</span>
                                <span className="text-blue-600 font-extrabold">{totalQty}</span>
                              </div>
                            </div>
                          )}
                          {cardOptions && (
                            <div className="flex flex-wrap items-center gap-1 pt-1">
                              <span className="text-slate-400">Add On:</span>
                              {cardOptions.split(',').map((opt: string, i: number) => (
                                <span key={i} className="px-1.5 py-0.5 rounded bg-[#3cc0c2]/10 text-[#3cc0c2] text-[8px] font-bold border border-[#3cc0c2]/20 whitespace-nowrap">
                                  {opt.trim()}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })()}

                    {(() => {
                      if (selectedStage !== 'printing') return null;
                      
                      const hasPrinter = !!(order as any).printing?.printing_status?.company_name;
                      const isReprint = !!(order as any).printing?.printing_status?.is_reprint;
                      
                      const statusObj = (order as any).printing?.printing_status;
                      const activeTypes = (order as any).client_information?.card_specs?.type?.split(',').filter(Boolean) || [];
                      
                      let sentDate = null;
                      let rcvdDate = null;
                      for (const type of activeTypes) {
                        if (statusObj?.[`${type}_sent_to_print_date`]) {
                          sentDate = statusObj[`${type}_sent_to_print_date`];
                          rcvdDate = statusObj[`${type}_delivery_date`];
                          break;
                        }
                      }

                      if (!sentDate && statusObj) {
                        const keys = Object.keys(statusObj);
                        const sentKey = keys.find(k => k.endsWith('_sent_to_print_date'));
                        if (sentKey) {
                          sentDate = statusObj[sentKey];
                          const prefix = sentKey.replace('_sent_to_print_date', '');
                          rcvdDate = statusObj[`${prefix}_delivery_date`];
                        }
                      }
                      
                      const hasSentDate = !!(sentDate && formatSimpleDate(sentDate) !== 'N/A');
                      const hasRcvdDate = !!(rcvdDate && formatSimpleDate(rcvdDate) !== 'N/A');
                      
                      if (!hasPrinter && !isReprint && !hasSentDate && !hasRcvdDate) {
                        return null;
                      }
                      
                      let printDaysText = null;
                      if (sentDate && hasSentDate) {
                        const startDate = new Date(sentDate);
                        startDate.setHours(0, 0, 0, 0);
                        const endDate = rcvdDate && hasRcvdDate ? new Date(rcvdDate) : new Date();
                        endDate.setHours(0, 0, 0, 0);
                        const diff = Math.floor((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
                        printDaysText = `${diff >= 0 ? diff : 0} Days`;
                      }

                      return (
                        <div className="mt-2 pt-2 border-t border-dashed border-slate-100 space-y-1.5 text-[9px] font-bold">
                          {/* Line 1: Printer, Reprint */}
                          {(hasPrinter || isReprint) && (
                            <div className="flex flex-wrap items-center gap-2">
                              {hasPrinter && (
                                <div className="flex items-center gap-1 text-slate-600 bg-slate-50 px-1.5 py-0.5 rounded border border-slate-100">
                                  <Building2 size={8} className="text-[#3cc0c2]" />
                                  <span>{(order as any).printing.printing_status.company_name}</span>
                                </div>
                              )}

                              {isReprint && (
                                <div className="flex items-center gap-1 bg-rose-50 text-rose-600 border border-rose-100 px-1.5 py-0.5 rounded text-[7px] font-black uppercase tracking-wider">
                                  <AlertCircle size={7} strokeWidth={3} />
                                  <span>Reprint</span>
                                </div>
                              )}
                            </div>
                          )}

                          {/* Line 2: Sent to Print, Received, Days */}
                          {(hasSentDate || hasRcvdDate) && (
                            <div className="flex flex-wrap items-center justify-between gap-2 text-slate-500 border-t border-slate-50/50 pt-1.5 w-full">
                              {hasSentDate && (
                                <div className="flex items-center gap-1">
                                  <span>Sent:</span>
                                  <span className="text-blue-600 font-extrabold">{formatSimpleDate(sentDate)}</span>
                                </div>
                              )}
                              
                              {hasRcvdDate && (
                                <div className="flex items-center gap-1">
                                  <span>Received:</span>
                                  <span className="text-blue-600 font-extrabold">{formatSimpleDate(rcvdDate)}</span>
                                </div>
                              )}

                              {printDaysText && (
                                <div className="bg-amber-50 text-amber-700 border border-amber-100 px-1 py-0.2 rounded text-[7px] font-black ml-auto">
                                  {printDaysText}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })()}

                    {(() => {
                      if (selectedStage !== 'packaging') return null;
                      
                      const logistics = (order as any).packaging?.packaging_logistics;
                      const cardOptions = (order as any).client_information?.card_specs?.card_options;
                      
                      const totalQty = (order as any).total_quantity || null;
                      const packedQty = logistics?.qty_cards || null;
                      
                      if (!totalQty && !packedQty && !cardOptions) return null;
                      
                      return (
                        <div className="mt-2 pt-2 border-t border-dashed border-slate-100 space-y-1.5 text-[9px] font-bold text-slate-500">
                          {/* Total Qty, Packed Qty */}
                          {(totalQty || packedQty) && (
                            <div className="flex flex-wrap items-center justify-between gap-2 pt-0.5 w-full">
                              {totalQty && (
                                <div className="flex items-center gap-1">
                                  <span>Total Qty:</span>
                                  <span className="text-blue-600 font-extrabold">{totalQty}</span>
                                </div>
                              )}
                              
                              {packedQty && (
                                <div className="flex items-center gap-1">
                                  <span>Packed Qty:</span>
                                  <span className="text-emerald-700 font-extrabold">{packedQty}</span>
                                </div>
                              )}
                            </div>
                          )}
                          
                          {cardOptions && (
                            <div className="flex flex-wrap items-center gap-1 pt-1">
                              <span className="text-slate-400">Add On:</span>
                              {cardOptions.split(',').map((opt: string, i: number) => (
                                <span key={i} className="px-1.5 py-0.5 rounded bg-[#3cc0c2]/10 text-[#3cc0c2] text-[8px] font-bold border border-[#3cc0c2]/20 whitespace-nowrap">
                                  {opt.trim()}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })()}

                    {(() => {
                      if (selectedStage !== 'delivery') return null;
                      
                      const deliveryObj = (order as any).dispatch_delivery;
                      if (!deliveryObj) return null;
                      
                      const mode = deliveryObj.dispatch_mode?.modes;
                      const giftType = deliveryObj.dispatch_mode?.gift_type;
                      const assignedDate = deliveryObj.dispatch_mode?.dispatch_details_date 
                        ? formatSimpleDate(deliveryObj.dispatch_mode.dispatch_details_date) 
                        : null;
                      
                      if (!mode && !giftType && !assignedDate) return null;
                      
                      const hasGift = giftType === 'with_gift';
                      
                      return (
                        <div className="mt-2 pt-2 border-t border-dashed border-slate-100 space-y-1.5 text-[9px] font-bold text-slate-500">
                          {/* Line 1: Mode of Dispatch, Gift Option */}
                          {(mode || giftType) && (
                            <div className="flex flex-wrap items-center gap-2">
                              {mode && (
                                <div className="flex items-center gap-1 text-slate-600 bg-slate-50 px-1.5 py-0.5 rounded border border-slate-100">
                                  <Truck size={8} className="text-blue-500" />
                                  <span>Dispatch: <span className="font-extrabold">{mode}</span></span>
                                </div>
                              )}
                              
                              {giftType && (
                                <div className={`flex items-center gap-1 px-1.5 py-0.5 rounded border ${
                                  hasGift 
                                    ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
                                    : 'bg-slate-50 text-slate-400 border-slate-100'
                                }`}>
                                  <Gift size={8} className={hasGift ? 'text-emerald-500' : 'text-slate-300'} />
                                  <span>{hasGift ? 'With Gift' : 'Without Gift'}</span>
                                </div>
                              )}
                            </div>
                          )}
                          
                          {/* Line 2: Assigned Date */}
                          {assignedDate && (
                            <div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-50/50 pt-1.5 w-full">
                              <div className="flex items-center gap-1">
                                <span>Assigned Date:</span>
                                <span className="text-rose-600 font-extrabold">{assignedDate}</span>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })()}
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
