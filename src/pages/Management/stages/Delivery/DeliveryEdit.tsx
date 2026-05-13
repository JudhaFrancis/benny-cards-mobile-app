import React from 'react';
import { IonInput } from '@ionic/react';
import { Box, Gift, MapPin, Building, Truck, Bus, MessageCircle, FileText, CreditCard, Calendar as CalendarIcon, Clock, Signature } from 'lucide-react';
import CustomSelect from '../../components/forms/CustomSelect';

interface Props {
  formData: any;
  setFormData: (data: any) => void;
  staffOptions: string[];
}

const DeliveryEdit: React.FC<Props> = ({ formData, setFormData, staffOptions }) => {
  return (
    <div className="space-y-8">
      <div className="bg-slate-50/50 rounded-3xl p-6 border border-slate-100 space-y-6">
        <h3 className="section-title"><Box size={14} /> Packaging Status</h3>
        <CustomSelect label="Packed By" id="packed_by" required={true} value={formData.dispatch_mode?.packed_by} options={staffOptions} onSelect={(val: string) => setFormData({...formData, dispatch_mode: {...formData.dispatch_mode, packed_by: val}})} />
        <div className="space-y-3">
          <label className="input-label">Gift Option<span className="text-rose-500 ml-1 font-bold">*</span></label>
          <div className="grid grid-cols-2 gap-3">
            {[
              { id: 'with_gift', label: 'With Gift', icon: Gift },
              { id: 'without_gift', label: 'No Gift', icon: Box }
            ].map(gift => {
              const isSelected = formData.dispatch_mode?.gift_type === gift.id;
              return (
                <div key={gift.id} className={`flex items-center gap-3 p-4 rounded-2xl border-2 transition-all cursor-pointer ${isSelected ? 'bg-teal-50 border-teal-500 text-teal-700' : 'bg-white border-slate-100 text-slate-400'}`} onClick={() => setFormData({...formData, dispatch_mode: {...formData.dispatch_mode, gift_type: gift.id}})}>
                  <gift.icon size={16} />
                  <span className="text-xs font-bold uppercase">{gift.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="bg-slate-50/50 rounded-3xl p-6 border border-slate-100 space-y-6">
        <h3 className="section-title"><MapPin size={14} /> Delivery Location</h3>
        <div className="space-y-3">
          <label className="input-label">Shop Location<span className="text-rose-500 ml-1 font-bold">*</span></label>
          <div className="flex gap-3">
            {['NGL SHOP', 'MTM SHOP'].map(loc => {
              const isSelected = (formData.delivery_location?.shop_location || 'NGL SHOP') === loc;
              return (
                <div key={loc} className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl border-2 transition-all cursor-pointer ${isSelected ? 'bg-teal-500 border-teal-500 text-white shadow-lg' : 'bg-white border-slate-100 text-slate-400'}`} onClick={() => setFormData({...formData, delivery_location: {...formData.delivery_location, shop_location: loc}})}>
                  <Building size={14} />
                  <span className="text-[10px] font-black uppercase">{loc}</span>
                </div>
              );
            })}
          </div>
        </div>
        <div className="input-group">
          <label className="input-label">Delivery Address<span className="text-rose-500 ml-1 font-bold">*</span></label>
          <div className="input-field-wrapper bg-white">
            <MapPin size={16} className="text-slate-400" />
            <IonInput value={formData.delivery_location?.address} placeholder="Enter full address" onIonChange={e => setFormData({...formData, delivery_location: {...formData.delivery_location, address: e.detail.value!}})} className="custom-ion-input" />
          </div>
        </div>
      </div>

      <div className="bg-slate-50/50 rounded-3xl p-6 border border-slate-100 space-y-6">
        <h3 className="section-title"><Truck size={14} /> Mode of Dispatch</h3>
        <div className="grid grid-cols-2 gap-3">
          {[
            { id: 'Bus', icon: Bus },
            { id: 'Courier', icon: Box },
            { id: 'Transport', icon: Truck },
            { id: 'Shop Pickup', icon: Building }
          ].map(mode => {
            const isSelected = formData.dispatch_mode?.modes === mode.id;
            return (
              <div key={mode.id} className={`flex items-center gap-3 p-4 rounded-2xl border-2 transition-all cursor-pointer ${isSelected ? 'bg-teal-500 border-teal-500 text-white shadow-lg' : 'bg-white border-slate-100 text-slate-400'}`} onClick={() => setFormData({...formData, dispatch_mode: {...formData.dispatch_mode, modes: mode.id}})}>
                <mode.icon size={16} />
                <span className="text-[10px] font-black uppercase">{mode.id}</span>
              </div>
            );
          })}
        </div>

        {formData.dispatch_mode?.modes === 'Bus' && (
          <div className="space-y-4 pt-4 border-t border-slate-200 animate-in fade-in zoom-in-95">
            <div className="input-group">
              <label className="input-label">Bus No<span className="text-rose-500 ml-1 font-bold">*</span></label>
              <div className="input-field-wrapper bg-white"><IonInput value={formData.dispatch_details?.bus?.bus_no} placeholder="e.g. TN 74 AX 1234" onIonChange={e => setFormData({...formData, dispatch_details: {...formData.dispatch_details, bus: {...formData.dispatch_details.bus, bus_no: e.detail.value!}}})} className="custom-ion-input" /></div>
            </div>
            <div className="input-group">
              <label className="input-label">Reaching Time</label>
              <div className="input-field-wrapper bg-white"><Clock size={16} className="text-slate-400" /><IonInput type="time" value={formData.dispatch_details?.bus?.reaching_time} onIonChange={e => setFormData({...formData, dispatch_details: {...formData.dispatch_details, bus: {...formData.dispatch_details.bus, reaching_time: e.detail.value!}}})} className="custom-ion-input" /></div>
            </div>
            <div className={`flex items-center gap-3 p-4 rounded-2xl border-2 transition-all cursor-pointer ${formData.dispatch_details?.bus?.shared_whatsapp ? 'bg-green-50 border-green-500 text-green-700' : 'bg-white border-slate-100 text-slate-400'}`} onClick={() => setFormData({...formData, dispatch_details: {...formData.dispatch_details, bus: {...formData.dispatch_details.bus, shared_whatsapp: !formData.dispatch_details.bus.shared_whatsapp}}})}>
              <MessageCircle size={16} />
              <span className="text-[10px] font-black uppercase">Shared in WhatsApp</span>
            </div>
          </div>
        )}

        {formData.dispatch_mode?.modes === 'Courier' && (
          <div className="space-y-4 pt-4 border-t border-slate-200 animate-in fade-in zoom-in-95">
            <div className="input-group">
              <label className="input-label">Courier Name<span className="text-rose-500 ml-1 font-bold">*</span></label>
              <div className="input-field-wrapper bg-white"><IonInput value={formData.dispatch_details?.courier?.name} placeholder="e.g. Professional Courier" onIonChange={e => setFormData({...formData, dispatch_details: {...formData.dispatch_details, courier: {...formData.dispatch_details.courier, name: e.detail.value!}}})} className="custom-ion-input" /></div>
            </div>
            <div className="input-group">
              <label className="input-label">Tracking No<span className="text-rose-500 ml-1 font-bold">*</span></label>
              <div className="input-field-wrapper bg-white"><IonInput value={formData.dispatch_details?.courier?.tracking_no} placeholder="Tracking Number" onIonChange={e => setFormData({...formData, dispatch_details: {...formData.dispatch_details, courier: {...formData.dispatch_details.courier, tracking_no: e.detail.value!}}})} className="custom-ion-input" /></div>
            </div>
            <div className={`flex items-center gap-3 p-4 rounded-2xl border-2 transition-all cursor-pointer ${formData.dispatch_details?.courier?.shared_whatsapp ? 'bg-green-50 border-green-500 text-green-700' : 'bg-white border-slate-100 text-slate-400'}`} onClick={() => setFormData({...formData, dispatch_details: {...formData.dispatch_details, courier: {...formData.dispatch_details.courier, shared_whatsapp: !formData.dispatch_details.courier.shared_whatsapp}}})}>
              <MessageCircle size={16} />
              <span className="text-[10px] font-black uppercase">Shared in WhatsApp</span>
            </div>
          </div>
        )}

        {formData.dispatch_mode?.modes === 'Transport' && (
          <div className="space-y-4 pt-4 border-t border-slate-200 animate-in fade-in zoom-in-95">
            <div className="input-group">
              <label className="input-label">Transport Name<span className="text-rose-500 ml-1 font-bold">*</span></label>
              <div className="input-field-wrapper bg-white"><IonInput value={formData.dispatch_details?.transport?.name} placeholder="e.g. VRL Transport" onIonChange={e => setFormData({...formData, dispatch_details: {...formData.dispatch_details, transport: {...formData.dispatch_details.transport, name: e.detail.value!}}})} className="custom-ion-input" /></div>
            </div>
            <div className="input-group">
              <label className="input-label">LR Number<span className="text-rose-500 ml-1 font-bold">*</span></label>
              <div className="input-field-wrapper bg-white"><IonInput value={formData.dispatch_details?.transport?.lr_number} placeholder="LR Number" onIonChange={e => setFormData({...formData, dispatch_details: {...formData.dispatch_details, transport: {...formData.dispatch_details.transport, lr_number: e.detail.value!}}})} className="custom-ion-input" /></div>
            </div>
            <div className={`flex items-center gap-3 p-4 rounded-2xl border-2 transition-all cursor-pointer ${formData.dispatch_details?.transport?.shared_whatsapp ? 'bg-green-50 border-green-500 text-green-700' : 'bg-white border-slate-100 text-slate-400'}`} onClick={() => setFormData({...formData, dispatch_details: {...formData.dispatch_details, transport: {...formData.dispatch_details.transport, shared_whatsapp: !formData.dispatch_details.transport.shared_whatsapp}}})}>
              <MessageCircle size={16} />
              <span className="text-[10px] font-black uppercase">Shared in WhatsApp</span>
            </div>
          </div>
        )}
      </div>

      <div className="space-y-4">
        <div className="input-group">
          <label className="input-label">Dispatch Details Date<span className="text-rose-500 ml-1 font-bold">*</span></label>
          <div className="input-field-wrapper"><CalendarIcon size={16} className="text-slate-400" /><IonInput type="date" value={formData.dispatch_mode?.dispatch_details_date} onIonChange={e => setFormData({...formData, dispatch_mode: {...formData.dispatch_mode, dispatch_details_date: e.detail.value!}})} className="custom-ion-input" /></div>
        </div>
        <div className="input-group">
          <label className="input-label">Dispatch Expense (₹)<span className="text-rose-500 ml-1 font-bold">*</span></label>
          <div className="input-field-wrapper"><CreditCard size={16} className="text-slate-400" /><IonInput type="number" value={formData.dispatch_mode?.dispatch_expense} placeholder="0" onIonChange={e => setFormData({...formData, dispatch_mode: {...formData.dispatch_mode, dispatch_expense: e.detail.value!}})} className="custom-ion-input font-bold text-rose-500" /></div>
        </div>
        <div className="input-group">
          <label className="input-label">Signature & Name<span className="text-rose-500 ml-1 font-bold">*</span></label>
          <div className="input-field-wrapper"><Signature size={16} className="text-slate-400" /><IonInput value={formData.dispatch_mode?.signature_name} placeholder="Who received/dispatched?" onIonChange={e => setFormData({...formData, dispatch_mode: {...formData.dispatch_mode, signature_name: e.detail.value!}})} className="custom-ion-input" /></div>
        </div>
      </div>
    </div>
  );
};

export default DeliveryEdit;
