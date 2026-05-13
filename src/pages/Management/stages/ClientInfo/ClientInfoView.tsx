import React from 'react';
import { ClipboardList, User, CreditCard, Sparkles, Plus } from 'lucide-react';
import { ManagementOrder } from '../../types';

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
              <div className="view-text">{order?.order_date ? new Date(order.order_date).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '-') : 'N/A'}</div>
            </div>
          </div>
          <div className="input-group">
            <label className="input-label">Order Taken By</label>
            <div className="input-field-wrapper readonly"><div className="view-text">{order?.client_information?.order_details?.order_taken_by || 'N/A'}</div></div>
          </div>
          <div className="input-group">
            <label className="input-label">Delivery Date</label>
            <div className="input-field-wrapper readonly"><div className="view-text">{order?.client_information?.order_details?.expected_delivery_date || 'N/A'}</div></div>
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
            <div className="input-field-wrapper readonly"><div className="view-text">{order?.client_information?.client_info?.occasion || 'N/A'}</div></div>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <div className="section-title"><CreditCard size={14} /> Card Specifications</div>
        <div className="space-y-6">
          <div className="flex flex-wrap gap-2">
            {order?.client_information?.card_specs?.type?.split(',').filter(Boolean).map((t: string) => (
              <span key={t} className="type-tag bg-teal-500 text-white border-0">{typeLabels[t] || t}</span>
            ))}
            {(!order?.client_information?.card_specs?.type) && <span className="text-[10px] text-slate-400 italic">No product type specified</span>}
          </div>

          <div className="space-y-4">
            <div className="input-group">
              <label className="input-label">Card Size</label>
              <div className="input-field-wrapper readonly"><div className="view-text">{order?.client_information?.card_specs?.card_size || 'N/A'}</div></div>
            </div>
            <div className="input-group">
              <label className="input-label">Quantity</label>
              <div className="input-field-wrapper readonly"><div className="view-text font-bold text-teal-600">{order?.client_information?.card_specs?.quantity || order?.total_quantity || 'N/A'}</div></div>
            </div>
            <div className="input-group">
              <label className="input-label">Detailed Specifications</label>
              <div className="specs-box">{order?.client_information?.card_specs?.specifications || 'No detailed specifications provided'}</div>
            </div>
          </div>

          <div className="p-5 bg-slate-50/50 rounded-3xl border border-slate-100 space-y-4">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2 mb-2">
              <Sparkles size={12} /> Paper & Finish
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="view-group">
                <label>Inner GSM</label>
                <p>{order?.client_information?.card_specs?.inner_gsm || 'N/A'}</p>
              </div>
              <div className="view-group">
                <label>Env. GSM</label>
                <p>{order?.client_information?.card_specs?.envelope_gsm || 'N/A'}</p>
              </div>
              <div className="view-group">
                <label>Card Lam.</label>
                <p className="capitalize">{order?.client_information?.card_specs?.card_lamination || 'none'}</p>
              </div>
              <div className="view-group">
                <label>Env. Lam.</label>
                <p className="capitalize">{order?.client_information?.card_specs?.envelope_lamination || 'none'}</p>
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
                  <span className="text-[10px] font-bold text-slate-700">{opt}</span>
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
