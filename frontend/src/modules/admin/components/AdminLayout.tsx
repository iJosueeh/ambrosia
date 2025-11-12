import { Outlet, Navigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import { useAuth } from '../../../shared/hooks/useAuth';

const AdminLayout = () => {
  const { user, loading } = useAuth(); // Changed isLoading to loading

  if (loading) {
    return <div>Cargando...</div>; // O un spinner de carga
  }

  // Si no hay usuario o el rol principal no es 'ADMIN', redirigir
  if (!user || user.rolPrincipal !== 'ADMIN') { // Changed user.rol to user.rolPrincipal and 'ADMIN' to 'ROLE_ADMIN'
    return <Navigate to="/auth" replace />; // Redirect to /auth instead of /login
  }

  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
