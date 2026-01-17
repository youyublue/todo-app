import { useEffect, Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAuth } from './contexts/AuthContext';
import { useProfile } from './hooks/useProfile';
import { useRealtime } from './hooks/useRealtime';
import { useNotifications } from './hooks/useNotifications';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { Layout } from './components/layout/Layout';
import { LoginForm } from './components/auth/LoginForm';
import { Spinner } from './components/ui/Spinner';

// Lazy load Pages
const DashboardPage = lazy(() => import('./pages/DashboardPage').then(module => ({ default: module.DashboardPage })));
const TodayPage = lazy(() => import('./pages/TodayPage').then(module => ({ default: module.TodayPage })));
const UpcomingPage = lazy(() => import('./pages/UpcomingPage').then(module => ({ default: module.UpcomingPage })));
const ImportantPage = lazy(() => import('./pages/ImportantPage').then(module => ({ default: module.ImportantPage })));
const StatsPage = lazy(() => import('./pages/StatsPage').then(module => ({ default: module.StatsPage })));
const SettingsPage = lazy(() => import('./pages/SettingsPage').then(module => ({ default: module.SettingsPage })));
const CategoryList = lazy(() => import('./components/categories/CategoryList').then(module => ({ default: module.CategoryList })));

function AppContent() {
  const { initialize, user } = useAuth();
  const { fetchProfile } = useProfile();
  useRealtime(); // Enable Realtime Sync
  useNotifications(); // Enable Browser Notifications

  useEffect(() => {
    initialize();
  }, [initialize]);

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user, fetchProfile]);

  return (
    <Routes>
      <Route path="/login" element={
        <div className="flex min-h-screen items-center justify-center bg-background">
          <LoginForm />
        </div>
      } />
      
      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>
          <Route path="/" element={
            <Suspense fallback={<div className="flex justify-center p-8"><Spinner /></div>}>
              <DashboardPage />
            </Suspense>
          } />
          <Route path="/today" element={
            <Suspense fallback={<div className="flex justify-center p-8"><Spinner /></div>}>
              <TodayPage />
            </Suspense>
          } />
          <Route path="/upcoming" element={
            <Suspense fallback={<div className="flex justify-center p-8"><Spinner /></div>}>
              <UpcomingPage />
            </Suspense>
          } />
          <Route path="/important" element={
            <Suspense fallback={<div className="flex justify-center p-8"><Spinner /></div>}>
              <ImportantPage />
            </Suspense>
          } />
          <Route path="/categories" element={
            <Suspense fallback={<div className="flex justify-center p-8"><Spinner /></div>}>
              <CategoryList />
            </Suspense>
          } />
          <Route path="/stats" element={
            <Suspense fallback={<div className="flex justify-center p-8"><Spinner /></div>}>
              <StatsPage />
            </Suspense>
          } />
          <Route path="/settings" element={
            <Suspense fallback={<div className="flex justify-center p-8"><Spinner /></div>}>
              <SettingsPage />
            </Suspense>
          } />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" />
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
