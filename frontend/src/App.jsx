import { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";

import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import RoomsPage from "./pages/RoomsPage";
import TenantsPage from "./pages/TenantsPage";
import BillsPage from "./pages/BillsPage";
import PaymentsPage from "./pages/PaymentsPage";
import MaintenancePage from "./pages/MaintenancePage";
import AnnouncementsPage from "./pages/AnnouncementsPage";
import ProfilePage from "./pages/ProfilePage";

// Sidebar + top bar wrapped around every signed-in page.
function AppLayout() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen lg:flex">
      <Sidebar open={menuOpen} onClose={() => setMenuOpen(false)} />
      <div className="flex min-w-0 flex-1 flex-col">
        <Navbar onMenu={() => setMenuOpen(true)} />
        <main className="flex-1 p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          <Route
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/rooms" element={<ProtectedRoute roles={["landlord"]}><RoomsPage /></ProtectedRoute>} />
            <Route path="/tenants" element={<ProtectedRoute roles={["landlord"]}><TenantsPage /></ProtectedRoute>} />
            <Route path="/bills" element={<BillsPage />} />
            <Route path="/payments" element={<PaymentsPage />} />
            <Route path="/maintenance" element={<MaintenancePage />} />
            <Route path="/announcements" element={<AnnouncementsPage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Route>

          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<p className="p-8">Page not found.</p>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}