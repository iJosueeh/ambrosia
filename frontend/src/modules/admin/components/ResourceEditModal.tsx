import React, { useState, useEffect } from 'react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { fetchResourceById } from '../services/resources.service';
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

// Configuración del toolbar de Quill
const quillModules = {
  toolbar: [
    [{ 'header': [1, 2, 3, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ 'color': [] }, { 'background': [] }],
    [{ 'list': 'ordered' }, { 'list': 'bullet' }],
    [{ 'align': [] }],
    ['link', 'image'],
    ['clean']
  ],
};

const quillFormats = [
  'header',
  'bold', 'italic', 'underline', 'strike',
  'color', 'background',
  'list', 'bullet',
  'align',
  'link', 'image'
];

const ResourceEditModal: React.FC<ResourceEditModalProps> = ({ resource, isOpen, categories, statuses, onClose, onSave }) => {
  const [formData, setFormData] = useState<ResourceUpdateDTO>(initialFormState);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadResourceData = async () => {
      if (resource && resource.id) {
        setLoading(true);
        try {
          // Fetch complete resource data from backend
          const fullResource = await fetchResourceById(resource.id);

          setFormData({
            titulo: fullResource.titulo || '',
            descripcion: fullResource.descripcion || '',
            enlace: fullResource.enlace || '',
            urlimg: fullResource.urlimg || '',
            contenido: fullResource.contenido || '',
            categoriaId: categories.find(c => c.nombre === resource.categoriaNombre)?.id || 0,
            estadoId: statuses.find(s => s.nombre === resource.estadoNombre)?.id || 0,
          });
        } catch (error) {
          console.error('Error loading resource:', error);
        } finally {
          setLoading(false);
        }
      } else {
        setFormData(initialFormState);
      }
    };

    if (isOpen) {
      loadResourceData();
    }
  }, [resource, categories, statuses, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const isNumeric = ['categoriaId', 'estadoId'].includes(name);
    setFormData(prev => ({ ...prev, [name]: isNumeric ? Number(value) : value }));
  };

  const handleContentChange = (content: string) => {
    setFormData(prev => ({ ...prev, contenido: content }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData, resource?.id);
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
        <div className="bg-white rounded-lg shadow-xl p-6">
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4">{resource?.id ? 'Editar Recurso' : 'Añadir Nuevo Recurso'}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Título</label>
            <input name="titulo" value={formData.titulo} onChange={handleChange} placeholder="Título del recurso" className="w-full p-2 border rounded" required />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
            <textarea name="descripcion" value={formData.descripcion} onChange={handleChange} placeholder="Descripción breve del recurso" className="w-full p-2 border rounded" rows={3} required />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Contenido (HTML)</label>
            <div className="border rounded bg-white">
              <ReactQuill
                theme="snow"
                value={formData.contenido}
                onChange={handleContentChange}
                modules={quillModules}
                formats={quillFormats}
                placeholder="Escribe el contenido del recurso aquí..."
                style={{ height: '300px', marginBottom: '50px' }}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Enlace Externo</label>
              <input name="enlace" value={formData.enlace} onChange={handleChange} placeholder="https://ejemplo.com/video" className="w-full p-2 border rounded" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">URL de Imagen</label>
              <input name="urlimg" value={formData.urlimg} onChange={handleChange} placeholder="https://ejemplo.com/imagen.jpg" className="w-full p-2 border rounded" required />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
              <select name="categoriaId" value={formData.categoriaId} onChange={handleChange} className="w-full p-2 border rounded" required>
                <option value={0}>Seleccionar Categoría</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
              <select name="estadoId" value={formData.estadoId} onChange={handleChange} className="w-full p-2 border rounded" required>
                <option value={0}>Seleccionar Estado</option>
                {statuses.map(s => <option key={s.id} value={s.id}>{s.nombre}</option>)}
              </select>
            </div>
          </div>

          <div className="mt-6 flex justify-end space-x-3 pt-4 border-t">
            <button type="button" onClick={onClose} className="px-6 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors">
              Cancelar
            </button>
            <button type="submit" className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors">
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResourceEditModal;
