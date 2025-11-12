import React from 'react';
import { Users, BookText, MessageSquare, BarChart2 } from 'lucide-react';

// Stat Card Component
const StatCard = ({ icon, title, value, change, changeType }) => {
  const Icon = icon;
  const isPositive = changeType === 'positive';

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <div className="flex items-center">
        <div className="bg-ambrosia-green/10 p-3 rounded-full">
          <Icon className="h-6 w-6 text-ambrosia-green" />
        </div>
        <div className="ml-4">
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-2xl font-bold text-gray-800">{value}</p>
        </div>
      </div>
      <div className="mt-4 text-sm">
        <span className={`font-semibold ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
          {isPositive ? '+' : ''}{change}
        </span>
        <span className="text-gray-500"> vs el último mes</span>
      </div>
    </div>
  );
};


export const AdminDashboard: React.FC = () => {
  const stats = [
    { icon: Users, title: 'Usuarios Totales', value: '1,250', change: '12.5%', changeType: 'positive' },
    { icon: BookText, title: 'Recursos Publicados', value: '480', change: '8.2%', changeType: 'positive' },
    { icon: MessageSquare, title: 'Hilos Activos en Foros', value: '89', change: '3.1%', changeType: 'negative' },
    { icon: Users, title: 'Nuevos Registros (Mes)', value: '112', change: '25%', changeType: 'positive' },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Dashboard</h1>
      <p className="text-gray-600 mb-8">Bienvenido de nuevo, Administrador.</p>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      {/* Charts Section */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Placeholder for Growth Chart */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Crecimiento de Usuarios</h3>
          <div className="h-64 bg-gray-100 rounded-md flex items-center justify-center">
            <BarChart2 className="h-12 w-12 text-gray-400" />
            <p className="text-gray-500 ml-2">Gráfico de ejemplo</p>
          </div>
        </div>

        {/* Placeholder for Content Distribution Chart */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Distribución de Contenido</h3>
          <div className="h-64 bg-gray-100 rounded-md flex items-center justify-center">
            <BarChart2 className="h-12 w-12 text-gray-400" />
            <p className="text-gray-500 ml-2">Gráfico de ejemplo</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
