import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { FileText, Target, Download, TrendingUp, CheckCircle, BookOpen, FileCheck, User, Activity, Settings, Shield, Bell, Globe, LogOut, Trash2, ChevronRight } from 'lucide-react';
import { useAuth } from '../../../shared/hooks/useAuth';
import { getUserByEmail, getSavedItems, removeSavedItem } from '../services/user.service';
import { useNavigate } from 'react-router-dom';
import type { UsuarioDTO, ActividadReciente, Recomendacion, Guardado } from '../types/user.types';
import EditProfileModal from './EditProfileModal';
import ChangePasswordModal from './ChangePasswordModal';
import DeleteAccountModal from './DeleteAccountModal';

export default function UserDashboard() {
    const [activeTab, setActiveTab] = useState('resumen');
    const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
    const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
    const [isDeleteAccountOpen, setIsDeleteAccountOpen] = useState(false);

    // Mock settings state
    const [emailNotifications, setEmailNotifications] = useState(true);
    const [language, setLanguage] = useState('es');

    const { user: authUser, isAuthenticated, logout } = useAuth();
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const { data: userData, isLoading, isError, error } = useQuery<UsuarioDTO, Error>({
        queryKey: ['userData', authUser?.email],
        queryFn: () => {
            if (!authUser?.email) {
                throw new Error('User email not available');
            }
            return getUserByEmail(authUser.email);
        },
        enabled: isAuthenticated && !!authUser?.email,
    });

    const { data: savedItems, isLoading: isLoadingSaved } = useQuery<Guardado[]>({
        queryKey: ['savedItems'],
        queryFn: getSavedItems,
        enabled: isAuthenticated && activeTab === 'guardados',
    });

    const removeSavedMutation = useMutation({
        mutationFn: removeSavedItem,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['savedItems'] });
        },
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
        { value: userData.articulosLeidos, label: 'Artículos leídos', icon: FileText, color: 'text-blue-600', bgColor: 'bg-blue-50' },
        { value: userData.testsCompletados, label: 'Tests completados', icon: Target, color: 'text-purple-600', bgColor: 'bg-purple-50' },
        { value: userData.recursosDescargados, label: 'Recursos descargados', icon: Download, color: 'text-teal-600', bgColor: 'bg-teal-50' },
        { value: userData.diasActivo, label: 'Días activo', icon: TrendingUp, color: 'text-emerald-600', bgColor: 'bg-emerald-50' }
    ];

    const progressData = userData.progreso || [];

    const formatTimeAgo = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

        let interval = seconds / 31536000;
        if (interval > 1) return `hace ${Math.floor(interval)} años`;
        interval = seconds / 2592000;
        if (interval > 1) return `hace ${Math.floor(interval)} meses`;
        interval = seconds / 86400;
        if (interval > 1) return `hace ${Math.floor(interval)} días`;
        interval = seconds / 3600;
        if (interval > 1) return `hace ${Math.floor(interval)} horas`;
        interval = seconds / 60;
        if (interval > 1) return `hace ${Math.floor(interval)} minutos`;
        return "hace unos segundos";
    };

    const activityTypeToUIMap: Record<ActividadReciente['tipoActividad'], { icon: any, color: string, bgColor: string }> = {
        REGISTRO: {
            icon: User,
            color: 'text-emerald-600',
            bgColor: 'bg-emerald-50'
        },
        TEST_COMPLETADO: {
            icon: CheckCircle,
            color: 'text-purple-600',
            bgColor: 'bg-purple-50'
        },
        ARTICULO_LEIDO: {
            icon: BookOpen,
            color: 'text-blue-600',
            bgColor: 'bg-blue-50'
        },
        RECURSO_DESCARGADO: {
            icon: Download,
            color: 'text-teal-600',
            bgColor: 'bg-teal-50'
        }
    };

    const recentActivity = (userData.actividadReciente || []).map((activity: ActividadReciente) => {
        const uiProps = activityTypeToUIMap[activity.tipoActividad] || {
            icon: Activity, // Icono por defecto
            color: 'text-gray-600',
            bgColor: 'bg-gray-50'
        };
        return {
            icon: uiProps.icon,
            text: activity.descripcion,
            time: formatTimeAgo(activity.fecha),
            color: uiProps.color,
            bgColor: uiProps.bgColor
        };
    });

    const recommendationTypeToUIMap: Record<Recomendacion['tipo'], { icon: any, color: string, bgColor: string }> = {
        TEST: {
            icon: Target,
            color: 'text-purple-600',
            bgColor: 'bg-purple-50'
        },
        ARTICULO: {
            icon: FileText,
            color: 'text-blue-600',
            bgColor: 'bg-blue-50'
        },
        RECURSO: {
            icon: BookOpen,
            color: 'text-teal-600',
            bgColor: 'bg-teal-50'
        }
    };

    const recommendations = (userData.recomendaciones || []).map((rec: Recomendacion) => {
        const uiProps = recommendationTypeToUIMap[rec.tipo] || {
            icon: TrendingUp, // Icono por defecto
            color: 'text-gray-600',
            bgColor: 'bg-gray-50'
        };
        return {
            ...rec,
            icon: uiProps.icon,
            color: uiProps.color,
            bgColor: uiProps.bgColor
        };
    });

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

                        <div className="flex-1 text-center md:text-left">
                            <h1 className="text-2xl md:text-3xl font-bold mb-1">{userData.nombre || 'Usuario'}</h1>
                            <p className="text-emerald-100 mb-2">{userData.correo}</p>
                            <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                                <div className="flex items-center gap-2 bg-white bg-opacity-20 rounded-full px-3 py-1 text-sm">
                                    <Activity className="w-4 h-4" />
                                    <span>{userData.diasActivo} días activo</span>
                                </div>
                            </div>
                        </div>

                        {/* Edit Profile Button */}
                        <button
                            onClick={() => setIsEditProfileOpen(true)}
                            className="bg-white text-emerald-600 px-6 py-2 rounded-lg font-semibold hover:bg-emerald-50 transition-colors duration-200"
                        >
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
                            <div>
                                {isLoadingSaved ? (
                                    <div className="text-center py-12">Cargando guardados...</div>
                                ) : savedItems && savedItems.length > 0 ? (
                                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {savedItems.map((item) => (
                                            <div key={item.id} className="bg-white rounded-xl shadow-md p-6 relative group border border-gray-100 hover:border-emerald-200 transition-all">
                                                <button
                                                    onClick={() => removeSavedMutation.mutate(item.id)}
                                                    className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors p-1 rounded-full hover:bg-red-50"
                                                    title="Eliminar de guardados"
                                                >
                                                    <Trash2 className="w-5 h-5" />
                                                </button>
                                                <div className="flex items-center gap-3 mb-4">
                                                    <div className={`p-2 rounded-lg ${item.tipo === 'TEST' ? 'bg-purple-50 text-purple-600' :
                                                        item.tipo === 'ARTICULO' ? 'bg-blue-50 text-blue-600' :
                                                            'bg-teal-50 text-teal-600'
                                                        }`}>
                                                        {item.tipo === 'TEST' ? <Target className="w-5 h-5" /> :
                                                            item.tipo === 'ARTICULO' ? <FileText className="w-5 h-5" /> :
                                                                <BookOpen className="w-5 h-5" />}
                                                    </div>
                                                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{item.tipo}</span>
                                                </div>
                                                <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-2 min-h-[3.5rem]">{item.titulo || 'Sin título'}</h3>
                                                <p className="text-gray-600 text-sm mb-4 line-clamp-3 min-h-[3.75rem]">{item.descripcion || 'Sin descripción disponible.'}</p>
                                                <button
                                                    onClick={() => navigate(item.url || '#')}
                                                    className="text-emerald-600 font-medium hover:text-emerald-700 flex items-center gap-1 text-sm group-hover:translate-x-1 transition-transform"
                                                >
                                                    Ver contenido <ChevronRight className="w-4 h-4" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-12">
                                        <FileCheck className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                                        <h3 className="text-xl font-semibold text-gray-800 mb-2">No tienes contenido guardado</h3>
                                        <p className="text-gray-600">Guarda artículos y recursos para acceder fácilmente más tarde</p>
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === 'configuracion' && (
                            <div className="max-w-4xl mx-auto">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Sección Perfil */}
                                    <section className="bg-gray-50 rounded-xl p-6 h-full">
                                        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                            <User className="w-5 h-5 text-emerald-600" />
                                            Información Personal
                                        </h3>
                                        <div className="space-y-3">
                                            <button
                                                onClick={() => setIsEditProfileOpen(true)}
                                                className="w-full flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200 hover:border-emerald-300 hover:shadow-sm transition-all"
                                            >
                                                <span className="text-gray-700 font-medium">Editar perfil</span>
                                                <ChevronRight className="w-5 h-5 text-gray-400" />
                                            </button>
                                            <button
                                                onClick={() => setIsChangePasswordOpen(true)}
                                                className="w-full flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200 hover:border-emerald-300 hover:shadow-sm transition-all"
                                            >
                                                <span className="text-gray-700 font-medium">Cambiar contraseña</span>
                                                <ChevronRight className="w-5 h-5 text-gray-400" />
                                            </button>
                                        </div>
                                    </section>

                                    {/* Sección Notificaciones */}
                                    <section className="bg-gray-50 rounded-xl p-6 h-full">
                                        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                            <Bell className="w-5 h-5 text-emerald-600" />
                                            Notificaciones
                                        </h3>
                                        <div className="bg-white rounded-lg border border-gray-200 p-4">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="text-gray-700 font-medium">Por correo electrónico</p>
                                                    <p className="text-sm text-gray-500 mt-1">Recibe actualizaciones sobre tu progreso</p>
                                                </div>
                                                <button
                                                    onClick={() => setEmailNotifications(!emailNotifications)}
                                                    className={`w-12 h-6 rounded-full transition-colors relative ${emailNotifications ? 'bg-emerald-500' : 'bg-gray-300'}`}
                                                >
                                                    <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform ${emailNotifications ? 'left-7' : 'left-1'}`} />
                                                </button>
                                            </div>
                                        </div>
                                    </section>

                                    {/* Sección Preferencias */}
                                    <section className="bg-gray-50 rounded-xl p-6 h-full">
                                        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                            <Globe className="w-5 h-5 text-emerald-600" />
                                            Preferencias
                                        </h3>
                                        <div className="bg-white rounded-lg border border-gray-200 p-4">
                                            <div className="flex items-center justify-between">
                                                <span className="text-gray-700 font-medium">Idioma</span>
                                                <select
                                                    value={language}
                                                    onChange={(e) => setLanguage(e.target.value)}
                                                    className="border-none bg-transparent text-gray-600 font-medium focus:ring-0 cursor-pointer text-right"
                                                >
                                                    <option value="es">Español</option>
                                                    <option value="en">English</option>
                                                </select>
                                            </div>
                                        </div>
                                    </section>

                                    {/* Sección Cuenta */}
                                    <section className="bg-gray-50 rounded-xl p-6 h-full">
                                        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                            <Settings className="w-5 h-5 text-emerald-600" />
                                            Cuenta
                                        </h3>
                                        <div className="space-y-3">
                                            <button
                                                onClick={logout}
                                                className="w-full flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200 hover:border-red-300 hover:text-red-600 transition-all group"
                                            >
                                                <span className="text-gray-700 font-medium group-hover:text-red-600">Cerrar sesión</span>
                                                <LogOut className="w-5 h-5 text-gray-400 group-hover:text-red-500" />
                                            </button>
                                            <button
                                                onClick={() => setIsDeleteAccountOpen(true)}
                                                className="w-full flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200 hover:border-red-300 hover:bg-red-50 transition-all group"
                                            >
                                                <span className="text-red-600 font-medium">Eliminar cuenta</span>
                                                <Trash2 className="w-5 h-5 text-red-500" />
                                            </button>
                                        </div>
                                    </section>
                                </div>
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
                                onClick={() => navigate(rec.link)}
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

            {/* Modals */}
            {userData && authUser?.id && (
                <>
                    <EditProfileModal
                        isOpen={isEditProfileOpen}
                        onClose={() => setIsEditProfileOpen(false)}
                        userId={authUser.id}
                        currentName={userData.nombre}
                        currentEmail={userData.correo}
                        currentTelefono={userData.telefono}
                        currentRol="USER"
                    />

                    <ChangePasswordModal
                        isOpen={isChangePasswordOpen}
                        onClose={() => setIsChangePasswordOpen(false)}
                        userId={authUser.id}
                    />

                    <DeleteAccountModal
                        isOpen={isDeleteAccountOpen}
                        onClose={() => setIsDeleteAccountOpen(false)}
                        userId={authUser.id}
                    />
                </>
            )}
        </div>
    );
}