import { Outlet, Navigate } from 'react-router-dom';
import ProfesionalSidebar from './ProfesionalSidebar';
import { useAuth } from '../../../shared/hooks/useAuth';

const ProfesionalLayout = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Cargando...</div>; // O un spinner de carga
  }

  // Si no hay usuario o el rol principal no es 'PROFESSIONAL', redirigir
  // Asumiendo que el rol para profesionales será 'PROFESSIONAL'
  if (!user || user.rolPrincipal !== 'PROFESSIONAL') {
    return <Navigate to="/auth" replace />;
  }

  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      <ProfesionalSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* No header for professional dashboard as per user request */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default ProfesionalLayout;

