import { Navigate } from "react-router-dom";
import { useAuth } from "../shared/hooks/useAuth";
import AdminLayout from "../modules/admin/components/AdminLayout";

export const AdminRoute = () => {
 const { isAuthenticated, user } = useAuth();

 // 1. Check if user is authenticated
 if (!isAuthenticated) {
   // Redirect to login page if not logged in
   return <Navigate to="/auth" replace />;
 }

 // 2. Check if user has the 'ADMIN' role
 // ✅ Cambiar 'ROLE_ADMIN' por 'ADMIN' (sin prefijo)
 if (user?.rolPrincipal !== 'ADMIN') {
   return <Navigate to="/dashboard" replace />;
 }

 // 3. If checks pass, render the AdminLayout. 
 // The <Outlet> inside AdminLayout will handle rendering the nested route.
 return <AdminLayout />;
};