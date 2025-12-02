import { useState, useEffect } from 'react';
import { X, User, Mail, Phone, Loader } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateUser } from '../services/user.service';
import { toast } from 'react-hot-toast';
import type { UpdateUserRequest } from '../types/user.types';

interface EditProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
    userId: string;
    currentName: string;
    currentEmail: string;
    currentTelefono?: string;
    currentRol: string;
}

export default function EditProfileModal({
    isOpen,
    onClose,
    userId,
    currentName,
    currentEmail,
    currentTelefono,
    currentRol
}: EditProfileModalProps) {
    const [nombre, setNombre] = useState(currentName);
    const [email, setEmail] = useState(currentEmail);
    const [telefono, setTelefono] = useState(currentTelefono || '');

    const queryClient = useQueryClient();

    // Reset form when modal opens with new data
    useEffect(() => {
        if (isOpen) {
            setNombre(currentName);
            setEmail(currentEmail);
            setTelefono(currentTelefono || '');
        }
    }, [isOpen, currentName, currentEmail, currentTelefono]);

    const updateMutation = useMutation({
        mutationFn: (data: UpdateUserRequest) => updateUser(userId, data),
        onSuccess: () => {
            toast.success('Perfil actualizado exitosamente');
            queryClient.invalidateQueries({ queryKey: ['userData'] });
            onClose();
        },
        onError: (error: any) => {
            const message = error.response?.data?.message || 'Error al actualizar perfil';
            toast.error(message);
        }
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!nombre.trim()) {
            toast.error('El nombre es obligatorio');
            return;
        }

        if (!email.trim()) {
            toast.error('El email es obligatorio');
            return;
        }

        updateMutation.mutate({
            nombre: nombre.trim(),
            email: email.trim(),
            telefono: telefono.trim() || undefined,
            rol: currentRol
        });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <h2 className="text-2xl font-bold text-gray-800">Editar Perfil</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                        disabled={updateMutation.isPending}
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    {/* Nombre */}
                    <div>
                        <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-2">
                            Nombre completo
                        </label>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                id="nombre"
                                type="text"
                                value={nombre}
                                onChange={(e) => setNombre(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                                placeholder="Tu nombre"
                                required
                                disabled={updateMutation.isPending}
                            />
                        </div>
                    </div>

                    {/* Email */}
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                            Correo electrónico
                        </label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                                placeholder="tu@email.com"
                                required
                                disabled={updateMutation.isPending}
                            />
                        </div>
                    </div>

                    {/* Teléfono */}
                    <div>
                        <label htmlFor="telefono" className="block text-sm font-medium text-gray-700 mb-2">
                            Teléfono (opcional)
                        </label>
                        <div className="relative">
                            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                id="telefono"
                                type="tel"
                                value={telefono}
                                onChange={(e) => setTelefono(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                                placeholder="+1 234 567 8900"
                                maxLength={20}
                                disabled={updateMutation.isPending}
                            />
                        </div>
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
                            disabled={updateMutation.isPending}
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="flex-1 px-4 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-lg font-semibold hover:from-emerald-600 hover:to-teal-600 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                            disabled={updateMutation.isPending}
                        >
                            {updateMutation.isPending ? (
                                <>
                                    <Loader className="w-5 h-5 animate-spin" />
                                    Guardando...
                                </>
                            ) : (
                                'Guardar cambios'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
