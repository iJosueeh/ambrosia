import React, { useState, useEffect } from 'react';
import type { AdminUser } from '../types/user.types';

interface EditUserModalProps {
  user: AdminUser | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (user: AdminUser) => void;
}

const EditUserModal: React.FC<EditUserModalProps> = ({ user, isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState<AdminUser | null>(null);

  useEffect(() => {
    setFormData(user);
  }, [user]);

  if (!isOpen || !formData) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => prev ? { ...prev, [name]: value } : null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData) {
      onSave(formData);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Edit User</h2>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="nombre" className="block text-sm font-medium text-gray-700">Nombre</label>
              <input
                type="text"
                name="nombre"
                id="nombre"
                value={formData.nombre}
                onChange={handleChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
              />
            </div>
            <div>
              <label htmlFor="correo" className="block text-sm font-medium text-gray-700">Correo</label>
              <input
                type="email"
                name="correo"
                id="correo"
                value={formData.correo}
                onChange={handleChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
              />
            </div>
            <div>
              <label htmlFor="rol" className="block text-sm font-medium text-gray-700">Rol</label>
              <select
                name="rol"
                id="rol"
                value={formData.rol}
                onChange={handleChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
              >
                <option>USER</option>
                <option>ADMIN</option>
              </select>
            </div>
          </div>
          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditUserModal;
