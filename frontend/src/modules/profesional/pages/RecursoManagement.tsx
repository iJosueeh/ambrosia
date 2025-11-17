import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../shared/hooks/useAuth';
import { getRecursosByProfesionalId, deleteRecurso } from '../../resources/services/resource.service'; // Use resource service
import type { RecursoDTO } from '../../resources/types/recurso.types'; // Use RecursoDTO
import { Plus, Edit, Trash2, BarChart } from 'lucide-react';

const RecursoManagement: React.FC = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [recursos, setRecursos] = useState<RecursoDTO[]>([]); // Change to recursos
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchRecursos = async () => { // Change function name
        if (!user || !user.id) return;
        setLoading(true);
        try {
            const data = await getRecursosByProfesionalId(user.id); // Use new service method
            setRecursos(data); // Set recursos
        } catch (err) {
            console.error("Error al cargar recursos:", err);
            setError("No se pudieron cargar los recursos.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user?.id) {
            fetchRecursos();
        }
    }, [user]);

    const handleAddNew = () => {
        navigate('/profesional/recursos/nuevo'); // Update path
    };

    const handleEdit = (id: number) => {
        navigate(`/profesional/recursos/editar/${id}`); // Update path
    };

    const handleDeleteRecurso = async (id: number) => { // Change function name
        if (window.confirm('¿Estás seguro de que quieres eliminar este recurso?')) {
            try {
                await deleteRecurso(id); // Use new service method
                fetchRecursos(); // Refresh list
            } catch (err) {
                console.error("Error al eliminar recurso:", err);
                setError("Error al eliminar recurso.");
            }
        }
    };

    if (loading) return <div className="text-center py-8">Cargando recursos...</div>;
    if (error) return <div className="text-center py-8 text-red-600">{error}</div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-800">Gestión de Recursos</h1>
                <button onClick={handleAddNew} className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 flex items-center">
                    <Plus className="w-5 h-5 mr-2" /> Nuevo Recurso
                </button>
            </div>

            <div className="bg-white shadow-sm border border-gray-200 rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Titulo</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Categoria</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {recursos.length === 0 ? (
                            <tr><td colSpan={5} className="text-center py-8 text-gray-500">No hay recursos disponibles.</td></tr>
                        ) : (
                            recursos.map((recurso) => (
                                <tr key={recurso.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{recurso.titulo}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm bg-green-50 text-green-800">{recurso.nombreCategoria}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm bg-green-50 text-green-800">{recurso.fechaPublicacion ? new Date(recurso.fechaPublicacion).toLocaleDateString() : 'Fecha no disponible'}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                            recurso.estado === 'PUBLICADO' ? 'bg-green-100 text-green-800' :
                                            recurso.estado === 'REVISION' ? 'bg-yellow-100 text-yellow-800' :
                                            'bg-gray-100 text-gray-800'
                                        }`}>
                                            {recurso.estado || 'BORRADOR'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button className="text-green-800 hover:text-green-600 mr-3"><BarChart className="w-5 h-5" /></button>
                                        <button onClick={() => recurso.id && handleEdit(recurso.id)} className="text-green-800 hover:text-green-600 mr-3"><Edit className="w-5 h-5" /></button>
                                        <button onClick={() => recurso.id && handleDeleteRecurso(recurso.id)} className="text-green-800 hover:text-green-600"><Trash2 className="w-5 h-5" /></button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default RecursoManagement;
