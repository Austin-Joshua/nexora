import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import { LandingPage }       from './pages/LandingPage';
import { OnboardingPage }    from './pages/OnboardingPage';
import { DashboardPage }     from './pages/DashboardPage';
import { InboxPage }         from './pages/InboxPage';
import { BrainPage }         from './pages/BrainPage';
import { NotificationsPage } from './pages/NotificationsPage';
import { SettingsPage }      from './pages/SettingsPage';
import { AuthCallbackPage }  from './pages/AuthCallbackPage';
import { EmailDetailPage }   from './pages/EmailDetailPage';
import { AnalyticsPage }     from './pages/AnalyticsPage';
import { ErrorBoundary }     from './components/common/ErrorBoundary';
import { PrivacyPolicyPage } from './pages/PrivacyPolicyPage';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuthStore();
  return isAuthenticated ? <>{children}</> : <Navigate to="/" replace />;
};

function App() {
  return (
    <ErrorBoundary>
      <Routes>
        <Route path="/"                element={<LandingPage />} />
        <Route path="/auth/callback"   element={<AuthCallbackPage />} />
        <Route path="/onboarding"      element={<ProtectedRoute><OnboardingPage /></ProtectedRoute>} />
        <Route path="/dashboard"       element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
        <Route path="/inbox"           element={<ProtectedRoute><InboxPage /></ProtectedRoute>} />
        <Route path="/emails/:id"      element={<ProtectedRoute><EmailDetailPage /></ProtectedRoute>} />
        <Route path="/brain"           element={<ProtectedRoute><BrainPage /></ProtectedRoute>} />
        <Route path="/notifications"   element={<ProtectedRoute><NotificationsPage /></ProtectedRoute>} />
        <Route path="/settings"        element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
        <Route path="/analytics"       element={<ProtectedRoute><AnalyticsPage /></ProtectedRoute>} />
        <Route path="/privacy"          element={<PrivacyPolicyPage />} />
        <Route path="*"                element={<Navigate to="/" replace />} />
      </Routes>
    </ErrorBoundary>
  );
}

export default App;
