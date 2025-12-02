import { useState } from 'react';
import { X, Lock, Eye, EyeOff, Loader, Shield } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import { changePassword } from '../services/user.service';
import { toast } from 'react-hot-toast';
import type { ChangePasswordRequest } from '../types/user.types';

interface ChangePasswordModalProps {
    isOpen: boolean;
    onClose: () => void;
    userId: string;
}

const getPasswordStrength = (password: string): { strength: number; label: string; color: string } => {
    if (!password) return { strength: 0, label: '', color: '' };

    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^a-zA-Z\d]/.test(password)) strength++;

    if (strength <= 2) return { strength: 1, label: 'Débil', color: 'bg-red-500' };
    if (strength === 3) return { strength: 2, label: 'Media', color: 'bg-yellow-500' };
    if (strength === 4) return { strength: 3, label: 'Buena', color: 'bg-blue-500' };
    return { strength: 4, label: 'Fuerte', color: 'bg-green-500' };
};

export default function ChangePasswordModal({ isOpen, onClose, userId }: ChangePasswordModalProps) {
    const [contrasenaActual, setContrasenaActual] = useState('');
    const [contrasenaNueva, setContrasenaNueva] = useState('');
    const [confirmarContrasena, setConfirmarContrasena] = useState('');

    const [showCurrent, setShowCurrent] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const passwordStrength = getPasswordStrength(contrasenaNueva);

    const changePasswordMutation = useMutation({
        mutationFn: (data: ChangePasswordRequest) => changePassword(userId, data),
        onSuccess: () => {
            toast.success('Contraseña actualizada exitosamente');
            // Reset form
            setContrasenaActual('');
            setContrasenaNueva('');
            setConfirmarContrasena('');
            onClose();
        },
        onError: (error: any) => {
            const message = error.response?.data?.message ||
                error.message ||
                'Error al cambiar la contraseña';
            toast.error(message);
        }
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!contrasenaActual) {
            toast.error('Ingresa tu contraseña actual');
            return;
        }

        if (contrasenaNueva.length < 8) {
            toast.error('La nueva contraseña debe tener al menos 8 caracteres');
            return;
        }

        if (contrasenaNueva !== confirmarContrasena) {
            toast.error('Las contraseñas nuevas no coinciden');
            return;
        }

        changePasswordMutation.mutate({
            contrasenaActual,
            contrasenaNueva,
            confirmarContrasena
        });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                            <Shield className="w-5 h-5 text-emerald-600" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800">Cambiar Contraseña</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                        disabled={changePasswordMutation.isPending}
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    {/* Contraseña Actual */}
                    <div>
                        <label htmlFor="current-password" className="block text-sm font-medium text-gray-700 mb-2">
                            Contraseña actual
                        </label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                id="current-password"
                                type={showCurrent ? 'text' : 'password'}
                                value={contrasenaActual}
                                onChange={(e) => setContrasenaActual(e.target.value)}
                                className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                                placeholder="••••••••"
                                required
                                disabled={changePasswordMutation.isPending}
                            />
                            <button
                                type="button"
                                onClick={() => setShowCurrent(!showCurrent)}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                tabIndex={-1}
                            >
                                {showCurrent ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>

                    {/* Nueva Contraseña */}
                    <div>
                        <label htmlFor="new-password" className="block text-sm font-medium text-gray-700 mb-2">
                            Nueva contraseña
                        </label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                id="new-password"
                                type={showNew ? 'text' : 'password'}
                                value={contrasenaNueva}
                                onChange={(e) => setContrasenaNueva(e.target.value)}
                                className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                                placeholder="••••••••"
                                required
                                minLength={8}
                                disabled={changePasswordMutation.isPending}
                            />
                            <button
                                type="button"
                                onClick={() => setShowNew(!showNew)}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                tabIndex={-1}
                            >
                                {showNew ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        </div>

                        {/* Password Strength Indicator */}
                        {contrasenaNueva && (
                            <div className="mt-2">
                                <div className="flex items-center gap-2 mb-1">
                                    <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full ${passwordStrength.color} transition-all duration-300`}
                                            style={{ width: `${(passwordStrength.strength / 4) * 100}%` }}
                                        />
                                    </div>
                                    <span className="text-xs font-medium text-gray-600">{passwordStrength.label}</span>
                                </div>
                                <p className="text-xs text-gray-500">Mínimo 8 caracteres. Usa mayúsculas, números y símbolos.</p>
                            </div>
                        )}
                    </div>

                    {/* Confirmar Contraseña */}
                    <div>
                        <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 mb-2">
                            Confirmar nueva contraseña
                        </label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                id="confirm-password"
                                type={showConfirm ? 'text' : 'password'}
                                value={confirmarContrasena}
                                onChange={(e) => setConfirmarContrasena(e.target.value)}
                                className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                                placeholder="••••••••"
                                required
                                disabled={changePasswordMutation.isPending}
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirm(!showConfirm)}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                tabIndex={-1}
                            >
                                {showConfirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        </div>
                        {confirmarContrasena && contrasenaNueva !== confirmarContrasena && (
                            <p className="mt-1 text-sm text-red-600">Las contraseñas no coinciden</p>
                        )}
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
                            disabled={changePasswordMutation.isPending}
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="flex-1 px-4 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-lg font-semibold hover:from-emerald-600 hover:to-teal-600 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                            disabled={changePasswordMutation.isPending}
                        >
                            {changePasswordMutation.isPending ? (
                                <>
                                    <Loader className="w-5 h-5 animate-spin" />
                                    Cambiando...
                                </>
                            ) : (
                                'Cambiar contraseña'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
