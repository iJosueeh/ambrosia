import React, { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
// CORRECCIÓN: LucideIcon se importa como un TIPO para evitar el error de sintaxis de módulos.
import { LogOut, LayoutDashboard, Users, Zap, Settings, Menu, X, type LucideIcon } from 'lucide-react';

// Definición de los ítems de navegación
interface NavItem {
    name: string;
    path: string;
    icon: LucideIcon;
}

const navItems: NavItem[] = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { name: 'Gestionar Usuarios', path: '/admin/users', icon: Users },
    { name: 'Gestionar Contenido', path: '/admin/content', icon: Zap },
    { name: 'Configuración', path: '/admin/settings', icon: Settings },
];

const AdminLayout: React.FC = () => {
    // Estado para controlar la apertura/cierre del sidebar en dispositivos móviles
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // Función de Logout (Deberías reemplazar esto por la función de tu hook useAuth)
    const handleLogout = () => {
        console.log('Logout iniciado...');
        localStorage.removeItem('authToken');
        localStorage.removeItem('userRole');
        // Redirigir al login
        window.location.href = '/login'; 
    };
    
    // Función para definir las clases de navegación
    const getNavLinkClass = ({ isActive, isPending }: { isActive: boolean, isPending: boolean }) => 
        `flex items-center p-3 rounded-lg transition-colors ${
            isPending ? 'bg-gray-100' : ''
        } ${
            isActive 
                ? 'bg-green-600 text-white shadow-md font-semibold' 
                : 'text-gray-400 hover:bg-gray-700 hover:text-white'
        }`;

    return (
        <div className="min-h-screen bg-gray-50 font-sans flex">
            
            {/* Botón de Menú para Móvil (Visible solo en pantallas pequeñas) */}
            <div className="fixed top-0 left-0 z-40 p-4 lg:hidden">
                <button 
                    onClick={() => setIsSidebarOpen(true)}
                    className="p-2 rounded-lg bg-white shadow border border-gray-200 text-gray-700 hover:bg-gray-100"
                >
                    <Menu className="h-6 w-6" />
                </button>
            </div>

            {/* Sidebar (Barra Lateral) */}
            <aside className={`
                w-64 bg-gray-800 text-white flex-shrink-0 flex flex-col 
                fixed inset-y-0 left-0 transform transition-transform duration-300 z-50
                lg:relative lg:translate-x-0
                ${isSidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'}
            `}>
                {/* Encabezado y Botón de Cierre (para móvil) */}
                <div className="p-4 flex justify-between items-center border-b border-gray-700">
                    <div className="text-2xl font-extrabold text-green-400 flex items-center">
                         <Zap className="h-6 w-6 mr-2" />
                        Ambrosia Admin
                    </div>
                    <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden p-1 text-gray-400 hover:text-white">
                        <X className="h-6 w-6" />
                    </button>
                </div>
                
                {/* Menú de Navegación */}
                <nav className="flex-1 px-4 py-6 space-y-2">
                    {navItems.map(item => {
                        const Icon = item.icon; // Componente Icono
                        return (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                end={item.path === '/admin'} // 'end' solo para el Dashboard raíz
                                className={getNavLinkClass}
                                onClick={() => setIsSidebarOpen(false)} // Cerrar al hacer clic en móvil
                            >
                                <Icon className="h-5 w-5 mr-3" />
                                {item.name}
                            </NavLink>
                        );
                    })}
                </nav>

                {/* Sección Inferior - Logout */}
                <div className="p-4 border-t border-gray-700 mt-auto">
                    <button 
                        onClick={handleLogout} 
                        className="w-full flex items-center p-3 rounded-lg text-sm font-medium text-gray-400 hover:bg-red-700 hover:text-white transition-colors"
                    >
                        <LogOut className="h-5 w-5 mr-3" />
                        Cerrar Sesión
                    </button>
                </div>
            </aside>

            {/* Main Content (El área donde se cargan las páginas) */}
            <main className="flex-1 p-6 lg:p-10 overflow-y-auto">
                {/* El contenido específico de la ruta hija (Dashboard, Usuarios, etc.) se renderiza aquí */}
                <Outlet />
            </main>

            {/* Overlay Oscuro para Móvil cuando el menú está abierto */}
            {isSidebarOpen && (
              <div 
                className="fixed inset-0 bg-black opacity-50 z-40 lg:hidden"
                onClick={() => setIsSidebarOpen(false)}
              ></div>
            )}
        </div>
    );
};

export default AdminLayout;