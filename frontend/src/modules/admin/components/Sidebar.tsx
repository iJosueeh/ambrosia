import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  BookText,
  MessageSquareWarning,
  BarChart3,
  Settings,
  Leaf,
} from 'lucide-react';

const navItems = [
  { to: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/admin/users', icon: Users, label: 'Gestión de Usuarios' },
  { to: '/admin/resources', icon: BookText, label: 'Recursos' },
  { to: '/admin/moderation', icon: MessageSquareWarning, label: 'Moderación' },
  { to: '/admin/analytics', icon: BarChart3, label: 'Análisis' },
  { to: '/admin/settings', icon: Settings, label: 'Configuración' },
];

const Sidebar = () => {
  return (
    <aside className="w-64 flex-shrink-0 bg-gray-50 border-r border-gray-200 flex flex-col">
      <div className="h-16 flex items-center justify-center border-b border-gray-200">
        <Leaf className="h-7 w-7 text-ambrosia-green" />
        <h1 className="ml-2 text-xl font-bold text-gray-800">Ambrosía Admin</h1>
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
                      ? 'bg-ambrosia-green/10 text-ambrosia-green'
                      : 'text-gray-600 hover:bg-gray-100'
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
        {/* Placeholder for user profile section in sidebar footer */}
      </div>
    </aside>
  );
};

export default Sidebar;
