import React, { useState, useEffect } from 'react';
import type { ResourceUpdateDTO, ResourceCategory, ResourceStatus, ResourceAdminDTO } from '../types/resource.types';

interface ResourceEditModalProps {
  resource: Partial<ResourceAdminDTO> | null;
  isOpen: boolean;
  categories: ResourceCategory[];
  statuses: ResourceStatus[];
  onClose: () => void;
  onSave: (resource: ResourceUpdateDTO, id?: number) => void;
}

const initialFormState: ResourceUpdateDTO = {
    titulo: '',
    descripcion: '',
    enlace: '',
    urlimg: '',
    contenido: '',
    categoriaId: 0,
    estadoId: 0,
};

const ResourceEditModal: React.FC<ResourceEditModalProps> = ({ resource, isOpen, categories, statuses, onClose, onSave }) => {
  const [formData, setFormData] = useState<ResourceUpdateDTO>(initialFormState);

  useEffect(() => {
    if (resource && resource.id) {
        // This is a simplified mapping. A real implementation might need to fetch the full resource object
        // to get all fields for the ResourceUpdateDTO.
        setFormData({
            titulo: resource.titulo || '',
            descripcion: '', // Assuming these fields are not in ResourceAdminDTO
            enlace: '',
            urlimg: '',
            contenido: '',
            categoriaId: categories.find(c => c.nombre === resource.categoriaNombre)?.id || 0,
            estadoId: statuses.find(s => s.nombre === resource.estadoNombre)?.id || 0,
        });
    } else {
        setFormData(initialFormState);
    }
  }, [resource, categories, statuses]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const isNumeric = ['categoriaId', 'estadoId'].includes(name);
    setFormData(prev => ({ ...prev, [name]: isNumeric ? Number(value) : value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData, resource?.id);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4">{resource?.id ? 'Edit Resource' : 'Add New Resource'}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          
          <input name="titulo" value={formData.titulo} onChange={handleChange} placeholder="Title" className="w-full p-2 border rounded" />
          <textarea name="descripcion" value={formData.descripcion} onChange={handleChange} placeholder="Description" className="w-full p-2 border rounded" />
          <textarea name="contenido" value={formData.contenido} onChange={handleChange} placeholder="Content (Markdown)" className="w-full p-2 border rounded h-40" />
          <input name="enlace" value={formData.enlace} onChange={handleChange} placeholder="Link (e.g., to video or podcast)" className="w-full p-2 border rounded" />
          <input name="urlimg" value={formData.urlimg} onChange={handleChange} placeholder="Image URL" className="w-full p-2 border rounded" />

          <div className="grid grid-cols-2 gap-4">
            <select name="categoriaId" value={formData.categoriaId} onChange={handleChange} className="w-full p-2 border rounded">
                <option value={0}>Select Category</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
            </select>
            <select name="estadoId" value={formData.estadoId} onChange={handleChange} className="w-full p-2 border rounded">
                <option value={0}>Select Status</option>
                {statuses.map(s => <option key={s.id} value={s.id}>{s.nombre}</option>)}
            </select>
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">Save</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResourceEditModal;
