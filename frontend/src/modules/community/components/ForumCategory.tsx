import { ChevronRight, Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
import { forumService } from '../services/forum.service';

// TEMP: Forcing Vite re-process
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

const ForumCategory = ({ category, onBackToHome, onSelectThread, onNewThread }: any) => {
    const [threads, setThreads] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<any>(null);

    useEffect(() => {
        const fetchThreads = async () => {
            if (!category || !category.id) {
                setLoading(false);
                return;
            }
            try {
                const data = await forumService.getForosByCategoriaForoId(category.id);
                const mappedThreads = data.map((thread: any) => ({
                    id: thread.id,
                    title: thread.titulo,
                    author: thread.autorNombre,
                    authorAvatar: thread.autorNombre ? thread.autorNombre.charAt(0) : 'A',
                    replies: thread.numeroComentarios,
                    lastActivity: formatRelativeTime(thread.fechaCreacion),
                    description: thread.descripcion // Pass description for thread detail page
                }));
                setThreads(mappedThreads);
            } catch (err: any) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };
        fetchThreads();
    }, [category]);

    if (loading) return <div className="flex justify-center items-center min-h-screen bg-gray-50 text-emerald-600 text-lg font-semibold">Cargando temas...</div>;
    if (error) return <div className="flex justify-center items-center min-h-screen bg-gray-50 text-red-600 text-lg font-semibold">Error al cargar temas: {error.message}</div>;

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-6xl mx-auto px-4 py-8">
                <div className="text-sm text-gray-600 mb-4 flex items-center">
                    <button onClick={onBackToHome} className="hover:text-emerald-600">Foros</button>
                    <ChevronRight className="w-4 h-4 mx-2" />
                    <span className="font-medium">{category.title}</span>
                </div>
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-4xl font-bold text-gray-900 mb-3">{category.title}</h1>
                        <p className="text-gray-600">{category.description}</p>
                    </div>
                    <button onClick={onNewThread} className="bg-emerald-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-emerald-600 transition-colors flex items-center gap-2 shadow-md whitespace-nowrap">
                        <Plus className="w-5 h-5" />Crear Nuevo Tema
                    </button>
                </div>
                <div className="bg-white rounded-xl shadow-md overflow-hidden">
                    {threads.map((thread: any) => (
                        <div key={thread.id} className="grid grid-cols-1 md:grid-cols-12 gap-4 px-6 py-5 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors" onClick={() => onSelectThread({ ...thread, categoryTitle: category.title })}>                            <div className="md:col-span-6 flex items-center gap-3">
                                <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center font-semibold text-emerald-700">{thread.authorAvatar}</div>
                                <div>
                                    <h3 className="font-semibold text-gray-900">{thread.title}</h3>
                                    <p className="text-sm text-gray-600">por {thread.author}</p>
                                </div>
                            </div>
                            <div className="md:col-span-2 flex items-center"><span className="font-semibold text-gray-900">{thread.replies} respuestas</span></div>
                            <div className="md:col-span-4 flex items-center md:justify-end"><span className="text-sm text-gray-600">{thread.lastActivity}</span></div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default ForumCategory