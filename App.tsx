import React, { useEffect } from 'react';
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import TermsPage from './pages/TermsPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import CookiePolicyPage from './pages/CookiePolicyPage';
import QuotePage from './pages/QuotePage';
import ContactPage from './pages/ContactPage';
import HelpPage from './pages/HelpPage';
import ComplaintsPage from './pages/ComplaintsPage';
import CustomerCenterPage from './pages/CustomerCenterPage';
// Fix: Use named import for AdminDashboard as the module lacks a default export.
import { AdminDashboard } from './pages/AdminDashboard';
import ClientDashboard from './pages/ClientDashboard';
import MIDStatusPage from './pages/MIDStatusPage';
import AdminVinLogsPage from './pages/AdminVinLogsPage';
import AdminDiagnosticsPage from './pages/AdminDiagnosticsPage';
import AuthPage from './pages/AuthPage';
import AboutPage from './pages/AboutPage';
import CareersPage from './pages/CareersPage';
import PressPage from './pages/PressPage';
import { AuthProvider } from './context/AuthContext';

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/careers" element={<CareersPage />} />
              <Route path="/press" element={<PressPage />} />
              <Route path="/terms" element={<TermsPage />} />
              <Route path="/privacy" element={<PrivacyPolicyPage />} />
              <Route path="/cookies" element={<CookiePolicyPage />} />
              <Route path="/quote" element={<QuotePage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/help" element={<HelpPage />} />
              <Route path="/faqs" element={<HelpPage />} />
              <Route path="/complaints" element={<ComplaintsPage />} />
              <Route path="/customers" element={<CustomerCenterPage />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/policies" element={<AdminDashboard initialTab="policy-ledger" />} />
              <Route path="/portal" element={<ClientDashboard />} />
              <Route path="/admin/mid-status" element={<MIDStatusPage />} />
              <Route path="/admin/vin-logs" element={<AdminVinLogsPage />} />
              <Route path="/admin/diagnostics" element={<AdminDiagnosticsPage />} />
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/login" element={<AuthPage />} />
              <Route path="/signup" element={<AuthPage />} />
              <Route path="/forgot-password" element={<AuthPage />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;