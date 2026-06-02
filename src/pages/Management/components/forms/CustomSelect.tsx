import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Check } from 'lucide-react';

interface Props {
  label: string;
  value: any;
  options: string[];
  onSelect: (val: any) => void;
  id: string;
  required?: boolean;
  multiple?: boolean;
  placeholder?: string;
  icon?: React.ReactNode;
}

const CustomSelect: React.FC<Props> = ({ 
  label, 
  value, 
  options, 
  onSelect, 
  id, 
  required = false, 
  multiple = false,
  placeholder,
  icon
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectedArray = multiple ? (Array.isArray(value) ? value : []) : [value];
  const displayPlaceholder = placeholder || `Select ${label}`;

  const handleItemSelect = (opt: string) => {
    if (multiple) {
      let newList;
      if (selectedArray.includes(opt)) {
        newList = selectedArray.filter(i => i !== opt);
      } else {
        newList = [...selectedArray, opt];
      }
      onSelect(newList);
    } else {
      onSelect(opt);
      setIsOpen(false);
    }
  };

  return (
    <div className="input-group relative">
      <label className="input-label">{label}{required && <span className="text-rose-500 ml-1 font-bold">*</span>}</label>
      <div className="custom-dropdown-trigger" onClick={() => setIsOpen(!isOpen)}>
        {icon && <div className="mr-3 text-slate-400">{icon}</div>}
        <span className={`selected-value flex-1 ${!value || (multiple && selectedArray.length === 0) ? 'text-slate-400 font-medium' : 'text-slate-900 font-bold'}`}>
          {multiple ? (selectedArray.length > 0 ? selectedArray.join(', ') : displayPlaceholder) : (value || displayPlaceholder)}
        </span>
        <div className="dropdown-icon">{isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}</div>
      </div>
      {isOpen && (
        <>
          <div className="dropdown-backdrop" onClick={() => setIsOpen(false)} />
          <div className="custom-dropdown-list shadow-2xl">
            {options.map((opt: string) => (
              <div 
                key={opt} 
                className={`dropdown-item flex items-center justify-between ${selectedArray.includes(opt) ? 'active' : ''}`} 
                onClick={() => handleItemSelect(opt)}
              >
                {opt}
                {multiple && selectedArray.includes(opt) && <Check size={14} />}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default CustomSelect;
