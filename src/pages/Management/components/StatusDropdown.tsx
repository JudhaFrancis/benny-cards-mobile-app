import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { IonSpinner } from '@ionic/react';

interface Props {
  status: string;
  onStatusChange: (newStatus: string) => void;
  updating?: boolean;
}

const StatusDropdown: React.FC<Props> = ({ status, onStatusChange, updating = false }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (s: string) => {
    onStatusChange(s);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <div
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-teal-100 bg-teal-50/30 cursor-pointer transition-all active:scale-95`}
        onClick={() => setIsOpen(!isOpen)}
      >
        {updating ? (
          <IonSpinner name="crescent" size="small" style={{ width: '12px', height: '12px' }} />
        ) : (
          <>
            <span className="text-[10px] font-black text-teal-600 uppercase tracking-wider">{status}</span>
            <ChevronDown size={10} className={`text-teal-600 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
          </>
        )}
      </div>
      {isOpen && (
        <>
          <div className="dropdown-backdrop" onClick={() => setIsOpen(false)} />
          <div className="custom-dropdown-list shadow-2xl" style={{ top: '35px', width: '120px', right: 0, left: 'auto' }}>
            {['Pending', 'Process', 'Completed'].map(s => (
              <div 
                key={s} 
                className={`dropdown-item text-[11px] py-2.5 ${status === s ? 'active' : ''}`} 
                onClick={() => handleSelect(s)}
              >
                {status === s ? 'Selected' : s}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default StatusDropdown;
