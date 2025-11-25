

import { useState, useEffect } from 'react';
import type { JSX } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { FaUsers, FaBook, FaComments, FaUserPlus } from 'react-icons/fa';

import { getAdminDashboardData as getDashboardData } from '../services/analytics.service';
import type { AdminDashboardData } from '../types/dashboard.types';

// Registrar los componentes de Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

// Un componente pequeño y reutilizable para las tarjetas de estadísticas
const StatCard = ({ title, value, icon }: { title: string, value: string | number, icon: JSX.Element }) => (
  <div className="bg-white p-6 rounded-lg shadow-md flex items-center justify-between">
    <div>
      <p className="text-sm font-medium text-gray-500">{title}</p>
      <p className="text-2xl font-bold text-gray-800">{value}</p>
    </div>
    <div className="text-3xl opacity-70">{icon}</div>
  </div>
);

// Función para formatear la fecha de forma amigable
const formatRelativeTime = (isoDate: string) => {
  const date = new Date(isoDate);
  const now = new Date();
  const seconds = Math.round((now.getTime() - date.getTime()) / 1000);
  const minutes = Math.round(seconds / 60);
  const hours = Math.round(minutes / 60);
  const days = Math.round(hours / 24);

  if (seconds < 60) return `${seconds} seconds ago`;
  if (minutes < 60) return `${minutes} minutes ago`;
  if (hours < 24) return `${hours} hours ago`;
  return `${days} days ago`;
};

const AdminDashboard = () => {
  const [dashboardData, setDashboardData] = useState<AdminDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await getDashboardData();
        setDashboardData(data);
      } catch (err) {
        setError('Failed to load dashboard data. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center h-screen"><p>Loading Dashboard...</p></div>;
  }

  if (error) {
    return <div className="flex justify-center items-center h-screen"><p className="text-red-500">{error}</p></div>;
  }

  // Adaptar los datos para el gráfico
  const lineChartData = {
    labels: dashboardData?.userGrowth.labels || [],
    datasets: [
      {
        label: 'New Users',
        data: dashboardData?.userGrowth.data || [],
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        tension: 0.2,
      },
    ],
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen font-sans">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Admin Dashboard</h1>

      {/* Sección de Estadísticas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard title="Total Users" value={dashboardData?.stats.totalUsuarios ?? 0} icon={<FaUsers className="text-blue-500" />} />
        <StatCard title="Published Resources" value={dashboardData?.stats.recursosPublicados ?? 0} icon={<FaBook className="text-green-500" />} />
        <StatCard title="Active Threads" value={dashboardData?.stats.hilosActivos ?? 0} icon={<FaComments className="text-yellow-500" />} />
        <StatCard title="New Users (Month)" value={dashboardData?.stats.nuevosRegistrosMes ?? 0} icon={<FaUserPlus className="text-purple-500" />} />
      </div>

      {/* Sección de Gráficos y Actividad */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Gráfico de Crecimiento */}
        <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">User Growth</h2>
          <Line data={lineChartData} />
        </div>

        {/* Actividad Reciente */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Recent Activity</h2>
          <ul className="space-y-4">
            {dashboardData?.recentActivity.map((activity, index) => (
              <li key={index} className="flex flex-col">
                <span className="text-gray-800">{activity.descripcion}</span>
                <span className="text-xs text-gray-500 self-end">{formatRelativeTime(activity.fecha)}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
