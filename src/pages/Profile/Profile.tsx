import React, { useEffect, useState } from 'react';
import {
  IonContent,
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButton,
  IonIcon,
  IonList,
  IonItem,
  IonLabel,
  IonAvatar,
  IonSpinner
} from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { 
  User, 
  LogOut, 
  ShieldCheck, 
  Mail, 
  Phone, 
  ChevronRight,
  Settings
} from 'lucide-react';
import api from '../../api/api';
import './Profile.css';

const Profile: React.FC = () => {
  const history = useHistory();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Immediately check localStorage so the new user name shows up instantly
    const storedUser = localStorage.getItem('auth_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
        setLoading(false); // We have local data, so we can stop showing the spinner early
      } catch (e) {
        console.error('Profile: Failed to parse stored user', e);
      }
    }

    // 2. Then fetch from API to keep everything perfectly synced
    const fetchUser = async () => {
      try {
        const response = await api.get('/user');
        if (response.data && response.data.name) {
          setUser(response.data);
          localStorage.setItem('auth_user', JSON.stringify(response.data));
        }
      } catch (err) {
        console.error('Profile: Failed to fetch user from API', err);
        // If API fails, we ALREADY have the localStorage user set above.
        // DO NOT overwrite it with defaults here.
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    history.push('/login');
  };

  if (loading) {
    return (
      <IonPage>
        <div className="flex items-center justify-center h-full">
          <IonSpinner name="crescent" color="primary" />
        </div>
      </IonPage>
    );
  }

  return (
    <IonPage className="profile-page">
      <IonContent fullscreen>
        <div className="profile-container">
          
          {/* Header Hero */}
          <div className="profile-header">
            <div className="avatar-wrapper">
              <div className="avatar-placeholder">
                {String(user?.name || 'B').charAt(0).toUpperCase()}
              </div>
              <div className="status-badge"></div>
            </div>
            <h1>{String(user?.name || 'Benny Cards')}</h1>
            <p className="user-role">
              {typeof user?.role_name === 'string' ? user.role_name : 
               typeof user?.role === 'string' ? user.role : 
               typeof user?.role?.name === 'string' ? user.role.name : 
               'Super Admin'}
            </p>
          </div>

          {/* Info Section */}
          <div className="profile-content">
            <div className="info-card">
              <div className="info-item">
                <div className="icon-box" style={{ background: 'rgba(60, 192, 194, 0.1)', color: '#3cc0c2' }}>
                  <User size={18} />
                </div>
                <div className="info-text">
                  <label>Full Name</label>
                  <span>{String(user?.name || 'Benny Cards')}</span>
                </div>
              </div>

              <div className="info-item">
                <div className="icon-box" style={{ background: 'rgba(60, 192, 194, 0.1)', color: '#3cc0c2' }}>
                  <Mail size={18} />
                </div>
                <div className="info-text">
                  <label>Email Address</label>
                  <span>{String(user?.email || 'admin@gmail.com')}</span>
                </div>
              </div>
              
              <div className="info-item">
                <div className="icon-box" style={{ background: 'rgba(60, 192, 194, 0.1)', color: '#3cc0c2' }}>
                  <ShieldCheck size={18} />
                </div>
                <div className="info-text">
                  <label>Account Type</label>
                  <span>
                    {typeof user?.role_name === 'string' ? user.role_name : 
                     typeof user?.role === 'string' ? user.role : 
                     typeof user?.role?.name === 'string' ? user.role.name : 
                     'Super Admin'}
                  </span>
                </div>
              </div>
            </div>

            {/* Logout Button */}
            <div className="logout-wrapper">
              <button onClick={handleLogout} className="logout-btn">
                <LogOut size={20} />
                Sign Out Account
              </button>
              <p className="version-text">Version 1.0.4 (Stable)</p>
            </div>
          </div>

        </div>
      </IonContent>
    </IonPage>
  );
};

export default Profile;
