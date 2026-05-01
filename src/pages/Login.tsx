import React, { useState } from 'react';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonInput,
  IonItem,
  IonLabel,
  IonButton,
  IonText,
  IonLoading,
} from '@ionic/react';
import { LogIn, Mail, Lock } from 'lucide-react';
import api from '../api/api';
import { useHistory } from 'react-router-dom';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const history = useHistory();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await api.post('/login', { email, password });
      if (response.data.success) {
        localStorage.setItem('auth_token', response.data.data.token);
        localStorage.setItem('auth_user', JSON.stringify(response.data.data.user));
        history.push('/dashboard');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <IonPage>
      <IonContent fullscreen className="ion-padding bg-slate-50">
        <div className="flex flex-col justify-center min-h-full max-w-md mx-auto space-y-12 py-12">
          <div className="text-center space-y-4">
            <div className="inline-flex p-4 bg-indigo-600 rounded-[2rem] text-white shadow-xl shadow-indigo-600/20">
              <LogIn size={32} />
            </div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">Benny Cards</h1>
            <p className="text-slate-500 font-bold uppercase tracking-[0.2em] text-[10px]">Admin Portal Access</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-4">
              <div className="bg-white p-2 rounded-3xl border border-slate-100 shadow-sm">
                <div className="flex items-center px-4 py-2 gap-3">
                  <Mail className="text-slate-400" size={18} />
                  <input
                    type="email"
                    placeholder="Email Address"
                    className="w-full py-2 bg-transparent text-slate-900 font-bold placeholder:text-slate-300 focus:outline-none"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="bg-white p-2 rounded-3xl border border-slate-100 shadow-sm">
                <div className="flex items-center px-4 py-2 gap-3">
                  <Lock className="text-slate-400" size={18} />
                  <input
                    type="password"
                    placeholder="Password"
                    className="w-full py-2 bg-transparent text-slate-900 font-bold placeholder:text-slate-300 focus:outline-none"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>

            {error && (
              <div className="bg-rose-50 text-rose-600 p-4 rounded-2xl text-xs font-black uppercase tracking-widest text-center border border-rose-100 animate-shake">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 text-white py-4 rounded-[2rem] font-black uppercase tracking-widest shadow-xl shadow-indigo-600/20 active:scale-95 transition-all hover:bg-indigo-700 disabled:opacity-50"
            >
              {loading ? 'Authenticating...' : 'Sign In'}
            </button>
          </form>

          <p className="text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            Authorized Personnel Only
          </p>
        </div>
        <IonLoading isOpen={loading} message="Checking credentials..." />
      </IonContent>
    </IonPage>
  );
};

export default Login;
