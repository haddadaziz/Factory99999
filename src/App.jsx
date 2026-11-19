import { Routes, Route, Navigate, Link } from 'react-router-dom';
import{useAuth} from './hooks/useAuth';
import {ROLES} from './constants';
import ProtectedRoute from './routes/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import UnauthorizedPage from './pages/UnauthorizedPage';

function RootRedirect() {
  const {isAuthenticated,role,loading} = useAuth();

  if(loading){
    return <div className="loading-container">{"Chargement de l application ..."}</div>
  }

  if(!isAuthenticated){
    return <Navigate to="/login" replace/>;
  }

  return role === ROLES.ADMIN ? (<Navigate to="/admin" replace/>) : (<Navigate to ="/operator" replace />);
}

function NavigationHeader() {
  const {user,role,logout} = useAuth();

  return (
    <header className="main-header">
      <div className="header-brand">
        <Link to="/" className="brand-title">FactoryFlow - Usine de Production</Link>
        <span className="user-badge">
          Rôle: {role}
        </span>
      </div>
      
      <div className="header-user">
        <span className="user-name">
          Connecté : <strong className="user-name">{user?.name}</strong>
        </span>
        <button onClick={logout} className="btn btn-logout">
          Déconnexion
        </button>
      </div>
    </header>
  )
}

export function App() {
  const {isAuthenticated} = useAuth();

  return (
    <div className="app-container">
      {isAuthenticated && <NavigationHeader/>}

      <main className="main-content">
        <Routes>
          <Route path="/" element={<RootRedirect/>}></Route>
          <Route path="/login" element={<LoginPage/>}></Route>
          <Route path="/unauthorized" element={<UnauthorizedPage/>}></Route>
          <Route element={<ProtectedRoute allowedRoles={[ROLES.ADMIN]}/>}></Route>
          <Route path="/admin" element={
            <div className="dashboard-placeholder">
              <h2>Tableau de Bord Admin</h2>
              <p> Gestion des stocks, matieres premieres ,produits et ordres</p>
            </div>
          }></Route>
          <Route path="/operator" element={
            <div className="dashboard-placeholder">
              <h2>Poste de Travail Atelier -Opérateur</h2>
              <p>Suivi de démarrage des ordres de fabrication</p>
            </div>
          }></Route>
          <Route path="*" element={
            <div className="not-found-page">
              <h2>404 - Page Introuvable</h2>
              <Link to="/" className="btn btn-secondary">{"Retour à l'acceuil"}</Link>
            </div>
          }></Route>    
        </Routes>
      </main>
    </div>
  );
}

export default App;
