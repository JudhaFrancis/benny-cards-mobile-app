import React from 'react';
import { IonInput, IonTextarea } from '@ionic/react';
import { Box, Download, Check, Calendar as CalendarIcon, Scissors, Type, Clock, Hash, Mail, Smile, Tag as TagIcon, Gift, Plus, User, Calendar, Image as ImageIcon, UploadCloud } from 'lucide-react';
import { formatDate } from '../../../../utils/dateUtils';
import CustomSelect from '../../components/forms/CustomSelect';
import { BASE_URL } from '../../../../api/config';

interface Props {
  formData: any;
  setFormData: (data: any) => void;
  staffOptions: string[];
}

const PackagingEdit: React.FC<Props> = ({ formData, setFormData, staffOptions }) => {
  const receivedDateRef = React.useRef<HTMLInputElement>(null);
  const workDateRef = React.useRef<HTMLInputElement>(null);
  const startTimeRef = React.useRef<HTMLInputElement>(null);
  const endTimeRef = React.useRef<HTMLInputElement>(null);

  return (
    <div className="space-y-8">
      <div className="bg-slate-50/50 rounded-3xl p-6 border border-slate-100 space-y-6">
        <h3 className="section-title"><Box size={14} /> Logistics Status</h3>
        <div className="grid grid-cols-1 gap-4">
          <div className={`p-4 rounded-2xl border transition-all ${formData.packaging_logistics?.card_received ? 'bg-teal-50 border-teal-200' : 'bg-white border-slate-100'}`}>
            <div className="flex items-center justify-between mb-3 cursor-pointer" onClick={() => setFormData({...formData, packaging_logistics: {...formData.packaging_logistics, card_received: !(formData.packaging_logistics?.card_received)}})}>
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-xl ${formData.packaging_logistics?.card_received ? 'bg-teal-500 text-white' : 'bg-slate-100 text-slate-400'}`}>
                  <Download size={16} />
                </div>
                <span className="text-xs font-bold text-slate-800">Card Received</span>
              </div>
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${formData.packaging_logistics?.card_received ? 'bg-teal-500 border-teal-500 text-white' : 'border-slate-200 bg-white'}`}>
                {formData.packaging_logistics?.card_received && <Check size={14} strokeWidth={4} />}
              </div>
            </div>
            {formData.packaging_logistics?.card_received && (
              <div className="input-group mb-0 animate-in fade-in slide-in-from-top-2">
                <div 
                  className="input-field-wrapper bg-white relative cursor-pointer group active:bg-slate-50 transition-colors"
                  onClick={() => (receivedDateRef.current as any)?.showPicker()}
                >
                  <Calendar size={14} className="text-teal-500 group-focus-within:text-teal-500" />
                  <div className={`view-text flex-1 text-[10px] ${!formData.packaging_logistics?.card_received_date ? 'text-slate-400 font-medium' : 'text-slate-800 font-bold'}`}>
                    {formData.packaging_logistics?.card_received_date ? formatDate(formData.packaging_logistics?.card_received_date) : 'Select Date'}
                  </div>
                  <input 
                    ref={receivedDateRef}
                    type="date" 
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
                    value={formData.packaging_logistics?.card_received_date || ''} 
                    onChange={e => setFormData({...formData, packaging_logistics: {...formData.packaging_logistics, card_received_date: e.target.value}})} 
                  />
                </div>
              </div>
            )}
          </div>

          <div className={`p-4 rounded-2xl border transition-all flex items-center justify-between cursor-pointer ${formData.packaging_logistics?.crafting_done ? 'bg-teal-50 border-teal-200' : 'bg-white border-slate-100'}`} onClick={() => setFormData({...formData, packaging_logistics: {...formData.packaging_logistics, crafting_done: !(formData.packaging_logistics?.crafting_done)}})}>
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
          <CustomSelect label="Assigned By" id="assigned_by" required={true} multiple={true} value={formData.packaging_logistics?.assigned_by_multiple} options={staffOptions} placeholder="Select staff" onSelect={(val: any) => setFormData({...formData, packaging_logistics: {...formData.packaging_logistics, assigned_by_multiple: val}})} />
          <CustomSelect label="Crafted By" id="crafted_by" required={true} multiple={true} value={formData.packaging_logistics?.crafted_by_multiple} options={staffOptions} placeholder="Select staff" onSelect={(val: any) => setFormData({...formData, packaging_logistics: {...formData.packaging_logistics, crafted_by_multiple: val}})} />
        </div>
      </div>

      <div className="bg-slate-50/50 rounded-3xl p-6 border border-slate-100 space-y-6">
        <h3 className="section-title"><Clock size={14} /> Work Details</h3>
        <div className="space-y-4">
          <div className="input-group">
            <label className="input-label">Names</label>
            <div className="input-field-wrapper bg-white">
              <Type size={16} className="text-slate-400" />
              <IonInput value={formData.packaging_logistics?.names} placeholder="Names on cards" onIonChange={e => setFormData({...formData, packaging_logistics: {...formData.packaging_logistics, names: e.detail.value!}})} className="custom-ion-input" />
            </div>
          </div>
          <div className="input-group">
            <label className="input-label">Date</label>
            <div 
              className="input-field-wrapper bg-white relative cursor-pointer group active:bg-slate-50 transition-colors"
              onClick={() => (workDateRef.current as any)?.showPicker()}
            >
              <Calendar size={16} className="text-slate-400 group-focus-within:text-teal-500" />
              <div className={`view-text flex-1 ${!formData.packaging_logistics?.date ? 'text-slate-400 font-medium' : 'text-slate-800 font-bold'}`}>
                {formData.packaging_logistics?.date ? formatDate(formData.packaging_logistics?.date) : 'Select Date'}
              </div>
              <input 
                ref={workDateRef}
                type="date" 
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
                value={formData.packaging_logistics?.date || ''} 
                onChange={e => setFormData({...formData, packaging_logistics: {...formData.packaging_logistics, date: e.target.value}})} 
              />
            </div>
          </div>
          <div className="input-group">
            <label className="input-label">Packed Qty</label>
            <div className="input-field-wrapper bg-white">
              <Hash size={16} className="text-slate-400" />
              <IonInput type="number" value={formData.packaging_logistics?.qty_cards} placeholder="#" onIonChange={e => setFormData({...formData, packaging_logistics: {...formData.packaging_logistics, qty_cards: e.detail.value!}})} className="custom-ion-input" />
            </div>
          </div>
          
          <div className="input-group">
            <label className="input-label">Start Time</label>
            <div 
              className="input-field-wrapper bg-white relative cursor-pointer group active:bg-slate-50 transition-colors"
              onClick={() => (startTimeRef.current as any)?.showPicker()}
            >
              <Clock size={14} className="text-slate-400 group-focus-within:text-teal-500" />
              <div className={`view-text flex-1 text-[10px] ${!formData.packaging_logistics?.start_time ? 'text-slate-400 font-medium' : 'text-slate-800 font-bold'}`}>
                {formData.packaging_logistics?.start_time || 'Select Start Time'}
              </div>
              <input 
                ref={startTimeRef}
                type="time" 
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
                value={formData.packaging_logistics?.start_time || ''} 
                onChange={e => setFormData({...formData, packaging_logistics: {...formData.packaging_logistics, start_time: e.target.value}})} 
              />
            </div>
          </div>
          <div className="input-group">
            <label className="input-label">End Time</label>
            <div 
              className="input-field-wrapper bg-white relative cursor-pointer group active:bg-slate-50 transition-colors"
              onClick={() => (endTimeRef.current as any)?.showPicker()}
            >
              <Clock size={14} className="text-slate-400 group-focus-within:text-teal-500" />
              <div className={`view-text flex-1 text-[10px] ${!formData.packaging_logistics?.end_time ? 'text-slate-400 font-medium' : 'text-slate-800 font-bold'}`}>
                {formData.packaging_logistics?.end_time || 'Select End Time'}
              </div>
              <input 
                ref={endTimeRef}
                type="time" 
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
                value={formData.packaging_logistics?.end_time || ''} 
                onChange={e => setFormData({...formData, packaging_logistics: {...formData.packaging_logistics, end_time: e.target.value}})} 
              />
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

      <div className="mt-6 border-t border-slate-200 pt-6">
        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2 mb-3">
          <ImageIcon size={12} /> Sticker Design Image (Optional)
        </label>
        <div className="flex items-center gap-4">
          {formData.design_print_file || formData.sticker_image ? (
            <div className="w-20 h-20 rounded-xl border border-slate-200 overflow-hidden relative group">
              <img 
                src={formData.design_print_file ? URL.createObjectURL(formData.design_print_file) : (formData.sticker_image?.startsWith('http') || formData.sticker_image?.startsWith('data:') ? formData.sticker_image : `${BASE_URL}/${formData.sticker_image}`)} 
                alt="Sticker" 
                className="w-full h-full object-cover" 
              />
              <div 
                className="absolute inset-0 bg-black/60 flex items-center justify-center cursor-pointer text-white text-[10px] font-bold opacity-0 hover:opacity-100 transition-opacity"
                onClick={() => {
                   setFormData({ ...formData, design_print_file: null, sticker_image: null });
                }}
              >
                Remove
              </div>
            </div>
          ) : (
            <label className="w-20 h-20 rounded-xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center gap-2 cursor-pointer bg-slate-50 text-slate-400 hover:text-teal-500 hover:border-teal-300 transition-colors">
              <UploadCloud size={20} />
              <span className="text-[9px] font-bold">Upload</span>
              <input 
                type="file" 
                accept="image/*" 
                className="hidden" 
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    setFormData({ ...formData, design_print_file: e.target.files[0] });
                  }
                }} 
              />
            </label>
          )}
          <div className="flex-1 text-[10px] text-slate-400 leading-relaxed">
            Upload a reference or print file for the sticker design. JPG, PNG or WEBP.
          </div>
        </div>
      </div>
    </div>
  );
};

export default PackagingEdit;
