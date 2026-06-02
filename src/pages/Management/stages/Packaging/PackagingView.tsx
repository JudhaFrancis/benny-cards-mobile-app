import React from 'react';
import { Box, Download, CheckCircle2, Calendar as CalendarIcon, Scissors, User, Mail, Smile, Tag as TagIcon, Gift, Plus, Clock, Type, Hash } from 'lucide-react';
import { ManagementOrder } from '../../types';
import { formatDate } from '../../../../utils/dateUtils';

interface Props {
  order: ManagementOrder | null;
}

const PackagingView: React.FC<Props> = ({ order }) => {
  return (
    <div className="space-y-8">
      <div className="bg-slate-50/50 rounded-3xl p-6 border border-slate-100 space-y-6">
        <h3 className="section-title"><Box size={14} /> Logistics Status</h3>
        <div className="grid grid-cols-1 gap-4">
          <div className={`p-4 rounded-2xl border ${order?.packaging?.packaging_logistics?.card_received ? 'bg-teal-500 border-teal-500 text-white shadow-lg' : 'bg-white border-slate-100 text-slate-400'}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Download size={16} />
                <span className="text-xs font-bold uppercase tracking-wider">Card Received</span>
              </div>
              {order?.packaging?.packaging_logistics?.card_received && <CheckCircle2 size={16} />}
            </div>
            {order?.packaging?.packaging_logistics?.card_received && order?.packaging?.packaging_logistics?.card_received_date && (
              <div className="mt-2 text-[10px] font-medium opacity-80 flex items-center gap-1">
                <CalendarIcon size={10} /> Received on {formatDate(order.packaging.packaging_logistics.card_received_date)}
              </div>
            )}
          </div>
          <div className={`p-4 rounded-2xl border ${order?.packaging?.packaging_logistics?.crafting_done ? 'bg-teal-500 border-teal-500 text-white shadow-lg' : 'bg-white border-slate-100 text-slate-400'}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Scissors size={16} />
                <span className="text-xs font-bold uppercase tracking-wider">Crafting Done</span>
              </div>
              {order?.packaging?.packaging_logistics?.crafting_done && <CheckCircle2 size={16} />}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-slate-50/50 rounded-3xl p-6 border border-slate-100 space-y-6">
        <h3 className="section-title"><User size={14} /> Assignment</h3>
        <div className="space-y-4">
          <div className="input-group">
            <label className="input-label">Assigned By</label>
            <div className="input-field-wrapper readonly bg-white"><div className="view-text">{Array.isArray(order?.packaging?.packaging_logistics?.assigned_by_multiple) ? order.packaging.packaging_logistics.assigned_by_multiple.join(', ') : 'N/A'}</div></div>
          </div>
          <div className="input-group">
            <label className="input-label">Crafted By</label>
            <div className="input-field-wrapper readonly bg-white"><div className="view-text">{Array.isArray(order?.packaging?.packaging_logistics?.crafted_by_multiple) ? order.packaging.packaging_logistics.crafted_by_multiple.join(', ') : 'N/A'}</div></div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-5">
        <div className="section-title"><Clock size={14} /> Work Details</div>
        
        <div className="space-y-4">
          <div className="input-group">
            <label className="input-label">Names</label>
            <div className="input-field-wrapper readonly bg-slate-50/50">
              <Type size={14} className="text-slate-400 mr-2" />
              <div className="view-text">{order?.packaging?.packaging_logistics?.names || 'N/A'}</div>
            </div>
          </div>

          <div className="input-group">
            <label className="input-label">Date</label>
            <div className="input-field-wrapper readonly bg-slate-50/50">
              <CalendarIcon size={14} className="text-slate-400 mr-2" />
              <div className="view-text">{formatDate(order?.packaging?.packaging_logistics?.date)}</div>
            </div>
          </div>
          <div className="input-group">
            <label className="input-label">Packed Qty</label>
            <div className="input-field-wrapper readonly bg-slate-50/50">
              <Hash size={14} className="text-slate-400 mr-2" />
              <div className="view-text font-bold text-teal-600">{order?.packaging?.packaging_logistics?.qty_cards || 'N/A'}</div>
            </div>
          </div>

          <div className="input-group">
            <label className="input-label">Start Time</label>
            <div className="input-field-wrapper readonly bg-slate-50/50">
              <Clock size={14} className="text-slate-400 mr-2" />
              <div className="view-text">{order?.packaging?.packaging_logistics?.start_time || 'N/A'}</div>
            </div>
          </div>
          <div className="input-group">
            <label className="input-label">End Time</label>
            <div className="input-field-wrapper readonly bg-slate-50/50">
              <Clock size={14} className="text-slate-400 mr-2" />
              <div className="view-text">{order?.packaging?.packaging_logistics?.end_time || 'N/A'}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-slate-50/50 rounded-3xl p-6 border border-slate-100 space-y-6">
        <h3 className="section-title"><Box size={14} /> Selected Components</h3>
        <div className="grid grid-cols-3 gap-3">
          {[
            { key: 'envelope', label: 'Envelope', icon: Mail },
            { key: 'sticker', label: 'Sticker', icon: Smile },
            { key: 'crafting', label: 'Crafting', icon: Scissors },
            { key: 'tag', label: 'Tag', icon: TagIcon },
            { key: 'ribbon', label: 'Ribbon', icon: Gift },
            { key: 'others', label: 'Others', icon: Plus }
          ].map(item => {
            const isSelected = order?.packaging?.packaging_logistics?.selected_items?.includes(item.key);
            return (
              <div key={item.key}
                className={`flex flex-col items-center gap-2 p-3 rounded-2xl border transition-all ${isSelected ? 'bg-teal-500 border-teal-500 text-white shadow-lg' : 'bg-white border-slate-50 text-slate-200'}`}
              >
                <item.icon size={18} />
                <span className="text-[9px] font-black uppercase tracking-wider">{item.label}</span>
              </div>
            );
          })}
        </div>
        {order?.packaging?.packaging_logistics?.selected_items?.includes('others') && (
          <div className="input-group mb-0 mt-4">
            <label className="input-label text-[10px]">Other Items</label>
            <div className="input-field-wrapper readonly bg-white"><div className="view-text">{order?.packaging?.packaging_logistics?.others_type || 'N/A'}</div></div>
          </div>
        )}
      </div>

      <div className="input-group">
        <label className="input-label">Issues in Card</label>
        <div className="input-field-wrapper readonly" style={{ minHeight: '60px' }}>
          <div className="view-text italic text-rose-500">{order?.packaging?.packaging_logistics?.card_issues || 'No issues found.'}</div>
        </div>
      </div>
    </div>
  );
};

export default PackagingView;
