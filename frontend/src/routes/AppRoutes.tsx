import { Routes, Route, Navigate, useLocation } from "react-router-dom"
import { LandingPage } from "../modules/home/pages/LandingPage"
import { AuthUser } from "../modules/auth/pages/AuthUser"
import { QuizPage } from "../modules/resources/pages/QuizPage"
import ListadoArticulosPage from "../modules/resources/pages/ListadoArticulosPage"
import { ResourcesPage } from "../modules/resources/pages/ResourcesPage"
import { RecursosExplorer } from "../modules/resources/components/RecursosExplorer"
import ArticleDetailPage from "../modules/resources/pages/ArticleDetailPage"
import UserDashboard from "../modules/users/components/UserDashboard"
import { useAuth } from "../shared/hooks/useAuth"
import type { JSX } from "react/jsx-runtime"
import ContactPage from "../modules/contact/pages/ContactPage";
import CommunityForums from "../modules/community/pages/CommunityForums";

// Admin Imports
import AdminLayout from "../modules/admin/components/AdminLayout";
import AdminDashboard from "../modules/admin/pages/AdminDashboard";
import UserManagement from "../modules/admin/pages/UserManagement";
import Resources from "../modules/admin/pages/Resources";
import Moderation from "../modules/admin/pages/Moderation";
import Analytics from "../modules/admin/pages/Analytics";
import Settings from "../modules/admin/pages/Settings";

// Profesional Imports
import ProfesionalLayout from "../modules/profesional/components/ProfesionalLayout";
import ProfesionalDashboard from "../modules/profesional/pages/ProfesionalDashboard";
import MaterialManagement from "../modules/profesional/pages/MaterialManagement";
import ProfesionalProfile from "../modules/profesional/pages/ProfesionalProfile";


const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { isAuthenticated } = useAuth();
  console.log("DEBUG: isAuthenticated en ProtectedRoute:", isAuthenticated); // DEBUG
  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }
  return children;
};

export const AppRoutes = () => {
  const location = useLocation(); // Obtener la ubicación actual
  console.log("DEBUG: AppRoutes render. Current path:", location.pathname); // Nuevo console.log

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/auth" element={<AuthUser />} />
      <Route path="/quiz" element={<QuizPage />} />
      <Route path="/articulos" element={<ListadoArticulosPage />} />
      <Route path="/explorar-recursos" element={<RecursosExplorer />} />
      <Route path="/explorar-recursos/:categoryId" element={<RecursosExplorer />} />
      <Route path="/articulos/:articleId" element={<ArticleDetailPage />} />
      <Route path="/resources-center" element={<ResourcesPage />} />
      <Route path="/contacto" element={<ContactPage />} />
      <Route path="/community-forums" element={<CommunityForums />} />

      {/* Protected User Route */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <UserDashboard />
          </ProtectedRoute>
        }
      />

      {/* Protected Profesional Routes */}
      <Route path="/profesional" element={<ProtectedRoute><ProfesionalLayout /></ProtectedRoute>}>
        <Route index element={<Navigate to="/profesional/dashboard" replace />} />
        <Route path="dashboard" element={<ProfesionalDashboard />} />
        <Route path="materials" element={<MaterialManagement />} />
        <Route path="profile" element={<ProfesionalProfile />} />
        {/* Add more professional routes here */}
      </Route>

      {/* Protected Admin Routes */}
      <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="users" element={<UserManagement />} />
        <Route path="resources" element={<Resources />} />
        <Route path="moderation" element={<Moderation />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="settings" element={<Settings />} />
      </Route>
    </Routes>
  )
}
