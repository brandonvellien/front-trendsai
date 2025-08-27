import { Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
// Ligne corrigée
import NewAnalysisPage from './pages/NewAnalysisPage';;
import { ReportPage } from './pages/ReportPage';
import { SignupPage } from './pages/SignupPage';
import { LoginPage } from './pages/LoginPage';
import { ProtectedRoute } from './components/ProtectedRoute';
import { DashboardPage } from './pages/DashboardPage';

function App() {
  return (
    <Routes>
      {/* Routes publiques (inchangées) */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />

      {/* Routes protégées */}
      <Route element={<ProtectedRoute />}>
        {/* Le Layout est maintenant le parent de toutes les pages protégées */}
        <Route path="/" element={<Layout />}>
          {/* "index" signifie que c'est la page par défaut pour "/" */}
          <Route index element={<DashboardPage />} /> 
          
          {/* Les autres pages sont au même niveau */}
          <Route path="new" element={<NewAnalysisPage />} />
          <Route path="report/:jobId" element={<ReportPage />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;