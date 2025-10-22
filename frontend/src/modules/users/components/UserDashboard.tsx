import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { FileText, Target, Download, TrendingUp, CheckCircle, BookOpen, FileCheck, User, Activity, Settings, Shield } from 'lucide-react';
import { useAuth } from '../../../shared/hooks/useAuth';
import { getUserByEmail } from '../services/user.service';

export default function UserDashboard() {
    const [activeTab, setActiveTab] = useState('resumen');
    const { user: authUser, isAuthenticated } = useAuth();

    const { data: userData, isLoading, isError, error } = useQuery({
        queryKey: ['userData', authUser?.email],
        queryFn: () => {
            if (!authUser?.email) {
                throw new Error('User email not available');
            }
            return getUserByEmail(authUser.email);
        },
        enabled: isAuthenticated && !!authUser?.email,
    });

    if (isLoading) {
        return <div className="min-h-screen flex items-center justify-center">Cargando perfil...</div>;
    }

    if (isError) {
        return <div className="min-h-screen flex items-center justify-center text-red-600">Error al cargar el perfil: {error?.message}</div>;
    }

    if (!userData) {
        return <div className="min-h-screen flex items-center justify-center">No se encontraron datos de usuario.</div>;
    }

    const stats = [
        { value: 12, label: 'Artículos leídos', icon: FileText, color: 'text-blue-600', bgColor: 'bg-blue-50' },
        { value: 2, label: 'Tests completados', icon: Target, color: 'text-purple-600', bgColor: 'bg-purple-50' },
        { value: 8, label: 'Recursos descargados', icon: Download, color: 'text-teal-600', bgColor: 'bg-teal-50' },
        { value: 28, label: 'Días activo', icon: TrendingUp, color: 'text-emerald-600', bgColor: 'bg-emerald-50' }
    ];

    const progressData = [
        { label: 'Artículos completados', current: 12, total: 20, percentage: 60 },
        { label: 'Tests de seguimiento', current: 2, total: 4, percentage: 50 },
        { label: 'Recursos explorados', current: 8, total: 15, percentage: 53 }
    ];

    const recentActivity = [
        {
            icon: CheckCircle,
            text: 'Completaste el test de evaluación',
            time: '2 días atrás',
            color: 'text-purple-600',
            bgColor: 'bg-purple-50'
        },
        {
            icon: BookOpen,
            text: 'Leíste "Nutrición intuitiva"',
            time: '5 días atrás',
            color: 'text-blue-600',
            bgColor: 'bg-blue-50'
        },
        {
            icon: Download,
            text: 'Descargaste "Guía de Mindfulness"',
            time: '1 semana atrás',
            color: 'text-teal-600',
            bgColor: 'bg-teal-50'
        },
        {
            icon: User,
            text: 'Te uniste a Ambrosia Vital',
            time: '4 semanas atrás',
            color: 'text-emerald-600',
            bgColor: 'bg-emerald-50'
        }
    ];

    const recommendations = [
        {
            icon: Target,
            title: 'Realizar nuevo test',
            description: 'Monitorea tu progreso',
            color: 'text-purple-600',
            bgColor: 'bg-purple-50'
        },
        {
            icon: FileText,
            title: 'Leer artículos nuevos',
            description: '8 sin leer',
            color: 'text-blue-600',
            bgColor: 'bg-blue-50'
        },
        {
            icon: BookOpen,
            title: 'Explorar recursos',
            description: 'Guías y videos',
            color: 'text-teal-600',
            bgColor: 'bg-teal-50'
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-teal-50 to-emerald-50">
            {/* Header */}
            <div className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-4 py-8">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row items-center gap-6">
                        {/* Avatar */}
                        <div className="w-24 h-24 rounded-full bg-white p-1 shadow-lg">
                            <div className="w-full h-full rounded-full bg-gradient-to-br from-emerald-400 to-teal-400 flex items-center justify-center text-white text-3xl font-bold">
                                {userData.nombre ? userData.nombre.charAt(0).toUpperCase() : 'U'}
                            </div>
                        </div>

                        {/* User Info */}
                        <div className="flex-1 text-center md:text-left">
                            <h1 className="text-2xl md:text-3xl font-bold mb-1">{userData.nombre || 'Usuario'}</h1>
                            <p className="text-emerald-100 mb-2">{userData.correo}</p>
                            <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                                <div className="flex items-center gap-2 bg-white bg-opacity-20 rounded-full px-3 py-1 text-sm">
                                    <Activity className="w-4 h-4" />
                                    <span>28 días activo</span> {/* This should also come from backend */}
                                </div>
                            </div>
                        </div>

                        {/* Edit Profile Button */}
                        <button className="bg-white text-emerald-600 px-6 py-2 rounded-lg font-semibold hover:bg-emerald-50 transition-colors duration-200">
                            Editar Perfil
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    {stats.map((stat, index) => (
                        <div key={index} className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow duration-200">
                            <div className="flex items-center justify-between mb-3">
                                <div className={`w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center`}>
                                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                                </div>
                                <span className={`text-3xl font-bold ${stat.color}`}>{stat.value}</span>
                            </div>
                            <p className="text-gray-600 text-sm font-medium">{stat.label}</p>
                        </div>
                    ))}
                </div>

                {/* Tabs */}
                <div className="bg-white rounded-xl shadow-md mb-8 overflow-hidden">
                    <div className="flex border-b border-gray-200 overflow-x-auto">
                        {[
                            { id: 'resumen', label: 'Resumen', icon: Activity },
                            { id: 'guardados', label: 'Guardados', icon: FileCheck },
                            { id: 'configuracion', label: 'Configuración', icon: Settings },
                            { id: 'privacidad', label: 'Privacidad', icon: Shield }
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors whitespace-nowrap ${activeTab === tab.id
                                        ? 'border-b-2 border-emerald-500 text-emerald-600'
                                        : 'text-gray-600 hover:text-gray-800'
                                    }`}
                            >
                                <tab.icon className="w-5 h-5" />
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* Tab Content */}
                    <div className="p-6">
                        {activeTab === 'resumen' && (
                            <div className="grid lg:grid-cols-2 gap-6">
                                {/* Progress Section */}
                                <div>
                                    <div className="flex items-center gap-2 mb-6">
                                        <TrendingUp className="w-5 h-5 text-emerald-600" />
                                        <h2 className="text-xl font-bold text-gray-800">Tu Progreso</h2>
                                    </div>
                                    <p className="text-gray-600 mb-6">Sigue avanzando en tu camino de recuperación</p>

                                    <div className="space-y-6">
                                        {progressData.map((item, index) => (
                                            <div key={index}>
                                                <div className="flex justify-between items-center mb-2">
                                                    <span className="text-sm font-medium text-gray-700">{item.label}</span>
                                                    <span className="text-sm font-semibold text-gray-800">{item.current}/{item.total}</span>
                                                </div>
                                                <div className="w-full bg-gray-200 rounded-full h-3">
                                                    <div
                                                        className="bg-gradient-to-r from-emerald-500 to-teal-500 h-3 rounded-full transition-all duration-300"
                                                        style={{ width: `${item.percentage}%` }}
                                                    ></div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Recent Activity */}
                                <div>
                                    <div className="flex items-center gap-2 mb-6">
                                        <Activity className="w-5 h-5 text-blue-600" />
                                        <h2 className="text-xl font-bold text-gray-800">Actividad Reciente</h2>
                                    </div>
                                    <p className="text-gray-600 mb-6">Tu historial en la plataforma</p>

                                    <div className="space-y-4">
                                        {recentActivity.map((activity, index) => (
                                            <div key={index} className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                                <div className={`w-10 h-10 ${activity.bgColor} rounded-lg flex items-center justify-center flex-shrink-0`}>
                                                    <activity.icon className={`w-5 h-5 ${activity.color}`} />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-gray-800 font-medium">{activity.text}</p>
                                                    <p className="text-sm text-gray-500">{activity.time}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'guardados' && (
                            <div className="text-center py-12">
                                <FileCheck className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                                <h3 className="text-xl font-semibold text-gray-800 mb-2">No tienes contenido guardado</h3>
                                <p className="text-gray-600">Guarda artículos y recursos para acceder fácilmente más tarde</p>
                            </div>
                        )}

                        {activeTab === 'configuracion' && (
                            <div className="text-center py-12">
                                <Settings className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                                <h3 className="text-xl font-semibold text-gray-800 mb-2">Configuración de cuenta</h3>
                                <p className="text-gray-600">Administra tus preferencias y configuración</p>
                            </div>
                        )}

                        {activeTab === 'privacidad' && (
                            <div className="text-center py-12">
                                <Shield className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                                <h3 className="text-xl font-semibold text-gray-800 mb-2">Privacidad y seguridad</h3>
                                <p className="text-gray-600">Controla cómo se usa tu información</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Recommendations */}
                <div className="bg-white rounded-xl shadow-md p-6">
                    <div className="flex items-center gap-2 mb-6">
                        <TrendingUp className="w-5 h-5 text-emerald-600" />
                        <h2 className="text-xl font-bold text-gray-800">Recomendaciones para ti</h2>
                    </div>
                    <p className="text-gray-600 mb-6">Basadas en tu actividad y progreso</p>

                    <div className="grid md:grid-cols-3 gap-4">
                        {recommendations.map((rec, index) => (
                            <button
                                key={index}
                                className="text-left p-6 border-2 border-gray-200 rounded-xl hover:border-emerald-300 hover:bg-emerald-50 transition-all duration-200 group"
                            >
                                <div className={`w-12 h-12 ${rec.bgColor} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                                    <rec.icon className={`w-6 h-6 ${rec.color}`} />
                                </div>
                                <h3 className="font-semibold text-gray-800 mb-2">{rec.title}</h3>
                                <p className="text-sm text-gray-600">{rec.description}</p>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}