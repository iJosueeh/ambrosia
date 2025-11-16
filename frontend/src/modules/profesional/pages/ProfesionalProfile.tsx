import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../shared/hooks/useAuth';
import { getProfesionalById, updateProfesional } from '../services/profesional.service';
import type { Profesional } from '../types/profesional.types';
import toast from 'react-hot-toast';
import { User, Mail, Briefcase, Save, Loader2, X, Camera, Phone, MapPin } from 'lucide-react';
import TagInput from '../../../shared/components/TagInput'; // Import the new TagInput component

const MAX_DESC_LENGTH = 500;

const ProfesionalProfile: React.FC = () => {
    const { user, loading: authLoading } = useAuth();
    const [profesional, setProfesional] = useState<Profesional | null>(null);
    const [loading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        especialidad: '',
        descripcion: '',
        telefono: '',
        ubicacion: '',
        habilidades: [] as string[],
    });

    useEffect(() => {
        const fetchProfesionalData = async () => {
            if (authLoading || !user || !user.id) {
                setLoading(false);
                return;
            }
            setLoading(true);
            try {
                const data = await getProfesionalById(user.id);
                setProfesional(data);
                setFormData({
                    especialidad: data.especialidad,
                    descripcion: data.descripcion,
                    telefono: data.telefono || '',
                    ubicacion: data.ubicacion || '',
                    habilidades: data.habilidades || [],
                });
            } catch (err) {
                console.error("Error al cargar los datos del profesional:", err);
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
        if (!profesional || !user || !user.id) {
            toast.error("No se pudo guardar el perfil. Datos incompletos.");
            return;
        }
        setIsSaving(true);
        try {
            const updatedData = { ...profesional, ...formData };
            const updatedProfesional = await updateProfesional(profesional.id, updatedData);
            setProfesional(updatedProfesional);
            toast.success("Perfil actualizado con éxito!");
        } catch (err) {
            console.error("Error al actualizar el perfil:", err);
            toast.error("Error al actualizar el perfil.");
        } finally {
            setIsSaving(false);
        }
    };

    const handleCancel = () => {
        if (profesional) {
            setFormData({
                especialidad: profesional.especialidad,
                descripcion: profesional.descripcion,
                telefono: profesional.telefono || '',
                ubicacion: profesional.ubicacion || '',
                habilidades: profesional.habilidades || [],
            });
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                {/* Left Column: Profile Picture */}
                <div className="md:col-span-1 flex flex-col items-center text-center">
                    <div className="relative group">
                        <img
                            src="https://via.placeholder.com/150" // Placeholder
                            alt="Foto de perfil"
                            className="w-40 h-40 rounded-full object-cover border-4 border-gray-200 shadow-lg group-hover:opacity-75 transition-opacity"
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                            <Camera className="w-8 h-8 text-white" />
                        </div>
                    </div>
                    <button className="mt-4 px-4 py-2 bg-gray-100 text-gray-800 rounded-lg text-sm font-semibold hover:bg-gray-200 transition-colors">
                        Cambiar Foto
                    </button>
                    <p className="text-xs text-gray-500 mt-2">JPG, GIF o PNG. 1MB max.</p>
                </div>

                {/* Right Column: Form */}
                <div className="md:col-span-2">
                    {/* Sección: Información Personal */}
                    <div className="mb-8 pb-8 border-b border-gray-200">
                        <h2 className="text-xl font-bold text-gray-800 mb-4">Información Personal</h2>
                        <div className="space-y-6">
                            <div>
                                <label htmlFor="nombreUsuario" className="block text-sm font-medium text-gray-700 mb-1">Nombre Completo</label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input type="text" id="nombreUsuario" value={profesional.nombreUsuario} disabled className="w-full pl-10 pr-4 py-3 bg-gray-100 border-gray-200 rounded-lg cursor-not-allowed" />
                                </div>
                            </div>
                            <div>
                                <label htmlFor="emailUsuario" className="block text-sm font-medium text-gray-700 mb-1">Correo Electrónico</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input type="email" id="emailUsuario" value={profesional.emailUsuario} disabled className="w-full pl-10 pr-4 py-3 bg-gray-100 border-gray-200 rounded-lg cursor-not-allowed" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sección: Detalles Profesionales */}
                    <div className="mb-8 pb-8 border-b border-gray-200">
                        <h2 className="text-xl font-bold text-gray-800 mb-4">Detalles Profesionales</h2>
                        <div className="space-y-6">
                            <div>
                                <label htmlFor="especialidad" className="block text-sm font-medium text-gray-700 mb-1">Especialidad</label>
                                <div className="relative">
                                    <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input type="text" id="especialidad" name="especialidad" value={formData.especialidad} onChange={handleChange} className="w-full pl-10 pr-4 py-3 bg-white border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all" />
                                </div>
                            </div>
                            <div>
                                <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700 mb-1">Descripción / Sobre mí</label>
                                <textarea id="descripcion" name="descripcion" value={formData.descripcion} onChange={handleChange} rows={5} maxLength={MAX_DESC_LENGTH} className="w-full px-4 py-3 bg-white border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"></textarea>
                                <p className="text-right text-sm text-gray-500">{formData.descripcion.length} / {MAX_DESC_LENGTH}</p>
                            </div>
                            <div>
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
                                    ]} // Updated suggestions
                                />
                            </div>
                        </div>
                    </div>

                    {/* Sección: Información de Contacto */}
                    <div className="mb-8 pb-8">
                        <h2 className="text-xl font-bold text-gray-800 mb-4">Información de Contacto</h2>
                        <div className="space-y-6">
                            <div>
                                <label htmlFor="telefono" className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input type="text" id="telefono" name="telefono" value={formData.telefono} onChange={handleChange} className="w-full pl-10 pr-4 py-3 bg-white border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all" />
                                </div>
                            </div>
                            <div>
                                <label htmlFor="ubicacion" className="block text-sm font-medium text-gray-700 mb-1">Ubicación</label>
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input type="text" id="ubicacion" name="ubicacion" value={formData.ubicacion} onChange={handleChange} className="w-full pl-10 pr-4 py-3 bg-white border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 flex justify-end gap-4">
                        <button type="button" onClick={handleCancel} className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-all flex items-center gap-2">
                            <X className="w-5 h-5" />
                            Cancelar
                        </button>
                        <button type="button" onClick={handleSave} disabled={isSaving} className="px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 flex items-center gap-2 disabled:opacity-50 disabled:cursor-wait shadow-md hover:shadow-lg transition-all">
                            {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                            {isSaving ? 'Guardando...' : 'Guardar Cambios'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfesionalProfile;
