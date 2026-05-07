import React, { useEffect, useState } from 'react';
import {
  IonContent,
  IonPage,
  IonSpinner,
  IonToast,
  IonInput,
  IonTextarea
} from '@ionic/react';
import { useParams, useHistory, useLocation } from 'react-router-dom';
import { 
  ChevronLeft, 
  Save, 
  User, 
  ClipboardList, 
  Edit2,
  CreditCard,
  Settings,
  Sparkles,
  Compass,
  FileSearch,
  ChevronDown,
  ChevronUp,
  Check,
  Palette,
  Printer,
  Box,
  Truck,
  Clock,
  Link as LinkIcon,
  Layout,
  Layers,
  FileText,
  Building2,
  AlertCircle,
  History,
  Smartphone,
  Scissors,
  Download,
  Mail,
  Tag as TagIcon,
  Gift,
  Plus,
  Hash,
  UserCheck,
  Smile,
  Type,
  Calendar as CalendarIcon,
  Bus,
  MapPin,
  Building,
  Phone,
  MessageCircle,
  Signature,
  Brush,
  Maximize,
  Edit3
} from 'lucide-react';
import api from '../api/api';
import './OrderDetail.css'; 
import './ManagementEdit.css';

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
}

const ManagementEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const history = useHistory();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const stage = queryParams.get('stage') || 'client-information';

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [order, setOrder] = useState<ManagementOrder | null>(null);
  const [staffOptions, setStaffOptions] = useState<string[]>([]);
  const [formData, setFormData] = useState<any>({});
  
  // Track which custom dropdown is open
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  useEffect(() => {
    fetchOrder();
    fetchStaff();
  }, [id]);

  const fetchStaff = async () => {
    try {
      const response = await api.get('/users', { params: { per_page: 100 } });
      if (response.data.success) {
        const staff = response.data.data.data
          .filter((u: any) => u.role && u.role.name.toLowerCase() !== 'user')
          .map((u: any) => u.name);
        setStaffOptions(staff);
      }
    } catch (error) {
      console.error('Error fetching staff:', error);
    }
  };

  const fetchOrder = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/orders/${id}`);
      if (response.data.success) {
        const data = response.data.data;
        setOrder(data);
        
        let initialData: any = {
          status: getStageStatus(data, stage)
        };

        if (stage === 'client-information') {
          const clientInfo = data.client_information || {};
          initialData.order_details = {
            order_taken_by: clientInfo.order_details?.order_taken_by || '',
            order_placed_in: clientInfo.order_details?.order_placed_in || '',
            expected_delivery_date: clientInfo.order_details?.expected_delivery_date || data.delivery_date || '',
            reference: clientInfo.order_details?.reference || '',
            remarks: clientInfo.order_details?.remarks || ''
          };
          const cd = data.customer_details || {};
          initialData.client_info = {
            name: clientInfo.client_info?.name || cd.name || '',
            address: clientInfo.client_info?.address || cd.address || '',
            phone: clientInfo.client_info?.phone || cd.phone || '',
            occasion: clientInfo.client_info?.occasion || ''
          };
          initialData.card_specs = {
            type: clientInfo.card_specs?.type || 'customize',
            card_size: clientInfo.card_specs?.card_size || '',
            quantity: clientInfo.card_specs?.quantity || data.total_quantity || '',
            specifications: clientInfo.card_specs?.specifications || '',
            inner_gsm: clientInfo.card_specs?.inner_gsm || '',
            envelope_gsm: clientInfo.card_specs?.envelope_gsm || '',
            card_lamination: clientInfo.card_specs?.card_lamination || 'none',
            envelope_lamination: clientInfo.card_specs?.envelope_lamination || 'none',
            card_options: clientInfo.card_specs?.card_options || ''
          };
        } else if (stage === 'designing') {
          const des = data.designing || {};
          initialData.process_status = {
            content_received: des.process_status?.content_received || false,
            content_not_received: des.process_status?.content_not_received || false,
            clear_content: des.process_status?.clear_content || false,
            tag: des.process_status?.tag || false,
            need_pdf: des.process_status?.need_pdf || false
          };
          initialData.work_assign = {
            assigned_to: des.work_assign?.assigned_to || '',
            assigned_date: des.work_assign?.assigned_date || '',
            deadline: des.work_assign?.deadline || '',
            content_by: des.work_assign?.content_by || '',
            completed_by: des.work_assign?.completed_by || '',
            completed_date: des.work_assign?.completed_date || ''
          };
          initialData.design_details = {
            outputs: des.design_details?.outputs || '',
            add_ons: des.design_details?.add_ons || ''
          };
        } else if (stage === 'printing') {
          const prnt = data.printing || {};
          const ps = prnt.printing_status || {};
          initialData.printing_status = {
            confirmed_date: ps.confirmed_date || '',
            company_name: ps.company_name || '',
            readymade_ordered: ps.readymade_ordered || false,
            readymade_sub_received: ps.readymade_sub_received || false,
            readymade_sent_to_print: ps.readymade_sent_to_print || false,
            printing_issues: ps.printing_issues || '',
            delay_reason: ps.delay_reason || ''
          };
          const cardTypes = data.client_information?.card_specs?.type?.split(',') || [];
          cardTypes.forEach((type: string) => {
            initialData.printing_status[`${type}_sent_to_print_date`] = ps[`${type}_sent_to_print_date`] || '';
            initialData.printing_status[`${type}_delivery_date`] = ps[`${type}_delivery_date`] || '';
            initialData.printing_status[`${type}_follow_up`] = ps[`${type}_follow_up`] || '';
            [1,2,3,4,5,6,7].forEach(day => {
              const key = `${type}_day_${day}_notes`;
              initialData.printing_status[key] = ps[key] || '';
            });
          });
        } else if (stage === 'packaging') {
          const pkg = data.packaging || {};
          const pl = pkg.packaging_logistics || {};
          initialData.packaging_logistics = {
            card_received: pl.card_received || false,
            card_received_date: pl.card_received_date || '',
            crafting_done: pl.crafting_done || false,
            assigned_by_multiple: pl.assigned_by_multiple || [],
            crafted_by_multiple: pl.crafted_by_multiple || [],
            names: pl.names || '',
            date: pl.date || '',
            qty_cards: pl.qty_cards || data.total_quantity || '',
            start_time: pl.start_time || '',
            end_time: pl.end_time || '',
            selected_items: pl.selected_items || [],
            others_type: pl.others_type || '',
            card_issues: pl.card_issues || ''
          };
        } else if (stage === 'delivery') {
          const del = data.dispatch_delivery || {};
          const dm = del.dispatch_mode || {};
          const dl = del.delivery_location || {};
          const dtl = del.dispatch_details || {};
          initialData.dispatch_mode = {
            modes: dm.modes || 'Courier',
            dispatch_details_date: dm.dispatch_details_date || '',
            dispatch_expense: dm.dispatch_expense || '',
            signature_name: dm.signature_name || '',
            packed_by: dm.packed_by || '',
            gift_type: dm.gift_type || null,
            start_time: dm.start_time || '',
            end_time: dm.end_time || ''
          };
          initialData.delivery_location = {
            shop_location: dl.shop_location || 'NGL SHOP',
            address: dl.address || data.customer_details?.address || ''
          };
          initialData.dispatch_details = {
            bus: dtl.bus || { bus_no: '', reaching_time: '', contact_no: '', shared_whatsapp: false },
            courier: dtl.courier || { name: '', tracking_no: '', shared_whatsapp: false },
            transport: dtl.transport || { name: '', lr_number: '', shared_whatsapp: false }
          };
        }

        setFormData(initialData);
      }
    } catch (error) {
      console.error('Error fetching order:', error);
    } finally {
      setLoading(false);
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

  const handleSave = async () => {
    try {
      setSaving(true);
      const payload = new FormData();
      payload.append('_method', 'PUT');
      payload.append('status', formData.status);

      if (stage === 'client-information') {
        payload.append('order_details', JSON.stringify(formData.order_details));
        payload.append('client_info', JSON.stringify(formData.client_info));
        payload.append('card_specs', JSON.stringify(formData.card_specs));
        await api.put(`/orders/${id}`, {
          order_date: order?.order_date,
          delivery_date: formData.order_details.expected_delivery_date
        });
      } else if (stage === 'designing') {
        payload.append('process_status', JSON.stringify(formData.process_status));
        payload.append('work_assign', JSON.stringify(formData.work_assign));
        payload.append('design_details', JSON.stringify(formData.design_details));
      } else if (stage === 'printing') {
        payload.append('printing_status', JSON.stringify(formData.printing_status));
      } else if (stage === 'packaging') {
        payload.append('packaging_logistics', JSON.stringify(formData.packaging_logistics));
      } else if (stage === 'delivery') {
        payload.append('dispatch_mode', JSON.stringify(formData.dispatch_mode));
        payload.append('delivery_location', JSON.stringify(formData.delivery_location));
        payload.append('dispatch_details', JSON.stringify(formData.dispatch_details));
      }

      const response = await api.post(`/orders/${id}/stages/${stage}`, payload);
      if (response.data.success) {
        setToastMessage('Changes saved successfully');
        setShowToast(true);
        setTimeout(() => history.goBack(), 1000);
      }
    } catch (error) {
      console.error('Error saving:', error);
      setToastMessage('Failed to save changes');
      setShowToast(true);
    } finally {
      setSaving(false);
    }
  };

  const cardOptionChoices = [
    "Sticker", "Band", "Satin Ribbon", "Rope", "Corner Cutting", "Envelope", "Insert Leaf", 
    "Buttersheet", "Tag", "Org. Ribbon", "Foiling", "Screen Printing", "UV", "SC Offset", "New Die", 
    "Dry Flower / Fresh", "Ready Seal", "Special Paper", "Custom Seal", "Pasting", "Others"
  ];

  const occasionOptions = [
    "Wedding", "Birthday", "Engagement", "Anniversary", "House Warming", "Puberty Function", "Other"
  ];

  const referenceOptions = [
    "Already Client", "Instagram", "Walk-In", "By Client", "Other"
  ];

  const placeOptions = [
    "NGL", "MTM", "TVL", "Chennai", "Online"
  ];

  const designOutputChoices = [
    "Invitation in Draft", "Buttersheet / Master", "Gift Frame", "PDF"
  ];

  // Helper for Single Select Custom Dropdown
  const CustomDropdown = ({ label, value, options, onSelect, id: dropdownId, required = false, multiple = false }: any) => {
    const isOpen = openDropdown === dropdownId;
    const selectedArray = multiple ? (Array.isArray(value) ? value : []) : [value];

    const handleItemSelect = (opt: string) => {
      if (multiple) {
        let newList;
        if (selectedArray.includes(opt)) {
          newList = selectedArray.filter(i => i !== opt);
        } else {
          newList = [...selectedArray, opt];
        }
        onSelect(newList);
      } else {
        onSelect(opt);
        setOpenDropdown(null);
      }
    };

    return (
      <div className="input-group relative">
        <label className="input-label">{label}{required && <span className="text-rose-500 ml-1 font-bold">*</span>}</label>
        <div className="custom-dropdown-trigger" onClick={() => setOpenDropdown(isOpen ? null : dropdownId)}>
          <span className="selected-value text-slate-900">
            {multiple ? (selectedArray.length > 0 ? selectedArray.join(', ') : `Select ${label}`) : (value || `Select ${label}`)}
          </span>
          <div className="dropdown-icon">{isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}</div>
        </div>
        {isOpen && (
          <>
            <div className="dropdown-backdrop" onClick={() => setOpenDropdown(null)} />
            <div className="custom-dropdown-list shadow-2xl">
              {options.map((opt: string) => (
                <div key={opt} className={`dropdown-item flex items-center justify-between ${selectedArray.includes(opt) ? 'active' : ''}`} onClick={() => handleItemSelect(opt)}>
                  {opt}
                  {multiple && selectedArray.includes(opt) && <Check size={14} />}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    );
  };

  // Helper for Checkbox Group
  const CheckboxGroup = ({ label, value, options, onSelect, required = false }: any) => {
    const selectedArray = value ? (Array.isArray(value) ? value : value.split(',').filter(Boolean)) : [];
    
    const toggleOption = (opt: string) => {
      let newArray;
      if (selectedArray.includes(opt)) {
        newArray = selectedArray.filter((s: string) => s !== opt);
      } else {
        newArray = [...selectedArray, opt];
      }
      onSelect(newArray.join(','));
    };

    return (
      <div className="space-y-4">
        <label className="input-label mb-2 block">{label}{required && <span className="text-rose-500 ml-1 font-bold">*</span>}</label>
        <div className="grid grid-cols-1 gap-2">
          {options.map((opt: string) => (
            <div key={opt} className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${selectedArray.includes(opt) ? 'bg-teal-50 border-teal-200' : 'bg-white border-slate-100'}`} onClick={() => toggleOption(opt)}>
              <div className={`w-5 h-5 rounded flex items-center justify-center border transition-all ${selectedArray.includes(opt) ? 'bg-teal-500 border-teal-500 text-white' : 'bg-white border-slate-300'}`}>
                {selectedArray.includes(opt) && <Check size={12} strokeWidth={4} />}
              </div>
              <span className={`text-sm ${selectedArray.includes(opt) ? 'text-teal-900 font-bold' : 'text-slate-600 font-medium'}`}>{opt}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  if (loading) return null;

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
                  <span className="text-[10px] font-black text-teal-600 uppercase tracking-wider">{formData.status}</span>
                  <ChevronDown size={10} className={`text-teal-600 transition-transform duration-300 ${openDropdown === 'status' ? 'rotate-180' : ''}`} />
                </div>
                {openDropdown === 'status' && (
                  <>
                    <div className="dropdown-backdrop" onClick={() => setOpenDropdown(null)} />
                    <div className="custom-dropdown-list shadow-2xl" style={{ top: '35px', width: '120px', right: 0, left: 'auto' }}>
                      {['Pending', 'Process', 'Completed'].map(s => (
                        <div key={s} className={`dropdown-item text-[11px] py-2.5 ${formData.status === s ? 'active' : ''}`} onClick={() => { setFormData({...formData, status: s}); setOpenDropdown(null); }}>{s}</div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* STAGE SPECIFIC FIELDS */}
            {stage === 'client-information' && (
              <>
                <div className="mb-8">
                  <div className="section-title"><ClipboardList size={14} /> Order Information</div>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 gap-4">
                      <div className="input-group">
                        <label className="input-label">Order No</label>
                        <div className="input-field-wrapper readonly"><div className="view-text">#{order?.order_number}</div></div>
                      </div>
                      <CustomDropdown label="Order Taken By" id="taken_by" value={formData.order_details?.order_taken_by} options={staffOptions} onSelect={(val: string) => setFormData({...formData, order_details: {...formData.order_details, order_taken_by: val}})} />
                      <div className="input-group">
                        <label className="input-label">Delivery Date<span className="text-rose-500 ml-1 font-bold">*</span></label>
                        <div className="input-field-wrapper">
                          <IonInput type="date" value={formData.order_details?.expected_delivery_date} onIonChange={e => setFormData({ ...formData, order_details: { ...formData.order_details, expected_delivery_date: e.detail.value! } })} className="custom-ion-input" />
                        </div>
                      </div>
                      <div className="space-y-3">
                        <label className="input-label">Order Placed In<span className="text-rose-500 ml-1 font-bold">*</span></label>
                        <div className="grid grid-cols-3 gap-2">
                          {placeOptions.map(place => {
                            const isSelected = formData.order_details?.order_placed_in === place;
                            return (
                              <div 
                                key={place}
                                className={`flex items-center justify-center py-3 rounded-xl border-2 transition-all cursor-pointer text-[10px] font-black uppercase tracking-wider ${isSelected ? 'bg-teal-50 border-teal-500 text-teal-700 shadow-sm' : 'bg-white border-slate-100 text-slate-400'}`}
                                onClick={() => setFormData({...formData, order_details: {...formData.order_details, order_placed_in: place}})}
                              >
                                {place}
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      <div className="space-y-3">
                        <label className="input-label">Reference<span className="text-rose-500 ml-1 font-bold">*</span></label>
                        <div className="grid grid-cols-2 gap-2">
                          {referenceOptions.map(ref => {
                            const isSelected = formData.order_details?.reference === ref;
                            return (
                              <div 
                                key={ref}
                                className={`flex items-center gap-2 p-3 rounded-xl border-2 transition-all cursor-pointer ${isSelected ? 'bg-emerald-50 border-emerald-500 text-emerald-700 shadow-sm' : 'bg-white border-slate-100 text-slate-400'}`}
                                onClick={() => setFormData({...formData, order_details: {...formData.order_details, reference: ref}})}
                              >
                                <div className={`w-3 h-3 rounded-full border-2 ${isSelected ? 'bg-emerald-500 border-emerald-500' : 'border-slate-200'}`}></div>
                                <span className={`text-[10px] font-bold ${isSelected ? 'text-emerald-900' : 'text-slate-600'}`}>{ref}</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Conditionally show Remarks if 'Other' is selected or if remarks already exist */}
                      {(formData.order_details?.reference === 'Other' || formData.order_details?.remarks) && (
                        <div className="input-group animate-in fade-in slide-in-from-top-2">
                          <label className="input-label">Remarks / Other Ref</label>
                          <div className="input-field-wrapper"><IonTextarea value={formData.order_details?.remarks} placeholder="Enter any extra details..." onIonChange={e => setFormData({ ...formData, order_details: { ...formData.order_details, remarks: e.detail.value! } })} className="custom-ion-input" /></div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mb-8">
                  <div className="section-title"><User size={14} /> Client Information</div>
                  <div className="space-y-4">
                    <div className="input-group">
                      <label className="input-label">Name<span className="text-rose-500 ml-1 font-bold">*</span></label>
                      <div className="input-field-wrapper"><IonInput value={formData.client_info?.name} onIonChange={e => setFormData({...formData, client_info: {...formData.client_info, name: e.detail.value!}})} className="custom-ion-input" /></div>
                    </div>
                    <div className="input-group">
                      <label className="input-label">Place (Address)<span className="text-rose-500 ml-1 font-bold">*</span></label>
                      <div className="input-field-wrapper">
                        <MapPin size={16} className="text-slate-400" />
                        <IonInput value={formData.client_info?.address} placeholder="Full Address" onIonChange={e => setFormData({...formData, client_info: {...formData.client_info, address: e.detail.value!}})} className="custom-ion-input" />
                      </div>
                    </div>
                    <div className="input-group">
                      <label className="input-label">Contact No<span className="text-rose-500 ml-1 font-bold">*</span></label>
                      <div className="input-field-wrapper"><IonInput value={formData.client_info?.phone} onIonChange={e => setFormData({...formData, client_info: {...formData.client_info, phone: e.detail.value!}})} className="custom-ion-input" /></div>
                    </div>
                    <CustomDropdown label="Occasion" id="occasion" value={formData.client_info?.occasion} options={occasionOptions} onSelect={(val: string) => setFormData({...formData, client_info: {...formData.client_info, occasion: val}})} />
                  </div>
                </div>

                <div className="mb-8">
                  <div className="section-title"><CreditCard size={14} /> Card Specifications</div>
                  <div className="space-y-6">
                    {/* Product Type Cards */}
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { id: 'customize', label: 'Customize Card', sub: 'Custom design', icon: Brush },
                        { id: 'semi_customize', label: 'Semi-Customize', sub: 'Semi custom', icon: Edit3 },
                        { id: 'ready_made', label: 'Ready Made', sub: 'Stock items', icon: Box },
                        { id: 'digital_local', label: 'Digital Local', sub: 'Digital only', icon: Smartphone }
                      ].map(type => {
                        const isSelected = formData.card_specs?.type?.split(',').includes(type.id);
                        return (
                          <div 
                            key={type.id}
                            className={`relative flex flex-col items-center text-center p-4 rounded-2xl border-2 transition-all cursor-pointer ${isSelected ? 'bg-teal-50 border-teal-500 shadow-md' : 'bg-white border-slate-100'}`}
                            onClick={() => {
                              let types = formData.card_specs?.type?.split(',').filter(Boolean) || [];
                              if (types.includes(type.id)) {
                                types = types.filter((t: string) => t !== type.id);
                              } else {
                                types.push(type.id);
                              }
                              setFormData({...formData, card_specs: {...formData.card_specs, type: types.join(',')}});
                            }}
                          >
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-2 ${isSelected ? 'bg-teal-500 text-white' : 'bg-slate-100 text-slate-400'}`}>
                              <type.icon size={20} />
                            </div>
                            <span className={`text-[10px] font-bold ${isSelected ? 'text-teal-900' : 'text-slate-700'}`}>{type.label}</span>
                            <span className="text-[8px] text-slate-400 mt-0.5">{type.sub}</span>
                            {isSelected && <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-teal-500"></div>}
                          </div>
                        );
                      })}
                    </div>

                    {/* Basic Specs */}
                    <div className="space-y-4">
                      <div className="input-group">
                        <label className="input-label">Card Size<span className="text-rose-500 ml-1 font-bold">*</span></label>
                        <div className="input-field-wrapper">
                          <Maximize size={16} className="text-slate-400" />
                          <IonInput value={formData.card_specs?.card_size} placeholder="e.g. 5x7 inches" onIonChange={e => setFormData({...formData, card_specs: {...formData.card_specs, card_size: e.detail.value!}})} className="custom-ion-input" />
                        </div>
                      </div>
                      <div className="input-group">
                        <label className="input-label">Quantity<span className="text-rose-500 ml-1 font-bold">*</span></label>
                        <div className="input-field-wrapper">
                          <Hash size={16} className="text-slate-400" />
                          <IonInput type="number" value={formData.card_specs?.quantity} placeholder="100" onIonChange={e => setFormData({...formData, card_specs: {...formData.card_specs, quantity: e.detail.value!}})} className="custom-ion-input" />
                        </div>
                      </div>
                      <div className="input-group">
                        <label className="input-label">Detailed Specifications<span className="text-rose-500 ml-1 font-bold">*</span></label>
                        <div className="input-field-wrapper" style={{ minHeight: '100px' }}>
                          <IonTextarea value={formData.card_specs?.specifications} placeholder="Enter requirements..." onIonChange={e => setFormData({...formData, card_specs: {...formData.card_specs, specifications: e.detail.value!}})} className="custom-ion-input" />
                        </div>
                      </div>
                    </div>

                    {/* Paper & Finish */}
                    <div className="p-5 bg-slate-50/50 rounded-3xl border border-slate-100 space-y-4">
                      <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2 mb-2">
                        <Sparkles size={12} /> Paper & Finish
                      </h4>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="input-group mb-0">
                          <label className="input-label text-[10px]">Inner GSM</label>
                          <div className="input-field-wrapper bg-white"><IonInput value={formData.card_specs?.inner_gsm} placeholder="300" onIonChange={e => setFormData({...formData, card_specs: {...formData.card_specs, inner_gsm: e.detail.value!}})} className="custom-ion-input" /></div>
                        </div>
                        <div className="input-group mb-0">
                          <label className="input-label text-[10px]">Env. GSM</label>
                          <div className="input-field-wrapper bg-white"><IonInput value={formData.card_specs?.envelope_gsm} placeholder="120" onIonChange={e => setFormData({...formData, card_specs: {...formData.card_specs, envelope_gsm: e.detail.value!}})} className="custom-ion-input" /></div>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <CustomDropdown label="Card Lam." id="card_lam" value={formData.card_specs?.card_lamination} options={['none', 'matt', 'glossy', 'velvet', 'others']} onSelect={(val: string) => setFormData({...formData, card_specs: {...formData.card_specs, card_lamination: val}})} />
                        <CustomDropdown label="Env. Lam." id="env_lam" value={formData.card_specs?.envelope_lamination} options={['none', 'matt', 'glossy', 'velvet', 'others']} onSelect={(val: string) => setFormData({...formData, card_specs: {...formData.card_specs, envelope_lamination: val}})} />
                      </div>
                    </div>

                    {/* Additional Options */}
                    <div>
                      <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2 mb-4">
                        <Plus size={12} /> Additional Options
                      </h4>
                      <div className="grid grid-cols-2 gap-2">
                        {cardOptionChoices.map(opt => {
                          const isSelected = formData.card_specs?.card_options?.split(',').includes(opt);
                          return (
                            <div 
                              key={opt}
                              className={`flex items-center gap-2 p-2.5 rounded-xl border transition-all cursor-pointer ${isSelected ? 'bg-teal-50 border-teal-200' : 'bg-white border-slate-100'}`}
                              onClick={() => {
                                let list = formData.card_specs?.card_options?.split(',').filter(Boolean) || [];
                                if (list.includes(opt)) {
                                  list = list.filter((i: string) => i !== opt);
                                } else {
                                  list.push(opt);
                                }
                                setFormData({...formData, card_specs: {...formData.card_specs, card_options: list.join(',')}});
                              }}
                            >
                              <div className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${isSelected ? 'bg-teal-500 border-teal-500 text-white' : 'bg-white border-slate-300'}`}>
                                {isSelected && <Check size={10} strokeWidth={4} />}
                              </div>
                              <span className={`text-[10px] font-bold ${isSelected ? 'text-teal-900' : 'text-slate-600'}`}>{opt}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {stage === 'designing' && (
              <div className="space-y-8">
                {/* 1. PROCESS STATUS (Pill Toggles) */}
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
                        className={`flex items-center justify-center py-3 px-2 rounded-2xl border text-[10px] font-black uppercase tracking-wider transition-all active:scale-95 cursor-pointer ${formData.process_status?.[p.key] ? 'bg-teal-500 border-teal-500 text-white shadow-lg shadow-teal-200' : 'bg-white border-slate-100 text-slate-400'}`}
                        onClick={() => {
                          let newStatus = { ...formData.process_status, [p.key]: !formData.process_status?.[p.key] };
                          if (p.key === 'content_received' && newStatus.content_received) {
                            newStatus.content_not_received = false;
                          } else if (p.key === 'content_not_received' && newStatus.content_not_received) {
                            newStatus.content_received = false;
                          }
                          setFormData({...formData, process_status: newStatus});
                        }}
                      >
                        {p.label}
                      </div>
                    ))}
                  </div>
                </div>

                {/* 2. WORK ASSIGNMENT */}
                <div>
                  <div className="section-title"><Clock size={14} /> Work Assignment</div>
                  <div className="space-y-4 mt-4">
                    <div className="grid grid-cols-1 gap-4">
                      <CustomDropdown label="Assigned To" id="assign_to" required={true} value={formData.work_assign?.assigned_to} options={staffOptions} onSelect={(val: string) => setFormData({...formData, work_assign: {...formData.work_assign, assigned_to: val}})} />
                      <div className="input-group">
                        <label className="input-label">Assigned Date<span className="text-rose-500 ml-1 font-bold">*</span></label>
                        <div className="input-field-wrapper"><IonInput type="date" value={formData.work_assign?.assigned_date} onIonChange={e => setFormData({...formData, work_assign: {...formData.work_assign, assigned_date: e.detail.value!}})} className="custom-ion-input" /></div>
                      </div>
                      <div className="input-group">
                        <label className="input-label">Deadline<span className="text-rose-500 ml-1 font-bold">*</span></label>
                        <div className="input-field-wrapper"><IonInput type="date" value={formData.work_assign?.deadline} onIonChange={e => setFormData({...formData, work_assign: {...formData.work_assign, deadline: e.detail.value!}})} className="custom-ion-input" /></div>
                      </div>
                      <CustomDropdown label="Content By" id="cont_by" required={true} value={formData.work_assign?.content_by} options={staffOptions} onSelect={(val: string) => setFormData({...formData, work_assign: {...formData.work_assign, content_by: val}})} />
                      <CustomDropdown label="Completed By" id="comp_by" required={true} value={formData.work_assign?.completed_by} options={staffOptions} onSelect={(val: string) => setFormData({...formData, work_assign: {...formData.work_assign, completed_by: val}})} />
                      <div className="input-group">
                        <label className="input-label">Completed Date<span className="text-rose-500 ml-1 font-bold">*</span></label>
                        <div className="input-field-wrapper"><IonInput type="date" value={formData.work_assign?.completed_date} onIonChange={e => setFormData({...formData, work_assign: {...formData.work_assign, completed_date: e.detail.value!}})} className="custom-ion-input" /></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 3. DESIGN DETAILS */}
                <div>
                  <div className="section-title"><Palette size={14} /> Design Details</div>
                  <div className="space-y-6 mt-4">
                    <CheckboxGroup label="Design Outputs" required={true} value={formData.design_details?.outputs} options={designOutputChoices} onSelect={(val: string) => setFormData({...formData, design_details: {...formData.design_details, outputs: val}})} />
                    <CheckboxGroup label="Print & Add-ons" value={formData.design_details?.add_ons} options={cardOptionChoices} onSelect={(val: string) => setFormData({...formData, design_details: {...formData.design_details, add_ons: val}})} />
                  </div>
                </div>
              </div>
            )}

            {stage === 'printing' && (
              <div className="space-y-8">
                {/* 1. ORDER & PRINTING STATUS */}
                <div>
                  <div className="section-title"><Printer size={14} /> Order & Printing Status</div>
                  <div className="space-y-4 mt-4">
                    <div className="input-group">
                      <label className="input-label">Confirmed Date<span className="text-rose-500 ml-1 font-bold">*</span></label>
                      <div className="input-field-wrapper"><IonInput type="date" value={formData.printing_status?.confirmed_date} onIonChange={e => setFormData({...formData, printing_status: {...formData.printing_status, confirmed_date: e.detail.value!}})} className="custom-ion-input" /></div>
                    </div>
                    <div className="input-group">
                      <label className="input-label">Printer Company Name<span className="text-rose-500 ml-1 font-bold">*</span></label>
                      <div className="input-field-wrapper flex items-center gap-2">
                        <Building2 size={14} className="text-slate-400" />
                        <IonInput value={formData.printing_status?.company_name} placeholder="Enter printer name" onIonChange={e => setFormData({...formData, printing_status: {...formData.printing_status, company_name: e.detail.value!}})} className="custom-ion-input" />
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
                          className={`flex-1 min-w-[100px] flex items-center justify-center py-3.5 px-3 rounded-2xl border text-[11px] font-black uppercase tracking-wider transition-all active:scale-95 cursor-pointer ${formData.printing_status?.[p.key] ? 'bg-teal-500 border-teal-500 text-white shadow-lg shadow-teal-100' : 'bg-white border-slate-100 text-slate-400'}`}
                          onClick={() => setFormData({...formData, printing_status: {...formData.printing_status, [p.key]: !formData.printing_status?.[p.key]}})}
                        >
                          {p.label}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 2. DYNAMIC CARD TYPE SECTIONS */}
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
                        <label className="input-label">Sent to Print Date<span className="text-rose-500 ml-1 font-bold">*</span></label>
                        <div className="input-field-wrapper bg-white"><IonInput type="date" value={formData.printing_status?.[`${type}_sent_to_print_date`]} onIonChange={e => setFormData({...formData, printing_status: {...formData.printing_status, [`${type}_sent_to_print_date`]: e.detail.value!}})} className="custom-ion-input" /></div>
                      </div>
                      <div className="input-group">
                        <label className="input-label">Delivery Date<span className="text-rose-500 ml-1 font-bold">*</span></label>
                        <div className="input-field-wrapper bg-white"><IonInput type="date" value={formData.printing_status?.[`${type}_delivery_date`]} onIonChange={e => setFormData({...formData, printing_status: {...formData.printing_status, [`${type}_delivery_date`]: e.detail.value!}})} className="custom-ion-input" /></div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase tracking-wider text-slate-400">Follow Up Checklist</label>
                      <div className="grid grid-cols-4 gap-2">
                        {[1, 2, 3, 4, 5, 6, 7].map(day => {
                          const isSelected = formData.printing_status?.[`${type}_follow_up`]?.split(',').includes(`Day ${day}`);
                          return (
                            <div key={day} 
                              className={`flex flex-col items-center justify-center p-2 rounded-xl border transition-all cursor-pointer ${isSelected ? 'bg-teal-50 border-teal-500 shadow-sm' : 'bg-white border-slate-100 opacity-50'}`}
                              onClick={() => {
                                let list = formData.printing_status?.[`${type}_follow_up`]?.split(',').filter(Boolean) || [];
                                if (list.includes(`Day ${day}`)) {
                                  list = list.filter((d: string) => d !== `Day ${day}`);
                                } else {
                                  list.push(`Day ${day}`);
                                }
                                setFormData({...formData, printing_status: {...formData.printing_status, [`${type}_follow_up`]: list.join(',')}});
                              }}
                            >
                              <span className={`text-[10px] font-black uppercase mb-1 ${isSelected ? 'text-teal-600' : 'text-slate-400'}`}>D{day}</span>
                              <div className={`w-4 h-4 rounded border flex items-center justify-center ${isSelected ? 'bg-teal-500 border-teal-500 text-white' : 'border-slate-300'}`}>
                                {isSelected && <Check size={10} strokeWidth={4} />}
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Dynamic Notes Section */}
                      <div className="space-y-3 mt-4">
                        {[1, 2, 3, 4, 5, 6, 7].map(day => {
                          if (!formData.printing_status?.[`${type}_follow_up`]?.split(',').includes(`Day ${day}`)) return null;
                          return (
                            <div key={day} className="flex flex-col gap-1.5 p-3 rounded-2xl bg-white border border-slate-100 shadow-sm">
                              <span className="text-[9px] font-black bg-teal-50 text-teal-600 px-2 py-0.5 rounded-full uppercase tracking-widest self-start">Follow-up Status (Day {day})</span>
                              <input 
                                value={formData.printing_status?.[`${type}_day_${day}_notes`]} 
                                type="text" 
                                className="w-full px-3 py-1.5 bg-slate-50 border border-slate-100 rounded-lg focus:border-teal-500 focus:bg-white focus:outline-none text-xs text-slate-700 font-medium" 
                                placeholder={`What happened on Day ${day}?`}
                                onChange={e => setFormData({...formData, printing_status: {...formData.printing_status, [`${type}_day_${day}_notes`]: e.target.value}})}
                              />
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                ))}

                {/* 3. ISSUES & DELAY */}
                <div>
                  <div className="section-title"><AlertCircle size={14} /> Issues & Delay</div>
                  <div className="space-y-4 mt-4">
                    <div className="input-group">
                      <label className="input-label">Any Printing Issues</label>
                      <div className="input-field-wrapper" style={{ minHeight: '80px' }}>
                        <IonTextarea value={formData.printing_status?.printing_issues} placeholder="Describe any issues..." onIonChange={e => setFormData({...formData, printing_status: {...formData.printing_status, printing_issues: e.detail.value!}})} className="custom-ion-input" />
                      </div>
                    </div>
                    <div className="input-group">
                      <label className="input-label">Delay Reason</label>
                      <div className="input-field-wrapper" style={{ minHeight: '80px' }}>
                        <IonTextarea value={formData.printing_status?.delay_reason} placeholder="Reason for delay..." onIonChange={e => setFormData({...formData, printing_status: {...formData.printing_status, delay_reason: e.detail.value!}})} className="custom-ion-input" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {stage === 'packaging' && (
              <div className="space-y-8">
                {/* 1. LOGISTICS STATUS */}
                <div className="bg-slate-50/50 rounded-3xl p-6 border border-slate-100 space-y-6">
                  <h3 className="section-title"><Box size={14} /> Logistics Status</h3>
                  <div className="grid grid-cols-1 gap-4">
                    {/* Card Received Card */}
                    <div className={`p-4 rounded-2xl border transition-all ${formData.packaging_logistics?.card_received ? 'bg-teal-50 border-teal-200' : 'bg-white border-slate-100'}`}>
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-xl ${formData.packaging_logistics?.card_received ? 'bg-teal-500 text-white' : 'bg-slate-100 text-slate-400'}`}>
                            <Download size={16} />
                          </div>
                          <span className="text-xs font-bold text-slate-800">Card Received</span>
                        </div>
                        <div 
                          className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${formData.packaging_logistics?.card_received ? 'bg-teal-500 border-teal-500 text-white' : 'border-slate-200 bg-white'}`}
                          onClick={() => setFormData({...formData, packaging_logistics: {...formData.packaging_logistics, card_received: !formData.packaging_logistics.card_received}})}
                        >
                          {formData.packaging_logistics?.card_received && <Check size={14} strokeWidth={4} />}
                        </div>
                      </div>
                      {formData.packaging_logistics?.card_received && (
                        <div className="input-group mb-0 animate-in fade-in slide-in-from-top-2">
                          <div className="input-field-wrapper bg-white">
                            <CalendarIcon size={14} className="text-teal-500" />
                            <IonInput type="date" value={formData.packaging_logistics?.card_received_date} onIonChange={e => setFormData({...formData, packaging_logistics: {...formData.packaging_logistics, card_received_date: e.detail.value!}})} className="custom-ion-input text-[10px]" />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Crafting Done Card */}
                    <div 
                      className={`p-4 rounded-2xl border transition-all flex items-center justify-between ${formData.packaging_logistics?.crafting_done ? 'bg-teal-50 border-teal-200' : 'bg-white border-slate-100'}`}
                      onClick={() => setFormData({...formData, packaging_logistics: {...formData.packaging_logistics, crafting_done: !formData.packaging_logistics.crafting_done}})}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-xl ${formData.packaging_logistics?.crafting_done ? 'bg-teal-500 text-white' : 'bg-slate-100 text-slate-400'}`}>
                          <Scissors size={16} />
                        </div>
                        <span className="text-xs font-bold text-slate-800">Crafting Done</span>
                      </div>
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${formData.packaging_logistics?.crafting_done ? 'bg-teal-500 border-teal-500 text-white' : 'border-slate-200 bg-white'}`}>
                        {formData.packaging_logistics?.crafting_done && <Check size={14} strokeWidth={4} />}
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. ASSIGNMENT & COMPLETION */}
                <div className="bg-slate-50/50 rounded-3xl p-6 border border-slate-100 space-y-6">
                  <h3 className="section-title"><User size={14} /> Assignment & Completion</h3>
                  <div className="space-y-4">
                    <CustomDropdown label="Assigned By" id="assigned_by" required={true} multiple={true} value={formData.packaging_logistics?.assigned_by_multiple} options={staffOptions} onSelect={(val: any) => setFormData({...formData, packaging_logistics: {...formData.packaging_logistics, assigned_by_multiple: val}})} />
                    <CustomDropdown label="Crafted By" id="crafted_by" required={true} multiple={true} value={formData.packaging_logistics?.crafted_by_multiple} options={staffOptions} onSelect={(val: any) => setFormData({...formData, packaging_logistics: {...formData.packaging_logistics, crafted_by_multiple: val}})} />
                  </div>
                </div>

                {/* 3. LOGISTICS DETAILS */}
                <div className="space-y-4">
                  <div className="input-group">
                    <label className="input-label">Names<span className="text-rose-500 ml-1 font-bold">*</span></label>
                    <div className="input-field-wrapper">
                      <Type size={16} className="text-slate-400" />
                      <IonInput value={formData.packaging_logistics?.names} placeholder="Names on cards" onIonChange={e => setFormData({...formData, packaging_logistics: {...formData.packaging_logistics, names: e.detail.value!}})} className="custom-ion-input" />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="input-group">
                      <label className="input-label">Date<span className="text-rose-500 ml-1 font-bold">*</span></label>
                      <div className="input-field-wrapper">
                        <CalendarIcon size={16} className="text-slate-400" />
                        <IonInput type="date" value={formData.packaging_logistics?.date} onIonChange={e => setFormData({...formData, packaging_logistics: {...formData.packaging_logistics, date: e.detail.value!}})} className="custom-ion-input" />
                      </div>
                    </div>
                    <div className="input-group">
                      <label className="input-label">Qty of Cards<span className="text-rose-500 ml-1 font-bold">*</span></label>
                      <div className="input-field-wrapper">
                        <Hash size={16} className="text-slate-400" />
                        <IonInput type="number" value={formData.packaging_logistics?.qty_cards} onIonChange={e => setFormData({...formData, packaging_logistics: {...formData.packaging_logistics, qty_cards: e.detail.value!}})} className="custom-ion-input" />
                      </div>
                    </div>
                    <div className="input-group">
                      <label className="input-label">Start Time</label>
                      <div className="input-field-wrapper">
                        <Clock size={16} className="text-slate-400" />
                        <IonInput type="time" value={formData.packaging_logistics?.start_time} onIonChange={e => setFormData({...formData, packaging_logistics: {...formData.packaging_logistics, start_time: e.detail.value!}})} className="custom-ion-input" />
                      </div>
                    </div>
                    <div className="input-group">
                      <label className="input-label">End Time</label>
                      <div className="input-field-wrapper">
                        <Clock size={16} className="text-slate-400" />
                        <IonInput type="time" value={formData.packaging_logistics?.end_time} onIonChange={e => setFormData({...formData, packaging_logistics: {...formData.packaging_logistics, end_time: e.detail.value!}})} className="custom-ion-input" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* 4. PACKAGING COMPONENTS */}
                <div className="bg-slate-50/50 rounded-3xl p-6 border border-slate-100 space-y-6">
                  <h3 className="section-title"><Box size={14} /> Packaging Components</h3>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { key: 'envelope', label: 'Envelope', icon: Mail },
                      { key: 'sticker', label: 'Sticker', icon: Smile },
                      { key: 'crafting', label: 'Crafting', icon: Scissors },
                      { key: 'tag', label: 'Tag', icon: TagIcon },
                      { key: 'ribbon', label: 'Ribbon', icon: Gift },
                      { key: 'others', label: 'Others', icon: Plus }
                    ].map(item => {
                      const isSelected = formData.packaging_logistics?.selected_items?.includes(item.key);
                      return (
                        <div key={item.key} 
                          className={`flex flex-col items-center gap-2 p-3 rounded-2xl border transition-all cursor-pointer ${isSelected ? 'bg-teal-500 border-teal-500 text-white shadow-lg' : 'bg-white border-slate-100 text-slate-400'}`}
                          onClick={() => {
                            let list = [...(formData.packaging_logistics.selected_items || [])];
                            if (list.includes(item.key)) {
                              list = list.filter(i => i !== item.key);
                            } else {
                              list.push(item.key);
                            }
                            setFormData({...formData, packaging_logistics: {...formData.packaging_logistics, selected_items: list}});
                          }}
                        >
                          <item.icon size={18} />
                          <span className="text-[9px] font-black uppercase tracking-wider">{item.label}</span>
                        </div>
                      );
                    })}
                  </div>
                  {formData.packaging_logistics?.selected_items?.includes('others') && (
                    <div className="input-group mb-0 animate-in fade-in zoom-in-95">
                      <label className="input-label text-[10px]">Specify Other Items</label>
                      <div className="input-field-wrapper bg-white">
                        <Type size={14} className="text-teal-500" />
                        <IonInput value={formData.packaging_logistics?.others_type} placeholder="Type items here..." onIonChange={e => setFormData({...formData, packaging_logistics: {...formData.packaging_logistics, others_type: e.detail.value!}})} className="custom-ion-input" />
                      </div>
                    </div>
                  )}
                </div>

                {/* 5. ISSUES */}
                <div className="space-y-4">
                  <div className="input-group">
                    <label className="input-label">Issues in Card</label>
                    <div className="input-field-wrapper" style={{ minHeight: '100px' }}>
                      <IonTextarea value={formData.packaging_logistics?.card_issues} placeholder="Describe any issues found..." onIonChange={e => setFormData({...formData, packaging_logistics: {...formData.packaging_logistics, card_issues: e.detail.value!}})} className="custom-ion-input" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {stage === 'delivery' && (
              <div className="space-y-8">
                {/* 1. PACKAGING STATUS (In Delivery Stage) */}
                <div className="bg-slate-50/50 rounded-3xl p-6 border border-slate-100 space-y-6">
                  <h3 className="section-title"><Box size={14} /> Packaging Status</h3>
                  
                  <CustomDropdown label="Packed By" id="packed_by" required={true} value={formData.dispatch_mode?.packed_by} options={staffOptions} onSelect={(val: string) => setFormData({...formData, dispatch_mode: {...formData.dispatch_mode, packed_by: val}})} />

                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 flex items-center gap-2">
                      <Gift size={12} /> Gift Option
                    </label>
                    <div className="flex flex-col gap-3">
                      <div 
                        className={`flex items-center gap-3 p-4 rounded-2xl border transition-all cursor-pointer ${formData.dispatch_mode?.gift_type === 'with_gift' ? 'bg-teal-50 border-teal-500 text-teal-700 shadow-md' : 'bg-white border-slate-100 text-slate-400'}`}
                        onClick={() => setFormData({...formData, dispatch_mode: {...formData.dispatch_mode, gift_type: formData.dispatch_mode.gift_type === 'with_gift' ? null : 'with_gift'}})}
                      >
                        <div className={`p-2 rounded-xl ${formData.dispatch_mode?.gift_type === 'with_gift' ? 'bg-teal-500 text-white' : 'bg-slate-100 text-slate-400'}`}>
                          <Gift size={16} />
                        </div>
                        <div className="flex-1">
                          <p className="text-[10px] font-black uppercase">With Gift</p>
                        </div>
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${formData.dispatch_mode?.gift_type === 'with_gift' ? 'bg-teal-500 border-teal-500 text-white' : 'border-slate-200'}`}>
                          {formData.dispatch_mode?.gift_type === 'with_gift' && <Check size={12} strokeWidth={4} />}
                        </div>
                      </div>

                      <div 
                        className={`flex items-center gap-3 p-4 rounded-2xl border transition-all cursor-pointer ${formData.dispatch_mode?.gift_type === 'without_gift' ? 'bg-teal-50 border-teal-500 text-teal-700 shadow-md' : 'bg-white border-slate-100 text-slate-400'}`}
                        onClick={() => setFormData({...formData, dispatch_mode: {...formData.dispatch_mode, gift_type: formData.dispatch_mode.gift_type === 'without_gift' ? null : 'without_gift'}})}
                      >
                        <div className={`p-2 rounded-xl ${formData.dispatch_mode?.gift_type === 'without_gift' ? 'bg-teal-500 text-white' : 'bg-slate-100 text-slate-400'}`}>
                          <Box size={16} />
                        </div>
                        <div className="flex-1">
                          <p className="text-[10px] font-black uppercase">No Gift</p>
                        </div>
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${formData.dispatch_mode?.gift_type === 'without_gift' ? 'bg-teal-500 border-teal-500 text-white' : 'border-slate-200'}`}>
                          {formData.dispatch_mode?.gift_type === 'without_gift' && <Check size={12} strokeWidth={4} />}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. DELIVERY LOCATION */}
                <div className="bg-slate-50/50 rounded-3xl p-6 border border-slate-100 space-y-6">
                  <h3 className="section-title"><MapPin size={14} /> Delivery Location</h3>
                  
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-wider text-slate-400">Select Shop Location</label>
                    <div className="grid grid-cols-2 gap-3 my-4">
                      {['NGL SHOP', 'MARTHANDAM SHOP', 'TVL SHOP', 'CHENNAI SHOP'].map(loc => (
                        <div key={loc} 
                          className={`flex items-center gap-2 p-3 rounded-2xl border transition-all cursor-pointer ${formData.delivery_location?.shop_location === loc ? 'bg-teal-500 border-teal-500 text-white shadow-lg' : 'bg-white border-slate-100 text-slate-400'}`}
                          onClick={() => setFormData({...formData, delivery_location: {...formData.delivery_location, shop_location: loc}})}
                        >
                          <Building size={14} />
                          <span className="text-[9px] font-black uppercase">{loc}</span>
                          {formData.delivery_location?.shop_location === loc && <Check size={10} strokeWidth={4} className="ml-auto" />}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="input-group">
                    <label className="input-label">Address</label>
                    <div className="input-field-wrapper bg-white">
                      <MapPin size={16} className="text-slate-400" />
                      <IonInput value={formData.delivery_location?.address} placeholder="Enter delivery address" onIonChange={e => setFormData({...formData, delivery_location: {...formData.delivery_location, address: e.detail.value!}})} className="custom-ion-input" />
                    </div>
                  </div>
                </div>

                {/* 3. MODE OF DISPATCH */}
                <div className="bg-slate-50/50 rounded-3xl p-6 border border-slate-100 space-y-6">
                  <h3 className="section-title"><Truck size={14} /> Mode of Dispatch</h3>
                  <div className="grid grid-cols-2 gap-3 my-4">
                    {[
                      { key: 'Shop Pickup', label: 'SHOP PICKUP', icon: Building },
                      { key: 'Bus', label: 'BUS', icon: Bus },
                      { key: 'Transport', label: 'TRANSPORT', icon: Truck },
                      { key: 'Courier', label: 'COURIER', icon: Box }
                    ].map(mode => (
                      <div key={mode.key} 
                        className={`flex items-center gap-2 p-3 rounded-2xl border transition-all cursor-pointer ${formData.dispatch_mode?.modes === mode.key ? 'bg-teal-500 border-teal-500 text-white shadow-lg' : 'bg-white border-slate-100 text-slate-400'}`}
                        onClick={() => setFormData({...formData, dispatch_mode: {...formData.dispatch_mode, modes: mode.key}})}
                      >
                        <mode.icon size={14} />
                        <span className="text-[9px] font-black uppercase">{mode.label}</span>
                        {formData.dispatch_mode?.modes === mode.key && <Check size={10} strokeWidth={4} className="ml-auto" />}
                      </div>
                    ))}
                  </div>
                </div>

                {/* 3. CONDITIONAL DISPATCH DETAILS */}
                {formData.dispatch_mode?.modes === 'Bus' && (
                  <div className="bg-slate-50/50 rounded-3xl p-6 border border-slate-100 space-y-4 animate-in fade-in slide-in-from-top-2">
                    <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                      <Bus size={16} className="text-blue-500" />
                      <h4 className="text-xs font-black uppercase">Bus Details</h4>
                    </div>
                    <div className="input-group">
                      <label className="input-label">Bus No<span className="text-rose-500 ml-1 font-bold">*</span></label>
                      <div className="input-field-wrapper bg-white">
                        <Hash size={14} className="text-slate-400" />
                        <IonInput value={formData.dispatch_details?.bus?.bus_no} placeholder="Enter bus number" onIonChange={e => setFormData({...formData, dispatch_details: {...formData.dispatch_details, bus: {...formData.dispatch_details.bus, bus_no: e.detail.value!}}})} className="custom-ion-input" />
                      </div>
                    </div>
                    <div className="input-group">
                      <label className="input-label">Reaching Time<span className="text-rose-500 ml-1 font-bold">*</span></label>
                      <div className="input-field-wrapper bg-white">
                        <Clock size={14} className="text-slate-400" />
                        <IonInput type="time" value={formData.dispatch_details?.bus?.reaching_time} onIonChange={e => setFormData({...formData, dispatch_details: {...formData.dispatch_details, bus: {...formData.dispatch_details.bus, reaching_time: e.detail.value!}}})} className="custom-ion-input" />
                      </div>
                    </div>
                    <div className="input-group">
                      <label className="input-label">Contact No<span className="text-rose-500 ml-1 font-bold">*</span></label>
                      <div className="input-field-wrapper bg-white">
                        <Phone size={14} className="text-slate-400" />
                        <IonInput value={formData.dispatch_details?.bus?.contact_no} placeholder="Enter contact" onIonChange={e => setFormData({...formData, dispatch_details: {...formData.dispatch_details, bus: {...formData.dispatch_details.bus, contact_no: e.detail.value!}}})} className="custom-ion-input" />
                      </div>
                    </div>
                    <div 
                      className={`flex items-center justify-between p-3 rounded-2xl border transition-all ${formData.dispatch_details?.bus?.shared_whatsapp ? 'bg-green-50 border-green-500 text-green-700' : 'bg-white border-slate-100 text-slate-400'}`}
                      onClick={() => setFormData({...formData, dispatch_details: {...formData.dispatch_details, bus: {...formData.dispatch_details.bus, shared_whatsapp: !formData.dispatch_details.bus.shared_whatsapp}}})}
                    >
                      <div className="flex items-center gap-2">
                        <MessageCircle size={14} />
                        <span className="text-[10px] font-bold">Shared in WhatsApp Group</span>
                      </div>
                      {formData.dispatch_details?.bus?.shared_whatsapp && <Check size={12} strokeWidth={4} />}
                    </div>
                  </div>
                )}

                {formData.dispatch_mode?.modes === 'Courier' && (
                  <div className="bg-slate-50/50 rounded-3xl p-6 border border-slate-100 space-y-4 animate-in fade-in slide-in-from-top-2">
                    <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                      <Box size={16} className="text-purple-500" />
                      <h4 className="text-xs font-black uppercase">Courier Details</h4>
                    </div>
                    <div className="input-group">
                      <label className="input-label">Courier Name<span className="text-rose-500 ml-1 font-bold">*</span></label>
                      <div className="input-field-wrapper bg-white">
                        <TagIcon size={14} className="text-slate-400" />
                        <IonInput value={formData.dispatch_details?.courier?.name} placeholder="Enter courier name" onIonChange={e => setFormData({...formData, dispatch_details: {...formData.dispatch_details, courier: {...formData.dispatch_details.courier, name: e.detail.value!}}})} className="custom-ion-input" />
                      </div>
                    </div>
                    <div className="input-group">
                      <label className="input-label">Tracking No<span className="text-rose-500 ml-1 font-bold">*</span></label>
                      <div className="input-field-wrapper bg-white">
                        <Layers size={14} className="text-slate-400" />
                        <IonInput value={formData.dispatch_details?.courier?.tracking_no} placeholder="Enter tracking no" onIonChange={e => setFormData({...formData, dispatch_details: {...formData.dispatch_details, courier: {...formData.dispatch_details.courier, tracking_no: e.detail.value!}}})} className="custom-ion-input" />
                      </div>
                    </div>
                    <div 
                      className={`flex items-center justify-between p-3 rounded-2xl border transition-all ${formData.dispatch_details?.courier?.shared_whatsapp ? 'bg-green-50 border-green-500 text-green-700' : 'bg-white border-slate-100 text-slate-400'}`}
                      onClick={() => setFormData({...formData, dispatch_details: {...formData.dispatch_details, courier: {...formData.dispatch_details.courier, shared_whatsapp: !formData.dispatch_details.courier.shared_whatsapp}}})}
                    >
                      <div className="flex items-center gap-2">
                        <MessageCircle size={14} />
                        <span className="text-[10px] font-bold">Shared in WhatsApp Group</span>
                      </div>
                      {formData.dispatch_details?.courier?.shared_whatsapp && <Check size={12} strokeWidth={4} />}
                    </div>
                  </div>
                )}

                {formData.dispatch_mode?.modes === 'Transport' && (
                  <div className="bg-slate-50/50 rounded-3xl p-6 border border-slate-100 space-y-4 animate-in fade-in slide-in-from-top-2">
                    <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                      <Truck size={16} className="text-amber-500" />
                      <h4 className="text-xs font-black uppercase">Transport Details</h4>
                    </div>
                    <div className="input-group">
                      <label className="input-label">Transport Name<span className="text-rose-500 ml-1 font-bold">*</span></label>
                      <div className="input-field-wrapper bg-white">
                        <Building size={14} className="text-slate-400" />
                        <IonInput value={formData.dispatch_details?.transport?.name} placeholder="Enter transport name" onIonChange={e => setFormData({...formData, dispatch_details: {...formData.dispatch_details, transport: {...formData.dispatch_details.transport, name: e.detail.value!}}})} className="custom-ion-input" />
                      </div>
                    </div>
                    <div className="input-group">
                      <label className="input-label">LR Number<span className="text-rose-500 ml-1 font-bold">*</span></label>
                      <div className="input-field-wrapper bg-white">
                        <FileText size={14} className="text-slate-400" />
                        <IonInput value={formData.dispatch_details?.transport?.lr_number} placeholder="Enter LR number" onIonChange={e => setFormData({...formData, dispatch_details: {...formData.dispatch_details, transport: {...formData.dispatch_details.transport, lr_number: e.detail.value!}}})} className="custom-ion-input" />
                      </div>
                    </div>
                    <div 
                      className={`flex items-center justify-between p-3 rounded-2xl border transition-all ${formData.dispatch_details?.transport?.shared_whatsapp ? 'bg-green-50 border-green-500 text-green-700' : 'bg-white border-slate-100 text-slate-400'}`}
                      onClick={() => setFormData({...formData, dispatch_details: {...formData.dispatch_details, transport: {...formData.dispatch_details.transport, shared_whatsapp: !formData.dispatch_details.transport.shared_whatsapp}}})}
                    >
                      <div className="flex items-center gap-2">
                        <MessageCircle size={14} />
                        <span className="text-[10px] font-bold">Shared in WhatsApp Group</span>
                      </div>
                      {formData.dispatch_details?.transport?.shared_whatsapp && <Check size={12} strokeWidth={4} />}
                    </div>
                  </div>
                )}

                {formData.dispatch_mode?.modes === 'Shop Pickup' && (
                  <div className="p-8 text-center border-2 border-dashed border-slate-100 rounded-3xl bg-slate-50/30">
                    <div className="inline-flex p-3 rounded-xl bg-white shadow-sm mb-3">
                      <Truck size={24} className="text-slate-200" />
                    </div>
                    <h4 className="text-[11px] font-bold text-slate-900 mb-1">No extra details needed for Shop Pickup</h4>
                    <p className="text-[9px] text-slate-400 px-4">The customer will pick up the order directly from the shop.</p>
                  </div>
                )}

                {/* 4. DISPATCH DETAILS (FINANCE/SIGNATURE) */}
                <div className="space-y-4">
                  <div className="input-group">
                    <label className="input-label">Dispatch Date<span className="text-rose-500 ml-1 font-bold">*</span></label>
                    <div className="input-field-wrapper">
                      <CalendarIcon size={16} className="text-slate-400" />
                      <IonInput type="date" value={formData.dispatch_mode?.dispatch_details_date} onIonChange={e => setFormData({...formData, dispatch_mode: {...formData.dispatch_mode, dispatch_details_date: e.detail.value!}})} className="custom-ion-input" />
                    </div>
                  </div>
                  <div className="input-group">
                    <label className="input-label">Dispatch Expense<span className="text-rose-500 ml-1 font-bold">*</span></label>
                    <div className="input-field-wrapper">
                      <CreditCard size={16} className="text-slate-400" />
                      <IonInput type="number" value={formData.dispatch_mode?.dispatch_expense} placeholder="Enter amount" onIonChange={e => setFormData({...formData, dispatch_mode: {...formData.dispatch_mode, dispatch_expense: e.detail.value!}})} className="custom-ion-input" />
                    </div>
                  </div>
                  <div className="input-group">
                    <label className="input-label">Start Time<span className="text-rose-500 ml-1 font-bold">*</span></label>
                    <div className="input-field-wrapper">
                      <Clock size={16} className="text-slate-400" />
                      <IonInput type="time" value={formData.dispatch_mode?.start_time} onIonChange={e => setFormData({...formData, dispatch_mode: {...formData.dispatch_mode, start_time: e.detail.value!}})} className="custom-ion-input" />
                    </div>
                  </div>
                  <div className="input-group">
                    <label className="input-label">End Time<span className="text-rose-500 ml-1 font-bold">*</span></label>
                    <div className="input-field-wrapper">
                      <Clock size={16} className="text-slate-400" />
                      <IonInput type="time" value={formData.dispatch_mode?.end_time} onIonChange={e => setFormData({...formData, dispatch_mode: {...formData.dispatch_mode, end_time: e.detail.value!}})} className="custom-ion-input" />
                    </div>
                  </div>
                  <div className="input-group">
                    <label className="input-label">Signature & Name<span className="text-rose-500 ml-1 font-bold">*</span></label>
                    <div className="input-field-wrapper">
                      <Signature size={16} className="text-slate-400" />
                      <IonInput value={formData.dispatch_mode?.signature_name} placeholder="Enter name" onIonChange={e => setFormData({...formData, dispatch_mode: {...formData.dispatch_mode, signature_name: e.detail.value!}})} className="custom-ion-input" />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Bottom Actions */}
          <div className="px-4 mt-8 space-y-4">
            <button onClick={handleSave} disabled={saving} className="save-btn" style={{ background: 'linear-gradient(135deg, #3cc0c2 0%, #29a0a2 100%)' }}>
              {saving ? <IonSpinner name="crescent" color="light" /> : <Save size={18} />}
              SAVE CHANGES
            </button>
            <button onClick={() => history.goBack()} className="cancel-btn">CANCEL</button>
          </div>
        </div>
      </IonContent>
      <IonToast isOpen={showToast} onDidDismiss={() => setShowToast(false)} message={toastMessage} duration={2000} position="bottom" className="custom-toast" />
    </IonPage>
  );
};

export default ManagementEdit;
