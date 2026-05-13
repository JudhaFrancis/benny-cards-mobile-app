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
}

const CustomSelect: React.FC<Props> = ({ 
  label, 
  value, 
  options, 
  onSelect, 
  id, 
  required = false, 
  multiple = false 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectedArray = multiple ? (Array.isArray(value) ? value : []) : [value];

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
        <span className="selected-value text-slate-900">
          {multiple ? (selectedArray.length > 0 ? selectedArray.join(', ') : `Select ${label}`) : (value || `Select ${label}`)}
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
