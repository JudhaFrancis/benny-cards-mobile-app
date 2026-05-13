import React from 'react';
import { 
  FileSearch, 
  Palette, 
  Printer, 
  Box, 
  Truck 
} from 'lucide-react';
import StatusDropdown from './StatusDropdown';

interface Props {
  stage: string;
  status: string;
  onStatusChange: (newStatus: string) => void;
  updating?: boolean;
}

const StageHeader: React.FC<Props> = ({ stage, status, onStatusChange, updating }) => {
  const getIcon = () => {
    switch (stage) {
      case 'client-information': return <FileSearch size={20} />;
      case 'designing': return <Palette size={20} />;
      case 'printing': return <Printer size={20} />;
      case 'packaging': return <Box size={20} />;
      case 'delivery': return <Truck size={20} />;
      default: return <FileSearch size={20} />;
    }
  };

  return (
    <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-50">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-xl bg-teal-50 text-teal-600">
          {getIcon()}
        </div>
        <h3 className="text-[0.82rem] font-bold text-slate-800 uppercase tracking-wider">
          {stage.replace(/-/g, ' ')}
        </h3>
      </div>

      <StatusDropdown 
        status={status} 
        onStatusChange={onStatusChange} 
        updating={updating} 
      />
    </div>
  );
};

export default StageHeader;
