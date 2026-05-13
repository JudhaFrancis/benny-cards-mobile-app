import React from 'react';
import { IonInput, IonTextarea } from '@ionic/react';
import { Box, Download, Check, Calendar as CalendarIcon, Scissors, Type, Clock, Hash, Mail, Smile, Tag as TagIcon, Gift, Plus } from 'lucide-react';
import CustomSelect from '../../components/forms/CustomSelect';

interface Props {
  formData: any;
  setFormData: (data: any) => void;
  staffOptions: string[];
}

const PackagingEdit: React.FC<Props> = ({ formData, setFormData, staffOptions }) => {
  return (
    <div className="space-y-8">
      <div className="bg-slate-50/50 rounded-3xl p-6 border border-slate-100 space-y-6">
        <h3 className="section-title"><Box size={14} /> Logistics Status</h3>
        <div className="grid grid-cols-1 gap-4">
          <div className={`p-4 rounded-2xl border transition-all ${formData.packaging_logistics?.card_received ? 'bg-teal-50 border-teal-200' : 'bg-white border-slate-100'}`}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-xl ${formData.packaging_logistics?.card_received ? 'bg-teal-500 text-white' : 'bg-slate-100 text-slate-400'}`}>
                  <Download size={16} />
                </div>
                <span className="text-xs font-bold text-slate-800">Card Received</span>
              </div>
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${formData.packaging_logistics?.card_received ? 'bg-teal-500 border-teal-500 text-white' : 'border-slate-200 bg-white'}`} onClick={() => setFormData({...formData, packaging_logistics: {...formData.packaging_logistics, card_received: !formData.packaging_logistics.card_received}})}>
                {formData.packaging_logistics?.card_received && <Check size={14} strokeWidth={4} />}
              </div>
            </div>
            {formData.packaging_logistics?.card_received && (
              <div className="input-group mb-0 animate-in fade-in slide-in-from-top-2">
                <div className="input-field-wrapper bg-white">
                  <CalendarIcon size={14} className="text-teal-500" />
                  <IonInput type="date" value={formData.packaging_logistics?.card_received_date} onIonChange={e => setFormData({...formData, packaging_logistics: {...formData.packaging_logistics, card_received_date: e.detail.value!}})} className="custom-ion-input text-[10px]" />
                </div>
              </div>
            )}
          </div>

          <div className={`p-4 rounded-2xl border transition-all flex items-center justify-between ${formData.packaging_logistics?.crafting_done ? 'bg-teal-50 border-teal-200' : 'bg-white border-slate-100'}`} onClick={() => setFormData({...formData, packaging_logistics: {...formData.packaging_logistics, crafting_done: !formData.packaging_logistics.crafting_done}})}>
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-xl ${formData.packaging_logistics?.crafting_done ? 'bg-teal-500 text-white' : 'bg-slate-100 text-slate-400'}`}>
                <Scissors size={16} />
              </div>
              <span className="text-xs font-bold text-slate-800">Crafting Done</span>
            </div>
            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${formData.packaging_logistics?.crafting_done ? 'bg-teal-500 border-teal-500 text-white' : 'border-slate-200 bg-white'}`}>
              {formData.packaging_logistics?.crafting_done && <Check size={14} strokeWidth={4} />}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-slate-50/50 rounded-3xl p-6 border border-slate-100 space-y-6">
        <h3 className="section-title"><User size={14} /> Assignment & Completion</h3>
        <div className="space-y-4">
          <CustomSelect label="Assigned By" id="assigned_by" required={true} multiple={true} value={formData.packaging_logistics?.assigned_by_multiple} options={staffOptions} onSelect={(val: any) => setFormData({...formData, packaging_logistics: {...formData.packaging_logistics, assigned_by_multiple: val}})} />
          <CustomSelect label="Crafted By" id="crafted_by" required={true} multiple={true} value={formData.packaging_logistics?.crafted_by_multiple} options={staffOptions} onSelect={(val: any) => setFormData({...formData, packaging_logistics: {...formData.packaging_logistics, crafted_by_multiple: val}})} />
        </div>
      </div>

      <div className="space-y-4">
        <div className="input-group">
          <label className="input-label">Names<span className="text-rose-500 ml-1 font-bold">*</span></label>
          <div className="input-field-wrapper">
            <Type size={16} className="text-slate-400" />
            <IonInput value={formData.packaging_logistics?.names} placeholder="Names on cards" onIonChange={e => setFormData({...formData, packaging_logistics: {...formData.packaging_logistics, names: e.detail.value!}})} className="custom-ion-input" />
          </div>
        </div>
        <div className="input-group">
          <label className="input-label">Date<span className="text-rose-500 ml-1 font-bold">*</span></label>
          <div className="input-field-wrapper">
            <CalendarIcon size={16} className="text-slate-400" />
            <IonInput type="date" value={formData.packaging_logistics?.date} onIonChange={e => setFormData({...formData, packaging_logistics: {...formData.packaging_logistics, date: e.detail.value!}})} className="custom-ion-input" />
          </div>
        </div>
        <div className="input-group">
          <label className="input-label">Qty of Cards<span className="text-rose-500 ml-1 font-bold">*</span></label>
          <div className="input-field-wrapper">
            <Hash size={16} className="text-slate-400" />
            <IonInput type="number" value={formData.packaging_logistics?.qty_cards} onIonChange={e => setFormData({...formData, packaging_logistics: {...formData.packaging_logistics, qty_cards: e.detail.value!}})} className="custom-ion-input" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="input-group">
            <label className="input-label">Start Time</label>
            <div className="input-field-wrapper"><IonInput type="time" value={formData.packaging_logistics?.start_time} onIonChange={e => setFormData({...formData, packaging_logistics: {...formData.packaging_logistics, start_time: e.detail.value!}})} className="custom-ion-input" /></div>
          </div>
          <div className="input-group">
            <label className="input-label">End Time</label>
            <div className="input-field-wrapper"><IonInput type="time" value={formData.packaging_logistics?.end_time} onIonChange={e => setFormData({...formData, packaging_logistics: {...formData.packaging_logistics, end_time: e.detail.value!}})} className="custom-ion-input" /></div>
          </div>
        </div>
      </div>

      <div className="bg-slate-50/50 rounded-3xl p-6 border border-slate-100 space-y-6">
        <h3 className="section-title"><Box size={14} /> Packaging Components</h3>
        <div className="grid grid-cols-3 gap-3">
          {[
            { key: 'envelope', label: 'Envelope', icon: Mail },
            { key: 'sticker', label: 'Sticker', icon: Smile },
            { key: 'crafting', label: 'Crafting', icon: Scissors },
            { key: 'tag', label: 'Tag', icon: TagIcon },
            { key: 'ribbon', label: 'Ribbon', icon: Gift },
            { key: 'others', label: 'Others', icon: Plus }
          ].map(item => {
            const isSelected = formData.packaging_logistics?.selected_items?.includes(item.key);
            return (
              <div key={item.key} className={`flex flex-col items-center gap-2 p-3 rounded-2xl border transition-all cursor-pointer ${isSelected ? 'bg-teal-500 border-teal-500 text-white shadow-lg' : 'bg-white border-slate-100 text-slate-400'}`} onClick={() => {
                let list = [...(formData.packaging_logistics.selected_items || [])];
                if (list.includes(item.key)) { list = list.filter(i => i !== item.key); } else { list.push(item.key); }
                setFormData({...formData, packaging_logistics: {...formData.packaging_logistics, selected_items: list}});
              }}>
                <item.icon size={18} />
                <span className="text-[9px] font-black uppercase tracking-wider">{item.label}</span>
              </div>
            );
          })}
        </div>
        {formData.packaging_logistics?.selected_items?.includes('others') && (
          <div className="input-group mb-0 mt-4 animate-in fade-in zoom-in-95">
            <label className="input-label text-[10px]">Specify Other Items</label>
            <div className="input-field-wrapper bg-white"><IonInput value={formData.packaging_logistics?.others_type} placeholder="Type items here..." onIonChange={e => setFormData({...formData, packaging_logistics: {...formData.packaging_logistics, others_type: e.detail.value!}})} className="custom-ion-input" /></div>
          </div>
        )}
      </div>

      <div className="input-group">
        <label className="input-label">Issues in Card</label>
        <div className="input-field-wrapper" style={{ minHeight: '100px' }}>
          <IonTextarea value={formData.packaging_logistics?.card_issues} placeholder="Describe any issues found..." onIonChange={e => setFormData({...formData, packaging_logistics: {...formData.packaging_logistics, card_issues: e.detail.value!}})} className="custom-ion-input" />
        </div>
      </div>
    </div>
  );
};

export default PackagingEdit;
