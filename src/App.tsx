import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { SupabaseProvider } from './context/SupabaseContext';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { ProtectedRoute, RoleBasedRedirect } from './components/ProtectedRoute';
import { Landing } from './pages/Landing';
import { Home } from './pages/Home';
import { VendorSignup } from './pages/VendorSignup';
import { VendorLogin } from './pages/VendorLogin';
import { ViewerLogin } from './pages/ViewerLogin';
import { SimpleLogin } from './pages/SimpleLogin';
import { EmailConfirmation } from './pages/EmailConfirmation';
import { Account } from './pages/Account';
import { VendorProfile } from './pages/VendorProfile';
import { Messages } from './pages/Messages';
// Removed Saved
import { Admin } from './pages/Admin';
// Removed Search
import { NotFound } from './pages/NotFound';

function AppContent() {
  return (
    <div className="min-h-screen bg-gray-50 safe-area">
      <Header />
      <main className="pb-20">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/home" element={<ProtectedRoute allowedRoles={['viewer']}><Home /></ProtectedRoute>} />
          <Route path="/signup" element={<VendorSignup />} />
                  <Route path="/vendor-login" element={<VendorLogin />} />
                  <Route path="/viewer-login" element={<ViewerLogin />} />
                  <Route path="/simple-login" element={<SimpleLogin />} />
          <Route path="/email-confirmation" element={<EmailConfirmation />} />
          <Route path="/account" element={<Account />} />
          <Route path="/vendor/:id" element={<VendorProfile />} />
          <Route path="/messages" element={<ProtectedRoute><Messages /></ProtectedRoute>} />
          {/* Removed saved */}
          <Route path="/admin" element={<ProtectedRoute allowedRoles={['admin']}><Admin /></ProtectedRoute>} />
          {/* Removed search */}
          <Route path="/dashboard" element={<RoleBasedRedirect />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <BottomNav />
    </div>
  );
}

export default function App() {
  return (
    <SupabaseProvider>
      <AppContent />
    </SupabaseProvider>
  );
}

