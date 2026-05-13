import React, { useEffect, useState } from 'react';
import { IonContent, IonPage, IonToast } from '@ionic/react';
import { useParams, useHistory, useLocation } from 'react-router-dom';
import api from '../../api/api';
import { ManagementOrder, ManagementStage } from './types';

// Shared Components
import ManagementHero from './components/ManagementHero';
import StageHeader from './components/StageHeader';

// Stage Views
import ClientInfoView from './stages/ClientInfo/ClientInfoView';
import DesigningView from './stages/Designing/DesigningView';
import PrintingView from './stages/Printing/PrintingView';
import PackagingView from './stages/Packaging/PackagingView';
import DeliveryView from './stages/Delivery/DeliveryView';

// CSS
import '../Orders/OrderDetail.css';
import './ManagementEdit.css';
import './ManagementDetail.css';

const ManagementDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const history = useHistory();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const stage = (queryParams.get('stage') || 'client-information') as ManagementStage;

  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState<ManagementOrder | null>(null);
  const [updating, setUpdating] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/orders/${id}`);
      if (response.data.success) {
        setOrder(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching order:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (newStatus: string) => {
    try {
      setUpdating(true);
      const payload = new FormData();
      payload.append('_method', 'PUT');
      payload.append('status', newStatus);

      const response = await api.post(`/orders/${id}/stages/${stage}`, payload);
      if (response.data.success) {
        setToastMessage(`Status updated to ${newStatus}`);
        setShowToast(true);
        fetchOrder();
      }
    } catch (error) {
      console.error('Error updating status:', error);
      setToastMessage('Failed to update status');
      setShowToast(true);
    } finally {
      setUpdating(false);
    }
  };

  const getStageStatus = (order: ManagementOrder | null, currentStage: ManagementStage) => {
    if (!order) return 'Pending';
    switch (currentStage) {
      case 'client-information': return order.client_information?.status || 'Pending';
      case 'designing': return order.designing?.status || 'Pending';
      case 'printing': return order.printing?.status || 'Pending';
      case 'packaging': return order.packaging?.status || 'Pending';
      case 'delivery': return order.dispatch_delivery?.status || 'Pending';
      default: return 'Pending';
    }
  };

  if (loading) return null;

  const status = getStageStatus(order, stage);
  const typeLabels: Record<string, string> = {
    customize: 'Customize Card',
    semi_customize: 'Semi – Customize Card',
    ready_made: 'Ready Made Card',
    digital_local: 'Digital Local'
  };

  const renderStageContent = () => {
    switch (stage) {
      case 'client-information':
        return <ClientInfoView order={order} typeLabels={typeLabels} />;
      case 'designing':
        return <DesigningView order={order} />;
      case 'printing':
        return (
          <PrintingView 
            order={order} 
            activeTypes={order?.client_information?.card_specs?.type?.split(',').filter(Boolean) || []} 
            typeLabels={typeLabels} 
          />
        );
      case 'packaging':
        return <PackagingView order={order} />;
      case 'delivery':
        return <DeliveryView order={order} />;
      default:
        return null;
    }
  };

  return (
    <IonPage className="order-detail-page">
      <IonContent fullscreen>
        <div className="management-detail-container pb-10">
          
          <ManagementHero 
            order={order} 
            onEdit={() => history.push(`/management/${id}/edit?stage=${stage}`)} 
          />

          <div className="detail-card">
            <StageHeader 
              stage={stage} 
              status={status} 
              onStatusChange={handleStatusUpdate} 
              updating={updating} 
            />

            {renderStageContent()}
          </div>
        </div>
      </IonContent>
      <IonToast 
        isOpen={showToast} 
        onDidDismiss={() => setShowToast(false)} 
        message={toastMessage} 
        duration={2000} 
        position="bottom" 
        className="custom-toast" 
      />
    </IonPage>
  );
};

export default ManagementDetail;
