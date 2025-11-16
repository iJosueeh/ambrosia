import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../shared/hooks/useAuth';
import { createMaterial, getMaterialsByProfesionalId, updateMaterial, deleteMaterial } from '../services/material.service';
import type { Material } from '../types/material.types';
import { Plus, Edit, Trash2 } from 'lucide-react';

const MaterialManagement: React.FC = () => {
    const { user } = useAuth();
    const [materials, setMaterials] = useState<Material[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingMaterial, setEditingMaterial] = useState<Material | null>(null);
    const [newMaterialData, setNewMaterialData] = useState({
        titulo: '',
        contenidoHtml: '',
        tipo: 'articulo', // Default type
        estado: 'Borrador', // Default status
    });

    const fetchMaterials = async () => {
        if (!user || !user.id) return;
        setLoading(true);
        try {
            // Assuming user.id is the profesionalId
            const data = await getMaterialsByProfesionalId(user.id);
            setMaterials(data);
        } catch (err) {
            console.error("Error al cargar materiales:", err);
            setError("No se pudieron cargar los materiales.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMaterials();
    }, [user]);

    const handleOpenModal = (material: Material | null = null) => {
        setEditingMaterial(material);
        if (material) {
            setNewMaterialData({
                titulo: material.titulo,
                contenidoHtml: material.contenidoHtml,
                tipo: material.tipo,
                estado: material.estado || 'Borrador',
            });
        } else {
            setNewMaterialData({
                titulo: '',
                contenidoHtml: '',
                tipo: 'articulo',
                estado: 'Borrador',
            });
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingMaterial(null);
        setNewMaterialData({ titulo: '', contenidoHtml: '', tipo: 'articulo', estado: 'Borrador' });
    };

    const handleSaveMaterial = async () => {
        if (!user || !user.id) {
            setError("Usuario no autenticado.");
            return;
        }

        try {
            const materialToSave = { ...newMaterialData, profesionalId: user.id, estado: newMaterialData.estado };
            if (editingMaterial) {
                await updateMaterial(editingMaterial.id, materialToSave);
            } else {
                await createMaterial(materialToSave);
            }
            handleCloseModal();
            fetchMaterials(); // Refresh list
        } catch (err) {
            console.error("Error al guardar material:", err);
            setError("Error al guardar material.");
        }
    };

    const handleDeleteMaterial = async (id: number) => {
        if (window.confirm('¿Estás seguro de que quieres eliminar este material?')) {
            try {
                await deleteMaterial(id);
                fetchMaterials(); // Refresh list
            } catch (err) {
                console.error("Error al eliminar material:", err);
                setError("Error al eliminar material.");
            }
        }
    };

    if (loading) return <div className="text-center py-8">Cargando materiales...</div>;
    if (error) return <div className="text-center py-8 text-red-600">{error}</div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-800">Gestión de Materiales</h1>
                <button onClick={() => handleOpenModal()} className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 flex items-center">
                    <Plus className="w-5 h-5 mr-2" /> Nuevo Material
                </button>
            </div>

            <div className="bg-white shadow-sm border border-gray-200 rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Título</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Categoría</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha Creación</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {materials.length === 0 ? (
                            <tr><td colSpan={5} className="text-center py-8 text-gray-500">No hay materiales disponibles.</td></tr>
                        ) : (
                            materials.map((material) => (
                                <tr key={material.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{material.titulo}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{material.tipo}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(material.fechaCreacion).toLocaleDateString()}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                            material.estado === 'Publicado' ? 'bg-green-100 text-green-800' :
                                            material.estado === 'Pendiente' ? 'bg-yellow-100 text-yellow-800' :
                                            'bg-gray-100 text-gray-800'
                                        }`}>
                                            {material.estado || 'Borrador'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button onClick={() => handleOpenModal(material)} className="text-indigo-600 hover:text-indigo-900 mr-3"><Edit className="w-5 h-5" /></button>
                                        <button onClick={() => handleDeleteMaterial(material.id)} className="text-red-600 hover:text-red-900"><Trash2 className="w-5 h-5" /></button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center">
                    <div className="bg-white p-8 rounded-lg shadow-xl max-w-2xl w-full">
                        <h2 className="text-2xl font-bold mb-4">{editingMaterial ? 'Editar Material' : 'Nuevo Material'}</h2>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">Título:</label>
                            <input
                                type="text"
                                value={newMaterialData.titulo}
                                onChange={(e) => setNewMaterialData({ ...newMaterialData, titulo: e.target.value })}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">Tipo:</label>
                            <select
                                value={newMaterialData.tipo}
                                onChange={(e) => setNewMaterialData({ ...newMaterialData, tipo: e.target.value })}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            >
                                <option value="articulo">Artículo</option>
                                <option value="video">Video</option>
                                <option value="documento">Documento</option>
                            </select>
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">Estado:</label>
                            <select
                                value={newMaterialData.estado}
                                onChange={(e) => setNewMaterialData({ ...newMaterialData, estado: e.target.value })}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            >
                                <option value="Borrador">Borrador</option>
                                <option value="Pendiente">Pendiente</option>
                                <option value="Publicado">Publicado</option>
                            </select>
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">Contenido HTML:</label>
                            <textarea
                                value={newMaterialData.contenidoHtml}
                                onChange={(e) => setNewMaterialData({ ...newMaterialData, contenidoHtml: e.target.value })}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-48"
                            ></textarea>
                        </div>
                        <div className="flex justify-end gap-4">
                            <button onClick={handleCloseModal} className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-400">Cancelar</button>
                            <button onClick={handleSaveMaterial} className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700">Guardar</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MaterialManagement;
