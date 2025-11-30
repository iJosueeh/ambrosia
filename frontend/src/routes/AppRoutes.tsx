import { Routes, Route, Navigate } from "react-router-dom";
import { LandingPage } from "../modules/home/pages/LandingPage";
import { AuthUser } from "../modules/auth/pages/AuthUser";
import { QuizPage } from "../modules/resources/pages/QuizPage";
import { TestsDashboard } from "../modules/resources/pages/TestsDashboard";
import ListadoArticulosPage from "../modules/resources/pages/ListadoArticulosPage";
import { ResourcesPage } from "../modules/resources/pages/ResourcesPage";
import { RecursosExplorer } from "../modules/resources/components/RecursosExplorer";
import ArticleDetailPage from "../modules/resources/pages/ArticleDetailPage";
import UserDashboard from "../modules/users/components/UserDashboard";
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
import RecursoManagement from "../modules/profesional/pages/RecursoManagement";
import RecursoEditor from "../modules/profesional/pages/RecursoEditor";
import ProfesionalProfile from "../modules/profesional/pages/ProfesionalProfile";
import StatisticsDashboard from "../modules/profesional/pages/StatisticsDashboard";

// Protected Route Component
import { ProtectedRoute } from "../components/ProtectedRoute";
import { UnauthorizedPage } from "../pages/UnauthorizedPage";

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/auth" element={<AuthUser />} />
      <Route path="/login" element={<AuthUser />} />
      <Route path="/quiz" element={<TestsDashboard />} />
      <Route path="/quiz/:id" element={<QuizPage />} />
      <Route path="/articulos" element={<ListadoArticulosPage />} />
      <Route path="/explorar-recursos" element={<RecursosExplorer />} />
      <Route path="/explorar-recursos/:categoryId" element={<RecursosExplorer />} />
      <Route path="/articulos/:slug" element={<ArticleDetailPage />} />
      <Route path="/resources-center" element={<ResourcesPage />} />
      <Route path="/contacto" element={<ContactPage />} />
      <Route path="/community-forums" element={<CommunityForums />} />
      <Route path="/unauthorized" element={<UnauthorizedPage />} />

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
      <Route
        path="/profesional"
        element={
          <ProtectedRoute allowedRoles={['ROLE_PROFESSIONAL']}>
            <ProfesionalLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/profesional/dashboard" replace />} />
        <Route path="dashboard" element={<ProfesionalDashboard />} />
        <Route path="recursos" element={<RecursoManagement />} />
        <Route path="recursos/nuevo" element={<RecursoEditor />} />
        <Route path="recursos/editar/:id" element={<RecursoEditor />} />
        <Route path="profile" element={<ProfesionalProfile />} />
        <Route path="estadisticas/:id" element={<StatisticsDashboard />} />
      </Route>

      {/* Protected Admin Routes */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="users" element={<UserManagement />} />
        <Route path="resources" element={<Resources />} />
        <Route path="moderation" element={<Moderation />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="settings" element={<Settings />} />
      </Route>
    </Routes>
  );
};
