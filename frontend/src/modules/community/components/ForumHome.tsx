import { ChevronRight, MessageCircle, Search } from 'lucide-react';
import { useEffect, useState } from 'react';
import { forumService } from '../services/forum.service';
import type { ForumCategoryType, ForumThreadType } from '../types/forum.types'; // Import ForumCategoryType

// Utility function to format date
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

interface ForumHomeProps {
    onSelectCategory: (category: ForumCategoryType) => void;
    searchQuery: string;
    setSearchQuery: (query: string) => void;
}

const ForumHome = ({ onSelectCategory, searchQuery, setSearchQuery }: ForumHomeProps) => {
    const [forumCategories, setForumCategories] = useState<ForumCategoryType[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<any>(null);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const data = await forumService.getAllCategories();
                const mappedCategories = data.map((cat: any) => { // cat is from backend, might need a DTO
                    const totalTopics = cat.foros ? cat.foros.length : 0;
                    const totalMessages = cat.foros ? cat.foros.reduce((sum: number, foro: any) => sum + (foro.numeroComentarios || 0), 0) : 0;
                    
                    // Find the last post across all forums in the category
                    let lastPostInfo = { user: 'N/A', time: 'N/A', title: 'N/A' };
                    if (cat.foros && cat.foros.length > 0) {
                        // Sort forums by creation date to find the latest one
                        const sortedForos = [...cat.foros].sort((a: any, b: any) => new Date(b.fechaCreacion).getTime() - new Date(a.fechaCreacion).getTime());
                        const latestForo = sortedForos[0];
                        lastPostInfo = {
                            user: latestForo.autorNombre,
                            time: formatRelativeTime(latestForo.fechaCreacion),
                            title: latestForo.titulo
                        };
                    }

                    return {
                        id: cat.id,
                        titulo: cat.titulo, // Use 'titulo' to match ForumCategoryType
                        descripcion: cat.descripcion,
                        // icon: MessageCircle, // Icon is not part of ForumCategoryType, handle separately in JSX
                        topics: totalTopics, // These are not part of ForumCategoryType, but used for display
                        messages: totalMessages, // These are not part of ForumCategoryType, but used for display
                        forums: cat.foros || [], // Ensure forums is an array
                        lastPost: lastPostInfo
                    };
                });
                setForumCategories(mappedCategories);
            } catch (err: any) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };
        fetchCategories();
    }, []);

    if (loading) return <div className="flex justify-center items-center min-h-screen bg-gray-50 text-emerald-600 text-lg font-semibold">Cargando categorías...</div>;
    if (error) return <div className="flex justify-center items-center min-h-screen bg-gray-50 text-red-600 text-lg font-semibold">Error al cargar categorías: {error.message}</div>;

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="text-sm text-gray-600 mb-4">
                    <span>Ambrosia</span> <ChevronRight className="w-4 h-4 inline mx-1" /> <span className="font-medium cursor-default">Foros</span>
                </div>
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-3">Bienvenido a los Foros de Ambrosia</h1>
                    <p className="text-gray-600 text-lg">Un espacio seguro para compartir, conectar y encontrar apoyo en tu camino.</p>
                </div>
                <div className="relative mb-8 max-w-2xl">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input type="text" placeholder="Buscar en los foros..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-12 pr-4 py-3.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-sm" />
                </div>
                {forumCategories.map((category: any) => { // category here is the mapped object, not ForumCategoryType directly
                    // const Icon = category.icon; // Icon is not part of ForumCategoryType
                    return (
                        <div key={category.id} className="mb-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">{category.titulo}</h2> {/* Use titulo */}
                            <div className="space-y-4">
                                {category.forums.map((forum: any) => (
                                    <div key={forum.id} className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all p-6 cursor-pointer" onClick={() => onSelectCategory(category)}>
                                        <div className="flex items-start gap-4">
                                            <div className="w-14 h-14 bg-emerald-50 rounded-xl flex items-center justify-center flex-shrink-0">
                                                <MessageCircle className="w-7 h-7 text-emerald-600" /> {/* Use MessageCircle directly */}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h3 className="text-xl font-bold text-gray-900 mb-2">{forum.titulo}</h3> {/* Use titulo */}
                                                <p className="text-gray-600 mb-4">{forum.descripcion}</p> {/* Use descripcion */}
                                                <div className="flex items-center gap-6 text-sm">
                                                    <div><span className="font-bold text-gray-900">{category.topics.toLocaleString()}</span><span className="text-gray-600 ml-1">Temas</span></div>
                                                    <div><span className="font-bold text-gray-900">{category.messages.toLocaleString()}</span><span className="text-gray-600 ml-1">Mensajes</span></div>
                                                </div>
                                            </div>
                                            <div className="text-right text-sm hidden md:block">
                                                <p className="text-gray-900 font-medium mb-1">{category.lastPost.title}</p>
                                                <p className="text-gray-600">por <span className="text-emerald-600">{category.lastPost.user}</span></p>
                                                <p className="text-gray-500">{category.lastPost.time}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default ForumHome