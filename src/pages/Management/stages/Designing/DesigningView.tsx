import React from 'react';
import { Layout, CheckCircle2, Clock, Palette } from 'lucide-react';
import { ManagementOrder } from '../../types';
import { formatDate } from '../../../../utils/dateUtils';

interface Props {
  order: ManagementOrder | null;
}

const DesigningView: React.FC<Props> = ({ order }) => {
  return ( 
    <div className="space-y-8">
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
              className={`flex items-center gap-2 py-2.5 px-3 rounded-2xl border text-[10px] font-black uppercase tracking-wider ${order?.designing?.work_assign?.[p.key] ? 'bg-teal-500 border-teal-500 text-white shadow-md shadow-teal-100' : 'bg-white border-slate-50 text-slate-300'}`}
            >
              {order?.designing?.work_assign?.[p.key] && <CheckCircle2 size={12} />}
              {p.label}
            </div>
          ))}
        </div>
      </div>

      <div>
        <div className="section-title"><Clock size={14} /> Work Assignment</div>
        <div className="space-y-4 mt-4">
          <div className="grid grid-cols-1 gap-4">
            <div className="input-group">
              <label className="input-label">Assigned To</label>
              <div className="input-field-wrapper readonly"><div className="view-text">{order?.designing?.work_assign?.assigned_to || 'Not Assigned'}</div></div>
            </div>
            <div className="input-group">
              <label className="input-label">Assigned Date</label>
              <div className="input-field-wrapper readonly"><div className="view-text">{formatDate(order?.designing?.work_assign?.assigned_date)}</div></div>
            </div>
            <div className="input-group">
              <label className="input-label">Deadline</label>
              <div className="input-field-wrapper readonly"><div className="view-text font-bold text-rose-500">{formatDate(order?.designing?.work_assign?.deadline)}</div></div>
            </div>
            <div className="input-group">
              <label className="input-label">Deadline Hours</label>
              <div className="input-field-wrapper readonly">
                <div className="view-text font-bold text-rose-500">
                  {order?.designing?.work_assign?.deadline_hours
                    ? (order?.designing?.work_assign?.deadline_hours === 24 || order?.designing?.work_assign?.deadline_hours === '24' 
                        ? '11-24 Hours' 
                        : `${order?.designing?.work_assign?.deadline_hours} Hours`)
                    : 'N/A'}
                </div>
              </div>
            </div>
            <div className="input-group">
              <label className="input-label">Content By</label>
              <div className="input-field-wrapper readonly"><div className="view-text">{order?.designing?.work_assign?.content_by || 'N/A'}</div></div>
            </div>
            <div className="input-group">
              <label className="input-label">Completed By</label>
              <div className="input-field-wrapper readonly"><div className="view-text">{order?.designing?.work_assign?.completed_by || 'Not Completed'}</div></div>
            </div>
            <div className="input-group">
              <label className="input-label">Completed Date</label>
              <div className="input-field-wrapper readonly"><div className="view-text">{formatDate(order?.designing?.work_assign?.completed_date)}</div></div>
            </div>
          </div>
        </div>
      </div>

      <div>
        <div className="section-title"><Palette size={14} /> DESIGN – CHECKED & GIVEN TO PRINT</div>
        <div className="space-y-6 mt-4">
          <div className="input-group">
            <label className="input-label">Design Outputs</label>
            <div className="flex flex-wrap gap-2 mt-2">
              {(order?.designing?.design_print?.design_outputs || order?.designing?.design_outputs)?.split(',').filter(Boolean).map((opt: string) => (
                <div key={opt} className="bg-teal-500 text-white px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm">
                  {opt}
                </div>
              )) || <span className="text-slate-400 italic text-[11px]">None</span>}
              {(!(order?.designing?.design_print?.design_outputs || order?.designing?.design_outputs)) && <span className="text-slate-400 italic text-[11px]">None</span>}
            </div>
          </div>
          <div className="input-group">
            <label className="input-label">Print & Add-ons</label>
            <div className="flex flex-wrap gap-2 mt-2">
              {(order?.designing?.design_print?.print_addons || order?.designing?.print_addons)?.split(',').filter(Boolean).map((opt: string) => (
                <div key={opt} className="bg-slate-100 text-slate-600 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider border border-slate-200">
                  {opt}
                </div>
              )) || <span className="text-slate-400 italic text-[11px]">None</span>}
              {(!(order?.designing?.design_print?.print_addons || order?.designing?.print_addons)) && <span className="text-slate-400 italic text-[11px]">None</span>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DesigningView;
