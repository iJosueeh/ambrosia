import React, { useState, useEffect, useMemo } from 'react'; // Import useMemo
import { useAuth } from '../../../shared/hooks/useAuth';
import { getProfesionalById } from '../services/profesional.service';
import { getRecursosByProfesionalId, getCategories } from '../../resources/services/resource.service'; // Import getCategories
import type { Profesional } from '../types/profesional.types';
import type { RecursoDTO } from '../../resources/types/recurso.types';
import type { CategoriaRecursoDTO } from '../../resources/types/categoria.types'; // Import CategoriaRecursoDTO
import { Mail, Phone, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom'; // Import Link for navigation
import Avatar from '../../../shared/components/Avatar'; // Import Avatar component

const ProfesionalDashboard: React.FC = () => {
    const { user, loading: authLoading } = useAuth();
    const [profesional, setProfesional] = useState<Profesional | null>(null);
    const [recursos, setRecursos] = useState<RecursoDTO[]>([]);
    const [categories, setCategories] = useState<CategoriaRecursoDTO[]>([]); // New state for categories
    const [activeFilter, setActiveFilter] = useState<string>('Todos'); // Change type to string
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const filterOptions = useMemo(() => {
        const options = [{ name: 'Todos', category: 'Todos' }];
        categories.forEach(cat => {
            options.push({ name: cat.nombre, category: cat.nombre });
        });
        return options;
    }, [categories]);

    const filteredRecursos = useMemo(() => {
        if (activeFilter === 'Todos') {
            return recursos;
        }
        return recursos.filter(recurso => recurso.nombreCategoria === activeFilter);
    }, [recursos, activeFilter]);

    useEffect(() => {
        const fetchProfesionalData = async () => {
            if (authLoading || !user) {
                return;
            }

            if (user.id) {
                try {
                    const [profesionalData, recursosData, categoriesData] = await Promise.all([ // Fetch categories
                        getProfesionalById(user.id),
                        getRecursosByProfesionalId(user.id),
                        getCategories() // Fetch categories
                    ]);
                    setProfesional(profesionalData);
                    setRecursos(recursosData);
                    setCategories(categoriesData); // Set categories
                } catch (err) {
                    console.error("Error al cargar los datos del profesional o recursos:", err);
                    setError("No se pudieron cargar los datos del dashboard.");
                } finally {
                    setLoading(false);
                }
            } else {
                setError("ID de usuario no disponible.");
                setLoading(false);
            }
        };

        fetchProfesionalData();
    }, [user, authLoading]); // Removed categories from dependencies
    if (authLoading || loading) {
        return <div className="text-center py-8">Cargando dashboard del profesional...</div>;
    }

    if (error) {
        return <div className="text-center py-8 text-red-600">{error}</div>;
    }

    if (!profesional) {
        return <div className="text-center py-8 text-gray-500">No se encontraron datos del profesional.</div>;
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
                <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Sobre Dr. {profesional.nombreUsuario}</h2>
                    <p className="text-gray-600 whitespace-pre-wrap">{profesional.descripcion}</p>
                </div>

                {/* Recent Publications */}
                <div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Publicaciones Recientes</h2>
                    {recursos.length === 0 ? ( // Change to recursos
                        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 text-center text-gray-500">
                            No hay publicaciones disponibles.
                        </div>
                    ) : (
                        <>
                            {/* Filters */}
                            <div className="flex flex-wrap gap-4 mb-6">
                                {filterOptions.map(option => (
                                    <button
                                        key={option.category}
                                        onClick={() => setActiveFilter(option.category as 'Todos' | 'Articulo' | 'Video')}
                                        className={`px-4 py-2 rounded-lg font-semibold transition-colors ${activeFilter === option.category
                                                ? 'bg-green-600 text-white'
                                                : 'bg-white border border-gray-300 text-gray-600 hover:bg-gray-100'
                                            }`}
                                    >
                                        {option.name}
                                    </button>
                                ))}
                            </div>

                            {/* Articles Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {filteredRecursos.map(recurso => ( // Use filteredRecursos here
                                    <div key={recurso.id} className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
                                        <img src={recurso.urlimg || "https://via.placeholder.com/400x200"} alt={recurso.titulo} className="w-full h-40 object-cover" />
                                        <div className="p-6">
                                            <p className="text-sm text-gray-500 mb-2">{recurso.fechaPublicacion ? new Date(recurso.fechaPublicacion).toLocaleDateString() : 'Fecha no disponible'}</p>
                                            <h3 className="text-lg font-bold text-gray-800 mb-2">{recurso.titulo}</h3>
                                            <p className="text-gray-600 text-sm mb-4 line-clamp-2">{recurso.descripcion}</p>
                                            <Link to={`/articulos/${recurso.slug}`} className="font-semibold text-green-600 hover:text-green-700">
                                                Leer artículo &rarr;
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Aside */}
            <div className="lg:col-span-1">
                <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
                    <div className="flex flex-col items-center text-center">
                        <Avatar
                            name={profesional.nombreUsuario}
                            imageUrl={profesional.profileImageUrl ? `${profesional.profileImageUrl}?t=${new Date().getTime()}` : undefined}
                            size="large" // O el tamaño que consideres adecuado para el dashboard
                        />
                        <h3 className="mt-4 text-xl font-bold text-gray-800">
                            <span className="text-gray-500">Dr.</span> {profesional.nombreUsuario}
                        </h3>
                        <p className="text-green-600 font-semibold">{profesional.especialidad}</p>
                        <Link to="/profesional/profile" className="mt-4 px-6 py-2 bg-green-600 text-white rounded-lg font-semibold">
                            Editar Perfil
                        </Link>
                    </div>

                    <div className="mt-6">
                        <h4 className="font-bold text-gray-700 mb-3">Especialidades e Habilidades</h4>
                        <div className="flex flex-wrap gap-2">
                            {Array.isArray(profesional.habilidades) && profesional.habilidades.map((habilidad, index) => (
                                <span key={index} className="bg-green-100 text-green-800 text-xs font-semibold px-3 py-1 rounded-full">{habilidad}</span>
                            ))}
                        </div>
                    </div>

                    <div className="mt-6 pt-6 border-t border-gray-200">
                        <h4 className="font-bold text-gray-700 mb-3">Información de Contacto</h4>
                        <ul className="space-y-3 text-gray-600">
                            <li className="flex items-center">
                                <Mail className="w-5 h-5 mr-3 text-gray-400" />
                                <span>{profesional.emailUsuario}</span>
                            </li>
                            <li className="flex items-center">
                                <Phone className="w-5 h-5 mr-3 text-gray-400" />
                                <span>{profesional.telefono || 'No disponible'}</span>
                            </li>
                            <li className="flex items-center">
                                <MapPin className="w-5 h-5 mr-3 text-gray-400" />
                                <span>{profesional.ubicacion || 'No disponible'}</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfesionalDashboard;
