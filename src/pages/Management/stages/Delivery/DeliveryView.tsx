import React from 'react';
import { Box, Gift, MapPin, Building, Truck, Bus, MessageCircle, FileText, CreditCard, Calendar as CalendarIcon, Clock, Signature } from 'lucide-react';
import { ManagementOrder } from '../../types';

interface Props {
  order: ManagementOrder | null;
}

const DeliveryView: React.FC<Props> = ({ order }) => {
  return (
    <div className="space-y-8">
      <div className="bg-slate-50/50 rounded-3xl p-6 border border-slate-100 space-y-6">
        <h3 className="section-title"><Box size={14} /> Packaging Status</h3>
        <div className="input-group">
          <label className="input-label">Packed By</label>
          <div className="input-field-wrapper readonly bg-white"><div className="view-text">{order?.dispatch_delivery?.dispatch_mode?.packed_by || 'N/A'}</div></div>
        </div>
        <div className="input-group">
          <label className="input-label">Gift Option</label>
          <div className={`flex items-center gap-2 py-2.5 px-4 rounded-2xl border ${order?.dispatch_delivery?.dispatch_mode?.gift_type ? 'bg-teal-50 border-teal-500 text-white shadow-md' : 'bg-white border-slate-50 text-slate-300'} self-start`}>
            <Gift size={14} />
            <span className="text-[10px] font-black uppercase">{order?.dispatch_delivery?.dispatch_mode?.gift_type === 'with_gift' ? 'With Gift' : (order?.dispatch_delivery?.dispatch_mode?.gift_type === 'without_gift' ? 'No Gift' : 'Not Selected')}</span>
          </div>
        </div>
      </div>

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

      <div className="bg-slate-50/50 rounded-3xl p-6 border border-slate-100 space-y-6">
        <h3 className="section-title"><Truck size={14} /> Dispatch Mode</h3>
        <div className="flex items-center gap-2 py-2.5 px-4 rounded-2xl bg-teal-500 text-white shadow-md self-start">
          {order?.dispatch_delivery?.dispatch_mode?.modes === 'Bus' && <Bus size={14} />}
          {order?.dispatch_delivery?.dispatch_mode?.modes === 'Courier' && <Box size={14} />}
          {order?.dispatch_delivery?.dispatch_mode?.modes === 'Transport' && <Truck size={14} />}
          {order?.dispatch_delivery?.dispatch_mode?.modes === 'Shop Pickup' && <Building size={14} />}
          <span className="text-[10px] font-black uppercase">{order?.dispatch_delivery?.dispatch_mode?.modes || 'N/A'}</span>
        </div>

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
  );
};

export default DeliveryView;
