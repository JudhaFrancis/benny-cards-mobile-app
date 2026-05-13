import React from 'react';
import { Check } from 'lucide-react';

interface Props {
  label: string;
  value: string;
  options: string[];
  onSelect: (val: string) => void;
  required?: boolean;
}

const FormCheckboxGroup: React.FC<Props> = ({ label, value, options, onSelect, required = false }) => {
  const selectedArray = value ? (Array.isArray(value) ? value : value.split(',').filter(Boolean)) : [];
  
  const toggleOption = (opt: string) => {
    let newArray;
    if (selectedArray.includes(opt)) {
      newArray = selectedArray.filter((s: string) => s !== opt);
    } else {
      newArray = [...selectedArray, opt];
    }
    onSelect(newArray.join(','));
  };

  return (
    <div className="space-y-4">
      <label className="input-label mb-2 block">{label}{required && <span className="text-rose-500 ml-1 font-bold">*</span>}</label>
      <div className="grid grid-cols-1 gap-2">
        {options.map((opt: string) => (
          <div key={opt} className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${selectedArray.includes(opt) ? 'bg-teal-50 border-teal-200' : 'bg-white border-slate-100'}`} onClick={() => toggleOption(opt)}>
            <div className={`w-5 h-5 rounded flex items-center justify-center border transition-all ${selectedArray.includes(opt) ? 'bg-teal-500 border-teal-500 text-white' : 'bg-white border-slate-300'}`}>
              {selectedArray.includes(opt) && <Check size={12} strokeWidth={4} />}
            </div>
            <span className={`text-sm ${selectedArray.includes(opt) ? 'text-teal-900 font-bold' : 'text-slate-600 font-medium'}`}>{opt}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FormCheckboxGroup;
