import { useState } from 'react';
import { X, AlertTriangle, Loader } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import { deleteUser } from '../services/user.service';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../../shared/hooks/useAuth';

interface DeleteAccountModalProps {
    isOpen: boolean;
    onClose: () => void;
    userId: string;
}

export default function DeleteAccountModal({ isOpen, onClose, userId }: DeleteAccountModalProps) {
    const [confirmText, setConfirmText] = useState('');
    const { logout } = useAuth();

    const deleteMutation = useMutation({
        mutationFn: () => deleteUser(userId),
        onSuccess: () => {
            toast.success('Cuenta eliminada exitosamente');
            onClose();
            logout(); // Logout after deletion
        },
        onError: (error: any) => {
            const message = error.response?.data?.message || 'Error al eliminar la cuenta';
            toast.error(message);
        }
    });

    const handleDelete = () => {
        if (confirmText !== 'ELIMINAR') return;
        deleteMutation.mutate();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-xl max-w-md w-full overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-red-50">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-red-100 rounded-full">
                            <AlertTriangle className="w-6 h-6 text-red-600" />
                        </div>
                        <h2 className="text-xl font-bold text-red-700">Eliminar Cuenta</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                        disabled={deleteMutation.isPending}
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-4">
                    <p className="text-gray-600">
                        Esta acción es <span className="font-bold text-red-600">irreversible</span>.
                        Se eliminarán todos tus datos, incluyendo tu progreso, tests completados y recursos guardados.
                    </p>

                    <p className="text-sm text-gray-500">
                        Para confirmar, escribe <span className="font-mono font-bold text-gray-800">ELIMINAR</span> en el campo de abajo:
                    </p>

                    <input
                        type="text"
                        value={confirmText}
                        onChange={(e) => setConfirmText(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                        placeholder="Escribe ELIMINAR"
                        disabled={deleteMutation.isPending}
                    />

                    {/* Buttons */}
                    <div className="flex gap-3 pt-4">
                        <button
                            onClick={onClose}
                            className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
                            disabled={deleteMutation.isPending}
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={handleDelete}
                            className="flex-1 px-4 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            disabled={confirmText !== 'ELIMINAR' || deleteMutation.isPending}
                        >
                            {deleteMutation.isPending ? (
                                <>
                                    <Loader className="w-5 h-5 animate-spin" />
                                    Eliminando...
                                </>
                            ) : (
                                'Eliminar permanentemente'
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
