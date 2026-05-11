import React, { useEffect, useState } from 'react';
import {
  IonContent,
  IonPage,
  IonSpinner,
  IonToast,
  IonInput,
  IonTextarea
} from '@ionic/react';
import { useParams, useHistory } from 'react-router-dom';
import {
  User,
  Clock,
  ChevronLeft,
  Save,
  ChevronDown,
  ChevronUp,
  ClipboardList
} from 'lucide-react';
import api from '../../api/api';
import './OrderEdit.css';
import '../Orders/OrderDetail.css'; 


interface OrderDetail {
  id: number;
  order_number: string;
  customer_details?: {
    name: string;
    phone?: string;
    email?: string;
    address?: string;
  };
  total_amount: number;
  status: string;
  resolved_status: string;
  payment_status?: string;
  order_date: string;
  items?: Array<{
    id: number;
    product_name: string;
    quantity: number;
    price: any;
  }>;
}

const OrderEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const history = useHistory();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
  const [order, setOrder] = useState<OrderDetail | null>(null);

  const [formData, setFormData] = useState({
    customer_name: '',
    customer_phone: '',
    customer_address: '',
    status: ''
  });

  const statuses = [
    'New Order', 'Confirmed',
    'Printing in Progress', 'Printed',
    'Packing in Progress', 'Packed',
    'Out for Delivery', 'Delivered',
    'Cancelled'
  ];

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/orders/${id}`);
        if (response.data.success) {
          const data = response.data.data;
          setOrder(data);
          setFormData({
            customer_name: data.customer_details?.name || '',
            customer_phone: data.customer_details?.phone || '',
            customer_address: data.customer_details?.address || '',
            status: data.resolved_status || ''
          });
        }
      } catch (error) {
        console.error('Error fetching order:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  const handleSave = async () => {
    try {
      setSaving(true);
      const response = await api.put(`/orders/${id}`, {
        customer_details: {
          name: formData.customer_name,
          phone: formData.customer_phone,
          address: formData.customer_address
        },
        status: formData.status
      });

      if (response.data.success) {
        setToastMessage('Order updated successfully');
        setShowToast(true);
        setTimeout(() => history.push(`/orders/${id}`), 1000);
      }
    } catch (error) {
      console.error('Error updating order:', error);
      setToastMessage('Failed to update order');
      setShowToast(true);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <IonPage>
        <IonContent>
          <div className="flex flex-col items-center justify-center h-full space-y-4">
            <IonSpinner name="crescent" color="primary" />
            <p className="text-sm font-bold text-slate-400">Loading Edit Mode...</p>
          </div>
        </IonContent>
      </IonPage>
    );
  }

  return (
    <IonPage className="order-edit-page">
      <IonContent fullscreen>
        <div className="order-edit-container pb-20">

          {/* Header Section */}
          <div className="header-hero mt-0">
            <button onClick={() => history.goBack()} className="back-btn-float mb-4">
              <ChevronLeft size={24} />
            </button>

            <div className="header-meta">
              <div className="order-title-group">
                <p>Edit Order</p>
                <h1>#{order?.order_number}</h1>
              </div>
              <div className="header-amount-box">
                <span className="label">Total Amount</span>
                <span className="amount">₹{Number(order?.total_amount).toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Form Fields Card */}
          <div className="detail-card">
            <div className="section-title">
              <User size={14} />
              Customer Details
            </div>

            <div className="space-y-4">
              <div className="input-group">
                <label className="input-label">Customer Name</label>
                <div className="input-field-wrapper">
                  <IonInput
                    value={formData.customer_name}
                    placeholder="Enter name"
                    onIonChange={(e) => setFormData({ ...formData, customer_name: e.detail.value! })}
                    className="custom-ion-input"
                  />
                </div>
              </div>

              <div className="input-group">
                <label className="input-label">Contact Number</label>
                <div className="input-field-wrapper">
                  <IonInput
                    value={formData.customer_phone}
                    placeholder="Enter phone"
                    onIonChange={(e) => setFormData({ ...formData, customer_phone: e.detail.value! })}
                    className="custom-ion-input"
                  />
                </div>
              </div>

              <div className="input-group">
                <label className="input-label">Shipping Address</label>
                <div className="input-field-wrapper">
                  <IonTextarea
                    value={formData.customer_address}
                    placeholder="Enter address"
                    rows={2}
                    onIonChange={(e) => setFormData({ ...formData, customer_address: e.detail.value! })}
                    className="custom-ion-input"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Tracking Section with Custom Dropdown */}
          <div className="detail-card management-section">
            <div className="section-title">
              <Clock size={14} />
              Tracking & Management
            </div>

            <div className="input-group mb-4 relative">
              <label className="input-label">Current Status</label>
              <div
                className="custom-dropdown-trigger"
                onClick={() => setIsStatusDropdownOpen(!isStatusDropdownOpen)}
              >
                <span className="selected-value">{formData.status}</span>
                <div className="dropdown-icon">
                  {isStatusDropdownOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </div>
              </div>

              {isStatusDropdownOpen && (
                <div className="custom-dropdown-list shadow-2xl">
                  {statuses.map((s) => (
                    <div
                      key={s}
                      className={`dropdown-item ${formData.status === s ? 'active' : ''}`}
                      onClick={() => {
                        setFormData({ ...formData, status: s });
                        setIsStatusDropdownOpen(false);
                      }}
                    >
                      {s}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Bottom Actions Area */}
            <div className="mt-8 flex flex-col gap-3">
              <button
                onClick={handleSave}
                disabled={saving}
                className="save-btn"
              >
                {saving ? <IonSpinner name="crescent" /> : <Save size={18} />}
                SAVE ALL CHANGES
              </button>
              <button
                onClick={() => history.goBack()}
                className="cancel-btn"
              >
                CANCEL EDITING
              </button>
            </div>
          </div>

        </div>
      </IonContent>

      <IonToast
        isOpen={showToast}
        onDidDismiss={() => setShowToast(false)}
        message={toastMessage}
        duration={2000}
        position="bottom"
        cssClass="custom-toast"
      />
    </IonPage>
  );
};

export default OrderEdit;
