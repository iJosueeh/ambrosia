import { useState, useEffect } from 'react';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Filler } from 'chart.js';
import type { ChartOptions } from 'chart.js'; 
import { fetchUsersGrowth, fetchResourcesStats, fetchForumStats, fetchAnalyticsSummary } from '../services/analytics.service';
import type { UsersGrowthData, ResourcesStats, ForumStats, AnalyticsSummary } from '../services/analytics.service';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Filler);

// --- Chart Options ---

const lineChartOptions: ChartOptions<'line'> = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom',
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        precision: 0, // Ensure y-axis labels are integers
      },
    },
  },
};

const doughnutChartOptions: ChartOptions<'doughnut'> = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'right',
    },
  },
};

const barChartOptions: ChartOptions<'bar'> = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom',
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        precision: 0, // Ensure y-axis labels are integers
      },
    },
  },
};

const Analytics = () => {
  const [usersGrowth, setUsersGrowth] = useState<UsersGrowthData | null>(null);
  const [resourcesStats, setResourcesStats] = useState<ResourcesStats | null>(null);
  const [forumStats, setForumStats] = useState<ForumStats | null>(null);
  const [summary, setSummary] = useState<AnalyticsSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadAnalyticsData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [growth, resources, forum, summaryData] = await Promise.all([
          fetchUsersGrowth(30), // Fetch last 30 days of user growth
          fetchResourcesStats(),
          fetchForumStats(),
          fetchAnalyticsSummary(),
        ]);
        setUsersGrowth(growth);
        setResourcesStats(resources);
        setForumStats(forum);
        setSummary(summaryData);
      } catch (err) {
        console.error("Failed to fetch analytics data:", err);
        setError("Failed to load analytics data.");
      } finally {
        setLoading(false);
      }
    };
    loadAnalyticsData();
  }, []);

  // --- Chart Data Mapping ---

  const userGrowthChartData = usersGrowth ? {
    labels: Object.keys(usersGrowth),
    datasets: [{
      label: 'Nuevos Usuarios',
      data: Object.values(usersGrowth),
      borderColor: 'rgba(16, 185, 129, 1)',
      backgroundColor: 'rgba(16, 185, 129, 0.2)',
      fill: true,
      tension: 0.3,
    }],
  } : { labels: [], datasets: [] };

  const contentDistributionChartData = (resourcesStats && forumStats) ? {
    labels: ['Recursos', 'Temas de Foro', 'Comentarios de Foro'],
    datasets: [{
      label: 'Distribución de Contenido',
      data: [resourcesStats.totalResources, forumStats.totalTopics, forumStats.totalComments],
      backgroundColor: ['#10B981', '#3B82F6', '#F59E0B'],
    }],
  } : { labels: [], datasets: [] };

  // For the "User Growth (Quarterly)" bar chart, we'll use the same usersGrowth data for simplicity,
  // but a real quarterly data would require more specific backend aggregation.
  const userGrowthBarChartData = usersGrowth ? {
    labels: Object.keys(usersGrowth), // Using daily for now, ideally quarterly
    datasets: [
      {
        label: 'Nuevos Usuarios',
        data: Object.values(usersGrowth),
        backgroundColor: '#3B82F6',
      },
    ],
  } : { labels: [], datasets: [] };


  if (loading) return <div className="text-center py-8">Cargando análisis...</div>;
  if (error) return <div className="text-center py-8 text-red-600">{error}</div>;
  if (!summary) return <div className="text-center py-8 text-gray-500">No hay datos de análisis disponibles.</div>;

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-gray-800">Análisis de la Plataforma</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200 flex flex-col items-center justify-center">
          <p className="text-sm text-gray-500">Total Usuarios</p>
          <p className="text-3xl font-bold text-gray-800">{summary.totalUsers}</p>
        </div>
        <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200 flex flex-col items-center justify-center">
          <p className="text-sm text-gray-500">Total Recursos</p>
          <p className="text-3xl font-bold text-gray-800">{summary.totalResources}</p>
        </div>
        <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200 flex flex-col items-center justify-center">
          <p className="text-sm text-gray-500">Total Temas Foro</p>
          <p className="text-3xl font-bold text-gray-800">{summary.totalTopics}</p>
        </div>
        <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200 flex flex-col items-center justify-center">
          <p className="text-sm text-gray-500">Total Comentarios Foro</p>
          <p className="text-3xl font-bold text-gray-800">{summary.totalComments}</p>
        </div>
      </div>

      {/* User Growth Chart */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Crecimiento de Usuarios (Últimos 30 días)</h3>
        <div className="h-80">
          <Line options={lineChartOptions} data={userGrowthChartData} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Content Distribution */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Distribución de Contenido</h3>
          <div className="h-80 flex justify-center">
            <Doughnut options={doughnutChartOptions} data={contentDistributionChartData} />
          </div>
        </div>

        {/* User Growth (Bar Chart) - Using same data for now */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Nuevos Usuarios por Día</h3>
          <div className="h-80">
            <Bar options={barChartOptions} data={userGrowthBarChartData} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
