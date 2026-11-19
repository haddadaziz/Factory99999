import { Routes, Route, Navigate, Link } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import { ROLES } from './constants';
import ProtectedRoute from './routes/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import UnauthorizedPage from './pages/UnauthorizedPage';
import MaterialsPage from './pages/MaterialsPage';

function RootRedirect() {
  const { isAuthenticated, role, loading } = useAuth();

  if (loading) {
    return <div className="loading-container">{"Chargement de l application ..."}</div>
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return role === ROLES.ADMIN ? (<Navigate to="/admin" replace />) : (<Navigate to="/operator" replace />);
}

function NavigationHeader() {
  const { user, role, logout } = useAuth();

  return (
    <header className="main-header">
      <div className="header-brand">
        <Link to="/" className="brand-title">FactoryFlow — Usine de Safi</Link>
        <span className="user-badge">Rôle : {role}</span>
      </div>

      <nav className="header-nav">
        {role === ROLES.ADMIN && (
          <>
            <Link to="/admin" className="nav-link">Tableau de bord</Link>
            <Link to="/admin/materials" className="nav-link">Matières Premières</Link>
          </>
        )}
        {role === ROLES.OPERATOR && (
          <Link to="/operator" className="nav-link">Atelier</Link>
        )}
      </nav>

      <div className="header-user">
        <span className="user-name">Connecté : <strong>{user?.name}</strong></span>
        <button onClick={logout} className="btn btn-logout">
          Déconnexion
        </button>
      </div>
    </header>
  );
}

export function App() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="app-container">
      {isAuthenticated && <NavigationHeader />}

      <main className="main-content">
        <Routes>
          <Route path="/" element={<RootRedirect />} />

          <Route path="/login" element={<LoginPage />} />
          <Route path="/unauthorized" element={<UnauthorizedPage />} />

          <Route element={<ProtectedRoute allowedRoles={[ROLES.ADMIN]} />}>
            <Route
              path="/admin"
              element={
                <div className="dashboard-placeholder">
                  <h2>Tableau de bord Administrateur</h2>
                  <p>Gestion globale des stocks, matières premières, produits et ordres.</p>
                </div>
              }
            />
            <Route path="/admin/materials" element={<MaterialsPage />} />
          </Route>

          <Route element={<ProtectedRoute allowedRoles={[ROLES.OPERATOR, ROLES.ADMIN]} />}>
            <Route
              path="/operator"
              element={
                <div className="dashboard-placeholder">
                  <h2>Poste de Travail Atelier — Opérateur</h2>
                  <p>Suivi et démarrage des ordres de fabrication assignés.</p>
                </div>
              }
            />
          </Route>

          <Route
            path="*"
            element={
              <div className="not-found-page">
                <h2>404 - Page Introuvable</h2>
                <Link to="/" className="btn btn-secondary">{"Retour à l'accueil"}</Link>
              </div>
            }
          />
        </Routes>
      </main>
    </div>
  );
}

export default App;
