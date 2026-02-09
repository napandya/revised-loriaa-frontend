import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { NotificationProvider } from '@/contexts/NotificationContext';
import { Sidebar } from '@/components/layout/Sidebar';
import { NotificationBell } from '@/components/NotificationBell';
import { NotificationToast } from '@/components/NotificationToast';
import { useAuthStore } from '@/stores/authStore';
import { Toaster } from '@/components/ui/toaster';

// Lazy load pages
const LoginPage = lazy(() => import('@/pages/Login'));
const DashboardPage = lazy(() => import('@/pages/DashboardPage'));
const LeadsPage = lazy(() => import('@/pages/LeadsPage'));
const InboxPage = lazy(() => import('@/pages/InboxPage'));
const LeasingAgentPage = lazy(() => import('@/pages/agents/LeasingAgentPage'));
const MarketingAgentPage = lazy(() => import('@/pages/agents/MarketingAgentPage'));
const PropertyManagerPage = lazy(() => import('@/pages/agents/PropertyManagerPage'));
const SettingsPage = lazy(() => import('@/pages/SettingsPage'));
const TeamPage = lazy(() => import('@/pages/TeamPage'));
const AnalyticsPage = lazy(() => import('@/pages/AnalyticsPage'));

function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center h-screen bg-background">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>
  );
}

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthStore();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
}

function AppHeader() {
  return (
    <header className="h-14 border-b border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-800/50 backdrop-blur-sm flex items-center justify-end px-6 sticky top-0 z-30">
      <div className="flex items-center gap-4">
        <NotificationBell />
      </div>
    </header>
  );
}

function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <AppHeader />
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
      <NotificationToast />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <NotificationProvider>
        <BrowserRouter>
          <Suspense fallback={<LoadingSpinner />}>
            <Routes>
              {/* Public routes */}
              <Route path="/login" element={<LoginPage />} />
              
              {/* Protected routes */}
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              
              <Route path="/dashboard" element={
                <PrivateRoute>
                  <AppLayout>
                    <DashboardPage />
                  </AppLayout>
                </PrivateRoute>
              } />
              
              <Route path="/leads" element={
                <PrivateRoute>
                  <AppLayout>
                    <LeadsPage />
                  </AppLayout>
                </PrivateRoute>
              } />
              
              <Route path="/inbox" element={
                <PrivateRoute>
                  <AppLayout>
                    <InboxPage />
                  </AppLayout>
                </PrivateRoute>
              } />
              
              <Route path="/agents/leasing" element={
                <PrivateRoute>
                  <AppLayout>
                    <LeasingAgentPage />
                  </AppLayout>
                </PrivateRoute>
              } />
              
              <Route path="/agents/marketing" element={
                <PrivateRoute>
                  <AppLayout>
                    <MarketingAgentPage />
                  </AppLayout>
                </PrivateRoute>
              } />
              
              <Route path="/agents/property" element={
                <PrivateRoute>
                  <AppLayout>
                    <PropertyManagerPage />
                  </AppLayout>
                </PrivateRoute>
              } />
              
              <Route path="/settings" element={
                <PrivateRoute>
                  <AppLayout>
                    <SettingsPage />
                  </AppLayout>
                </PrivateRoute>
              } />
              
              <Route path="/team" element={
                <PrivateRoute>
                  <AppLayout>
                    <TeamPage />
                  </AppLayout>
                </PrivateRoute>
              } />

              <Route path="/analytics" element={
                <PrivateRoute>
                  <AppLayout>
                    <AnalyticsPage />
                  </AppLayout>
                </PrivateRoute>
              } />
              
              {/* Fallback */}
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </Suspense>
          <Toaster />
        </BrowserRouter>
      </NotificationProvider>
    </ThemeProvider>
  );
}
