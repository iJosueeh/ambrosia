import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../../shared/hooks/useAuth';
import { getStatistics, exportStatisticsToExcel } from '../services/statistics.service';
import type { StatisticData } from '../types/statistics.types';
import { Bar, Doughnut } from 'react-chartjs-2'; // Import Doughnut
import toast from 'react-hot-toast';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    ArcElement, // Import ArcElement for Doughnut
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    ArcElement, // Register ArcElement
    Title,
    Tooltip,
    Legend
);

// Helper to generate random colors
const getRandomColor = () => {
    const r = Math.floor(Math.random() * 255);
    const g = Math.floor(Math.random() * 255);
    const b = Math.floor(Math.random() * 255);
    return `rgba(${r}, ${g}, ${b}, 0.6)`;
};


const StatisticsDashboard: React.FC = () => {
    const { id: resourceId } = useParams<{ id: string }>();
    const { user } = useAuth();
    const [statistics, setStatistics] = useState<StatisticData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchStatistics = async () => {
            if (!user || !user.id) {
                setError("User not authenticated.");
                setLoading(false);
                return;
            }
            setLoading(true);
            try {
                let data;
                if (resourceId) {
                    console.log(`Fetching stats for resource ID: ${resourceId}`);
                    // data = await getStatisticsForResource(parseInt(resourceId, 10));
                    data = await getStatistics(user.id);
                } else {
                    data = await getStatistics(user.id);
                }
                setStatistics(data);
            } catch (err) {
                console.error("Error fetching statistics:", err);
                setError("Failed to load statistics.");
            } finally {
                setLoading(false);
            }
        };

        fetchStatistics();
    }, [user, resourceId]);

    const handleExport = async () => {
        if (!user?.id) {
            toast.error("Autenticación requerida para exportar.");
            return;
        }
        toast.loading("Exportando datos a Excel...", { id: 'export-toast' });
        try {
            const blob = await exportStatisticsToExcel(user.id);
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `estadisticas_profesional_${user.id}.xlsx`;
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);
            toast.success("¡Exportado con éxito!", { id: 'export-toast' });
        } catch (exportError) {
            console.error("Failed to export to Excel:", exportError);
            toast.error("No se pudo exportar los datos.", { id: 'export-toast' });
        }
    };

    if (loading) return <div className="text-center py-8">Cargando estadísticas...</div>;
    if (error) return <div className="text-center py-8 text-red-600">{error}</div>;

    if (resourceId && !statistics) {
        return <div className="text-center py-8 text-gray-500">No hay datos de estadísticas disponibles para el recurso con ID: {resourceId}.</div>;
    }
    
    if (!statistics) return <div className="text-center py-8 text-gray-500">No hay datos de estadísticas disponibles.</div>;

    const downloadChartData = {
        labels: statistics.downloadTrends.map(trend => trend.date),
        datasets: [
            {
                label: 'Descargas',
                data: statistics.downloadTrends.map(trend => trend.count),
                backgroundColor: 'rgba(0, 179, 126, 0.5)',
                borderColor: '#00B37E',
                borderWidth: 1,
            },
        ],
    };

    const resourcePopularityChartData = {
        labels: statistics.resourcePopularity.map(res => res.resourceTitle),
        datasets: [
            {
                label: 'Vistas/Descargas',
                data: statistics.resourcePopularity.map(res => res.count),
                backgroundColor: 'rgba(75, 192, 192, 0.5)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
            },
        ],
    };

    const categoryDistributionData = {
        labels: statistics.resourceDistributionByCategory.map(cat => cat.categoryName),
        datasets: [{
            label: 'Recursos por Categoría',
            data: statistics.resourceDistributionByCategory.map(cat => cat.count),
            backgroundColor: statistics.resourceDistributionByCategory.map(() => getRandomColor()),
            borderWidth: 1,
        }],
    };
    
    const categoryPerformanceData = {
        labels: statistics.downloadPerformanceByCategory.map(cat => cat.categoryName),
        datasets: [{
            label: 'Descargas por Categoría',
            data: statistics.downloadPerformanceByCategory.map(cat => cat.count),
            backgroundColor: 'rgba(255, 159, 64, 0.6)',
            borderColor: 'rgba(255, 159, 64, 1)',
            borderWidth: 1,
        }],
    };


    return (
        <div className="space-y-8 p-6 bg-gray-50 rounded-lg shadow-md">
            <h1 className="text-4xl font-bold text-gray-800 mb-6">
                {resourceId ? `Estadísticas para el Recurso #${resourceId}` : 'Panel de Estadísticas General'}
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-700">Total de Descargas</h2>
                    <p className="text-3xl font-bold text-ambrosia-green mt-2">{statistics.totalDownloads}</p>
                </div>
                <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-700">Recursos Publicados</h2>
                    <p className="text-3xl font-bold text-blue-600 mt-2">{statistics.publishedResources}</p>
                </div>
                <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-700">Usuarios Únicos</h2>
                    <p className="text-3xl font-bold text-purple-600 mt-2">{statistics.uniqueUsers}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">Distribución por Categoría</h2>
                    <Doughnut data={categoryDistributionData} options={{ responsive: true, plugins: { legend: { position: 'top' as const } } }} />
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">Rendimiento por Categoría</h2>
                    <Bar data={categoryPerformanceData} options={{ responsive: true, indexAxis: 'y', plugins: { legend: { display: false } } }} />
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">Tendencia de Descargas</h2>
                    <Bar data={downloadChartData} options={{ responsive: true, plugins: { legend: { position: 'top' as const }, title: { display: true, text: 'Descargas por Fecha' } } }} />
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">Popularidad de Recursos</h2>
                    <Bar data={resourcePopularityChartData} options={{ responsive: true, plugins: { legend: { position: 'top' as const }, title: { display: true, text: 'Vistas/Descargas por Recurso' } } }} />
                </div>
            </div>

            <div className="text-right mt-8">
                <button onClick={handleExport} className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 text-lg font-semibold">
                    Exportar Datos a Excel
                </button>
            </div>
        </div>
    );
};

export default StatisticsDashboard;
