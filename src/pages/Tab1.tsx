import { 
  IonContent, 
  IonHeader, 
  IonPage, 
  IonTitle, 
  IonToolbar, 
  IonIcon,
  IonRippleEffect
} from '@ionic/react';
import { 
  notificationsOutline, 
  walletOutline, 
  trendingUpOutline, 
  trendingDownOutline,
  fastFoodOutline,
  cartOutline,
  airplaneOutline
} from 'ionicons/icons';
import { API_URL } from '../api/config';
import './Tab1.css';

const Tab1: React.FC = () => {
  console.log('Backend API URL:', API_URL);
  return (
    <IonPage>
      <IonContent fullscreen className="ion-padding-vertical">
        <div className="dashboard-container">
          
          {/* Header Section */}
          <div className="header-section">
            <div className="welcome-text">
              <p>Welcome back,</p>
              <h2>Benny</h2>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <div className="icon-badge" style={{ fontSize: '24px', color: '#666' }}>
                <IonIcon icon={notificationsOutline} />
              </div>
              <div className="avatar-circle">
                <img src="/assets/avatar.png" alt="Profile" />
              </div>
            </div>
          </div>

          {/* Premium Card */}
          <div className="premium-card ion-activatable ripple-parent">
            <IonRippleEffect></IonRippleEffect>
            <div className="card-overlay"></div>
            <div className="card-label">Total Balance</div>
            <div className="card-value">$12,850.00</div>
            <div className="card-footer">
              <div className="card-number">**** **** **** 4285</div>
              <div style={{ fontSize: '12px', opacity: 0.8 }}>Exp: 12/26</div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-icon" style={{ backgroundColor: '#e8f5e9', color: '#2e7d32' }}>
                <IonIcon icon={trendingUpOutline} />
              </div>
              <div className="stat-label">Income</div>
              <div className="stat-value">$4,250</div>
            </div>
            <div className="stat-item">
              <div className="stat-icon" style={{ backgroundColor: '#ffebee', color: '#c62828' }}>
                <IonIcon icon={trendingDownOutline} />
              </div>
              <div className="stat-label">Expenses</div>
              <div className="stat-value">$1,840</div>
            </div>
          </div>

          {/* Transactions Section */}
          <div className="section-title">
            <h3>Recent Activity</h3>
            <a href="#">See All</a>
          </div>

          <div className="transaction-list">
            <div className="transaction-item ion-activatable ripple-parent">
              <IonRippleEffect></IonRippleEffect>
              <div className="tx-icon" style={{ backgroundColor: '#fff3e0', color: '#ef6c00' }}>
                <IonIcon icon={fastFoodOutline} />
              </div>
              <div className="tx-info">
                <div className="tx-name">McDonald's</div>
                <div className="tx-date">Today, 12:45 PM</div>
              </div>
              <div className="tx-amount negative">-$15.50</div>
            </div>

            <div className="transaction-item ion-activatable ripple-parent">
              <IonRippleEffect></IonRippleEffect>
              <div className="tx-icon" style={{ backgroundColor: '#e3f2fd', color: '#1565c0' }}>
                <IonIcon icon={cartOutline} />
              </div>
              <div className="tx-info">
                <div className="tx-name">Amazon</div>
                <div className="tx-date">Yesterday, 08:20 PM</div>
              </div>
              <div className="tx-amount negative">-$89.99</div>
            </div>

            <div className="transaction-item ion-activatable ripple-parent">
              <IonRippleEffect></IonRippleEffect>
              <div className="tx-icon" style={{ backgroundColor: '#f3e5f5', color: '#7b1fa2' }}>
                <IonIcon icon={airplaneOutline} />
              </div>
              <div className="tx-info">
                <div className="tx-name">Flight Ticket</div>
                <div className="tx-date">22 Apr, 2024</div>
              </div>
              <div className="tx-amount negative">-$450.00</div>
            </div>

            <div className="transaction-item ion-activatable ripple-parent">
              <IonRippleEffect></IonRippleEffect>
              <div className="tx-icon" style={{ backgroundColor: '#e8f5e9', color: '#2e7d32' }}>
                <IonIcon icon={walletOutline} />
              </div>
              <div className="tx-info">
                <div className="tx-name">Salary Deposit</div>
                <div className="tx-date">21 Apr, 2024</div>
              </div>
              <div className="tx-amount positive">+$3,500.00</div>
            </div>
          </div>

        </div>
      </IonContent>
    </IonPage>
  );
};

export default Tab1;
