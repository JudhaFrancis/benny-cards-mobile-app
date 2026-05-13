import React from 'react';
import { IonInput, IonTextarea } from '@ionic/react';
import { Printer, Building2, Palette, Edit2, Box, Smartphone, Check, AlertCircle } from 'lucide-react';

interface Props {
  formData: any;
  setFormData: (data: any) => void;
  activeTypes: string[];
  typeLabels: Record<string, string>;
}

const PrintingEdit: React.FC<Props> = ({ formData, setFormData, activeTypes, typeLabels }) => {
  return (
    <div className="space-y-8">
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
                      if (list.includes(`Day ${day}`)) { list = list.filter((d: string) => d !== `Day ${day}`); } else { list.push(`Day ${day}`); }
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
  );
};

export default PrintingEdit;
