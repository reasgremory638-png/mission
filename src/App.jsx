import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ChallengeProvider, useChallenge } from './context/ChallengeContext';
import Login from './pages/Login';
import SetupChallenge from './pages/SetupChallenge';
import MapPage from './pages/MapPage';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';

function AppRoutes() {
  const { user, loading: authLoading } = useAuth();
  const { challenge, loading: challengeLoading } = useChallenge();

  if (authLoading || challengeLoading) {
    return (
      <div className="min-h-screen bg-nature-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-bounce">🌿</div>
          <p className="text-warm-600 font-display text-lg">جار التحميل...</p>
        </div>
      </div>
    );
  }

  if (!user) return <Login />;
  if (!challenge) return <SetupChallenge />;
  if (challenge.failed) return <Navigate to="/map" replace />;

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/map" replace />} />
      <Route path="/map" element={<MapPage />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="*" element={<Navigate to="/map" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ChallengeProvider>
          <AppRoutes />
        </ChallengeProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
