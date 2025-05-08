
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@/components/ui/theme-provider';
import { Toaster } from './components/ui/toaster';
import Onboarding from "./pages/Onboarding";
import LandingPage from "./pages/LandingPage";
import Dashboard from "./pages/Dashboard";
import Settings from "./pages/Settings";
import AuthPage from "./pages/AuthPage";
import ProfilePage from "./pages/ProfilePage";
import NotFoundPage from "./pages/NotFoundPage";
import MarketplacePage from "./pages/MarketplacePage";
import TrainingPage from "./pages/TrainingPage";
import NetworkPage from "./pages/NetworkPage";
import StatisticsPage from "./pages/StatisticsPage";
import FinancialPage from "./pages/FinancialPage";
import JobsPage from "./pages/JobsPage";
import AdminSecurityPage from "./pages/AdminSecurityPage";
import AdminDashboard from "./pages/AdminDashboard";
import Layout from './components/layout/Layout';
import { AuthProvider } from './hooks/use-auth';
import { FinancialProvider } from './contexts/FinancialContext';
import { SidebarProvider } from './contexts/SidebarContext';

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <FinancialProvider>
          <SidebarProvider>
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/auth" element={<AuthPage />} />
                <Route path="/onboarding" element={<Onboarding />} />
                <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
                <Route path="/marketplace" element={<Layout><MarketplacePage /></Layout>} />
                <Route path="/training" element={<Layout><TrainingPage /></Layout>} />
                <Route path="/network" element={<Layout><NetworkPage /></Layout>} />
                <Route path="/statistics" element={<Layout><StatisticsPage /></Layout>} />
                <Route path="/financial" element={<Layout><FinancialPage /></Layout>} />
                <Route path="/jobs" element={<Layout><JobsPage /></Layout>} />
                <Route path="/profile" element={<Layout><ProfilePage /></Layout>} />
                <Route path="/settings" element={<Layout><Settings /></Layout>} />
                <Route path="/admin/security" element={<Layout><AdminSecurityPage /></Layout>} />
                <Route path="/admin/dashboard" element={<Layout><AdminDashboard /></Layout>} />
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
              <Toaster />
            </BrowserRouter>
          </SidebarProvider>
        </FinancialProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
