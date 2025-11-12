import React from 'react';
import { MoreVertical, Edit, Trash2, ShieldCheck, ShieldOff } from 'lucide-react';

const users = [
  { id: 1, name: 'Ana García', email: 'ana.garcia@example.com', role: 'Usuario', status: 'Activo', registered: '2023-10-28' },
  { id: 2, name: 'Carlos Rodriguez', email: 'carlos.r@example.com', role: 'Profesional', status: 'Activo', registered: '2023-10-25' },
  { id: 3, name: 'Luisa Fernandez', email: 'luisa.f@example.com', role: 'Usuario', status: 'Inactivo', registered: '2023-09-15' },
  { id: 4, name: 'Javier Martinez', email: 'javier.m@example.com', role: 'ADMIN', status: 'Activo', registered: '2023-08-01' },
];

const UserManagement: React.FC = () => {
  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Gestión de Usuarios</h1>
          <p className="text-gray-600">Administra los usuarios de la plataforma.</p>
        </div>
        <button className="bg-ambrosia-green text-white px-4 py-2 rounded-lg shadow-sm hover:bg-green-700 transition-colors">
          Añadir Usuario
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="p-4 text-left text-sm font-semibold text-gray-600">Nombre</th>
              <th className="p-4 text-left text-sm font-semibold text-gray-600">Rol</th>
              <th className="p-4 text-left text-sm font-semibold text-gray-600">Estado</th>
              <th className="p-4 text-left text-sm font-semibold text-gray-600">Registrado</th>
              <th className="p-4 text-left text-sm font-semibold text-gray-600">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={user.id} className={`border-b border-gray-200 ${index === users.length - 1 ? 'border-b-0' : ''}`}>
                <td className="p-4">
                  <div className="font-medium text-gray-800">{user.name}</div>
                  <div className="text-sm text-gray-500">{user.email}</div>
                </td>
                <td className="p-4 text-gray-700">{user.role}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    user.status === 'Activo' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {user.status}
                  </span>
                </td>
                <td className="p-4 text-gray-700">{user.registered}</td>
                <td className="p-4">
                  <div className="flex items-center space-x-2">
                    <button className="p-2 text-gray-500 hover:text-blue-600 rounded-full hover:bg-gray-100"><Edit size={16} /></button>
                    <button className="p-2 text-gray-500 hover:text-red-600 rounded-full hover:bg-gray-100"><Trash2 size={16} /></button>
                    <button className="p-2 text-gray-500 hover:text-green-600 rounded-full hover:bg-gray-100">
                      {user.status === 'Activo' ? <ShieldOff size={16} /> : <ShieldCheck size={16} />}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserManagement;
