import { useState } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import ProfesionalSidebar from './ProfesionalSidebar';
import { useAuth } from '../../../shared/hooks/useAuth';
import { Menu } from 'lucide-react';

const ProfesionalLayout = () => {
  const { user, loading } = useAuth();
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div>Cargando...</div>
      </div>
    );
  }

  if (!user || user.rolPrincipal !== 'PROFESSIONAL') {
    return <Navigate to="/auth" replace />;
  }

  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      {/* Sidebar - adaptable for mobile and desktop */}
      <div className="md:flex">
        <ProfesionalSidebar isSidebarOpen={isSidebarOpen} setSidebarOpen={setSidebarOpen} />
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile Header */}
        <header className="md:hidden flex justify-between items-center bg-white p-4 border-b">
          <button onClick={() => setSidebarOpen(true)}>
            <Menu className="h-6 w-6 text-gray-600" />
          </button>
          <span className="text-xl font-bold text-gray-800">Ambrosía Profesional</span>
        </header>

        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default ProfesionalLayout;
