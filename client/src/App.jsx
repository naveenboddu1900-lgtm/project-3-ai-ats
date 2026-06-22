import { Navigate, Route, BrowserRouter as Router, Routes, useLocation } from 'react-router-dom';
import Shell from './components/Shell.jsx';
import { AuthProvider, useAuth } from './context/AuthContext.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RecruiterDashboard from './pages/RecruiterDashboard.jsx';
import CandidatePortal from './pages/CandidatePortal.jsx';
import ApplyPage from './pages/ApplyPage.jsx';
import PipelinePage from './pages/PipelinePage.jsx';
import RankingPage from './pages/RankingPage.jsx';

function ProtectedRoute({ children, roles }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return null;
  if (!user) {
    const redirect = encodeURIComponent(`${location.pathname}${location.search}`);
    return <Navigate to={`/login?redirect=${redirect}`} replace />;
  }
  if (roles && !roles.includes(user.role)) {
    return <Navigate to={user.role === 'recruiter' ? '/recruiter' : '/candidate'} replace />;
  }

  return children;
}

function RoleHome() {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return <Navigate to={user.role === 'recruiter' ? '/recruiter' : '/candidate'} replace />;
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Shell />
              </ProtectedRoute>
            }
          >
            <Route index element={<RoleHome />} />
            <Route
              path="recruiter"
              element={
                <ProtectedRoute roles={['recruiter']}>
                  <RecruiterDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="pipeline"
              element={
                <ProtectedRoute roles={['recruiter']}>
                  <PipelinePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="ranking"
              element={
                <ProtectedRoute roles={['recruiter']}>
                  <RankingPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="candidate"
              element={
                <ProtectedRoute roles={['candidate']}>
                  <CandidatePortal />
                </ProtectedRoute>
              }
            />
            <Route
              path="apply/:jobId"
              element={
                <ProtectedRoute roles={['candidate']}>
                  <ApplyPage />
                </ProtectedRoute>
              }
            />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}
