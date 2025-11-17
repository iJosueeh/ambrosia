import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  User, // Icon for profile
  LogOut,
  BookOpen, // Icon for managing resources/materials
  Leaf, // Assuming Leaf icon is available or replace with a suitable one
} from 'lucide-react';
import { useAuth } from '../../../shared/hooks/useAuth';

const navItems = [
  { to: '/profesional/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/profesional/profile', icon: User, label: 'Mi Perfil' },
  { to: '/profesional/recursos', icon: BookOpen, label: 'Mis Recursos' }, // Updated route and label
  // Add more professional-specific navigation items here
];

const ProfesionalSidebar = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  return (
    <aside className="w-64 flex-shrink-0 bg-white border-r border-gray-200 flex flex-col">
      <div className="h-16 flex items-center justify-center border-b border-gray-200 px-4">
        <Leaf className="h-7 w-7 text-green-600" /> {/* Assuming Leaf icon is available or replace with a suitable one */}
        <h1 className="ml-2 text-xl font-bold text-gray-800 whitespace-nowrap">Ambrosía Profesional</h1>
      </div>
      <nav className="flex-grow mt-4">
        <ul>
          {navItems.map((item) => (
            <li key={item.to} className="px-4 py-1">
              <NavLink
                to={item.to}
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
  );
};

export default ProfesionalSidebar;
