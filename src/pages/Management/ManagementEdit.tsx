import React, { useEffect, useState } from 'react';
import { IonContent, IonPage, IonSpinner, IonToast } from '@ionic/react';
import { useParams, useHistory, useLocation } from 'react-router-dom';
import { Save } from 'lucide-react';
import api from '../../api/api';
import { ManagementOrder, ManagementStage } from './types';

// Shared Components
import ManagementHero from './components/ManagementHero';
import StageHeader from './components/StageHeader';

// Stage Edit Fields
import ClientInfoEdit from './stages/ClientInfo/ClientInfoEdit';
import DesigningEdit from './stages/Designing/DesigningEdit';
import PrintingEdit from './stages/Printing/PrintingEdit';
import PackagingEdit from './stages/Packaging/PackagingEdit';
import DeliveryEdit from './stages/Delivery/DeliveryEdit';

// CSS
import '../Orders/OrderDetail.css';
import './ManagementEdit.css';

const ManagementEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const history = useHistory();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const stage = (queryParams.get('stage') || 'client-information') as ManagementStage;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [order, setOrder] = useState<ManagementOrder | null>(null);
  const [formData, setFormData] = useState<any>({});
  const [staffOptions, setStaffOptions] = useState<string[]>([]);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [orderRes, staffRes] = await Promise.all([
        api.get(`/orders/${id}`),
        api.get('/users?per_page=100')
      ]);

      if (orderRes.data.success) {
        const orderData = orderRes.data.data;
        setOrder(orderData);
        initializeFormData(orderData, stage);
      }

      if (staffRes.data.success) {
        const staffData = staffRes.data.data.data || staffRes.data.data;
        setStaffOptions(
          staffData
            .filter((user: any) => user.role?.name?.toLowerCase() !== 'user' && user.name && user.name.trim() !== '')
            .map((s: any) => s.name)
        );
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const initializeFormData = (order: any, currentStage: ManagementStage) => {
    switch (currentStage) {
      case 'client-information':
        setFormData({
          order_details: {
            ...(order.client_information?.order_details || {}),
            order_date: (order.client_information?.order_details?.order_date || order.order_date || '').split('T')[0],
            expected_delivery_date: (order.client_information?.order_details?.expected_delivery_date || order.expected_delivery_date || '').split('T')[0]
          },
          client_info: order.client_information?.client_info || order.customer_details || {},
          card_specs: order.client_information?.card_specs || {},
          status: order.client_information?.status || 'Pending'
        });
        break;
      case 'designing':
        setFormData(order.designing || { status: 'Pending', process_status: {}, work_assign: {}, design_details: {} });
        break;
      case 'printing':
        setFormData(order.printing || { status: 'Pending', printing_status: {} });
        break;
      case 'packaging':
        setFormData(order.packaging || { status: 'Pending', packaging_logistics: { selected_items: [], assigned_by_multiple: [], crafted_by_multiple: [] } });
        break;
      case 'delivery':
        setFormData(order.dispatch_delivery || { status: 'Pending', dispatch_mode: {}, delivery_location: {}, dispatch_details: { bus: {}, courier: {}, transport: {} } });
        break;
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      
      let payload: any = formData;
      let isMultipart = false;
      let method = 'put';
      let url = `/orders/${id}/stages/${stage}`;

      if (formData.design_print_file) {
        isMultipart = true;
        method = 'post'; // Laravel needs POST + _method=PUT for multipart
        const fd = new FormData();
        fd.append('_method', 'PUT');

        const appendObject = (obj: any, prefix = '') => {
          for (const key in obj) {
            if (key === 'design_print_file') continue;
            
            const val = obj[key];
            const newKey = prefix ? `${prefix}[${key}]` : key;
            
            if (val === null || val === undefined) {
              // skip
            } else if (typeof val === 'object' && !(val instanceof File) && !Array.isArray(val)) {
              appendObject(val, newKey);
            } else if (Array.isArray(val)) {
              val.forEach((item, index) => {
                fd.append(`${newKey}[]`, item);
              });
            } else {
              fd.append(newKey, val as string);
            }
          }
        };

        appendObject(formData);
        fd.append('sticker_image', formData.design_print_file);
        payload = fd;
      }

      const response = await (isMultipart 
        ? api.post(url, payload, { headers: { 'Content-Type': 'multipart/form-data' } })
        : api.put(url, payload));

      if (response.data.success) {
        setToastMessage('Changes saved successfully!');
        setShowToast(true);
        setTimeout(() => history.push(`/management/${id}?stage=${stage}`), 1000);
      }
    } catch (error: any) {
      console.error('Error saving:', error);
      if (error.response?.data?.errors) {
        const errors = error.response.data.errors;
        const firstErrorKey = Object.keys(errors)[0];
        setToastMessage(errors[firstErrorKey][0]);
      } else {
        setToastMessage(error.response?.data?.message || 'Failed to save changes');
      }
      setShowToast(true);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return null;

  const typeLabels: Record<string, string> = {
    customize: 'Customize Card',
    semi_customize: 'Semi – Customize Card',
    ready_made: 'Ready Made Card',
    digital_local: 'Digital Local'
  };

  const renderStageFields = () => {
    switch (stage) {
      case 'client-information':
        return <ClientInfoEdit formData={formData} setFormData={setFormData} staffOptions={staffOptions} order={order} />;
      case 'designing':
        return <DesigningEdit formData={formData} setFormData={setFormData} staffOptions={staffOptions} />;
      case 'printing':
        return (
          <PrintingEdit 
            formData={formData} 
            setFormData={setFormData} 
            activeTypes={order?.client_information?.card_specs?.type?.split(',').filter(Boolean) || []} 
            typeLabels={typeLabels} 
          />
        );
      case 'packaging':
        return <PackagingEdit formData={formData} setFormData={setFormData} staffOptions={staffOptions} />;
      case 'delivery':
        return <DeliveryEdit formData={formData} setFormData={setFormData} staffOptions={staffOptions} />;
      default:
        return null;
    }
  };

  return (
    <IonPage className="order-detail-page">
      <IonContent fullscreen>
        <div className="management-detail-container pb-24">
          
          <ManagementHero order={order} isEdit={true} />

          <div className="detail-card">
            <StageHeader 
              stage={stage} 
              status={formData.status} 
              onStatusChange={(s) => setFormData({...formData, status: s})} 
            />

            {renderStageFields()}
          </div>
        </div>

        <div className="fixed-bottom-action">
          <button 
            className={`save-btn ${saving ? 'opacity-70 pointer-events-none' : ''}`} 
            onClick={handleSave}
          >
            {saving ? <IonSpinner name="crescent" /> : <><Save size={18} /> SAVE CHANGES</>}
          </button>
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

export default ManagementEdit;
