import { Routes, Route } from 'react-router-dom';

function App() {
  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h1>FactoryFlow - Interface Industrielle</h1>
      <p style={{ marginTop: '1rem', color: 'var(--color-text-muted)' }}>
        Socle technique initialisé avec succès.
      </p>
      <Routes>
        <Route path="/" element={<div style={{ marginTop: '2rem' }}>Bienvenue sur FactoryFlow</div>} />
        <Route path="*" element={<div style={{ marginTop: '2rem', color: 'var(--color-danger)' }}>404 - Page non trouvée</div>} />
      </Routes>
    </div>
  );
}

export default App;
