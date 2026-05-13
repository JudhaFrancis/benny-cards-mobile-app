import React from 'react';
import { IonInput, IonTextarea } from '@ionic/react';
import { ClipboardList, User, CreditCard, Sparkles, Plus, MapPin, Maximize, Hash, Brush, Edit3, Box, Smartphone, Check } from 'lucide-react';
import CustomSelect from '../../components/forms/CustomSelect';

interface Props {
  formData: any;
  setFormData: (data: any) => void;
  staffOptions: string[];
  order: any;
}

const ClientInfoEdit: React.FC<Props> = ({ formData, setFormData, staffOptions, order }) => {
  const occasionOptions = ["Wedding", "Birthday", "Engagement", "Anniversary", "House Warming", "Puberty Function", "Other"];
  const referenceOptions = ["Already Client", "Instagram", "Walk-In", "By Client", "Other"];
  const placeOptions = ["NGL", "MTM", "TVL", "Chennai", "Online"];
  const cardOptionChoices = ["Sticker", "Band", "Satin Ribbon", "Rope", "Corner Cutting", "Envelope", "Insert Leaf", "Buttersheet", "Tag", "Org. Ribbon", "Foiling", "Screen Printing", "UV", "SC Offset", "New Die", "Dry Flower / Fresh", "Ready Seal", "Special Paper", "Custom Seal", "Pasting", "Others"];

  return (
    <>
      <div className="mb-8">
        <div className="section-title"><ClipboardList size={14} /> Order Information</div>
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <div className="input-group">
              <label className="input-label">Order No</label>
              <div className="input-field-wrapper readonly"><div className="view-text">#{order?.order_number}</div></div>
            </div>
            <CustomSelect label="Order Taken By" id="taken_by" value={formData.order_details?.order_taken_by} options={staffOptions} onSelect={(val: string) => setFormData({...formData, order_details: {...formData.order_details, order_taken_by: val}})} />
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
                    <div key={place} className={`flex items-center justify-center py-3 rounded-xl border-2 transition-all cursor-pointer text-[10px] font-black uppercase tracking-wider ${isSelected ? 'bg-teal-50 border-teal-500 text-teal-700 shadow-sm' : 'bg-white border-slate-100 text-slate-400'}`} onClick={() => setFormData({...formData, order_details: {...formData.order_details, order_placed_in: place}})}>
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
                    <div key={ref} className={`flex items-center gap-2 p-3 rounded-xl border-2 transition-all cursor-pointer ${isSelected ? 'bg-emerald-50 border-emerald-500 text-emerald-700 shadow-sm' : 'bg-white border-slate-100 text-slate-400'}`} onClick={() => setFormData({...formData, order_details: {...formData.order_details, reference: ref}})}>
                      <div className={`w-3 h-3 rounded-full border-2 ${isSelected ? 'bg-emerald-500 border-emerald-500' : 'border-slate-200'}`}></div>
                      <span className={`text-[10px] font-bold ${isSelected ? 'text-emerald-900' : 'text-slate-600'}`}>{ref}</span>
                    </div>
                  );
                })}
              </div>
            </div>

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
          <CustomSelect label="Occasion" id="occasion" value={formData.client_info?.occasion} options={occasionOptions} onSelect={(val: string) => setFormData({...formData, client_info: {...formData.client_info, occasion: val}})} />
        </div>
      </div>

      <div className="mb-8">
        <div className="section-title"><CreditCard size={14} /> Card Specifications</div>
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-3">
            {[
              { id: 'customize', label: 'Customize Card', sub: 'Custom design', icon: Brush },
              { id: 'semi_customize', label: 'Semi-Customize', sub: 'Semi custom', icon: Edit3 },
              { id: 'ready_made', label: 'Ready Made', sub: 'Stock items', icon: Box },
              { id: 'digital_local', label: 'Digital Local', sub: 'Digital only', icon: Smartphone }
            ].map(type => {
              const isSelected = formData.card_specs?.type?.split(',').includes(type.id);
              return (
                <div key={type.id} className={`relative flex flex-col items-center text-center p-4 rounded-2xl border-2 transition-all cursor-pointer ${isSelected ? 'bg-teal-50 border-teal-500 shadow-md' : 'bg-white border-slate-100'}`} onClick={() => {
                  let types = formData.card_specs?.type?.split(',').filter(Boolean) || [];
                  if (types.includes(type.id)) { types = types.filter((t: string) => t !== type.id); } else { types.push(type.id); }
                  setFormData({...formData, card_specs: {...formData.card_specs, type: types.join(',')}});
                }}>
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
              <CustomSelect label="Card Lam." id="card_lam" value={formData.card_specs?.card_lamination} options={['none', 'matt', 'glossy', 'velvet', 'others']} onSelect={(val: string) => setFormData({...formData, card_specs: {...formData.card_specs, card_lamination: val}})} />
              <CustomSelect label="Env. Lam." id="env_lam" value={formData.card_specs?.envelope_lamination} options={['none', 'matt', 'glossy', 'velvet', 'others']} onSelect={(val: string) => setFormData({...formData, card_specs: {...formData.card_specs, envelope_lamination: val}})} />
            </div>
          </div>

          <div>
            <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2 mb-4">
              <Plus size={12} /> Additional Options
            </h4>
            <div className="grid grid-cols-2 gap-2">
              {cardOptionChoices.map(opt => {
                const isSelected = formData.card_specs?.card_options?.split(',').includes(opt);
                return (
                  <div key={opt} className={`flex items-center gap-2 p-2.5 rounded-xl border transition-all cursor-pointer ${isSelected ? 'bg-teal-50 border-teal-200' : 'bg-white border-slate-100'}`} onClick={() => {
                    let list = formData.card_specs?.card_options?.split(',').filter(Boolean) || [];
                    if (list.includes(opt)) { list = list.filter((i: string) => i !== opt); } else { list.push(opt); }
                    setFormData({...formData, card_specs: {...formData.card_specs, card_options: list.join(',')}});
                  }}>
                    <div className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${isSelected ? 'bg-teal-500 border-teal-500 text-white' : 'border-slate-300'}`}>
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
  );
};

export default ClientInfoEdit;
