import { useState, useEffect } from 'react';
import { Plus, Search, ChevronLeft, ChevronRight, Trash2, Edit } from 'lucide-react';
import { fetchAdminResources, fetchResourceCategories, fetchResourceStatuses, deleteResource } from '../services/resources.service';
import type { ResourceAdminDTO, ResourceCategory, ResourceStatus } from '../types/resource.types';

// --- Reusable Components ---
// (Assuming FilterDropdown, Pagination, and StatusBadge are defined as before or adapted)

const FilterDropdown: React.FC<{
  label: string;
  options: { id: number; nombre: string }[];
  value: number | '';
  onChange: (value: string) => void;
  placeholder: string;
}> = ({ label, options, value, onChange, placeholder }) => (
  <div>
    <label htmlFor={label} className="block text-sm font-medium text-gray-700">{label}</label>
    <select
      id={label}
      value={value}
      onChange={e => onChange(e.target.value)}
      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md"
    >
      <option value="">{placeholder}</option>
      {options.map(option => <option key={option.id} value={option.id}>{option.nombre}</option>)}
    </select>
  </div>
);

const Pagination: React.FC<{
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}> = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;
  return (
    <div className="flex items-center justify-between">
      <button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1} className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50">
        <ChevronLeft className="w-5 h-5 mr-2" /> Anterior
      </button>
      <span className="text-sm text-gray-700">Página {currentPage} de {totalPages}</span>
      <button onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages} className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50">
        Siguiente <ChevronRight className="w-5 h-5 ml-2" />
      </button>
    </div>
  );
};

const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const styles: { [key: string]: string } = {
    Publicado: 'bg-green-100 text-green-800',
    Borrador: 'bg-yellow-100 text-yellow-800',
    Revisión: 'bg-blue-100 text-blue-800',
  };
  return <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${styles[status] || 'bg-gray-100 text-gray-800'}`}>{status}</span>;
};


import { createResource, updateResource } from '../services/resources.service';
import ResourceEditModal from '../components/ResourceEditModal';
import type { ResourceUpdateDTO } from '../types/resource.types';

// --- Main Resources Page ---

const Resources = () => {
  const [resources, setResources] = useState<ResourceAdminDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(0);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingResource, setEditingResource] = useState<Partial<ResourceAdminDTO> | null>(null);

  // Filter options
  const [categories, setCategories] = useState<ResourceCategory[]>([]);
  const [statuses, setStatuses] = useState<ResourceStatus[]>([]);

  // Filter values
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [statusId, setStatusId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const loadResources = async () => {
    setLoading(true);
    try {
      const data = await fetchAdminResources({
        page: currentPage - 1,
        size: itemsPerPage,
        categoryId,
        statusId,
        search: searchQuery,
      });
      setResources(data.content);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error("Failed to fetch resources:", error);
      setResources([]);
      setTotalPages(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadFilters = async () => {
      try {
        const [catData, statusData] = await Promise.all([
          fetchResourceCategories(),
          fetchResourceStatuses()
        ]);
        setCategories(catData);
        setStatuses(statusData);
      } catch (error) {
        console.error("Failed to load filters:", error);
      }
    };
    loadFilters();
  }, []);

  useEffect(() => {
    loadResources();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, categoryId, statusId, searchQuery]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handleFilterChange = (setter: React.Dispatch<React.SetStateAction<number | null>>) => (value: string) => {
    setter(value ? Number(value) : null);
    setCurrentPage(1);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this resource?')) {
      try {
        await deleteResource(id);
        loadResources();
      } catch (error) {
        console.error('Failed to delete resource', error);
      }
    }
  }

  const handleOpenModal = (resource: Partial<ResourceAdminDTO> | null = null) => {
    setEditingResource(resource);
    setIsModalOpen(true);
  }

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingResource(null);
  }

  const handleSave = async (resourceData: ResourceUpdateDTO, id?: number) => {
    try {
      if (id) {
        await updateResource(id, resourceData);
      } else {
        await createResource(resourceData);
      }
      handleCloseModal();
      loadResources();
    } catch (error) {
      console.error('Failed to save resource', error);
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <h1 className="text-3xl font-bold text-gray-800">Gestión de Recursos</h1>
        <button onClick={() => handleOpenModal()} className="mt-4 md:mt-0 flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
          <Plus className="w-5 h-5 mr-2" /> Añadir Nuevo Recurso
        </button>
      </div>

      {/* Filters and Search */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="md:col-span-2 relative">
          <label htmlFor="search" className="sr-only">Buscar</label>
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            id="search"
            type="text"
            placeholder="Buscar por título..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
          />
        </div>
        <FilterDropdown
          label="Categoría"
          options={categories}
          value={categoryId || ''}
          onChange={handleFilterChange(setCategoryId)}
          placeholder="Todas las categorías"
        />
        <FilterDropdown
          label="Estado"
          options={statuses}
          value={statusId || ''}
          onChange={handleFilterChange(setStatusId)}
          placeholder="Todos los estados"
        />
      </div>

      {/* Resources Table */}
      <div className="bg-white shadow-sm border border-gray-200 rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Título</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Categoría</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha de Publicación</th>
              <th scope="col" className="relative px-6 py-3"><span className="sr-only">Acciones</span></th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr><td colSpan={5} className="text-center py-8 text-gray-500">Cargando recursos...</td></tr>
            ) : resources.length === 0 ? (
              <tr><td colSpan={5} className="text-center py-8 text-gray-500">No se encontraron recursos.</td></tr>
            ) : (
              resources.map(resource => (
                <tr key={resource.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{resource.titulo}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{resource.categoriaNombre}</td>
                  <td className="px-6 py-4 whitespace-nowrap"><StatusBadge status={resource.estadoNombre} /></td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(resource.fechaPublicacion).toLocaleDateString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <button onClick={() => handleOpenModal(resource)} className="text-gray-400 hover:text-blue-600 p-1"><Edit className="w-5 h-5" /></button>
                      <button onClick={() => handleDelete(resource.id)} className="text-gray-400 hover:text-red-600 p-1"><Trash2 className="w-5 h-5" /></button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        <div className="px-6 py-4 border-t border-gray-200">
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
        </div>
      </div>

      <ResourceEditModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSave}
        resource={editingResource}
        categories={categories}
        statuses={statuses}
      />
    </div>
  );
};

export default Resources;
