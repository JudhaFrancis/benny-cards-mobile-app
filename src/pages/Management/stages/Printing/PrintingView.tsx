import React from 'react';
import { Printer, Building2, Palette, Edit2, Box, Smartphone, AlertCircle } from 'lucide-react';
import { ManagementOrder } from '../../types';

interface Props {
  order: ManagementOrder | null;
  activeTypes: string[];
  typeLabels: Record<string, string>;
}

const PrintingView: React.FC<Props> = ({ order, activeTypes, typeLabels }) => {
  return (
    <div className="space-y-8">
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
  );
};

export default PrintingView;
