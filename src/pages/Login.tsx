import React, { useState, useEffect } from 'react';
import {
  IonContent,
  IonPage,
  IonLoading,
} from '@ionic/react';
import { LogIn, Mail, Lock, AlertCircle, ArrowRight } from 'lucide-react';
import api from '../api/api';
import { useHistory } from 'react-router-dom';
import './Login.css';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [companyLogo, setCompanyLogo] = useState<string | null>(null);
  const [companyName, setCompanyName] = useState<string | null>(null);
  const history = useHistory();

  const fetchLogo = async () => {
    try {
      const response = await api.get('/settings/logo');
      if (response.data.success && response.data.data) {
        setCompanyLogo(response.data.data.logo);
        setCompanyName(response.data.data.company_name);
      }
    } catch (e) {
      console.error('Login: Failed to fetch logo', e);
    }
  };

  useEffect(() => {
    fetchLogo();
  }, []);

  const getImageSource = (path: string) => {
    if (!path) return '';
    if (path.startsWith('data:image') || path.startsWith('http')) return path;
    const baseUrl = import.meta.env.VITE_BACKEND_API_URL;
    return `${baseUrl}/${path}`;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const baseUrl = import.meta.env.VITE_BACKEND_API_URL;
      await api.get(`${baseUrl}/sanctum/csrf-cookie`, { baseURL: '' });

      const response = await api.post('/login', { email, password });

      if (response.data.success) {
        localStorage.setItem('auth_token', response.data.data.token);
        localStorage.setItem('auth_user', JSON.stringify(response.data.data.user));
        // Force a full reload to clear any stale Ionic/Tab state
        window.location.href = '/dashboard';
      }
    } catch (err: any) {
      if (err.response?.status === 401) {
        setError('Invalid credentials. Please verify your email and password.');
      } else {
        setError(err.response?.data?.message || 'Connection lost. Please check your internet and try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <IonPage>
      <IonContent fullscreen className="ion-padding login-content">
        <div className="login-container space-y-10 py-12">

          {/* Brand Header */}
          <div className="text-center space-y-6">
            <div className="flex flex-col items-center gap-4">
              <div className="logo-container">
                {companyLogo ? (
                  <img
                    src={getImageSource(companyLogo)}
                    className="w-full h-full object-contain"
                    alt="Logo"
                  />
                ) : (
                  <LogIn size={32} style={{ color: '#3cc0c2' }} />
                )}
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#3cc0c2] block">
                  {companyName || "BENNY CARDS"}
                </span>
                <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Management Portal</h1>
              </div>
            </div>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-3">
                <label className="text-xs font-semibold text-slate-700 ml-1 block">Email Address</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-[#3cc0c2] transition-colors duration-300" />
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="login-input"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-xs font-semibold text-slate-700 ml-1 block">Password</label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-[#3cc0c2] transition-colors duration-300" />
                  <input
                    type="password"
                    placeholder="Enter your password"
                    className="login-input"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>

            {error && (
              <div className="error-message">
                <AlertCircle size={18} className="shrink-0" />
                {error}
              </div>
            )}

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="login-button"
              >
                {loading ? 'Accessing Portal...' : 'Sign In'}
                {!loading && <ArrowRight size={18} />}
              </button>
            </div>
          </form>

          {/* Footer */}
          <div className="pt-8 border-t border-slate-100 text-center">
            <p className="text-[10px] text-slate-400 font-medium uppercase tracking-widest">
              &copy; 2026 Benny Cards • Management Console
            </p>
          </div>
        </div>
        <IonLoading isOpen={loading} message="Authenticating..." />
      </IonContent>
    </IonPage>
  );
};

export default Login;
