import React from 'react';
import { Box, Gift, MapPin, Building, Truck, Bus, MessageCircle, FileText, CreditCard, Calendar as CalendarIcon, Clock, Signature, User } from 'lucide-react';
import { ManagementOrder } from '../../types';
import { formatDate } from '../../../../utils/dateUtils';

interface Props {
  order: ManagementOrder | null;
}

const DeliveryView: React.FC<Props> = ({ order }) => {
  return (
    <div className="space-y-8">
      <div className="bg-slate-50/50 rounded-3xl p-6 border border-slate-100 space-y-6">
        <h3 className="section-title">Selected Shop Location</h3>
        
        <div className="space-y-4">
          <div className="input-group">
            <label className="input-label">Packed By</label>
            <div className="input-field-wrapper readonly bg-white">
              <User size={14} className="text-slate-400" />
              <div className="view-text">{order?.dispatch_delivery?.dispatch_mode?.packed_by || 'N/A'}</div>
            </div>
          </div>

          <div className="input-group">
            <label className="input-label">Gift Option</label>
            <div className={`flex items-center gap-3 p-4 rounded-2xl border ${order?.dispatch_delivery?.dispatch_mode?.gift_type ? 'bg-teal-500 border-teal-500 text-white shadow-lg' : 'bg-white border-slate-100 text-slate-300'} self-start`}>
              <Gift size={18} />
              <span className="text-xs font-bold">{order?.dispatch_delivery?.dispatch_mode?.gift_type === 'with_gift' ? 'With Gift' : (order?.dispatch_delivery?.dispatch_mode?.gift_type === 'without_gift' ? 'Without Gift' : 'Not Selected')}</span>
            </div>
          </div>
        </div>

        <div className="space-y-4 pt-2">
          <label className="input-label">Shop Location</label>
          <div className="grid grid-cols-2 gap-3">
            {[
              { id: 'NGL SHOP', icon: Building, label: 'NGL Shop' },
              { id: 'MARTHANDAM SHOP', icon: MapPin, label: 'MTM Shop' },
              { id: 'TVL SHOP', icon: Box, label: 'TVL Shop' },
              { id: 'CHENNAI SHOP', icon: Building, label: 'Chennai Shop' }
            ].map(loc => {
              const isSelected = order?.dispatch_delivery?.delivery_location?.shop_location === loc.id;
              return (
                <div key={loc.id} className={`flex flex-col items-center gap-2 p-4 rounded-2xl border transition-all ${isSelected ? 'bg-teal-500 border-teal-500 text-white shadow-lg' : 'bg-white border-slate-100 text-slate-400'}`}>
                  <loc.icon size={18} className={isSelected ? 'text-white' : 'text-slate-300'} />
                  <span className={`text-[9px] font-black ${isSelected ? 'text-white' : 'text-slate-400'}`}>{loc.label}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="input-group">
          <label className="input-label">Address</label>
          <div className="input-field-wrapper readonly bg-white flex items-start gap-3">
            <MapPin size={16} className="text-slate-400 shrink-0 mt-0.5" />
            <div className="view-text leading-relaxed">{order?.dispatch_delivery?.delivery_location?.address || 'N/A'}</div>
          </div>
        </div>
      </div>

      <div className="bg-slate-50/50 rounded-3xl p-6 border border-slate-100 space-y-6">
        <h3 className="section-title"><Truck size={14} /> Mode of Dispatch</h3>
        
        <div className="grid grid-cols-2 gap-3">
          {[
            { id: 'Shop Pickup', icon: Building, label: 'Shop Pickup' },
            { id: 'Bus', icon: Bus, label: 'Bus' },
            { id: 'Transport', icon: Truck, label: 'Transport' },
            { id: 'Courier', icon: Box, label: 'Courier' }
          ].map(mode => {
            const isSelected = order?.dispatch_delivery?.dispatch_mode?.modes === mode.id;
            return (
              <div key={mode.id} className={`flex flex-col items-center gap-2 p-4 rounded-2xl border transition-all ${isSelected ? 'bg-teal-500 border-teal-500 text-white shadow-lg' : 'bg-white border-slate-100 text-slate-400'}`}>
                <mode.icon size={18} className={isSelected ? 'text-white' : 'text-slate-300'} />
                <span className={`text-[9px] font-black ${isSelected ? 'text-white' : 'text-slate-400'}`}>{mode.label}</span>
              </div>
            );
          })}
        </div>

        <div className="space-y-4 pt-2">
          <div className="input-group">
            <label className="input-label">Dispatch Date</label>
            <div className="input-field-wrapper readonly bg-white">
              <CalendarIcon size={14} className="text-slate-400" />
              <div className="view-text font-bold">{formatDate(order?.dispatch_delivery?.dispatch_mode?.dispatch_details_date)}</div>
            </div>
          </div>
          <div className="input-group">
            <label className="input-label">Dispatch Expense</label>
            <div className="input-field-wrapper readonly bg-white">
              <CreditCard size={14} className="text-slate-400" />
              <div className="view-text font-black text-rose-500">₹{order?.dispatch_delivery?.dispatch_mode?.dispatch_expense || '0'}</div>
            </div>
          </div>
          <div className="input-group">
            <label className="input-label">Signature & Name</label>
            <div className="input-field-wrapper readonly bg-white">
              <Signature size={14} className="text-slate-400" />
              <div className="view-text italic text-[11px] truncate">{order?.dispatch_delivery?.dispatch_mode?.signature_name || '-'}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-slate-50/50 rounded-3xl p-6 border border-slate-100 space-y-6">
        <h3 className="section-title"><FileText size={14} /> Dispatch Details</h3>
        
        {order?.dispatch_delivery?.dispatch_mode?.modes === 'Bus' && (
          <div className="bg-white rounded-2xl border border-blue-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="bg-blue-50/50 px-4 py-2 flex items-center gap-2 border-b border-blue-50">
              <Bus size={14} className="text-blue-500" />
              <span className="text-[10px] font-black text-blue-600 tracking-wider">Bus Details</span>
            </div>
            <div className="p-4 grid grid-cols-1 gap-3">
              <div className="input-group">
                <label className="input-label">Bus No</label>
                <div className="view-text font-bold">{order?.dispatch_delivery?.dispatch_details?.bus?.bus_no || '-'}</div>
              </div>
              <div className="input-group">
                <label className="input-label">Reaching Time</label>
                <div className="view-text">{order?.dispatch_delivery?.dispatch_details?.bus?.reaching_time || '-'}</div>
              </div>
              <div className="input-group">
                <label className="input-label">Contact No</label>
                <div className="view-text font-bold">{order?.dispatch_delivery?.dispatch_details?.bus?.contact_no || '-'}</div>
              </div>
            </div>
            {order?.dispatch_delivery?.dispatch_details?.bus?.shared_whatsapp && (
              <div className="px-4 py-2 bg-green-50 border-t border-green-100 flex items-center gap-2">
                <MessageCircle size={12} className="text-green-500" />
                <span className="text-[10px] font-bold text-green-600">Shared in WhatsApp Group</span>
              </div>
            )}
          </div>
        )}

        {order?.dispatch_delivery?.dispatch_mode?.modes === 'Courier' && (
          <div className="bg-white rounded-2xl border border-purple-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="bg-purple-50/50 px-4 py-2 flex items-center gap-2 border-b border-purple-50">
              <Box size={14} className="text-purple-500" />
              <span className="text-[10px] font-black text-purple-600 tracking-wider">Courier Details</span>
            </div>
            <div className="p-4 grid grid-cols-1 gap-3">
              <div className="input-group">
                <label className="input-label">Courier Name</label>
                <div className="view-text font-bold">{order?.dispatch_delivery?.dispatch_details?.courier?.name || '-'}</div>
              </div>
              <div className="input-group">
                <label className="input-label">Tracking No</label>
                <div className="view-text font-bold text-purple-600 uppercase tracking-tight">{order?.dispatch_delivery?.dispatch_details?.courier?.tracking_no || '-'}</div>
              </div>
            </div>
            {order?.dispatch_delivery?.dispatch_details?.courier?.shared_whatsapp && (
              <div className="px-4 py-2 bg-green-50 border-t border-green-100 flex items-center gap-2">
                <MessageCircle size={12} className="text-green-500" />
                <span className="text-[10px] font-bold text-green-600">Shared in WhatsApp Group</span>
              </div>
            )}
          </div>
        )}

        {order?.dispatch_delivery?.dispatch_mode?.modes === 'Transport' && (
          <div className="bg-white rounded-2xl border border-amber-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="bg-amber-50/50 px-4 py-2 flex items-center gap-2 border-b border-amber-50">
              <Truck size={14} className="text-amber-500" />
              <span className="text-[10px] font-black text-amber-600 tracking-wider">Transport Details</span>
            </div>
            <div className="p-4 grid grid-cols-1 gap-3">
              <div className="input-group">
                <label className="input-label">Transport Name</label>
                <div className="view-text font-bold">{order?.dispatch_delivery?.dispatch_details?.transport?.name || '-'}</div>
              </div>
              <div className="input-group">
                <label className="input-label">LR Number</label>
                <div className="view-text font-bold text-amber-600 uppercase tracking-tight">{order?.dispatch_delivery?.dispatch_details?.transport?.lr_number || '-'}</div>
              </div>
            </div>
            {order?.dispatch_delivery?.dispatch_details?.transport?.shared_whatsapp && (
              <div className="px-4 py-2 bg-green-50 border-t border-green-100 flex items-center gap-2">
                <MessageCircle size={12} className="text-green-500" />
                <span className="text-[10px] font-bold text-green-600">Shared in WhatsApp Group</span>
              </div>
            )}
          </div>
        )}

        {(!order?.dispatch_delivery?.dispatch_mode?.modes || order?.dispatch_delivery?.dispatch_mode?.modes === 'Shop Pickup') && (
          <div className="py-12 flex flex-col items-center justify-center gap-3 border-2 border-dashed border-slate-100 rounded-3xl bg-slate-50/30">
            <div className="p-3 bg-white rounded-full shadow-sm">
              <Truck size={24} strokeWidth={1.5} className="text-slate-300" />
            </div>
            <div className="space-y-1 text-center px-6">
              <div className="text-sm font-bold text-slate-600">
                {order?.dispatch_delivery?.dispatch_mode?.modes === 'Shop Pickup' ? 'No extra details needed for Shop Pickup' : 'Select a Dispatch Mode First'}
              </div>
              <div className="text-[10px] text-slate-400 leading-relaxed">
                {order?.dispatch_delivery?.dispatch_mode?.modes === 'Shop Pickup' ? 'The customer will pick up the order directly from the shop.' : 'Please go to the previous section and select how this order will be dispatched.'}
              </div>
            </div>
          </div>
        )}
      </div>

    </div>
  );
};

export default DeliveryView;
