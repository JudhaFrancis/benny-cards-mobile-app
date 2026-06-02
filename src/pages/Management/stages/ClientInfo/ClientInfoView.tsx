import React from 'react';
import { ClipboardList, User, CreditCard, Sparkles, Plus, Brush, Edit3, Box, Smartphone } from 'lucide-react';
import { ManagementOrder } from '../../types';
import { formatDate } from '../../../../utils/dateUtils';

interface Props {
  order: ManagementOrder | null;
  typeLabels: Record<string, string>;
}

const ClientInfoView: React.FC<Props> = ({ order, typeLabels }) => {
  return (
    <>
      <div className="mb-8">
        <div className="section-title"><ClipboardList size={14} /> Order Information</div>
        <div className="space-y-4">
          <div className="input-group">
            <label className="input-label">Order No</label>
            <div className="input-field-wrapper readonly"><div className="view-text">#{order?.order_number}</div></div>
          </div>
          <div className="input-group">
            <label className="input-label">Order Date</label>
            <div className="input-field-wrapper readonly">
              <div className="view-text">{formatDate(order?.order_date)}</div>
            </div>
          </div>
          <div className="input-group">
            <label className="input-label">Order Taken By</label>
            <div className="input-field-wrapper readonly"><div className="view-text">{order?.client_information?.order_details?.order_taken_by || 'N/A'}</div></div>
          </div>
          <div className="input-group">
            <label className="input-label">Delivery Date</label>
            <div className="input-field-wrapper readonly"><div className="view-text">{formatDate(order?.client_information?.order_details?.expected_delivery_date)}</div></div>
          </div>
          <div className="input-group">
            <label className="input-label">Order Placed In</label>
            <div className="input-field-wrapper readonly"><div className="view-text">{order?.client_information?.order_details?.order_placed_in || 'N/A'}</div></div>
          </div>
          <div className="input-group">
            <label className="input-label">Reference</label>
            <div className="input-field-wrapper readonly"><div className="view-text">{order?.client_information?.order_details?.reference || 'N/A'}</div></div>
          </div>
          {order?.client_information?.order_details?.remarks && (
            <div className="input-group">
              <label className="input-label">Remarks</label>
              <div className="input-field-wrapper readonly" style={{ minHeight: '60px' }}>
                <div className="view-text">{order?.client_information?.order_details?.remarks}</div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="mb-8">
        <div className="section-title"><User size={14} /> Client Information</div>
        <div className="space-y-4">
          <div className="input-group">
            <label className="input-label">Name</label>
            <div className="input-field-wrapper readonly"><div className="view-text">{order?.client_information?.client_info?.name || order?.customer_details?.name || 'N/A'}</div></div>
          </div>
          <div className="input-group">
            <label className="input-label">Place (Address)</label>
            <div className="input-field-wrapper readonly"><div className="view-text">{order?.client_information?.client_info?.address || order?.customer_details?.address || 'N/A'}</div></div>
          </div>
          <div className="input-group">
            <label className="input-label">Contact No</label>
            <div className="input-field-wrapper readonly"><div className="view-text">{order?.client_information?.client_info?.phone || order?.customer_details?.phone || 'N/A'}</div></div>
          </div>
          <div className="input-group">
            <label className="input-label">Occasion</label>
            <div className="input-field-wrapper readonly">
              <div className="view-text">
                {order?.client_information?.client_info?.occasion === 'Other' 
                  ? order?.client_information?.client_info?.other_occasion || 'Other'
                  : order?.client_information?.client_info?.occasion || 'N/A'}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <div className="section-title"><CreditCard size={14} /> Card Specifications</div>
        <div className="space-y-6">
          <div className="space-y-3">
            <label className="input-label">Product Type</label>
            <div className="grid grid-cols-2 gap-3">
              {[
                { id: 'customize', label: 'Customize Card', sub: 'Custom design and printing', icon: Brush },
                { id: 'ready_made', label: 'Ready Made Card', sub: 'Pre-designed stock items', icon: Box }
              ].map(type => {
                const isSelected = order?.client_information?.card_specs?.type?.split(',').includes(type.id);
                return (
                  <div key={type.id} className={`relative flex flex-col items-center text-center p-4 rounded-2xl border-2 transition-all ${isSelected ? 'bg-teal-50 border-teal-500 shadow-md' : 'bg-white border-slate-100 opacity-60'}`}>
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-2 ${isSelected ? 'bg-teal-500 text-white' : 'bg-slate-100 text-slate-400'}`}>
                      <type.icon size={20} />
                    </div>
                    <span className={`text-[10px] font-bold ${isSelected ? 'text-teal-900' : 'text-slate-600'}`}>{type.label}</span>
                    <span className="text-[8px] text-slate-400 mt-0.5">{type.sub}</span>
                    {isSelected && <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-teal-500"></div>}
                  </div>
                );
              })}
            </div>
          </div>          <div className="space-y-4">
            <div className="input-group">
              <label className="input-label">Card Size</label>
              <div className="input-field-wrapper readonly"><div className="view-text">{order?.client_information?.card_specs?.card_size || 'N/A'}</div></div>
            </div>
            <div className="input-group">
              <label className="input-label">Quantity</label>
              <div className="input-field-wrapper readonly"><div className="view-text font-bold text-teal-600">{order?.client_information?.card_specs?.quantity || order?.total_quantity || 'N/A'}</div></div>
            </div>
            <div className="input-group">
              <label className="input-label">DETAILED SPECIFICATIONS</label>
              <div className="specs-box">{order?.client_information?.card_specs?.specifications || 'No detailed specifications provided'}</div>
            </div>
          </div>

          <div className="p-5 bg-slate-50/50 rounded-3xl border border-slate-100 space-y-4">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2 mb-2">
              <Sparkles size={12} /> Paper & Finish
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="view-group">
                <label>INNER GSM</label>
                <p>{order?.client_information?.card_specs?.inner_gsm || 'N/A'}</p>
              </div>
              <div className="view-group">
                <label>ENVELOPE GSM</label>
                <p>{order?.client_information?.card_specs?.envelope_gsm || 'N/A'}</p>
              </div>
              <div className="view-group">
                <label>CARD LAMINATION</label>
                <p className="capitalize">
                  {order?.client_information?.card_specs?.card_lamination === 'others'
                    ? order?.client_information?.card_specs?.other_card_lamination || 'Others'
                    : order?.client_information?.card_specs?.card_lamination || 'none'}
                </p>
              </div>
              <div className="view-group">
                <label>ENVELOPE LAMINATION</label>
                <p className="capitalize">
                  {order?.client_information?.card_specs?.envelope_lamination === 'others'
                    ? order?.client_information?.card_specs?.other_envelope_lamination || 'Others'
                    : order?.client_information?.card_specs?.envelope_lamination || 'none'}
                </p>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2 mb-3">
              <Plus size={12} /> Additional Options
            </h4>
            <div className="flex flex-wrap gap-2">
              {order?.client_information?.card_specs?.card_options?.split(',').filter(Boolean).map((opt: string) => (
                <div key={opt} className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-100 rounded-full shadow-sm">
                  <div className="w-1.5 h-1.5 rounded-full bg-teal-500"></div>
                  <span className="text-[10px] font-bold text-slate-700">
                    {opt === 'Others' && order?.client_information?.card_specs?.other_card_options 
                      ? order?.client_information?.card_specs?.other_card_options 
                      : opt}
                  </span>
                </div>
              ))}
              {(!order?.client_information?.card_specs?.card_options) && <span className="text-[10px] text-slate-400 italic">No additional options selected</span>}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ClientInfoView;
