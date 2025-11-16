import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../shared/hooks/useAuth';
import { getProfesionalById } from '../services/profesional.service';
import { getMaterialsByProfesionalId } from '../services/material.service'; // Import material service
import type { Profesional } from '../types/profesional.types';
import type { Material } from '../types/material.types'; // Import material type
import { Mail, Phone, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom'; // Import Link for navigation

const ProfesionalDashboard: React.FC = () => {
    const { user, loading: authLoading } = useAuth();
    const [profesional, setProfesional] = useState<Profesional | null>(null);
    const [materials, setMaterials] = useState<Material[]>([]); // State for materials
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProfesionalData = async () => {
            if (authLoading || !user) {
                return;
            }

            if (user.id) {
                try {
                    const [profesionalData, materialsData] = await Promise.all([
                        getProfesionalById(user.id),
                        getMaterialsByProfesionalId(user.id)
                    ]);
                    setProfesional(profesionalData);
                    setMaterials(materialsData);
                } catch (err) {
                    console.error("Error al cargar los datos del profesional o materiales:", err);
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
    }, [user, authLoading]);

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
                    {materials.length === 0 ? (
                        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 text-center text-gray-500">
                            No hay publicaciones disponibles.
                        </div>
                    ) : (
                        <>
                            {/* Filters */}
                            <div className="flex space-x-4 mb-6">
                                <button className="px-4 py-2 bg-green-600 text-white rounded-lg font-semibold">Todos</button>
                                <button className="px-4 py-2 bg-white border border-gray-300 text-gray-600 rounded-lg font-semibold">Artículos</button>
                                <button className="px-4 py-2 bg-white border border-gray-300 text-gray-600 rounded-lg font-semibold">Videos</button>
                            </div>

                            {/* Articles Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {materials.map(material => (
                                    <div key={material.id} className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
                                        <img src="https://via.placeholder.com/400x200" alt={material.titulo} className="w-full h-40 object-cover" />
                                        <div className="p-6">
                                            <p className="text-sm text-gray-500 mb-2">{new Date(material.fechaCreacion).toLocaleDateString()}</p>
                                            <h3 className="text-lg font-bold text-gray-800 mb-2">{material.titulo}</h3>
                                            <p className="text-gray-600 text-sm mb-4 line-clamp-2">{material.contenidoHtml}</p>
                                            <Link to={`/articulos/${material.id}`} className="font-semibold text-green-600 hover:text-green-700">
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
                        <img
                            src="https://via.placeholder.com/150" // Placeholder for professional's photo
                            alt="Foto del profesional"
                            className="w-32 h-32 rounded-full object-cover border-4 border-green-200"
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
