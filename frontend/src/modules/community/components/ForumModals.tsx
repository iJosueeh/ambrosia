import { X } from 'lucide-react';
import type { Dispatch, SetStateAction } from 'react';

// Define types for the modal props
export interface NewThreadData {
    title: string;
    content: string;
    categoriaForoId: string | null;
}

interface NewThreadModalProps {
    onClose: () => void;
    data: NewThreadData;
    setData: Dispatch<SetStateAction<NewThreadData>>;
    onCreate: () => void;
}

export function NewThreadModal({ onClose, data, setData, onCreate }: NewThreadModalProps) {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-8">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-3xl font-bold text-gray-900">Crear Nuevo Tema</h2>
                        <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg"><X className="w-6 h-6" /></button>
                    </div>
                    <div className="mb-6">
                        <label className="block text-sm font-semibold text-gray-800 mb-2">Título</label>
                        <input
                            type="text"
                            placeholder="Escribe un título..."
                            value={String(data.title)}
                            onChange={(e) => setData(prev => ({
                                ...prev,
                                title: e.target.value,
                            } as NewThreadData))}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                    </div>
                    <div className="mb-6">
                        <label className="block text-sm font-semibold text-gray-800 mb-2">Contenido</label>
                        <textarea
                            placeholder="Comparte tu historia..."
                            value={data.content}
                            onChange={(e) => setData({ ...data, content: e.target.value })}
                            rows={8}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
                        ></textarea>
                    </div>
                    <div className="flex gap-4">
                        <button onClick={onClose} className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50">Cancelar</button>
                        <button onClick={onCreate} className="flex-1 bg-emerald-500 text-white py-3 rounded-xl font-semibold hover:bg-emerald-600">Publicar</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

interface ReplyModalProps {
    onClose: () => void;
    comment: any;
    content: string;
    setContent: (content: string) => void;
    onPost: () => void;
    isSubmitting?: boolean;
}

export function ReplyModal({ onClose, comment, content, setContent, onPost, isSubmitting = false }: ReplyModalProps) {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-8">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-3xl font-bold text-gray-900">{comment ? `Respondiendo a @${comment.autor?.nombre || 'Usuario'}` : 'Responder al Tema'}</h2>
                        <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg" disabled={isSubmitting}><X className="w-6 h-6" /></button>
                    </div>
                    {comment && comment.contenido && (
                        <div className="bg-gray-50 rounded-xl p-4 mb-6 border-l-4 border-emerald-500">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center font-semibold text-emerald-700 text-sm">{comment.autor?.nombre?.charAt(0) || 'U'}</div>
                                <span className="font-semibold text-gray-900">{comment.autor?.nombre || 'Usuario'}</span>
                            </div>
                            <p className="text-gray-700 text-sm">{comment.contenido.substring(0, 100)}{comment.contenido.length > 100 ? '...' : ''}</p>
                        </div>
                    )}
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="Escribe tu respuesta..."
                        rows={6}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none mb-6"
                        disabled={isSubmitting}
                    ></textarea>
                    <div className="flex gap-4">
                        <button onClick={onClose} className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50" disabled={isSubmitting}>Cancelar</button>
                        <button
                            onClick={onPost}
                            className="flex-1 bg-emerald-500 text-white py-3 rounded-xl font-semibold hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                            disabled={isSubmitting || !content.trim()}
                        >
                            {isSubmitting ? 'Enviando...' : 'Enviar'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
