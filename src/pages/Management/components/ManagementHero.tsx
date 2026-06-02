import React from 'react';
import { ChevronLeft, Edit2 } from 'lucide-react';
import { useHistory } from 'react-router-dom';
import { ManagementOrder } from '../types';

interface Props {
  order: ManagementOrder | null;
  stage?: string;
  isEdit?: boolean;
  onEdit?: () => void;
}

const ManagementHero: React.FC<Props> = ({ order, stage, isEdit = false, onEdit }) => {
  const history = useHistory();

  return (
    <>
      <div className="header-hero mt-0">
      <div className="flex justify-between items-center mb-4">
        <button onClick={() => history.goBack()} className="back-btn-float">
          <ChevronLeft size={24} />
        </button>
        {!isEdit && onEdit && (
          <button
            onClick={onEdit}
            className="header-edit-btn"
          >
            <Edit2 size={12} />
            EDIT
          </button>
        )}
      </div>
      <div className="header-meta">
        <div className="order-title-group">
          <p>Order Reference</p>
          <h1>#{order?.order_number}</h1>
        </div>
        <div className="header-amount-box">
          <span className="label">Total Amount</span>
          <span className="amount">₹{Number(order?.total_amount || 0).toLocaleString()}</span>
        </div>
      </div>
    </div>
    </>
  );
};

export default ManagementHero;
