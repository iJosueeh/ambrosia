import React, { useEffect, useState } from 'react';
import { Users, BookText, MessageSquare, UserPlus, FilePlus, MessageCircle } from 'lucide-react';
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
  Filler,
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

// --- TypeScript Interfaces ---

interface Stat {
  icon: React.ElementType;
  title: string;
  value: string;
  change: string;
  changeType: 'positive' | 'negative';
}

interface Activity {
  icon: React.ElementType;
  text: string;
  subject: string;
  time: string;
}

interface DashboardData {
  stats: Stat[];
  growthChart: {
    labels: string[];
    data: number[];
  };
  recentActivity: Activity[];
}

// Mock service to fetch data
const getDashboardData = async (): Promise<DashboardData> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 500));

  return {
    stats: [
      { icon: Users, title: 'Usuarios Totales', value: '1,250', change: '+12.5%', changeType: 'positive' },
      { icon: BookText, title: 'Recursos Publicados', value: '480', change: '+8.2%', changeType: 'positive' },
      { icon: MessageSquare, title: 'Hilos Activos en Foros', value: '89', change: '-3.1%', changeType: 'negative' },
      { icon: UserPlus, title: 'Nuevos Registros (Mes)', value: '112', change: '+25%', changeType: 'positive' },
    ],
    growthChart: {
      labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio'],
      data: [65, 59, 80, 81, 56, 55, 90],
    },
    recentActivity: [
      { icon: UserPlus, text: 'Nuevo usuario registrado: ', subject: 'carlos_dev', time: 'hace 5 minutos' },
      { icon: FilePlus, text: 'Nuevo artículo publicado: ', subject: '"Ansiedad 101"', time: 'hace 1 hora' },
      { icon: MessageCircle, text: 'Nuevo comentario en el foro: ', subject: '"Técnicas de Relajación"', time: 'hace 3 horas' },
      { icon: UserPlus, text: 'Nuevo usuario registrado: ', subject: 'ana_gomez', time: 'hace 5 horas' },
    ]
  };
};

// --- Component Props Interfaces ---



interface GrowthChartProps {
  data: {
    labels: string[];
    data: number[];
  };
}

interface RecentActivityProps {
  activities: Activity[];
}

// --- Components ---

const StatCard: React.FC<Stat> = ({ icon: Icon, title, value, change, changeType }) => {
  const isPositive = changeType === 'positive';
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 transition-transform hover:scale-105">
      <div className="flex items-center">
        <div className="bg-green-100 p-3 rounded-full">
          <Icon className="h-6 w-6 text-green-700" />
        </div>
        <div className="ml-4">
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-2xl font-bold text-gray-800">{value}</p>
        </div>
      </div>
      <div className="mt-4 text-sm">
        <span className={`font-semibold ${isPositive ? 'text-green-600' : 'text-red-500'}`}>
          {change}
        </span>
        <span className="text-gray-500"> vs el último mes</span>
      </div>
    </div>
  );
};

const GrowthChart: React.FC<GrowthChartProps> = ({ data }) => {
  const chartData = {
    labels: data.labels,
    datasets: [
      {
        label: 'Nuevos Usuarios',
        data: data.data,
        fill: true,
        backgroundColor: 'rgba(16, 185, 129, 0.2)',
        borderColor: 'rgba(16, 185, 129, 1)',
        tension: 0.4,
        pointBackgroundColor: 'rgba(16, 185, 129, 1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(16, 185, 129, 1)',
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        beginAtZero: true,
      },
    },
  };

  return <Line options={options} data={chartData} />;
};

const RecentActivity: React.FC<RecentActivityProps> = ({ activities }) => (
  <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
    <h3 className="text-lg font-semibold text-gray-700 mb-4">Actividad Reciente</h3>
    <ul className="space-y-4">
      {activities.map((activity, index) => {
        const Icon = activity.icon;
        return (
          <li key={index} className="flex items-center text-sm">
            <div className="bg-gray-100 p-2 rounded-full mr-3">
              <Icon className="h-5 w-5 text-gray-500" />
            </div>
            <div className="flex-grow">
              <span className="text-gray-600">{activity.text}</span>
              <span className="font-semibold text-gray-800">{activity.subject}</span>
            </div>
            <span className="text-gray-400 text-xs whitespace-nowrap">{activity.time}</span>
          </li>
        );
      })}
    </ul>
  </div>
);

// --- Main Dashboard Page ---

export const AdminDashboard: React.FC = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const data = await getDashboardData();
      setDashboardData(data);
      setLoading(false);
    };
    fetchData();
  }, []);

  if (loading || !dashboardData) {
    return (
      <div className="flex items-center justify-center h-full">
        <p>Cargando datos del dashboard...</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Dashboard</h1>
      <p className="text-gray-600 mb-8">Bienvenido de nuevo, Administrador.</p>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {dashboardData.stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      {/* Main Content Area */}
      <div className="mt-8 grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Growth Chart (takes 2/3 width on large screens) */}
        <div className="xl:col-span-2 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Crecimiento Mensual de Usuarios</h3>
          <div className="h-80">
            <GrowthChart data={dashboardData.growthChart} />
          </div>
        </div>

        {/* Recent Activity (takes 1/3 width on large screens) */}
        <div className="xl:col-span-1">
          <RecentActivity activities={dashboardData.recentActivity} />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
