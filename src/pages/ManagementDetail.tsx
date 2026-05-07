import React, { useEffect, useState } from 'react';
import {
  IonContent,
  IonPage,
  IonSpinner,
  IonToast,
} from '@ionic/react';
import { useParams, useHistory, useLocation } from 'react-router-dom';
import { 
  ChevronLeft, 
  User, 
  ClipboardList, 
  Edit2,
  CreditCard,
  Settings,
  Sparkles,
  Compass,
  FileSearch,
  ChevronDown,
  Palette,
  Printer,
  Box,
  Truck,
  Clock,
  Layout,
  Layers,
  FileText,
  CheckCircle2,
  ExternalLink,
  Building2,
  AlertCircle,
  History,
  Check,
  Calendar as CalendarIcon,
  Smartphone,
  Download,
  Scissors,
  Mail,
  Smile,
  Tag as TagIcon,
  Gift,
  Plus,
  Type,
  Hash,
  MapPin,
  Building,
  Bus,
  Phone,
  MessageCircle,
  Signature
} from 'lucide-react';
import api from '../api/api';
import './OrderDetail.css'; 
import './ManagementEdit.css';
import './ManagementDetail.css';

interface ManagementOrder {
  id: number;
  order_number: string;
  customer_name: string;
  status: string;
  resolved_status: string;
  total_amount: any;
  order_date: string;
  delivery_date?: string;
  client_information?: any;
  designing?: any;
  printing?: any;
  packaging?: any;
  dispatch_delivery?: any;
  customer_details?: any;
  total_quantity?: number | string;
}

const ManagementDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const history = useHistory();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const stage = queryParams.get('stage') || 'client-information';

  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState<ManagementOrder | null>(null);
  const [updating, setUpdating] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  
  // Track status dropdown
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  useEffect(() => {
    fetchOrder();
  }, [id, stage]);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/orders/${id}`);
      if (response.data.success) {
        setOrder(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching order:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (newStatus: string) => {
    try {
      setUpdating(true);
      const payload = new FormData();
      payload.append('_method', 'PUT');
      payload.append('status', newStatus);
      
      const response = await api.post(`/orders/${id}/stages/${stage}`, payload);
      if (response.data.success) {
        setToastMessage(`Status updated to ${newStatus}`);
        setShowToast(true);
        fetchOrder();
      }
    } catch (error) {
      console.error('Error updating status:', error);
      setToastMessage('Failed to update status');
      setShowToast(true);
    } finally {
      setUpdating(false);
      setOpenDropdown(null);
    }
  };

  const getStageStatus = (order: any, currentStage: string) => {
    switch (currentStage) {
      case 'client-information': return order.client_information?.status || 'Pending';
      case 'designing': return order.designing?.status || 'Pending';
      case 'printing': return order.printing?.status || 'Pending';
      case 'packaging': return order.packaging?.status || 'Pending';
      case 'delivery': return order.dispatch_delivery?.status || 'Pending';
      default: return 'Pending';
    }
  };

  if (loading) return null;

  const status = getStageStatus(order, stage);
  const activeTypes = order?.client_information?.card_specs?.type?.split(',').filter(Boolean) || [];
  const typeLabels: any = {
    customize: 'Customize Card',
    semi_customize: 'Semi – Customize Card',
    ready_made: 'Ready Made Card',
    digital_local: 'Digital Local'
  };

  return (
    <IonPage className="order-detail-page">
      <IonContent fullscreen>
        <div className="order-detail-container pb-10">
          
          {/* Header Hero */}
          <div className="header-hero">
            <div className="flex justify-between items-center mb-4">
              <button onClick={() => history.goBack()} className="back-btn-float">
                <ChevronLeft size={24} />
              </button>
              <button 
                onClick={() => history.push(`/management/${id}/edit?stage=${stage}`)} 
                className="header-edit-btn"
              >
                <Edit2 size={12} />
                EDIT
              </button>
            </div>
            <div className="header-meta">
              <div className="order-title-group">
                <p>Order Reference</p>
                <h1>#{order?.order_number}</h1>
              </div>
              <div className="header-amount-box">
                <span className="label">Total Amount</span>
                <span className="amount">₹{Number(order?.total_amount || 0).toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* STAGE HEADER */}
          <div className="detail-card">
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-50">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-teal-50 text-teal-600">
                  {stage === 'client-information' && <FileSearch size={20} />}
                  {stage === 'designing' && <Palette size={20} />}
                  {stage === 'printing' && <Printer size={20} />}
                  {stage === 'packaging' && <Box size={20} />}
                  {stage === 'delivery' && <Truck size={20} />}
                </div>
                <h3 className="text-[0.82rem] font-bold text-slate-800 uppercase tracking-wider">
                  {stage.replace(/-/g, ' ')}
                </h3>
              </div>

              {/* Status Dropdown Badge */}
              <div className="relative">
                <div 
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-teal-100 bg-teal-50/30 cursor-pointer transition-all active:scale-95`}
                  onClick={() => setOpenDropdown(openDropdown === 'status' ? null : 'status')}
                >
                  {updating ? (
                    <IonSpinner name="crescent" size="small" style={{ width: '12px', height: '12px' }} />
                  ) : (
                    <>
                      <span className="text-[10px] font-black text-teal-600 uppercase tracking-wider">{status}</span>
                      <ChevronDown size={10} className={`text-teal-600 transition-transform duration-300 ${openDropdown === 'status' ? 'rotate-180' : ''}`} />
                    </>
                  )}
                </div>
                {openDropdown === 'status' && (
                  <>
                    <div className="dropdown-backdrop" onClick={() => setOpenDropdown(null)} />
                    <div className="custom-dropdown-list shadow-2xl" style={{ top: '35px', width: '120px', right: 0, left: 'auto' }}>
                      {['Pending', 'Process', 'Completed'].map(s => (
                        <div key={s} className={`dropdown-item text-[11px] py-2.5 ${status === s ? 'active' : ''}`} onClick={() => handleStatusUpdate(s)}>{status === s ? 'Selected' : s}</div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* STAGE SPECIFIC VIEW FIELDS */}
            {stage === 'client-information' && (
              <>
                <div className="mb-8">
                  <div className="section-title"><ClipboardList size={14} /> Order Information</div>
                  <div className="space-y-4">
                    <div className="input-group">
                      <label className="input-label">Order No</label>
                      <div className="input-field-wrapper readonly"><div className="view-text">#{order?.order_number}</div></div>
                    </div>
                    <div className="input-group">
                      <label className="input-label">Order Date</label>
                      <div className="input-field-wrapper readonly">
                        <div className="view-text">{order?.order_date ? new Date(order.order_date).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '-') : 'N/A'}</div>
                      </div>
                    </div>
                    <div className="input-group">
                      <label className="input-label">Order Taken By</label>
                      <div className="input-field-wrapper readonly"><div className="view-text">{order?.client_information?.order_details?.order_taken_by || 'N/A'}</div></div>
                    </div>
                    <div className="input-group">
                      <label className="input-label">Delivery Date</label>
                      <div className="input-field-wrapper readonly"><div className="view-text">{order?.client_information?.order_details?.expected_delivery_date || 'N/A'}</div></div>
                    </div>
                    <div className="input-group">
                      <label className="input-label">Order Placed In</label>
                      <div className="input-field-wrapper readonly"><div className="view-text">{order?.client_information?.order_details?.order_placed_in || 'N/A'}</div></div>
                    </div>
                    <div className="input-group">
                      <label className="input-label">Reference</label>
                      <div className="input-field-wrapper readonly"><div className="view-text">{order?.client_information?.order_details?.reference || 'N/A'}</div></div>
                    </div>
                    {order?.client_information?.order_details?.remarks && (
                      <div className="input-group">
                        <label className="input-label">Remarks</label>
                        <div className="input-field-wrapper readonly" style={{ minHeight: '60px' }}>
                          <div className="view-text">{order?.client_information?.order_details?.remarks}</div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mb-8">
                  <div className="section-title"><User size={14} /> Client Information</div>
                  <div className="space-y-4">
                    <div className="input-group">
                      <label className="input-label">Name</label>
                      <div className="input-field-wrapper readonly"><div className="view-text">{order?.client_information?.client_info?.name || order?.customer_details?.name || 'N/A'}</div></div>
                    </div>
                    <div className="input-group">
                      <label className="input-label">Place (Address)</label>
                      <div className="input-field-wrapper readonly"><div className="view-text">{order?.client_information?.client_info?.address || order?.customer_details?.address || 'N/A'}</div></div>
                    </div>
                    <div className="input-group">
                      <label className="input-label">Contact No</label>
                      <div className="input-field-wrapper readonly"><div className="view-text">{order?.client_information?.client_info?.phone || order?.customer_details?.phone || 'N/A'}</div></div>
                    </div>
                    <div className="input-group">
                      <label className="input-label">Occasion</label>
                      <div className="input-field-wrapper readonly"><div className="view-text">{order?.client_information?.client_info?.occasion || 'N/A'}</div></div>
                    </div>
                  </div>
                </div>

                <div className="mb-8">
                  <div className="section-title"><CreditCard size={14} /> Card Specifications</div>
                  <div className="space-y-6">
                    {/* Product Type Tags */}
                    <div className="flex flex-wrap gap-2">
                      {order?.client_information?.card_specs?.type?.split(',').filter(Boolean).map((t: string) => (
                        <span key={t} className="type-tag bg-teal-500 text-white border-0">{typeLabels[t] || t}</span>
                      ))}
                      {(!order?.client_information?.card_specs?.type) && <span className="text-[10px] text-slate-400 italic">No product type specified</span>}
                    </div>

                    <div className="space-y-4">
                      <div className="input-group">
                        <label className="input-label">Card Size</label>
                        <div className="input-field-wrapper readonly"><div className="view-text">{order?.client_information?.card_specs?.card_size || 'N/A'}</div></div>
                      </div>
                      <div className="input-group">
                        <label className="input-label">Quantity</label>
                        <div className="input-field-wrapper readonly"><div className="view-text font-bold text-teal-600">{order?.client_information?.card_specs?.quantity || order?.total_quantity || 'N/A'}</div></div>
                      </div>
                      <div className="input-group">
                        <label className="input-label">Detailed Specifications</label>
                        <div className="specs-box">{order?.client_information?.card_specs?.specifications || 'No detailed specifications provided'}</div>
                      </div>
                    </div>

                    {/* Paper & Finish View */}
                    <div className="p-5 bg-slate-50/50 rounded-3xl border border-slate-100 space-y-4">
                      <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2 mb-2">
                        <Sparkles size={12} /> Paper & Finish
                      </h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="view-group">
                          <label>Inner GSM</label>
                          <p>{order?.client_information?.card_specs?.inner_gsm || 'N/A'}</p>
                        </div>
                        <div className="view-group">
                          <label>Env. GSM</label>
                          <p>{order?.client_information?.card_specs?.envelope_gsm || 'N/A'}</p>
                        </div>
                        <div className="view-group">
                          <label>Card Lam.</label>
                          <p className="capitalize">{order?.client_information?.card_specs?.card_lamination || 'none'}</p>
                        </div>
                        <div className="view-group">
                          <label>Env. Lam.</label>
                          <p className="capitalize">{order?.client_information?.card_specs?.envelope_lamination || 'none'}</p>
                        </div>
                      </div>
                    </div>

                    {/* Additional Options View */}
                    <div>
                      <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2 mb-3">
                        <Plus size={12} /> Additional Options
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {order?.client_information?.card_specs?.card_options?.split(',').filter(Boolean).map((opt: string) => (
                          <div key={opt} className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-100 rounded-full shadow-sm">
                            <div className="w-1.5 h-1.5 rounded-full bg-teal-500"></div>
                            <span className="text-[10px] font-bold text-slate-700">{opt}</span>
                          </div>
                        ))}
                        {(!order?.client_information?.card_specs?.card_options) && <span className="text-[10px] text-slate-400 italic">No additional options selected</span>}
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {stage === 'designing' && (
              <div className="space-y-8">
                {/* 1. PROCESS STATUS VIEW */}
                <div>
                  <div className="section-title"><Layout size={14} /> Process Status</div>
                  <div className="grid grid-cols-2 gap-3 mt-4">
                    {[
                      { key: 'content_received', label: 'Content Received' },
                      { key: 'content_not_received', label: 'Content Not Received' },
                      { key: 'clear_content', label: 'Clear Content' },
                      { key: 'tag', label: 'Tag' },
                      { key: 'need_pdf', label: 'Need PDF' }
                    ].map(p => (
                      <div key={p.key} 
                        className={`flex items-center gap-2 py-2.5 px-3 rounded-2xl border text-[10px] font-black uppercase tracking-wider ${order?.designing?.process_status?.[p.key] ? 'bg-teal-500 border-teal-500 text-white shadow-md shadow-teal-100' : 'bg-white border-slate-50 text-slate-300'}`}
                      >
                        {order?.designing?.process_status?.[p.key] && <CheckCircle2 size={12} />}
                        {p.label}
                      </div>
                    ))}
                  </div>
                </div>

                {/* 2. WORK ASSIGNMENT VIEW */}
                <div>
                  <div className="section-title"><Clock size={14} /> Work Assignment</div>
                  <div className="space-y-4 mt-4">
                    <div className="grid grid-cols-1 gap-4">
                      <div className="input-group">
                        <label className="input-label">Assigned To</label>
                        <div className="input-field-wrapper readonly"><div className="view-text">{order?.designing?.work_assign?.assigned_to || 'Not Assigned'}</div></div>
                      </div>
                      <div className="input-group">
                        <label className="input-label">Deadline</label>
                        <div className="input-field-wrapper readonly"><div className="view-text font-bold text-rose-500">{order?.designing?.work_assign?.deadline || 'No deadline'}</div></div>
                      </div>
                      <div className="input-group">
                        <label className="input-label">Completed By</label>
                        <div className="input-field-wrapper readonly"><div className="view-text">{order?.designing?.work_assign?.completed_by || 'Not Completed'}</div></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 3. DESIGN DETAILS VIEW */}
                <div>
                  <div className="section-title"><Palette size={14} /> Design Details</div>
                  <div className="space-y-6 mt-4">
                    <div className="input-group">
                      <label className="input-label">Design Outputs</label>
                      <div className="input-field-wrapper readonly" style={{ minHeight: '40px' }}>
                        <div className="view-text">{order?.designing?.design_details?.outputs || 'None'}</div>
                      </div>
                    </div>
                    <div className="input-group">
                      <label className="input-label">Print & Add-ons</label>
                      <div className="input-field-wrapper readonly" style={{ minHeight: '60px' }}>
                        <div className="view-text">{order?.designing?.design_details?.add_ons || 'None'}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {stage === 'printing' && (
              <div className="space-y-8">
                {/* 1. ORDER & PRINTING STATUS VIEW */}
                <div>
                  <div className="section-title"><Printer size={14} /> Order & Printing Status</div>
                  <div className="space-y-4 mt-4">
                    <div className="input-group">
                      <label className="input-label">Confirmed Date</label>
                      <div className="input-field-wrapper readonly"><div className="view-text">{order?.printing?.printing_status?.confirmed_date || 'N/A'}</div></div>
                    </div>
                    <div className="input-group">
                      <label className="input-label">Printer Company Name</label>
                      <div className="input-field-wrapper readonly flex items-center gap-2">
                        <Building2 size={14} className="text-slate-400" />
                        <div className="view-text">{order?.printing?.printing_status?.company_name || 'N/A'}</div>
                      </div>
                    </div>
                    {/* Status Pills */}
                    <div className="flex flex-wrap gap-2 mt-4">
                      {[
                        { key: 'readymade_ordered', label: 'Ordered' },
                        { key: 'readymade_sub_received', label: 'Card Received' },
                        { key: 'readymade_sent_to_print', label: 'Sent to Print' }
                      ].map(p => (
                        <div key={p.key} 
                          className={`flex-1 min-w-[100px] flex items-center justify-center py-3.5 px-3 rounded-2xl border text-[11px] font-black uppercase tracking-wider ${order?.printing?.printing_status?.[p.key] ? 'bg-teal-500 border-teal-500 text-white shadow-lg shadow-teal-100' : 'bg-white border-slate-50 text-slate-300'}`}
                        >
                          {p.label}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 2. DYNAMIC CARD TYPE SECTIONS VIEW */}
                {activeTypes.map(type => (
                  <div key={type} className="p-6 bg-slate-50/50 rounded-[2rem] border border-slate-100 space-y-6">
                    <h4 className="font-bold text-slate-800 flex items-center gap-2">
                      {type === 'customize' && <Palette size={16} className="text-teal-600" />}
                      {type === 'semi_customize' && <Edit2 size={16} className="text-teal-600" />}
                      {type === 'ready_made' && <Box size={16} className="text-teal-600" />}
                      {type === 'digital_local' && <Smartphone size={16} className="text-teal-600" />}
                      {typeLabels[type] || type}
                    </h4>

                    <div className="space-y-4">
                      <div className="input-group">
                        <label className="input-label text-[10px]">Sent to Print</label>
                        <div className="input-field-wrapper readonly bg-white"><div className="view-text text-[11px]">{order?.printing?.printing_status?.[`${type}_sent_to_print_date`] || 'N/A'}</div></div>
                      </div>
                      <div className="input-group">
                        <label className="input-label text-[10px]">Delivery Date</label>
                        <div className="input-field-wrapper readonly bg-white"><div className="view-text text-[11px] font-bold text-teal-600">{order?.printing?.printing_status?.[`${type}_delivery_date`] || 'N/A'}</div></div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase tracking-wider text-slate-400">Follow Up History</label>
                      <div className="space-y-3">
                        {[1, 2, 3, 4, 5, 6, 7].map(day => {
                          const note = order?.printing?.printing_status?.[`${type}_day_${day}_notes`];
                          if (!note && !order?.printing?.printing_status?.[`${type}_follow_up`]?.split(',').includes(`Day ${day}`)) return null;
                          return (
                            <div key={day} className="p-3 rounded-2xl bg-white border border-slate-100 shadow-sm flex items-start gap-3">
                              <div className={`w-6 h-6 rounded-lg flex-shrink-0 flex items-center justify-center ${order?.printing?.printing_status?.[`${type}_follow_up`]?.split(',').includes(`Day ${day}`) ? 'bg-teal-500 text-white' : 'bg-slate-100 text-slate-400'}`}>
                                <span className="text-[10px] font-bold">{day}</span>
                              </div>
                              <div className="flex-1">
                                <div className="text-[11px] text-slate-600 font-medium leading-relaxed">
                                  {note || <span className="text-slate-300 italic">No notes recorded</span>}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                        {!(order?.printing?.printing_status?.[`${type}_follow_up`]) && <div className="text-[10px] text-slate-400 italic">No follow-up history available</div>}
                      </div>
                    </div>
                  </div>
                ))}

                {/* 3. ISSUES & DELAY VIEW */}
                <div>
                  <div className="section-title"><AlertCircle size={14} /> Issues & Delay</div>
                  <div className="space-y-4 mt-4">
                    <div className="input-group">
                      <label className="input-label">Any Printing Issues</label>
                      <div className="input-field-wrapper readonly" style={{ minHeight: '40px' }}>
                        <div className="view-text italic text-rose-500">{order?.printing?.printing_status?.printing_issues || 'None'}</div>
                      </div>
                    </div>
                    <div className="input-group">
                      <label className="input-label">Delay Reason</label>
                      <div className="input-field-wrapper readonly" style={{ minHeight: '40px' }}>
                        <div className="view-text italic text-amber-600">{order?.printing?.printing_status?.delay_reason || 'None'}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {stage === 'packaging' && (
              <div className="space-y-8">
                {/* 1. LOGISTICS STATUS VIEW */}
                <div className="bg-slate-50/50 rounded-3xl p-6 border border-slate-100 space-y-6">
                  <h3 className="section-title"><Box size={14} /> Logistics Status</h3>
                  <div className="grid grid-cols-1 gap-4">
                    <div className={`p-4 rounded-2xl border ${order?.packaging?.packaging_logistics?.card_received ? 'bg-teal-500 border-teal-500 text-white shadow-lg' : 'bg-white border-slate-100 text-slate-400'}`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Download size={16} />
                          <span className="text-xs font-bold uppercase tracking-wider">Card Received</span>
                        </div>
                        {order?.packaging?.packaging_logistics?.card_received && <CheckCircle2 size={16} />}
                      </div>
                      {order?.packaging?.packaging_logistics?.card_received && order?.packaging?.packaging_logistics?.card_received_date && (
                        <div className="mt-2 text-[10px] font-medium opacity-80 flex items-center gap-1">
                          <CalendarIcon size={10} /> Received on {order.packaging.packaging_logistics.card_received_date}
                        </div>
                      )}
                    </div>
                    <div className={`p-4 rounded-2xl border ${order?.packaging?.packaging_logistics?.crafting_done ? 'bg-teal-500 border-teal-500 text-white shadow-lg' : 'bg-white border-slate-100 text-slate-400'}`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Scissors size={16} />
                          <span className="text-xs font-bold uppercase tracking-wider">Crafting Done</span>
                        </div>
                        {order?.packaging?.packaging_logistics?.crafting_done && <CheckCircle2 size={16} />}
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. ASSIGNMENT & COMPLETION VIEW */}
                <div className="bg-slate-50/50 rounded-3xl p-6 border border-slate-100 space-y-6">
                  <h3 className="section-title"><User size={14} /> Assignment</h3>
                  <div className="space-y-4">
                    <div className="input-group">
                      <label className="input-label">Assigned By</label>
                      <div className="input-field-wrapper readonly bg-white"><div className="view-text">{Array.isArray(order?.packaging?.packaging_logistics?.assigned_by_multiple) ? order.packaging.packaging_logistics.assigned_by_multiple.join(', ') : 'N/A'}</div></div>
                    </div>
                    <div className="input-group">
                      <label className="input-label">Crafted By</label>
                      <div className="input-field-wrapper readonly bg-white"><div className="view-text">{Array.isArray(order?.packaging?.packaging_logistics?.crafted_by_multiple) ? order.packaging.packaging_logistics.crafted_by_multiple.join(', ') : 'N/A'}</div></div>
                    </div>
                  </div>
                </div>

                {/* 3. LOGISTICS DETAILS VIEW */}
                <div className="space-y-4">
                   <div className="input-group">
                    <label className="input-label">Names</label>
                    <div className="input-field-wrapper readonly"><div className="view-text">{order?.packaging?.packaging_logistics?.names || 'N/A'}</div></div>
                  </div>
                  <div className="input-group">
                    <label className="input-label">Date</label>
                    <div className="input-field-wrapper readonly"><div className="view-text">{order?.packaging?.packaging_logistics?.date || 'N/A'}</div></div>
                  </div>
                  <div className="input-group">
                    <label className="input-label">Qty of Cards</label>
                    <div className="input-field-wrapper readonly"><div className="view-text font-bold text-teal-600">{order?.packaging?.packaging_logistics?.qty_cards || (order as any).total_quantity || 'N/A'}</div></div>
                  </div>
                  <div className="input-group">
                    <label className="input-label">Start Time</label>
                    <div className="input-field-wrapper readonly"><div className="view-text">{order?.packaging?.packaging_logistics?.start_time || 'N/A'}</div></div>
                  </div>
                  <div className="input-group">
                    <label className="input-label">End Time</label>
                    <div className="input-field-wrapper readonly"><div className="view-text">{order?.packaging?.packaging_logistics?.end_time || 'N/A'}</div></div>
                  </div>
                </div>

                {/* 4. PACKAGING COMPONENTS VIEW */}
                <div className="bg-slate-50/50 rounded-3xl p-6 border border-slate-100 space-y-6">
                  <h3 className="section-title"><Box size={14} /> Components</h3>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { key: 'envelope', label: 'Envelope', icon: Mail },
                      { key: 'sticker', label: 'Sticker', icon: Smile },
                      { key: 'crafting', label: 'Crafting', icon: Scissors },
                      { key: 'tag', label: 'Tag', icon: TagIcon },
                      { key: 'ribbon', label: 'Ribbon', icon: Gift },
                      { key: 'others', label: 'Others', icon: Plus }
                    ].map(item => {
                      const isSelected = order?.packaging?.packaging_logistics?.selected_items?.includes(item.key);
                      return (
                        <div key={item.key} 
                          className={`flex flex-col items-center gap-2 p-3 rounded-2xl border transition-all ${isSelected ? 'bg-teal-500 border-teal-500 text-white shadow-lg' : 'bg-white border-slate-50 text-slate-200'}`}
                        >
                          <item.icon size={18} />
                          <span className="text-[9px] font-black uppercase tracking-wider">{item.label}</span>
                        </div>
                      );
                    })}
                  </div>
                  {order?.packaging?.packaging_logistics?.selected_items?.includes('others') && (
                    <div className="input-group mb-0 mt-4">
                      <label className="input-label text-[10px]">Other Items</label>
                      <div className="input-field-wrapper readonly bg-white"><div className="view-text">{order?.packaging?.packaging_logistics?.others_type || 'N/A'}</div></div>
                    </div>
                  )}
                </div>

                {/* 5. ISSUES VIEW */}
                <div className="input-group">
                  <label className="input-label">Issues in Card</label>
                  <div className="input-field-wrapper readonly" style={{ minHeight: '60px' }}>
                    <div className="view-text italic text-rose-500">{order?.packaging?.packaging_logistics?.card_issues || 'None'}</div>
                  </div>
                </div>
              </div>
            )}

            {stage === 'delivery' && (
              <div className="space-y-8">
                {/* 1. PACKAGING STATUS (In Delivery Stage) */}
                <div className="bg-slate-50/50 rounded-3xl p-6 border border-slate-100 space-y-6">
                  <h3 className="section-title"><Box size={14} /> Packaging Status</h3>
                  <div className="input-group">
                    <label className="input-label">Packed By</label>
                    <div className="input-field-wrapper readonly bg-white"><div className="view-text">{order?.dispatch_delivery?.dispatch_mode?.packed_by || 'N/A'}</div></div>
                  </div>
                  <div className="input-group">
                    <label className="input-label">Gift Option</label>
                    <div className={`flex items-center gap-2 py-2.5 px-4 rounded-2xl border ${order?.dispatch_delivery?.dispatch_mode?.gift_type ? 'bg-teal-500 border-teal-500 text-white shadow-md' : 'bg-white border-slate-50 text-slate-300'} self-start`}>
                      <Gift size={14} />
                      <span className="text-[10px] font-black uppercase">{order?.dispatch_delivery?.dispatch_mode?.gift_type === 'with_gift' ? 'With Gift' : (order?.dispatch_delivery?.dispatch_mode?.gift_type === 'without_gift' ? 'No Gift' : 'Not Selected')}</span>
                    </div>
                  </div>
                </div>

                {/* 2. DELIVERY LOCATION VIEW */}
                <div className="bg-slate-50/50 rounded-3xl p-6 border border-slate-100 space-y-6">
                  <h3 className="section-title"><MapPin size={14} /> Delivery Location</h3>
                  <div className="input-group">
                    <label className="input-label">Shop Location</label>
                    <div className="flex items-center gap-2 py-2.5 px-4 rounded-2xl bg-teal-500 text-white shadow-md self-start">
                      <Building size={14} />
                      <span className="text-[10px] font-black uppercase">{order?.dispatch_delivery?.delivery_location?.shop_location || 'NGL SHOP'}</span>
                    </div>
                  </div>
                  <div className="input-group">
                    <label className="input-label">Address</label>
                    <div className="input-field-wrapper readonly bg-white">
                      <div className="view-text">{order?.dispatch_delivery?.delivery_location?.address || 'N/A'}</div>
                    </div>
                  </div>
                </div>

                {/* 2. MODE OF DISPATCH VIEW */}
                <div className="bg-slate-50/50 rounded-3xl p-6 border border-slate-100 space-y-6">
                  <h3 className="section-title"><Truck size={14} /> Dispatch Mode</h3>
                  <div className="flex items-center gap-2 py-2.5 px-4 rounded-2xl bg-teal-500 text-white shadow-md self-start">
                    {order?.dispatch_delivery?.dispatch_mode?.modes === 'Bus' && <Bus size={14} />}
                    {order?.dispatch_delivery?.dispatch_mode?.modes === 'Courier' && <Box size={14} />}
                    {order?.dispatch_delivery?.dispatch_mode?.modes === 'Transport' && <Truck size={14} />}
                    {order?.dispatch_delivery?.dispatch_mode?.modes === 'Shop Pickup' && <Building size={14} />}
                    <span className="text-[10px] font-black uppercase">{order?.dispatch_delivery?.dispatch_mode?.modes || 'N/A'}</span>
                  </div>

                  {/* Mode Details */}
                  {order?.dispatch_delivery?.dispatch_mode?.modes === 'Bus' && (
                    <div className="space-y-3 pt-2">
                      <div className="input-group">
                        <label className="input-label">Bus No</label>
                        <div className="view-text font-bold text-slate-800">{order?.dispatch_delivery?.dispatch_details?.bus?.bus_no || 'N/A'}</div>
                      </div>
                      <div className="input-group">
                        <label className="input-label">Reaching Time</label>
                        <div className="view-text">{order?.dispatch_delivery?.dispatch_details?.bus?.reaching_time || 'N/A'}</div>
                      </div>
                      {order?.dispatch_delivery?.dispatch_details?.bus?.shared_whatsapp && (
                        <div className="flex items-center gap-1 text-green-600 text-[10px] font-bold">
                          <MessageCircle size={10} /> Shared in WhatsApp
                        </div>
                      )}
                    </div>
                  )}

                  {order?.dispatch_delivery?.dispatch_mode?.modes === 'Courier' && (
                    <div className="space-y-3 pt-2">
                      <div className="input-group">
                        <label className="input-label">Courier Name</label>
                        <div className="view-text font-bold text-slate-800">{order?.dispatch_delivery?.dispatch_details?.courier?.name || 'N/A'}</div>
                      </div>
                      <div className="input-group">
                        <label className="input-label">Tracking No</label>
                        <div className="view-text font-bold text-teal-600 uppercase">{order?.dispatch_delivery?.dispatch_details?.courier?.tracking_no || 'N/A'}</div>
                      </div>
                      {order?.dispatch_delivery?.dispatch_details?.courier?.shared_whatsapp && (
                        <div className="flex items-center gap-1 text-green-600 text-[10px] font-bold">
                          <MessageCircle size={10} /> Shared in WhatsApp
                        </div>
                      )}
                    </div>
                  )}

                   {order?.dispatch_delivery?.dispatch_mode?.modes === 'Transport' && (
                    <div className="space-y-3 pt-2">
                      <div className="input-group">
                        <label className="input-label">Transport Name</label>
                        <div className="view-text font-bold text-slate-800">{order?.dispatch_delivery?.dispatch_details?.transport?.name || 'N/A'}</div>
                      </div>
                      <div className="input-group">
                        <label className="input-label">LR Number</label>
                        <div className="view-text font-bold text-amber-600 uppercase">{order?.dispatch_delivery?.dispatch_details?.transport?.lr_number || 'N/A'}</div>
                      </div>
                      {order?.dispatch_delivery?.dispatch_details?.transport?.shared_whatsapp && (
                        <div className="flex items-center gap-1 text-green-600 text-[10px] font-bold">
                          <MessageCircle size={10} /> Shared in WhatsApp
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* 3. DISPATCH DETAILS VIEW */}
                <div className="space-y-4">
                  <div className="input-group">
                    <label className="input-label">Dispatch Date</label>
                    <div className="view-text font-bold">{order?.dispatch_delivery?.dispatch_mode?.dispatch_details_date || 'N/A'}</div>
                  </div>
                  <div className="input-group">
                    <label className="input-label">Dispatch Expense</label>
                    <div className="view-text font-black text-rose-500">₹{order?.dispatch_delivery?.dispatch_mode?.dispatch_expense || '0'}</div>
                  </div>
                  <div className="input-group">
                    <label className="input-label">Signature & Name</label>
                    <div className="view-text italic">{order?.dispatch_delivery?.dispatch_mode?.signature_name || 'N/A'}</div>
                  </div>
                </div>
              </div>
            )}
          </div>

        </div>
      </IonContent>
      <IonToast isOpen={showToast} onDidDismiss={() => setShowToast(false)} message={toastMessage} duration={2000} position="bottom" className="custom-toast" />
    </IonPage>
  );
};

export default ManagementDetail;
