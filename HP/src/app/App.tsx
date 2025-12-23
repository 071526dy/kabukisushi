import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { LandingPage } from './pages/LandingPage';
import { AdminLayout } from './admin/layouts/AdminLayout';
import { DashboardPage } from './admin/pages/DashboardPage';
import { LoginPage } from './admin/pages/LoginPage';
import { EditorPage } from './admin/pages/EditorPage';
import { DataProvider } from '../contexts/DataContext';
import { AuthProvider } from '../contexts/AuthContext';
import { ProtectedRoute } from './admin/components/shared/ProtectedRoute';

export default function App() {
  return (
    <DataProvider>
      <AuthProvider>
        <Router>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />

            {/* Admin Routes */}
            <Route path="/admin/login" element={<LoginPage />} />
            <Route path="/admin/editor" element={
              <ProtectedRoute>
                <EditorPage />
              </ProtectedRoute>
            } />

            <Route path="/admin" element={
              <ProtectedRoute>
                <AdminLayout>
                  <Routes>
                    <Route path="dashboard" element={<DashboardPage />} />
                    <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />
                    {/* Add other admin routes here as needed */}
                  </Routes>
                </AdminLayout>
              </ProtectedRoute>
            } />

            {/* Handle /admin/* sub-routes correctly by nesting or using wildcard */}
            <Route path="/admin/*" element={
              <ProtectedRoute>
                <AdminLayout>
                  <Routes>
                    <Route path="dashboard" element={<DashboardPage />} />
                    {/* Future routes: menu, gallery, settings */}
                  </Routes>
                </AdminLayout>
              </ProtectedRoute>
            } />

          </Routes>
        </Router>
      </AuthProvider>
    </DataProvider>
  );
}
