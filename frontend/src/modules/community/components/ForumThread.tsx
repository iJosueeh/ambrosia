import { ChevronRight, MessageSquare, ThumbsUp, X } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { forumService } from '../services/forum.service';

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

const ForumThread = ({ thread, onBack, onBackToHome, onReply }: any) => {
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchComments = async () => {
            if (!thread || !thread.id) {
                setLoading(false);
                return;
            }
            try {
                const data = await forumService.getCommentsByForoId(thread.id);
                const mappedComments = data.map((comment: any) => ({
                    id: comment.id,
                    author: comment.autorNombre,
                    authorAvatar: comment.autorNombre ? comment.autorNombre.charAt(0) : 'A',
                    time: formatRelativeTime(comment.fechaCreacion),
                    content: comment.contenido,
                    likes: 0 // Placeholder, if likes are not in backend yet
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

    if (loading) return <div className="flex justify-center items-center min-h-screen bg-gray-50 text-emerald-600 text-lg font-semibold">Cargando comentarios...</div>;
    if (error) return <div className="flex justify-center items-center min-h-screen bg-gray-50 text-red-600 text-lg font-semibold">Error al cargar comentarios: {error.message}</div>;

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-5xl mx-auto px-4 py-8">
                <div className="text-sm text-gray-600 mb-6 flex items-center flex-wrap">
                    <button onClick={onBackToHome} className="hover:text-emerald-600">Foros</button>
                    <ChevronRight className="w-4 h-4 mx-2" />
                    <button onClick={onBack} className="hover:text-emerald-600">{thread.categoryTitle}</button>
                    <ChevronRight className="w-4 h-4 mx-2" />
                    <span className="font-medium">{thread.title}</span>
                </div>
                <div className="mb-6">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">{thread.title}</h1>
                    <p className="text-gray-600">Iniciado por <span className="font-semibold text-emerald-600">{thread.author}</span>, {thread.lastActivity}</p>
                </div>
                <div className="mb-6">
                    <button onClick={() => onReply(null)} className="bg-emerald-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-emerald-600 transition-colors flex items-center gap-2 shadow-md">
                        <MessageSquare className="w-5 h-5" />Responder al Tema
                    </button>
                </div>
                <div className="space-y-4">
                    {comments.map((comment: any) => (
                        <div key={comment.id} className="bg-white rounded-xl shadow-md p-6">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center font-semibold text-emerald-700 flex-shrink-0">{comment.authorAvatar}</div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className="font-bold text-gray-900">{comment.author}</span>
                                        <span className="text-sm text-gray-500">{comment.time}</span>
                                    </div>
                                    <p className="text-gray-700 leading-relaxed mb-4">{comment.content}</p>
                                    <div className="flex items-center gap-4">
                                        <button className="flex items-center gap-2 text-gray-600 hover:text-emerald-600 transition-colors">
                                            <ThumbsUp className="w-4 h-4" /><span className="text-sm">{comment.likes}</span>
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