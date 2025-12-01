import { ChevronRight, MessageSquare, ThumbsUp } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../../shared/hooks/useAuth';
import { forumService } from '../services/forum.service';
import type { ForumThreadType, CommentType } from '../types/forum.types';

// Utility function to format date (copied from ForumHome.tsx)
const formatRelativeTime = (dateString: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime(); // difference in milliseconds

    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const months = Math.floor(days / 30);
    const years = Math.floor(days / 365);

    if (seconds < 60) return `hace ${seconds} segundos`;
    if (minutes < 60) return `hace ${minutes} minutos`;
    if (hours < 24) return `hace ${hours} horas`;
    if (days < 30) return `hace ${days} días`;
    if (months < 12) return `hace ${months} meses`;
    return `hace ${years} años`;
};

interface ForumThreadProps {
    thread: ForumThreadType | null;
    onBack: () => void;
    onBackToHome: () => void;
    onReply: (comment: CommentType | null) => void;
}

const ForumThread: React.FC<ForumThreadProps> = ({ thread, onBack, onBackToHome, onReply }) => {
    const { user } = useAuth();
    const [comments, setComments] = useState<CommentType[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<any>(null);
    const [likedComments, setLikedComments] = useState<Set<string>>(new Set());

    useEffect(() => {
        const fetchComments = async () => {
            if (!thread || !thread.id) {
                setLoading(false);
                return;
            }
            try {
                const data = await forumService.getCommentsByForoId(thread.id);
                const mappedComments: CommentType[] = (data.content || []).map((comment: any) => ({
                    id: comment.id,
                    autor: {
                        id: comment.autorId,
                        nombre: comment.autorNombre,
                    },
                    fechaCreacion: comment.fechaCreacion,
                    contenido: comment.contenido,
                    status: comment.status,
                    foroId: thread.id,
                    foroTitulo: thread.titulo,
                    likesCount: comment.likesCount || 0,
                }));
                setComments(mappedComments);
            } catch (err: any) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };
        fetchComments();
    }, [thread]);

    const handleLike = async (comment: CommentType) => {
        if (!user) {
            toast.error('Debes iniciar sesión para dar like.');
            return;
        }

        if (!thread || !thread.id) return;

        const wasLiked = likedComments.has(comment.id);

        // Actualización optimista
        const newLikedComments = new Set(likedComments);
        if (wasLiked) {
            newLikedComments.delete(comment.id);
        } else {
            newLikedComments.add(comment.id);
        }
        setLikedComments(newLikedComments);

        // Actualizar count localmente
        setComments(prevComments =>
            prevComments.map(c =>
                c.id === comment.id
                    ? { ...c, likesCount: (c.likesCount || 0) + (wasLiked ? -1 : 1) }
                    : c
            )
        );

        try {
            await forumService.toggleLike(thread.id, comment.id);
        } catch (error: any) {
            // Revertir en caso de error
            setLikedComments(likedComments);
            setComments(prevComments =>
                prevComments.map(c =>
                    c.id === comment.id
                        ? { ...c, likesCount: (c.likesCount || 0) + (wasLiked ? 1 : -1) }
                        : c
                )
            );
            toast.error('Error al dar like. Inténtalo de nuevo.');
        }
    };

    if (loading) return <div className="flex justify-center items-center min-h-screen bg-gray-50 text-emerald-600 text-lg font-semibold">Cargando comentarios...</div>;
    if (error) return <div className="flex justify-center items-center min-h-screen bg-gray-50 text-red-600 text-lg font-semibold">Error al cargar comentarios: {error.message}</div>;
    if (!thread) return <div className="flex justify-center items-center min-h-screen bg-gray-50 text-gray-500 text-lg font-semibold">No se ha seleccionado ningún tema.</div>;

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-5xl mx-auto px-4 py-8">
                <div className="text-sm text-gray-600 mb-6 flex items-center flex-wrap">
                    <button onClick={onBackToHome} className="hover:text-emerald-600">Foros</button>
                    <ChevronRight className="w-4 h-4 mx-2" />
                    <button onClick={onBack} className="hover:text-emerald-600">{thread.categoriaForo.titulo}</button>
                    <ChevronRight className="w-4 h-4 mx-2" />
                    <span className="font-medium">{thread.titulo}</span>
                </div>
                <div className="mb-6">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">{thread.titulo}</h1>
                    <p className="text-gray-600">Iniciado por <span className="font-semibold text-emerald-600">{thread.autor.nombre}</span>, {formatRelativeTime(thread.fechaCreacion)}</p>
                </div>
                <div className="mb-6">
                    <button onClick={() => onReply(null)} className="bg-emerald-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-emerald-600 transition-colors flex items-center gap-2 shadow-md">
                        <MessageSquare className="w-5 h-5" />Responder al Tema
                    </button>
                </div>
                <div className="space-y-4">
                    {comments.map((comment: CommentType) => (
                        <div key={comment.id} className="bg-white rounded-xl shadow-md p-6">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center font-semibold text-emerald-700 flex-shrink-0">{comment.autor.nombre.charAt(0)}</div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className="font-bold text-gray-900">{comment.autor.nombre}</span>
                                        <span className="text-sm text-gray-500">{formatRelativeTime(comment.fechaCreacion)}</span>
                                    </div>
                                    <p className="text-gray-700 leading-relaxed mb-4">{comment.contenido}</p>
                                    <div className="flex items-center gap-4">
                                        <button
                                            onClick={() => handleLike(comment)}
                                            className={`flex items-center gap-2 transition-colors ${likedComments.has(comment.id)
                                                    ? 'text-emerald-600 hover:text-emerald-700'
                                                    : 'text-gray-600 hover:text-emerald-600'
                                                }`}
                                        >
                                            <ThumbsUp className={`w-4 h-4 ${likedComments.has(comment.id) ? 'fill-emerald-600' : ''
                                                }`} />
                                            <span className="text-sm">{comment.likesCount || 0}</span>
                                        </button>
                                        <button onClick={() => onReply(comment)} className="flex items-center gap-2 text-gray-600 hover:text-emerald-600 transition-colors">
                                            <MessageSquare className="w-4 h-4" /><span className="text-sm">Responder</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default ForumThread