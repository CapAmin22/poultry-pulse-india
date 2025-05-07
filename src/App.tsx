
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './components/ui/theme-provider';
import { Toaster } from './components/ui/toaster';
import { Onboarding } from "./pages/Onboarding";
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
import Layout from './components/layout/Layout';
import { AuthProvider } from './hooks/use-auth';
import { FinancialProvider } from './contexts/FinancialContext';

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <FinancialProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/onboarding" element={<Onboarding />} />
              <Route element={<Layout />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/marketplace" element={<MarketplacePage />} />
                <Route path="/training" element={<TrainingPage />} />
                <Route path="/network" element={<NetworkPage />} />
                <Route path="/statistics" element={<StatisticsPage />} />
                <Route path="/financial" element={<FinancialPage />} />
                <Route path="/jobs" element={<JobsPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/settings" element={<Settings />} />
              </Route>
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </BrowserRouter>
          <Toaster />
        </FinancialProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
