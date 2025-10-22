import { Routes, Route, Navigate } from "react-router-dom"
import { LandingPage } from "../modules/home/pages/LandingPage"
import { AuthUser } from "../modules/auth/pages/AuthUser"
import { QuizPage } from "../modules/resources/pages/QuizPage"
import { ListadoArticulosPage } from "../modules/resources/pages/ListadoArticulosPage"
import UserDashboard from "../modules/users/components/UserDashboard"
import { useAuth } from "../shared/hooks/useAuth"
import type { JSX } from "react/jsx-runtime"

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }
  return children;
};

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/auth" element={<AuthUser />} />
      <Route path="/quiz" element={<QuizPage />} />
      <Route path="/articulos" element={<ListadoArticulosPage />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <UserDashboard />
          </ProtectedRoute>
        }
      />
    </Routes>
  )
}