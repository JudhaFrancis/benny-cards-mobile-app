import React, { useEffect, useState } from 'react';
import {
  IonContent,
  IonPage,
  IonSpinner,
  IonToast,
  IonButton
} from '@ionic/react';
import { useParams, useHistory } from 'react-router-dom';
import { 
  User, 
  Clock, 
  ChevronLeft, 
  Edit2, 
  ClipboardList
} from 'lucide-react';
import api from '../../api/api';
import './OrderDetail.css';

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

const OrderDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const history = useHistory();
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const fetchOrderDetail = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/orders/${id}`);
      if (response.data.success) {
        setOrder(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching order detail:', error);
      setToastMessage('Failed to load order details');
      setShowToast(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrderDetail();
  }, [id]);

  if (loading) {
    return (
      <IonPage>
        <IonContent>
          <div className="flex flex-col items-center justify-center h-full space-y-4">
            <IonSpinner name="crescent" color="primary" />
            <p className="text-sm font-bold text-slate-400">Loading Order Details...</p>
          </div>
        </IonContent>
      </IonPage>
    );
  }

  if (!order) {
    return (
      <IonPage>
        <IonContent className="ion-padding">
          <div className="text-center py-20">
            <p>Order not found</p>
            <IonButton onClick={() => history.push('/orders')} fill="clear">Go back</IonButton>
          </div>
        </IonContent>
      </IonPage>
    );
  }

  return (
    <IonPage className="order-detail-page">
      <IonContent fullscreen>
        <div className="order-detail-container pb-10">
          
          {/* Header Section */}
          <div className="header-hero mt-0">
            <div className="flex justify-between items-center mb-4">
              <button onClick={() => history.push('/orders')} className="back-btn-float">
                <ChevronLeft size={24} />
              </button>
              <button 
                onClick={() => history.push(`/orders/${id}/edit`)} 
                className="header-edit-btn"
              >
                <Edit2 size={12} />
                EDIT
              </button>
            </div>
            
            <div className="header-meta">
              <div className="order-title-group">
                <p>Order Reference</p>
                <h1>#{order.order_number}</h1>
              </div>
              <div className="header-amount-box">
                <span className="label">Total Amount</span>
                <span className="amount">₹{Number(order.total_amount).toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Customer Details Card */}
          <div className="detail-card">
            <div className="section-title">
              <User size={14} />
              Customer Details
            </div>
            
            <div className="space-y-4">
              <div className="input-group">
                <label className="input-label">Customer Name</label>
                <div className="input-field-wrapper readonly">
                  <div className="view-text">{order.customer_details?.name || 'N/A'}</div>
                </div>
              </div>

              <div className="input-group">
                <label className="input-label">Contact Number</label>
                <div className="input-field-wrapper readonly">
                  <div className="view-text">{order.customer_details?.phone || 'N/A'}</div>
                </div>
              </div>

              <div className="input-group">
                <label className="input-label">Shipping Address</label>
                <div className="input-field-wrapper readonly">
                  <div className="view-text">{order.customer_details?.address || 'N/A'}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary Card */}
          {order.items && order.items.length > 0 && (
            <div className="detail-card">
              <div className="section-title">
                <ClipboardList size={14} />
                Order Summary
              </div>
              
              <div className="items-list">
                {order.items.map((item) => (
                  <div key={item.id} className="order-item">
                    <div className="item-main">
                      <span className="item-name">{item.product_name}</span>
                      <span className="item-qty">Quantity: {item.quantity}</span>
                    </div>
                    <span className="item-price">
                      ₹{Number((Number(item.price) || Number((item as any).unit_price) || 0) * (Number(item.quantity) || 0)).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tracking Section */}
          <div className="detail-card management-section">
            <div className="section-title">
              <Clock size={14} />
              Tracking & Management
            </div>
            
            <div className="input-group">
              <label className="input-label">Current Status</label>
              <div className="input-field-wrapper readonly">
                <div className="view-text">{order.resolved_status}</div>
              </div>
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

export default OrderDetail;
