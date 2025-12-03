import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Search, ChevronLeft, ChevronRight, Trash2, Edit, Eye, Download } from 'lucide-react';
import { fetchUsers, updateUser, deleteUser } from '../services/userManagement.service';
import axiosInstance from '../../../utils/axiosInstance';
import type { AdminUser, PaginatedUsersResponse } from '../types/user.types';

// --- Component Props Interfaces ---

interface FilterDropdownProps {
  label: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
}

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

// --- Reusable Components ---

const FilterDropdown: React.FC<FilterDropdownProps> = ({ label, options, value, onChange }) => (
  <div>
    <label htmlFor={label} className="block text-sm font-medium text-gray-700">{label}</label>
    <select
      id={label}
      value={value}
      onChange={e => onChange(e.target.value)}
      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md"
    >
      {options.map(option => <option key={option}>{option}</option>)}
    </select>
  </div>
);

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
      >
        <ChevronLeft className="w-5 h-5 mr-2" />
        Anterior
      </button>
      <span className="text-sm text-gray-700">
        Página {currentPage} de {totalPages}
      </span>
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
      >
        Siguiente
        <ChevronRight className="w-5 h-5 ml-2" />
      </button>
    </div>
  );
};

import EditUserModal from '../components/EditUserModal';

// --- Main User Management Page ---

const UserManagement = () => {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(0);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);

  // Filters and Pagination State
  const [roleFilter, setRoleFilter] = useState('Todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const loadUsers = useCallback(async () => {
    setLoading(true);
    try {
      const data: PaginatedUsersResponse = await fetchUsers({
        page: currentPage - 1, // Backend is 0-indexed
        size: itemsPerPage,
        role: roleFilter,
        search: searchQuery,
      });
      setUsers(data.content);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error("Failed to fetch users:", error);
      setUsers([]);
      setTotalPages(0);
    } finally {
      setLoading(false);
    }
  }, [currentPage, roleFilter, searchQuery]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset to first page on new search
  };

  const handleRoleChange = (value: string) => {
    setRoleFilter(value);
    setCurrentPage(1); // Reset to first page on filter change
  }

  const handleDelete = async (userId: number) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await deleteUser(userId);
        // Refresh users list
        loadUsers();
      } catch (error) {
        console.error("Failed to delete user:", error);
        // Handle error display to user
      }
    }
  }

  const handleEditClick = (user: AdminUser) => {
    setEditingUser(user);
    setIsModalOpen(true);
  }

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingUser(null);
  }

  const handleSaveUser = async (user: AdminUser) => {
    try {
      await updateUser(user);
      handleCloseModal();
      loadUsers();
    } catch (error) {
      console.error("Failed to update user:", error);
    }
  }

  const handleExportToExcel = async () => {
    try {
      const response = await axiosInstance.get('/admin/users/export/excel', {
        responseType: 'blob',
      });

      // Crear un enlace temporal para descargar el archivo
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `usuarios_${new Date().toISOString().split('T')[0]}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Failed to export users:", error);
      alert('Error al exportar usuarios a Excel');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <h1 className="text-3xl font-bold text-gray-800">Gestión de Usuarios</h1>
        <div className="mt-4 md:mt-0 flex gap-3">
          <button
            onClick={handleExportToExcel}
            className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Download className="w-5 h-5 mr-2" />
            Exportar a Excel
          </button>
          <button className="flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
            <Plus className="w-5 h-5 mr-2" />
            Añadir Nuevo Usuario
          </button>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2 relative">
          <label htmlFor="search" className="sr-only">Buscar</label>
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            id="search"
            type="text"
            placeholder="Buscar por nombre o email..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
          />
        </div>
        <FilterDropdown
          label="Rol"
          options={['Todos', 'ADMIN', 'USER']}
          value={roleFilter}
          onChange={handleRoleChange}
        />
      </div>

      {/* Users Table */}
      <div className="bg-white shadow-sm border border-gray-200 rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rol</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha de Registro</th>
              <th scope="col" className="relative px-6 py-3"><span className="sr-only">Acciones</span></th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr><td colSpan={4} className="text-center py-8 text-gray-500">Cargando usuarios...</td></tr>
            ) : users.length === 0 ? (
              <tr><td colSpan={4} className="text-center py-8 text-gray-500">No se encontraron usuarios.</td></tr>
            ) : (
              users.map(user => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{user.nombre}</div>
                    <div className="text-sm text-gray-500">{user.correo}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.rol === 'ADMIN' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                      }`}>
                      {user.rol}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(user.fechaRegistro).toLocaleDateString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <button className="text-gray-400 hover:text-gray-600 p-1"><Eye className="w-5 h-5" /></button>
                      <button onClick={() => handleEditClick(user)} className="text-gray-400 hover:text-blue-600 p-1"><Edit className="w-5 h-5" /></button>
                      <button onClick={() => handleDelete(user.id)} className="text-gray-400 hover:text-red-600 p-1"><Trash2 className="w-5 h-5" /></button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Table Footer with Pagination */}
        <div className="px-6 py-4 border-t border-gray-200">
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
        </div>
      </div>

      <EditUserModal
        user={editingUser}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveUser}
      />
    </div>
  );
};

export default UserManagement;
