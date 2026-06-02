import React from 'react';
import { Printer, Building2, Palette, Edit2, Box, Smartphone, AlertCircle, Check } from 'lucide-react';
import { ManagementOrder } from '../../types';
import { formatDate } from '../../../../utils/dateUtils';

interface Props {
  order: ManagementOrder | null;
  activeTypes: string[];
  typeLabels: Record<string, string>;
}

const PrintingView: React.FC<Props> = ({ order, activeTypes, typeLabels }) => {
  return (
    <div className="space-y-8">
      <div>
        <div className="section-title mb-2"><Printer size={14} /> Order & Printing Status</div>
        <div className="space-y-4">
          <div className="input-group">
            <label className="input-label">Confirmed Date</label>
            <div className="input-field-wrapper readonly"><div className="view-text">{formatDate(order?.printing?.printing_status?.confirmed_date)}</div></div>
          </div>
          <div className="input-group">
            <label className="input-label">Printer Company Name</label>
            <div className="input-field-wrapper readonly flex items-center gap-2">
              <Building2 size={14} className="text-slate-400" />
              <div className="view-text">{order?.printing?.printing_status?.company_name || 'N/A'}</div>
            </div>
            {order?.printing?.printing_status?.is_reprint && (
              <div className="mt-4 flex justify-start">
                <div className="flex items-center gap-2 px-5 py-2 bg-rose-50 text-rose-500 rounded-xl border border-rose-100 shadow-sm animate-in zoom-in duration-300">
                  <AlertCircle size={12} strokeWidth={3} />
                  <span className="text-[11px] font-black uppercase tracking-wider">Reprint</span>
                </div>
              </div>
            )}
          </div>
          <div className="flex flex-wrap gap-2 mt-4">
            {[
              { key: 'readymade_ordered', label: 'Ordered' },
              { key: 'readymade_sub_received', label: 'Received' },
              { key: 'readymade_sent_to_print', label: 'To Print' }
            ].map(p => (
              <div key={p.key}
                className={`flex-1 min-w-[100px] flex items-center justify-center py-3.5 px-3 rounded-2xl border text-[11px] font-black uppercase tracking-wider ${order?.printing?.printing_status?.[p.key] 
                  ? 'bg-teal-500 border-teal-500 text-white shadow-lg shadow-teal-100' 
                  : 'bg-white border-slate-50 text-slate-300'}`}
              >
                {p.label}
              </div>
            ))}
          </div>
        </div>
      </div>

      {activeTypes.map(type => (
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
              <label className="input-label text-[10px]">Sent to Print</label>
              <div className="input-field-wrapper readonly bg-white"><div className="view-text text-[11px]">{formatDate(order?.printing?.printing_status?.[`${type}_sent_to_print_date`])}</div></div>
            </div>
            <div className="input-group">
              <label className="input-label text-[10px]">Received Date</label>
              <div className="input-field-wrapper readonly bg-white"><div className="view-text text-[11px] font-bold text-teal-600">{formatDate(order?.printing?.printing_status?.[`${type}_delivery_date`])}</div></div>
            </div>
          </div>

          <div className="space-y-3">
            <label className="block mb-2 text-[10px] font-black uppercase tracking-wider text-slate-400">Follow Up Checklist</label>

            {/* 7-Day Grid matching Admin Panel */}
            <div className="grid grid-cols-7 gap-1.5 mb-6">
              {[1, 2, 3, 4, 5, 6, 7].map(day => {
                const dateStr = order?.printing?.printing_status?.[`${type}_sent_to_print_date`];
                let isActive = false;
                if (dateStr) {
                  const startDate = new Date(dateStr);
                  startDate.setHours(0, 0, 0, 0);
                  const today = new Date();
                  today.setHours(0, 0, 0, 0);
                  const diffDays = Math.floor((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
                  isActive = (diffDays + 1) >= day;
                }
                const isSelected = order?.printing?.printing_status?.[`${type}_follow_up`]?.split(',').includes(`Day ${day}`);

                return (
                  <div key={day} className={`flex flex-col items-center justify-center py-2 rounded-xl border ${isSelected || isActive ? 'bg-teal-500 border-teal-500 text-white' : 'bg-slate-50 border-slate-100 text-slate-300 opacity-40'}`}>
                    <span className="text-[8px] font-black mb-1">D{day}</span>
                    <div className={`w-3 h-3 rounded-sm border flex items-center justify-center ${isSelected || isActive ? 'bg-white text-teal-600' : 'border-slate-200'}`}>
                      {(isSelected || isActive) && <Check size={8} strokeWidth={4} />}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="space-y-3">
              {[1, 2, 3, 4, 5, 6, 7].map(day => {
                const note = order?.printing?.printing_status?.[`${type}_day_${day}_notes`];
                const dateStr = order?.printing?.printing_status?.[`${type}_sent_to_print_date`];
                let isActive = false;
                if (dateStr) {
                  const startDate = new Date(dateStr);
                  startDate.setHours(0, 0, 0, 0);
                  const today = new Date();
                  today.setHours(0, 0, 0, 0);
                  const diffDays = Math.floor((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
                  isActive = (diffDays + 1) >= day;
                }

                // Only show notes for active days or if a note exists
                if (!isActive && !note) return null;

                return (
                  <div key={day} className="p-3 rounded-2xl bg-white border border-slate-100 shadow-sm flex items-start gap-3">
                    <div className={`w-6 h-6 rounded-lg flex-shrink-0 flex items-center justify-center ${isActive ? 'bg-teal-500 text-white shadow-sm' : 'bg-slate-100 text-slate-400'}`}>
                      <span className="text-[10px] font-bold">{day}</span>
                    </div>
                    <div className="flex-1">
                      <div className="mb-2">
                        <span className="px-2 py-0.5 rounded-lg text-[9px] font-black bg-teal-50 text-teal-600 border border-teal-100 uppercase tracking-wider">
                          Follow-up Status (Day {day})
                        </span>
                      </div>
                      <div className="text-[12px] text-slate-600 font-medium leading-relaxed">
                        {note || <span className="text-slate-300/60 italic">No notes recorded</span>}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ))}

      <div>
        <div className="space-y-4">
          <div className="input-group">
            <label className="input-label">Printing Issues</label>
            <div className="input-field-wrapper readonly" style={{ minHeight: '40px' }}>
              <div className="view-text italic text-rose-500">{order?.printing?.printing_status?.printing_issues || 'No issues reported.'}</div>
            </div>
          </div>
          <div className="input-group">
            <label className="input-label">Delay Reason</label>
            <div className="input-field-wrapper readonly" style={{ minHeight: '40px' }}>
              <div className="view-text italic text-amber-600">{order?.printing?.printing_status?.delay_reason || 'No delays.'}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrintingView;
