import React, { useState, useEffect, useRef } from 'react'; // Add useRef
import { useAuth } from '../../../shared/hooks/useAuth';
import { getProfesionalById, updateProfesional, uploadProfileImage, deleteProfileImage } from '../services/profesional.service';
import type { Profesional } from '../types/profesional.types';
import toast from 'react-hot-toast';
import { User, Mail, Briefcase, Save, Loader2, X, Camera, Phone, MapPin } from 'lucide-react';
import TagInput from '../../../shared/components/TagInput';
import Avatar from '../../../shared/components/Avatar'; // Import Avatar component

const MAX_DESC_LENGTH = 500;

const ProfesionalProfile: React.FC = () => {
    const { user, loading: authLoading } = useAuth();
    const [profesional, setProfesional] = useState<Profesional | null>(null);
    const [loading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null); // New ref

    const [formData, setFormData] = useState({
        especialidad: '',
        descripcion: '',
        telefono: '',
        ubicacion: '',
        habilidades: [] as string[],
    });

    useEffect(() => {
        const fetchProfesionalData = async () => {
            if (authLoading || !user?.id) {
                setLoading(false);
                return;
            }

            setLoading(true);
            try {
                const data = await getProfesionalById(user.id);
                setProfesional(data);
                console.log("Datos del profesional cargados:", data); // <-- Añade esta línea
                setFormData({
                    especialidad: data.especialidad,
                    descripcion: data.descripcion,
                    telefono: data.telefono || '',
                    ubicacion: data.ubicacion || '',
                    habilidades: data.habilidades || [],
                });
            } catch (err) {
                console.error("Error al cargar datos:", err);
                setError("No se pudieron cargar los datos del profesional.");
            } finally {
                setLoading(false);
            }
        };

        fetchProfesionalData();
    }, [user, authLoading]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleHabilidadesChange = (newHabilidades: string[]) => {
        setFormData(prev => ({ ...prev, habilidades: newHabilidades }));
    };

    const handleSave = async () => {
        if (!profesional || !user?.id) {
            toast.error("No se pudo guardar el perfil.");
            return;
        }

        setIsSaving(true);
        try {
            const updatedData = { ...profesional, ...formData };
            const updatedProfesional = await updateProfesional(profesional.id, updatedData);
            setProfesional(updatedProfesional);
            toast.success("Perfil actualizado con éxito!");
        } catch (err) {
            console.error("Error al actualizar perfil:", err);
            toast.error("Error al actualizar el perfil.");
        } finally {
            setIsSaving(false);
        }
    };

    const handleCancel = () => {
        if (!profesional) return;
        setFormData({
            especialidad: profesional.especialidad,
            descripcion: profesional.descripcion,
            telefono: profesional.telefono || '',
            ubicacion: profesional.ubicacion || '',
            habilidades: profesional.habilidades || [],
        });
    };

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        if (!user?.id || !profesional) {
            toast.error("Usuario no autenticado o perfil no cargado.");
            return;
        }
        const file = event.target.files?.[0];
        if (file) {
            // Basic client-side validation
            const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
            if (!allowedTypes.includes(file.type)) {
                toast.error('Tipo de archivo no permitido. Solo se aceptan JPG, PNG o GIF.');
                return;
            }
            const maxSizeInBytes = 1 * 1024 * 1024; // 1MB
            if (file.size > maxSizeInBytes) {
                toast.error('El archivo es demasiado grande. El tamaño máximo es de 1MB.');
                return;
            }

            setIsSaving(true); // Use isSaving for upload state
            try {
                const imageUrl = await uploadProfileImage(profesional.id, file); // Use new service method
                if (imageUrl) {
                    // Update professional's profile with the new image URL
                    const updatedProfesionalData = { ...profesional, profileImageUrl: imageUrl };
                    // No need to call updateProfesional here, as the backend endpoint
                    // for uploadProfileImage will handle updating the profileImageUrl in the DB.
                    // Just update the local state to reflect the change immediately.
                    setProfesional(updatedProfesionalData);
                    toast.success("Foto de perfil actualizada con éxito!");
                }
            } catch (err) {
                console.error("Error al subir o actualizar la foto de perfil:", err);
                toast.error("Error al actualizar la foto de perfil.");
            } finally {
                setIsSaving(false);
                // Clear the file input to allow re-uploading the same file if needed
                if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                }
            }
        }
    };

    const handleDeleteImage = async () => {
        if (!profesional || !user?.id) {
            toast.error("No se pudo eliminar el avatar.");
            return;
        }

        setIsSaving(true);
        try {
            await deleteProfileImage(profesional.id);
            const updatedProfesionalData = { ...profesional, profileImageUrl: null };
            setProfesional(updatedProfesionalData);
            toast.success("Avatar eliminado con éxito!");
        } catch (err) {
            console.error("Error al eliminar el avatar:", err);
            toast.error("Error al eliminar el avatar.");
        } finally {
            setIsSaving(false);
        }
    };

    if (authLoading || loading) {
        return <div className="text-center py-8">Cargando perfil del profesional...</div>;
    }

    if (error) {
        return <div className="text-center py-8 text-red-600">{error}</div>;
    }

    if (!profesional) {
        return <div className="text-center py-8 text-gray-500">No se encontraron datos del profesional.</div>;
    }

    return (
        <div className="bg-white p-8 rounded-2xl shadow-2xl border border-gray-100">
            <h1 className="text-3xl font-bold text-gray-800 mb-8">Editar Perfil Profesional</h1>

            <div className="space-y-8">
                {/* TOP SECTION */}
                <div className="flex flex-col md:flex-row items-start md:items-center gap-8 pb-8 border-b border-gray-200">
                    {/* FOTO */}
                    <div className="flex flex-col items-center text-center md:w-1/4">
                        <div className="relative group">
                            <Avatar
                                name={profesional.nombreUsuario}
                                imageUrl={profesional.profileImageUrl ? `${profesional.profileImageUrl}?t=${new Date().getTime()}` : undefined}
                                size="xl"
                            />
                            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                                <Camera className="w-8 h-8 text-white" />
                            </div>
                        </div>
                        <div className="flex flex-col gap-2 mt-4">
                            <button
                                className="px-4 py-2 bg-gray-100 text-gray-800 rounded-lg text-sm font-semibold hover:bg-gray-200 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-wait"
                                onClick={() => fileInputRef.current?.click()} // Trigger file input
                                disabled={isSaving} // Disable button while saving
                            >
                                {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Camera className="w-4 h-4" />}
                                {isSaving ? "Subiendo..." : "Cambiar Foto"}
                            </button>
                            {profesional.profileImageUrl && ( // Solo mostrar si hay una imagen de perfil
                                <button
                                    className="px-4 py-2 bg-red-100 text-red-700 rounded-lg text-sm font-semibold hover:bg-red-200 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-wait"
                                    onClick={handleDeleteImage}
                                    disabled={isSaving}
                                >
                                    {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <X className="w-4 h-4" />}
                                    {isSaving ? "Eliminando..." : "Eliminar Avatar"}
                                </button>
                            )}
                        </div>
                        <input
                            type="file"
                            ref={fileInputRef}
                            accept="image/*"
                            className="hidden"
                            onChange={handleFileChange} // New handler
                        />
                        <p className="text-xs text-gray-500 mt-2">JPG, GIF o PNG. 1MB max.</p>
                    </div>

                    {/* INFORMACIÓN PERSONAL */}
                    <div className="flex-1 space-y-6 md:pl-8">
                        <h2 className="text-xl font-bold text-gray-800 mb-4">Información Personal</h2>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre Completo</label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="text"
                                    value={profesional.nombreUsuario}
                                    disabled
                                    className="w-full pl-10 pr-4 py-3 bg-gray-100 border-gray-200 rounded-lg cursor-not-allowed"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Correo Electrónico</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="email"
                                    value={profesional.emailUsuario}
                                    disabled
                                    className="w-full pl-10 pr-4 py-3 bg-gray-100 border-gray-200 rounded-lg cursor-not-allowed"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* DETALLES PROFESIONALES */}
                <div className="mb-8 pb-8 border-b border-gray-200">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">Detalles Profesionales</h2>

                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Especialidad</label>
                            <div className="relative">
                                <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="text"
                                    name="especialidad"
                                    value={formData.especialidad}
                                    onChange={handleChange}
                                    className="w-full pl-10 pr-4 py-3 bg-white border-gray-200 rounded-lg focus:outline-none focus:ring-4 focus:ring-emerald-300 transition duration-150 ease-in-out"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Descripción / Sobre mí</label>
                            <textarea
                                name="descripcion"
                                value={formData.descripcion}
                                onChange={handleChange}
                                rows={5}
                                maxLength={MAX_DESC_LENGTH}
                                className="w-full px-4 py-3 bg-white border-gray-200 rounded-lg focus:outline-none focus:ring-4 focus:ring-emerald-300 transition duration-150 ease-in-out"
                            ></textarea>
                            <p className="text-right text-sm text-gray-500">
                                {formData.descripcion.length} / {MAX_DESC_LENGTH}
                            </p>
                        </div>

                        <TagInput
                            label="Habilidades"
                            value={formData.habilidades}
                            onChange={handleHabilidadesChange}
                            placeholder="Añadir habilidad..."
                            suggestions={[
                                'Terapia Cognitivo-Conductual', 'Terapia Familiar', 'Terapia de Pareja', 'Psicodiagnóstico',
                                'Manejo del Estrés', 'Habilidades Sociales', 'Intervención en Crisis', 'Neuropsicología',
                                'Psicoterapia Infantil', 'Planificación Dietética', 'Nutrición Deportiva', 'Control de Peso',
                                'Educación Nutricional', 'Dietoterapia', 'Asesoramiento Nutricional', 'Nutrición Clínica',
                                'Salud Digestiva', 'Mindfulness', 'Depresión', 'Ansiedad', 'Trastornos Alimentarios',
                                'Coaching Nutricional', 'Psicología Positiva', 'Desarrollo Personal'
                            ]}
                        />
                    </div>
                </div>

                {/* CONTACTO */}
                <div className="mb-8 pb-8">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">Información de Contacto</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                            <div className="relative">
                                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    name="telefono"
                                    value={formData.telefono}
                                    onChange={handleChange}
                                    className="w-full pl-10 pr-4 py-3 bg-white border-gray-200 rounded-lg focus:outline-none focus:ring-4 focus:ring-emerald-300 transition duration-150 ease-in-out"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Ubicación</label>
                            <div className="relative">
                                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    name="ubicacion"
                                    value={formData.ubicacion}
                                    onChange={handleChange}
                                    className="w-full pl-10 pr-4 py-3 bg-white border-gray-200 rounded-lg focus:outline-none focus:ring-4 focus:ring-emerald-300 transition duration-150 ease-in-out"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* ACTION BUTTONS */}
                <div className="mt-8 flex justify-end gap-4">
                    <button
                        type="button"
                        onClick={handleCancel}
                        className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 flex items-center gap-2"
                    >
                        <X className="w-5 h-5" />
                        Cancelar
                    </button>

                    <button
                        type="button"
                        onClick={handleSave}
                        disabled={isSaving}
                        className="px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 flex items-center gap-2 disabled:opacity-50 disabled:cursor-wait shadow-md"
                    >
                        {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                        {isSaving ? "Guardando..." : "Guardar Cambios"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProfesionalProfile;