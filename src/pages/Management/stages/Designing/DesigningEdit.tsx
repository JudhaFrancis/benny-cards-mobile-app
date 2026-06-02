import React from 'react';
import { IonInput } from '@ionic/react';
import { Layout, Clock, Palette, Calendar, Image as ImageIcon, UploadCloud } from 'lucide-react';
import { formatDate } from '../../../../utils/dateUtils';
import CustomSelect from '../../components/forms/CustomSelect';
import FormCheckboxGroup from '../../components/forms/FormCheckboxGroup';
import { BASE_URL } from '../../../../api/config';
import { Plus, Check } from 'lucide-react';

interface Props {
  formData: any;
  setFormData: (data: any) => void;
  staffOptions: string[];
}

const DesigningEdit: React.FC<Props> = ({ formData, setFormData, staffOptions }) => {
  const assignedDateRef = React.useRef<HTMLInputElement>(null);
  const deadlineRef = React.useRef<HTMLInputElement>(null);
  const completedDateRef = React.useRef<HTMLInputElement>(null);
  
  const designOutputChoices = ["Invitation in Draft", "Buttersheet / Master", "Gift Frame", "PDF"];
  const [newAddon, setNewAddon] = React.useState('');
  const [cardOptionChoices, setCardOptionChoices] = React.useState<string[]>(() => {
    const initialChoices = ["Sticker", "Band", "Satin Ribbon", "Rope", "Corner Cutting", "Envelope", "Insert Leaf", "Buttersheet", "Tag", "Org. Ribbon", "Foiling", "Screen Printing", "UV", "SC Offset", "New Die", "Dry Flower / Fresh", "Ready Seal", "Special Paper", "Custom Seal"];
    const selectedAddons = formData.design_print?.print_addons || formData.print_addons || '';
    const selectedArray = selectedAddons ? (Array.isArray(selectedAddons) ? selectedAddons : selectedAddons.split(',').filter(Boolean)) : [];
    const customAddons = selectedArray.filter((addon: string) => !initialChoices.includes(addon));
    return Array.from(new Set([...initialChoices, ...customAddons]));
  });

  const handleAddAddon = () => {
    if (newAddon.trim() && !cardOptionChoices.includes(newAddon.trim())) {
      const addedOption = newAddon.trim();
      setCardOptionChoices([...cardOptionChoices, addedOption]);
      setNewAddon('');
      
      const val = formData.design_print?.print_addons || formData.print_addons || '';
      const selectedArray = val ? (Array.isArray(val) ? val : val.split(',').filter(Boolean)) : [];
      const newArray = [...selectedArray, addedOption];
      if (formData.design_print) {
        setFormData({...formData, design_print: {...formData.design_print, print_addons: newArray.join(',')}});
      } else {
        setFormData({...formData, print_addons: newArray.join(',')});
      }
    }
  };

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
              className={`flex items-center justify-center py-3 px-2 rounded-2xl border text-[10px] font-black uppercase tracking-wider transition-all active:scale-95 cursor-pointer ${formData.work_assign?.[p.key] ? 'bg-teal-500 border-teal-500 text-white shadow-lg shadow-teal-200' : 'bg-white border-slate-100 text-slate-400'}`}
              onClick={() => {
                let newWorkAssign = { ...formData.work_assign, [p.key]: !formData.work_assign?.[p.key] };
                if (p.key === 'content_received' && newWorkAssign.content_received) {
                  newWorkAssign.content_not_received = false;
                } else if (p.key === 'content_not_received' && newWorkAssign.content_not_received) {
                  newWorkAssign.content_received = false;
                }
                setFormData({...formData, work_assign: newWorkAssign});
              }}
            >
              {p.label}
            </div>
          ))}
        </div>
      </div>

      <div>
        <div className="section-title"><Clock size={14} /> Work Assignment</div>
        <div className="space-y-4 mt-4">
          <div className="grid grid-cols-1 gap-4">
            <CustomSelect label="Assigned To" id="assign_to" required={true} value={formData.work_assign?.assigned_to} options={staffOptions} placeholder="Select designer" onSelect={(val: string) => setFormData({...formData, work_assign: {...formData.work_assign, assigned_to: val}})} />
            <div className="input-group">
              <label className="input-label">Assigned Date<span className="text-rose-500 ml-1 font-bold">*</span></label>
              <div 
                className="input-field-wrapper relative cursor-pointer group active:bg-slate-50 transition-colors"
                onClick={() => (assignedDateRef.current as any)?.showPicker()}
              >
                <Calendar size={14} className="text-slate-400 group-focus-within:text-teal-500" />
                <div className={`view-text flex-1 ${!formData.work_assign?.assigned_date ? 'text-slate-400 font-medium' : 'text-slate-800 font-bold'}`}>
                  {formData.work_assign?.assigned_date ? formatDate(formData.work_assign?.assigned_date) : 'Select Date'}
                </div>
                <input 
                  ref={assignedDateRef}
                  type="date" 
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
                  value={formData.work_assign?.assigned_date || ''} 
                  onChange={e => setFormData({...formData, work_assign: {...formData.work_assign, assigned_date: e.target.value}})} 
                />
              </div>
            </div>
            <div className="input-group">
              <label className="input-label">Deadline<span className="text-rose-500 ml-1 font-bold">*</span></label>
              <div 
                className="input-field-wrapper relative cursor-pointer group active:bg-slate-50 transition-colors"
                onClick={() => (deadlineRef.current as any)?.showPicker()}
              >
                <Calendar size={14} className="text-slate-400 group-focus-within:text-teal-500" />
                <div className={`view-text flex-1 ${!formData.work_assign?.deadline ? 'text-slate-400 font-medium' : 'text-slate-800 font-bold'}`}>
                  {formData.work_assign?.deadline ? formatDate(formData.work_assign?.deadline) : 'Select Date'}
                </div>
                <input 
                  ref={deadlineRef}
                  type="date" 
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
                  value={formData.work_assign?.deadline || ''} 
                  onChange={e => setFormData({...formData, work_assign: {...formData.work_assign, deadline: e.target.value}})} 
                />
              </div>
            </div>
            <div className="input-group">
              <label className="input-label">Deadline Hours</label>
              <div className="grid grid-cols-3 gap-2 mt-1">
                {[
                  { label: '2 Hr', value: 2 },
                  { label: '4 Hr', value: 4 },
                  { label: '6 Hr', value: 6 },
                  { label: '8 Hr', value: 8 },
                  { label: '10 Hr', value: 10 },
                  { label: '11-24 Hr', value: 24 }
                ].map(option => {
                  const isSelected = Number(formData.work_assign?.deadline_hours) === option.value;
                  return (
                    <div 
                      key={option.value}
                      className={`flex items-center justify-center py-3 rounded-xl border-2 transition-all cursor-pointer text-[10px] font-bold tracking-wider ${isSelected ? 'bg-teal-500 border-teal-500 text-white shadow-md shadow-teal-100' : 'bg-white border-slate-100 text-slate-600'}`}
                      onClick={() => setFormData({...formData, work_assign: {...formData.work_assign, deadline_hours: option.value}})}
                    >
                      {option.label}
                    </div>
                  );
                })}
              </div>
            </div>
            <CustomSelect label="Content By" id="cont_by" required={true} value={formData.work_assign?.content_by} options={staffOptions} placeholder="Select staff" onSelect={(val: string) => setFormData({...formData, work_assign: {...formData.work_assign, content_by: val}})} />
            <CustomSelect label="Completed By" id="comp_by" required={true} value={formData.work_assign?.completed_by} options={staffOptions} placeholder="Select staff" onSelect={(val: string) => setFormData({...formData, work_assign: {...formData.work_assign, completed_by: val}})} />
            <div className="input-group">
              <label className="input-label">Completed Date<span className="text-rose-500 ml-1 font-bold">*</span></label>
              <div 
                className="input-field-wrapper relative cursor-pointer group active:bg-slate-50 transition-colors"
                onClick={() => (completedDateRef.current as any)?.showPicker()}
              >
                <Calendar size={14} className="text-slate-400 group-focus-within:text-teal-500" />
                <div className={`view-text flex-1 ${!formData.work_assign?.completed_date ? 'text-slate-400 font-medium' : 'text-slate-800 font-bold'}`}>
                  {formData.work_assign?.completed_date ? formatDate(formData.work_assign?.completed_date) : 'Select Date'}
                </div>
                <input 
                  ref={completedDateRef}
                  type="date" 
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
                  value={formData.work_assign?.completed_date || ''} 
                  onChange={e => setFormData({...formData, work_assign: {...formData.work_assign, completed_date: e.target.value}})} 
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div>
        <div className="section-title"><Palette size={14} /> DESIGN – CHECKED & GIVEN TO PRINT</div>
        <div className="space-y-6 mt-4">
          <FormCheckboxGroup 
            label="Design Outputs" 
            required={true} 
            value={formData.design_print?.design_outputs || formData.design_outputs} 
            options={designOutputChoices} 
            onSelect={(val: string) => {
              if (formData.design_print) {
                setFormData({...formData, design_print: {...formData.design_print, design_outputs: val}});
              } else {
                setFormData({...formData, design_outputs: val});
              }
            }} 
          />
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="input-label block !mb-0">Print & Add-ons</label>
              
              <div className="flex gap-2 items-center w-full max-w-[170px]">
                <div className="input-field-wrapper flex-1 bg-white !m-0 !py-0 !px-3 h-[30px] !min-h-[30px] !rounded-lg border shadow-sm">
                  <input 
                    type="text"
                    value={newAddon} 
                    placeholder="Add new addon..." 
                    onChange={e => setNewAddon(e.target.value)} 
                    onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleAddAddon(); } }}
                    className="w-full h-full bg-transparent border-none outline-none text-[10px] font-bold text-slate-700 placeholder:text-[10px] placeholder:font-medium placeholder:text-slate-400"
                    style={{ fontSize: '10px' }}
                  />
                </div>
                <div 
                  onClick={handleAddAddon}
                  className="flex items-center justify-center bg-[#3cc0c2] text-white px-3 h-[30px] rounded-lg text-[10px] font-bold cursor-pointer transition-all shadow-sm active:scale-95"
                  style={{ backgroundColor: '#3cc0c2', color: 'white' }}
                >
                  Add
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {cardOptionChoices.map(opt => {
                const val = formData.design_print?.print_addons || formData.print_addons || '';
                const selectedArray = val ? (Array.isArray(val) ? val : val.split(',').filter(Boolean)) : [];
                const isSelected = selectedArray.includes(opt);
                return (
                  <div key={opt} className={`flex items-center gap-2 p-2.5 rounded-xl border transition-all cursor-pointer ${isSelected ? 'bg-teal-50 border-teal-200' : 'bg-white border-slate-100'}`} onClick={() => {
                    let newArray;
                    if (isSelected) {
                      newArray = selectedArray.filter((s: string) => s !== opt);
                    } else {
                      newArray = [...selectedArray, opt];
                    }
                    if (formData.design_print) {
                      setFormData({...formData, design_print: {...formData.design_print, print_addons: newArray.join(',')}});
                    } else {
                      setFormData({...formData, print_addons: newArray.join(',')});
                    }
                  }}>
                    <div className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${isSelected ? 'bg-teal-500 border-teal-500 text-white' : 'border-slate-300'}`}>
                      {isSelected && <Check size={10} strokeWidth={4} />}
                    </div>
                    <span className={`text-[10px] font-bold ${isSelected ? 'text-teal-900' : 'text-slate-600'}`}>{opt}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Sticker Upload Area */}
          <div className="mt-6 border-t border-slate-100 pt-6">
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
      </div>
    </div>
  );
};

export default DesigningEdit;
