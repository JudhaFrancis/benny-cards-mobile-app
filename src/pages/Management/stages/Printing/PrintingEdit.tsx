import React, { useEffect } from 'react';
import { IonInput, IonTextarea } from '@ionic/react';
import { Printer, Building2, Palette, Edit2, Box, Smartphone, Check, AlertCircle, Calendar } from 'lucide-react';
import { formatDate } from '../../../../utils/dateUtils';

interface Props {
  formData: any;
  setFormData: (data: any) => void;
  activeTypes: string[];
  typeLabels: Record<string, string>;
}

const PrintingEdit: React.FC<Props> = ({ formData, setFormData, activeTypes, typeLabels }) => {
  const confirmedDateRef = React.useRef<HTMLInputElement>(null);
  const sentDateRefs = React.useRef<Record<string, HTMLInputElement | null>>({});
  const deliveryDateRefs = React.useRef<Record<string, HTMLInputElement | null>>({});

  // Auto-select days logic matching Admin Panel
  useEffect(() => {
    let updatedStatus = { ...formData.printing_status };
    let changed = false;

    activeTypes.forEach(type => {
      const dateStr = updatedStatus[`${type}_sent_to_print_date`];
      if (!dateStr) return;

      const startDate = new Date(dateStr);
      startDate.setHours(0, 0, 0, 0);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const diffDays = Math.floor((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));

      if (diffDays >= 0) {
        const maxDay = Math.min(diffDays + 1, 7);
        let currentFollowUp = updatedStatus[`${type}_follow_up`]?.split(',').filter(Boolean) || [];
        let typeChanged = false;

        for (let i = 1; i <= maxDay; i++) {
          const dayStr = `Day ${i}`;
          if (!currentFollowUp.includes(dayStr)) {
            currentFollowUp.push(dayStr);
            typeChanged = true;
          }
        }

        if (typeChanged) {
          updatedStatus[`${type}_follow_up`] = currentFollowUp.join(',');
          changed = true;
        }
      }
    });

    if (changed) {
      setFormData({ ...formData, printing_status: updatedStatus });
    }
  }, [formData.printing_status, activeTypes]);

  return (
    <div className="space-y-8">
      <div>
        <div className="section-title mb-2"><Printer size={14} /> Order & Printing Status</div>
        <div className="space-y-4">
          <div className="input-group">
            <label className="input-label">Confirmed Date<span className="text-rose-500 ml-1 font-bold">*</span></label>
            <div
              className="input-field-wrapper relative cursor-pointer group active:bg-slate-100 transition-colors"
              onClick={() => (confirmedDateRef.current as any)?.showPicker()}
            >
              <Calendar size={14} className="text-slate-400 group-focus-within:text-teal-500" />
              <div className={`view-text flex-1 ${!formData.printing_status?.confirmed_date ? 'text-slate-400 font-medium' : 'text-slate-800 font-bold'}`}>
                {formData.printing_status?.confirmed_date ? formatDate(formData.printing_status?.confirmed_date) : 'Select Date'}
              </div>
              <input
                ref={confirmedDateRef}
                type="date"
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
                value={formData.printing_status?.confirmed_date || ''}
                onChange={e => setFormData({ ...formData, printing_status: { ...formData.printing_status, confirmed_date: e.target.value } })}
              />
            </div>
          </div>
          <div className="input-group">
            <label className="input-label">Printer Company Name<span className="text-rose-500 ml-1 font-bold">*</span></label>
            <div className="input-field-wrapper flex items-center gap-2">
              <Building2 size={14} className="text-slate-400" />
              <IonInput value={formData.printing_status?.company_name} placeholder="Enter printer name" onIonChange={e => setFormData({ ...formData, printing_status: { ...formData.printing_status, company_name: e.detail.value! } })} className="custom-ion-input" />
            </div>
            <div className="mt-4 flex justify-start">
              <label className="flex items-center gap-3 px-4 py-2 rounded-2xl border border-slate-100 bg-slate-50/50 cursor-pointer transition-all active:scale-95 group">
                <div 
                  className={`w-5 h-5 rounded-lg border-2 flex items-center justify-center transition-all ${formData.printing_status?.is_reprint ? 'bg-rose-500 border-rose-500 shadow-sm shadow-rose-100' : 'bg-white border-slate-200 group-hover:border-rose-300'}`}
                  onClick={(e) => {
                    e.preventDefault();
                    setFormData({ ...formData, printing_status: { ...formData.printing_status, is_reprint: !formData.printing_status?.is_reprint } });
                  }}
                >
                  {formData.printing_status?.is_reprint && <Check size={14} className="text-white" strokeWidth={4} />}
                </div>
                <span className={`text-[11px] font-bold uppercase tracking-wider transition-colors ${formData.printing_status?.is_reprint ? 'text-rose-600' : 'text-slate-400 group-hover:text-rose-500'}`}>
                  Reprint
                </span>
                <input 
                  type="checkbox" 
                  className="sr-only" 
                  checked={formData.printing_status?.is_reprint || false}
                  onChange={() => setFormData({ ...formData, printing_status: { ...formData.printing_status, is_reprint: !formData.printing_status?.is_reprint } })}
                />
              </label>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 mt-4">
            {[
              { key: 'readymade_ordered', label: 'Ordered' },
              { key: 'readymade_sub_received', label: 'Received' },
              { key: 'readymade_sent_to_print', label: 'To Print' }
            ].map(p => (
              <div key={p.key}
                className={`flex-1 min-w-[100px] flex items-center justify-center py-3.5 px-3 rounded-2xl border text-[11px] font-black uppercase tracking-wider transition-all active:scale-95 cursor-pointer ${formData.printing_status?.[p.key] 
                  ? 'bg-teal-500 border-teal-500 text-white shadow-lg shadow-teal-100' 
                  : 'bg-white border-slate-100 text-slate-400'}`}
                onClick={() => setFormData({ ...formData, printing_status: { ...formData.printing_status, [p.key]: !formData.printing_status?.[p.key] } })}
              >
                {p.label}
              </div>
            ))}
          </div>
        </div>
      </div>

      {activeTypes.map(type => {
        const dateStr = formData.printing_status?.[`${type}_sent_to_print_date`];
        let calculatedMaxDay = 0;
        if (dateStr) {
          const startDate = new Date(dateStr);
          startDate.setHours(0, 0, 0, 0);
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          calculatedMaxDay = Math.floor((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
        }

        return (
          <div key={type} className="p-6 bg-slate-50/50 rounded-[2rem] border border-slate-100 space-y-4">
            <div className="section-title mb-0">
              {type === 'customize' && <Palette size={14} />}
              {type === 'semi_customize' && <Edit2 size={14} />}
              {type === 'ready_made' && <Box size={14} />}
              {type === 'digital_local' && <Smartphone size={14} />}
              {typeLabels[type] || type}
            </div>

            <div className="space-y-4">
              <div className="input-group">
                <label className="input-label text-[10px]">Sent to Print Date<span className="text-rose-500 ml-1 font-bold">*</span></label>
                <div
                  className="input-field-wrapper bg-white relative cursor-pointer group active:bg-slate-50 transition-colors"
                  onClick={() => (sentDateRefs.current[type] as any)?.showPicker()}
                >
                  <Calendar size={14} className="text-slate-400 group-focus-within:text-teal-500" />
                  <div className={`view-text flex-1 text-[11px] ${!formData.printing_status?.[`${type}_sent_to_print_date`] ? 'text-slate-400 font-medium' : 'text-slate-800 font-bold'}`}>
                    {formData.printing_status?.[`${type}_sent_to_print_date`] ? formatDate(formData.printing_status?.[`${type}_sent_to_print_date`]) : 'Select Date'}
                  </div>
                  <input
                    ref={el => { sentDateRefs.current[type] = el; }}
                    type="date"
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
                    value={formData.printing_status?.[`${type}_sent_to_print_date`] || ''}
                    onChange={e => setFormData({ ...formData, printing_status: { ...formData.printing_status, [`${type}_sent_to_print_date`]: e.target.value } })}
                  />
                </div>
              </div>
              <div className="input-group">
                <label className="input-label text-[10px]">Received Date<span className="text-rose-500 ml-1 font-bold">*</span></label>
                <div
                  className="input-field-wrapper bg-white relative cursor-pointer group active:bg-slate-50 transition-colors"
                  onClick={() => (deliveryDateRefs.current[type] as any)?.showPicker()}
                >
                  <Calendar size={14} className="text-slate-400 group-focus-within:text-teal-500" />
                  <div className={`view-text flex-1 text-[11px] ${!formData.printing_status?.[`${type}_delivery_date`] ? 'text-slate-400 font-medium' : 'text-teal-600 font-bold'}`}>
                    {formData.printing_status?.[`${type}_delivery_date`] ? formatDate(formData.printing_status?.[`${type}_delivery_date`]) : 'Select Date'}
                  </div>
                  <input
                    ref={el => { deliveryDateRefs.current[type] = el; }}
                    type="date"
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
                    value={formData.printing_status?.[`${type}_delivery_date`] || ''}
                    onChange={e => setFormData({ ...formData, printing_status: { ...formData.printing_status, [`${type}_delivery_date`]: e.target.value } })}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <label className="block mb-2 text-[10px] font-black uppercase tracking-wider text-slate-400">Follow Up Checklist</label>
              <div className="grid grid-cols-7 gap-1.5 mb-6">
                {[1, 2, 3, 4, 5, 6, 7].map(day => {
                  const isSelected = formData.printing_status?.[`${type}_follow_up`]?.split(',').includes(`Day ${day}`);
                  const isAutoActive = calculatedMaxDay >= day;

                  return (
                    <div key={day}
                      className={`flex flex-col items-center justify-center py-2 rounded-xl border transition-all cursor-pointer ${isSelected || isAutoActive ? 'bg-teal-500 border-teal-500 text-white shadow-sm' : 'bg-white border-slate-100 text-slate-300 opacity-40'}`}
                      onClick={() => {
                        let list = formData.printing_status?.[`${type}_follow_up`]?.split(',').filter(Boolean) || [];
                        if (list.includes(`Day ${day}`)) { list = list.filter((d: string) => d !== `Day ${day}`); } else { list.push(`Day ${day}`); }
                        setFormData({ ...formData, printing_status: { ...formData.printing_status, [`${type}_follow_up`]: list.join(',') } });
                      }}
                    >
                      <span className="text-[8px] font-black mb-1">D{day}</span>
                      <div className={`w-3 h-3 rounded-sm border flex items-center justify-center ${isSelected || isAutoActive ? 'bg-white text-teal-600' : 'border-slate-300'}`}>
                        {(isSelected || isAutoActive) && <Check size={8} strokeWidth={4} />}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="space-y-3">
                {[1, 2, 3, 4, 5, 6, 7].map(day => {
                  const isSelected = formData.printing_status?.[`${type}_follow_up`]?.split(',').includes(`Day ${day}`);
                  const isAutoActive = calculatedMaxDay >= day;

                  if (!isSelected && !isAutoActive) return null;

                  return (
                    <div key={day} className="flex flex-col gap-1.5 p-3 rounded-2xl bg-white border border-slate-100 shadow-sm">
                      <div className="flex items-center gap-2">
                        <span className={`text-[9px] font-black px-2 py-0.5 rounded-lg uppercase tracking-wider ${isAutoActive ? 'bg-teal-500 text-white' : 'bg-teal-50 text-teal-600 border border-teal-100'}`}>Follow-up Status (Day {day})</span>
                      </div>
                      <input
                        value={formData.printing_status?.[`${type}_day_${day}_notes`] || ''}
                        type="text"
                        className="w-full px-3 py-1.5 bg-slate-50 border border-slate-100 rounded-lg focus:border-teal-500 focus:bg-white focus:outline-none text-xs text-slate-700 font-medium"
                        placeholder={`What happened on Day ${day}?`}
                        onChange={e => setFormData({ ...formData, printing_status: { ...formData.printing_status, [`${type}_day_${day}_notes`]: e.target.value } })}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        );
      })}

      <div>
        <div className="space-y-4">
          <div className="input-group">
            <label className="input-label">Printing Issues</label>
            <div className="input-field-wrapper" style={{ minHeight: '80px' }}>
              <IonTextarea value={formData.printing_status?.printing_issues} placeholder="Describe any issues..." onIonChange={e => setFormData({ ...formData, printing_status: { ...formData.printing_status, printing_issues: e.detail.value! } })} className="custom-ion-input" />
            </div>
          </div>
          <div className="input-group">
            <label className="input-label">Delay Reason</label>
            <div className="input-field-wrapper" style={{ minHeight: '80px' }}>
              <IonTextarea value={formData.printing_status?.delay_reason} placeholder="Reason for delay..." onIonChange={e => setFormData({ ...formData, printing_status: { ...formData.printing_status, delay_reason: e.detail.value! } })} className="custom-ion-input" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrintingEdit;
