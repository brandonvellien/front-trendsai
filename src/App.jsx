import { Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { ProtectedRoute } from './components/ProtectedRoute';
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';
import { DashboardPage } from './pages/DashboardPage';
import { NewAnalysisPage } from './pages/NewAnalysisPage';
import { ReportPage } from './pages/ReportPage';

function App() {
  return (
    <Routes>
      {/* Routes publiques accessibles par tous */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />

      {/* Routes protégées */}
      {/* 1. On passe d'abord par le portail de sécurité */}
      <Route element={<ProtectedRoute />}>
        {/* 2. Si on a le droit d'entrer, on charge la mise en page (header, etc.) */}
        <Route element={<Layout />}>
          {/* 3. Enfin, on affiche la page demandée à l'intérieur de la mise en page */}
          <Route path="/" element={<DashboardPage />} />
          <Route path="/new" element={<NewAnalysisPage />} />
          <Route path="/report/:jobId" element={<ReportPage />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;