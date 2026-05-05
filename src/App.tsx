import { Redirect, Route } from 'react-router-dom';
import {
  IonApp,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
  setupIonicReact
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { 
  gridOutline, 
  receiptOutline, 
  layersOutline,
  personOutline
} from 'ionicons/icons';
import Dashboard from './pages/Dashboard';
import Orders from './pages/Orders';
import Management from './pages/Management';
import Login from './pages/Login';
import OrderDetail from './pages/OrderDetail';
import OrderEdit from './pages/OrderEdit';
import Profile from './pages/Profile';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/**
 * Ionic Dark Mode
 */
import '@ionic/react/css/palettes/dark.system.css';

/* Theme variables */
import './theme/variables.css';
import './index.css';

import { useLocation } from 'react-router-dom';

setupIonicReact();

const App: React.FC = () => {
  const location = useLocation();
  const showTabs = location.pathname !== '/login';

  return (
    <IonTabs>
      <IonRouterOutlet>
        <Route exact path="/login">
          <Login />
        </Route>
        <Route exact path="/dashboard">
          {localStorage.getItem('auth_token') ? <Dashboard /> : <Redirect to="/login" />}
        </Route>
        <Route exact path="/orders">
          {localStorage.getItem('auth_token') ? <Orders /> : <Redirect to="/login" />}
        </Route>
        <Route exact path="/orders/:id">
          {localStorage.getItem('auth_token') ? <OrderDetail /> : <Redirect to="/login" />}
        </Route>
        <Route exact path="/orders/:id/edit">
          {localStorage.getItem('auth_token') ? <OrderEdit /> : <Redirect to="/login" />}
        </Route>
        <Route path="/management">
          {localStorage.getItem('auth_token') ? <Management /> : <Redirect to="/login" />}
        </Route>
        <Route exact path="/profile">
          {localStorage.getItem('auth_token') ? <Profile /> : <Redirect to="/login" />}
        </Route>
        <Route exact path="/">
          <Redirect to="/dashboard" />
        </Route>
      </IonRouterOutlet>
      
      {showTabs && (
        <IonTabBar slot="bottom">
          <IonTabButton tab="dashboard" href="/dashboard">
            <IonIcon aria-hidden="true" icon={gridOutline} />
            <IonLabel>Dashboard</IonLabel>
          </IonTabButton>
          <IonTabButton tab="orders" href="/orders">
            <IonIcon aria-hidden="true" icon={receiptOutline} />
            <IonLabel>Orders</IonLabel>
          </IonTabButton>
          <IonTabButton tab="management" href="/management">
            <IonIcon aria-hidden="true" icon={layersOutline} />
            <IonLabel>Management</IonLabel>
          </IonTabButton>
          <IonTabButton tab="profile" href="/profile">
            <IonIcon aria-hidden="true" icon={personOutline} />
            <IonLabel>Profile</IonLabel>
          </IonTabButton>
        </IonTabBar>
      )}
    </IonTabs>
  );
};

const MainApp: React.FC = () => (
  <IonApp>
    <IonReactRouter>
      <App />
    </IonReactRouter>
  </IonApp>
);

export default MainApp;
