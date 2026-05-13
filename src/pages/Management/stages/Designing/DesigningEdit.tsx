import React from 'react';
import { IonInput } from '@ionic/react';
import { Layout, Clock, Palette } from 'lucide-react';
import CustomSelect from '../../components/forms/CustomSelect';
import FormCheckboxGroup from '../../components/forms/FormCheckboxGroup';

interface Props {
  formData: any;
  setFormData: (data: any) => void;
  staffOptions: string[];
}

const DesigningEdit: React.FC<Props> = ({ formData, setFormData, staffOptions }) => {
  const designOutputChoices = ["Invitation in Draft", "Buttersheet / Master", "Gift Frame", "PDF"];
  const cardOptionChoices = ["Sticker", "Band", "Satin Ribbon", "Rope", "Corner Cutting", "Envelope", "Insert Leaf", "Buttersheet", "Tag", "Org. Ribbon", "Foiling", "Screen Printing", "UV", "SC Offset", "New Die", "Dry Flower / Fresh", "Ready Seal", "Special Paper", "Custom Seal", "Pasting", "Others"];

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
              className={`flex items-center justify-center py-3 px-2 rounded-2xl border text-[10px] font-black uppercase tracking-wider transition-all active:scale-95 cursor-pointer ${formData.process_status?.[p.key] ? 'bg-teal-500 border-teal-500 text-white shadow-lg shadow-teal-200' : 'bg-white border-slate-100 text-slate-400'}`}
              onClick={() => {
                let newStatus = { ...formData.process_status, [p.key]: !formData.process_status?.[p.key] };
                if (p.key === 'content_received' && newStatus.content_received) {
                  newStatus.content_not_received = false;
                } else if (p.key === 'content_not_received' && newStatus.content_not_received) {
                  newStatus.content_received = false;
                }
                setFormData({...formData, process_status: newStatus});
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
            <CustomSelect label="Assigned To" id="assign_to" required={true} value={formData.work_assign?.assigned_to} options={staffOptions} onSelect={(val: string) => setFormData({...formData, work_assign: {...formData.work_assign, assigned_to: val}})} />
            <div className="input-group">
              <label className="input-label">Assigned Date<span className="text-rose-500 ml-1 font-bold">*</span></label>
              <div className="input-field-wrapper"><IonInput type="date" value={formData.work_assign?.assigned_date} onIonChange={e => setFormData({...formData, work_assign: {...formData.work_assign, assigned_date: e.detail.value!}})} className="custom-ion-input" /></div>
            </div>
            <div className="input-group">
              <label className="input-label">Deadline<span className="text-rose-500 ml-1 font-bold">*</span></label>
              <div className="input-field-wrapper"><IonInput type="date" value={formData.work_assign?.deadline} onIonChange={e => setFormData({...formData, work_assign: {...formData.work_assign, deadline: e.detail.value!}})} className="custom-ion-input" /></div>
            </div>
            <CustomSelect label="Content By" id="cont_by" required={true} value={formData.work_assign?.content_by} options={staffOptions} onSelect={(val: string) => setFormData({...formData, work_assign: {...formData.work_assign, content_by: val}})} />
            <CustomSelect label="Completed By" id="comp_by" required={true} value={formData.work_assign?.completed_by} options={staffOptions} onSelect={(val: string) => setFormData({...formData, work_assign: {...formData.work_assign, completed_by: val}})} />
            <div className="input-group">
              <label className="input-label">Completed Date<span className="text-rose-500 ml-1 font-bold">*</span></label>
              <div className="input-field-wrapper"><IonInput type="date" value={formData.work_assign?.completed_date} onIonChange={e => setFormData({...formData, work_assign: {...formData.work_assign, completed_date: e.detail.value!}})} className="custom-ion-input" /></div>
            </div>
          </div>
        </div>
      </div>

      <div>
        <div className="section-title"><Palette size={14} /> Design Details</div>
        <div className="space-y-6 mt-4">
          <FormCheckboxGroup label="Design Outputs" required={true} value={formData.design_details?.outputs} options={designOutputChoices} onSelect={(val: string) => setFormData({...formData, design_details: {...formData.design_details, outputs: val}})} />
          <FormCheckboxGroup label="Print & Add-ons" value={formData.design_details?.add_ons} options={cardOptionChoices} onSelect={(val: string) => setFormData({...formData, design_details: {...formData.design_details, add_ons: val}})} />
        </div>
      </div>
    </div>
  );
};

export default DesigningEdit;
