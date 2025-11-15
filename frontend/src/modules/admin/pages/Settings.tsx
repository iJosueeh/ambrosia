import React, { useState, useEffect } from 'react';
import { User, Bell } from 'lucide-react';
import { fetchAdminProfile, updateAdminProfile } from '../services/settings.service';
import type { AdminProfileDTO } from '../types/settings.types';

// --- Component Props Interfaces ---

interface SettingsSectionProps {
  icon: React.ElementType;
  title: string;
  description: string;
  children: React.ReactNode;
}

interface InputFieldProps {
  label: string;
  type: string;
  id: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  readOnly?: boolean;
}

// --- Reusable Components ---

const SettingsSection: React.FC<SettingsSectionProps> = ({ icon, title, description, children }) => {
  const Icon = icon;
  return (
    <div className="bg-white shadow-sm border border-gray-200 rounded-lg">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-start">
          <div className="bg-gray-100 p-3 rounded-full mr-4">
            <Icon className="h-6 w-6 text-gray-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
            <p className="text-sm text-gray-500 mt-1">{description}</p>
          </div>
        </div>
      </div>
      <div className="p-6 space-y-6">
        {children}
      </div>
    </div>
  );
};

const InputField: React.FC<InputFieldProps> = ({ label, type, id, value, onChange, placeholder, readOnly = false }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-gray-700">{label}</label>
    <input
      type={type}
      id={id}
      name={id} // Add name attribute for form handling
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      readOnly={readOnly}
      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
    />
  </div>
);

const Settings = () => {
  const [profile, setProfile] = useState<AdminProfileDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      setLoading(true);
      try {
        const data = await fetchAdminProfile();
        setProfile(data);
      } catch (err) {
        console.error("Failed to fetch admin profile:", err);
        setError("Failed to load admin profile.");
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile(prev => prev ? { ...prev, [name]: name === 'nivelAcceso' ? Number(value) : value } : null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;

    setIsSaving(true);
    try {
      await updateAdminProfile(profile);
      alert("Profile updated successfully!");
    } catch (err) {
      console.error("Failed to update admin profile:", err);
      setError("Failed to update profile.");
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) return <div className="text-center py-8">Cargando configuración...</div>;
  if (error) return <div className="text-center py-8 text-red-600">{error}</div>;
  if (!profile) return <div className="text-center py-8 text-gray-500">No hay datos de perfil disponibles.</div>;

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-gray-800">Configuración</h1>

      {/* Profile Settings */}
      <SettingsSection
        icon={User}
        title="Perfil del Administrador"
        description="Edita tu información personal y de tu cuenta."
      >
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField label="Nombre Completo" type="text" id="nombre" value={profile.nombre} onChange={handleChange} />
            <InputField label="Dirección de Email" type="email" id="email" value={profile.email} onChange={handleChange} />
            <InputField label="Nivel de Acceso" type="number" id="nivelAcceso" value={profile.nivelAcceso} onChange={handleChange} readOnly={true} />
          </div>
          {/* Password fields removed for simplicity and security, would be a separate flow */}
          <div className="flex justify-end mt-6">
            <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700" disabled={isSaving}>
              {isSaving ? 'Guardando...' : 'Guardar Cambios'}
            </button>
          </div>
        </form>
      </SettingsSection>

      {/* Notification Settings - Placeholder for now, as preferences are not fully defined */}
      <SettingsSection
        icon={Bell}
        title="Notificaciones"
        description="Gestiona cómo recibes las notificaciones del panel."
      >
        <p className="text-gray-500">Funcionalidad de preferencias de notificación no implementada aún.</p>
        {/* <ToggleSwitch label="Email por nuevo registro de usuario" id="notifyNewUser" enabled={true} />
        <ToggleSwitch label="Email por contenido reportado en foros" id="notifyReported" enabled={true} />
        <ToggleSwitch label="Resumen semanal de actividad" id="notifySummary" enabled={false} /> */}
        <div className="flex justify-end pt-4 border-t border-gray-200">
          <button className="px-4 py-2 bg-gray-400 text-white rounded-md cursor-not-allowed" disabled>Guardar Preferencias</button>
        </div>
      </SettingsSection>

    </div>
  );
};

export default Settings;
