import React from 'react';
import { Layout, CheckCircle2, Clock, Palette } from 'lucide-react';
import { ManagementOrder } from '../../types';

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
              className={`flex items-center gap-2 py-2.5 px-3 rounded-2xl border text-[10px] font-black uppercase tracking-wider ${order?.designing?.process_status?.[p.key] ? 'bg-teal-500 border-teal-500 text-white shadow-md shadow-teal-100' : 'bg-white border-slate-50 text-slate-300'}`}
            >
              {order?.designing?.process_status?.[p.key] && <CheckCircle2 size={12} />}
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
              <label className="input-label">Deadline</label>
              <div className="input-field-wrapper readonly"><div className="view-text font-bold text-rose-500">{order?.designing?.work_assign?.deadline || 'No deadline'}</div></div>
            </div>
            <div className="input-group">
              <label className="input-label">Completed By</label>
              <div className="input-field-wrapper readonly"><div className="view-text">{order?.designing?.work_assign?.completed_by || 'Not Completed'}</div></div>
            </div>
          </div>
        </div>
      </div>

      <div>
        <div className="section-title"><Palette size={14} /> Design Details</div>
        <div className="space-y-6 mt-4">
          <div className="input-group">
            <label className="input-label">Design Outputs</label>
            <div className="input-field-wrapper readonly" style={{ minHeight: '40px' }}>
              <div className="view-text">{order?.designing?.design_details?.outputs || 'None'}</div>
            </div>
          </div>
          <div className="input-group">
            <label className="input-label">Print & Add-ons</label>
            <div className="input-field-wrapper readonly" style={{ minHeight: '60px' }}>
              <div className="view-text">{order?.designing?.design_details?.add_ons || 'None'}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DesigningView;
