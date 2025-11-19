import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  User,
  LogOut,
  BookOpen,
  Leaf,
  X, // Import X icon for the close button
} from 'lucide-react';
import { useAuth } from '../../../shared/hooks/useAuth';

const navItems = [
  { to: '/profesional/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/profesional/profile', icon: User, label: 'Mi Perfil' },
  { to: '/profesional/recursos', icon: BookOpen, label: 'Mis Recursos' },
];

interface ProfesionalSidebarProps {
  isSidebarOpen: boolean;
  setSidebarOpen: (isOpen: boolean) => void;
}

const ProfesionalSidebar: React.FC<ProfesionalSidebarProps> = ({ isSidebarOpen, setSidebarOpen }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  return (
    <>
      {/* Overlay for mobile */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden ${isSidebarOpen ? 'block' : 'hidden'}`}
        onClick={() => setSidebarOpen(false)}
      ></div>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-white border-r border-gray-200 flex flex-col z-30
                   transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0
                   ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="h-16 flex items-center justify-between border-b border-gray-200 px-4">
          <div className="flex items-center">
            <Leaf className="h-7 w-7 text-green-600" />
            <h1 className="ml-2 text-xl font-bold text-gray-800">Ambrosía Pro</h1>
          </div>
          {/* Close button for mobile */}
          <button onClick={() => setSidebarOpen(false)} className="md:hidden">
            <X className="h-6 w-6 text-gray-600" />
          </button>
        </div>
        <nav className="flex-grow mt-4">
          <ul>
            {navItems.map((item) => (
              <li key={item.to} className="px-4 py-1">
                <NavLink
                  to={item.to}
                  onClick={() => setSidebarOpen(false)} // Close sidebar on navigation
                  className={({ isActive }) =>
                    `flex items-center px-4 py-2.5 text-sm font-medium rounded-lg transition-colors duration-200 ${
                      isActive
                        ? 'bg-green-100 text-green-700'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`
                  }
                >
                  <item.icon className="h-5 w-5 mr-3" />
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-2.5 text-sm font-medium rounded-lg text-gray-600 hover:bg-gray-50 transition-colors duration-200"
          >
            <LogOut className="h-5 w-5 mr-3" />
            Cerrar Sesión
          </button>
        </div>
      </aside>
    </>
  );
};

export default ProfesionalSidebar;
