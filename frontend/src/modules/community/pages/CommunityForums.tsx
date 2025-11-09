import { useState } from 'react';
import type { Dispatch, SetStateAction } from 'react';
import ForumHome from '../components/ForumHome';
import ForumCategory from '../components/ForumCategory';
import ForumThread from '../components/ForumThread';
import { X } from 'lucide-react';
import { forumService } from '../services/forum.service';

// Define types for the modal props
interface NewThreadData {
  title: string;
  content: string;
  categoriaForoId: number | null;
}

interface NewThreadModalProps {
  onClose: () => void;
  data: NewThreadData;
  setData: Dispatch<SetStateAction<NewThreadData>>;
  onCreate: () => void;
}


const CommunityForums = () => {
    const [view, setView] = useState('home');
    const [selectedCategory, setSelectedCategory] = useState<any>(null);
    const [selectedThread, setSelectedThread] = useState<any>(null);
    const [showNewThread, setShowNewThread] = useState(false);
    const [showReply, setShowReply] = useState(false);
    const [replyToComment, setReplyToComment] = useState<any>(null);
    const [newThreadData, setNewThreadData] = useState<NewThreadData>({ title: '', content: '', categoriaForoId: null });
    const [replyContent, setReplyContent] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const handleCreateNewThread = async () => {
        if (!selectedCategory || !selectedCategory.id) return;
        try {
            // Assuming a user is logged in and we can get their ID
            const userId = 1; // Placeholder for logged-in user ID
            const newForo = {
                titulo: newThreadData.title,
                descripcion: newThreadData.content,
                autor: { id: userId }, // Assuming backend can map this to a User object
                categoriaForo: { id: parseInt(selectedCategory.id, 10) }
            };
            await forumService.createForo(newForo);
            setShowNewThread(false);
            setNewThreadData({ title: '', content: '', categoriaForoId: null });
            // Optionally, refresh the category view to show the new thread
            setView('category');
        } catch (error) {
            console.error("Error creating new thread:", error);
            // Handle error, show message to user
        }
    };
    const handlePostReply = async () => {
        if (!selectedThread || !selectedThread.id) return;
        try {
            const userId = 1; // Placeholder for logged-in user ID
            const newComment = {
                contenido: replyContent,
                autor: { id: userId }, // Assuming backend can map this to a User object
            };
            await forumService.createComment(selectedThread.id, newComment);
            setShowReply(false);
            setReplyToComment(null);
            setReplyContent('');
            // Optionally, refresh the thread view to show the new comment
            setView('thread');
        } catch (error) {
            console.error("Error posting reply:", error);
            // Handle error, show message to user
        }
    };

    // Modal Nuevo Tema
    function NewThreadModal({ onClose, data, setData, onCreate }: NewThreadModalProps) {
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
                            <input type="text" placeholder="Escribe un título..." value={data.title} onChange={(e) => setData({ ...data, title: e.target.value })} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                        </div>
                        <div className="mb-6">
                            <label className="block text-sm font-semibold text-gray-800 mb-2">Contenido</label>
                            <textarea placeholder="Comparte tu historia..." value={data.content} onChange={(e) => setData({ ...data, content: e.target.value })} rows="8" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"></textarea>
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

    // Modal Responder
    function ReplyModal({ onClose, comment, content, setContent, onPost }: any) {
        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
                    <div className="p-8">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-3xl font-bold text-gray-900">{comment ? `Respondiendo a @${comment.author}` : 'Responder al Tema'}</h2>
                            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg"><X className="w-6 h-6" /></button>
                        </div>
                        {comment && (
                            <div className="bg-gray-50 rounded-xl p-4 mb-6 border-l-4 border-emerald-500">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center font-semibold text-emerald-700 text-sm">{comment.authorAvatar}</div>
                                    <span className="font-semibold text-gray-900">{comment.author}</span>
                                </div>
                                <p className="text-gray-700 text-sm">{comment.content.substring(0, 100)}...</p>
                            </div>
                        )}
                        <textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="Escribe tu respuesta..." rows={6} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none mb-6"></textarea>
                        <div className="flex gap-4">
                            <button onClick={onClose} className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50">Cancelar</button>
                            <button onClick={onPost} className="flex-1 bg-emerald-500 text-white py-3 rounded-xl font-semibold hover:bg-emerald-600">Enviar</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (view === 'home') {
        return <ForumHome onSelectCategory={(cat: any) => { setSelectedCategory(cat); setView('category'); }} searchQuery={searchQuery} setSearchQuery={setSearchQuery} />;
    }

    if (view === 'category') {
        return <ForumCategory category={selectedCategory} onBack={() => setView('home')} onBackToHome={() => setView('home')} onSelectThread={(thread: any) => { setSelectedThread(thread); setView('thread'); }} onNewThread={() => setShowNewThread(true)} />;
    }

    if (view === 'thread') {
        return (
            <>
                <ForumThread thread={selectedThread} onBack={() => setView('category')} onBackToHome={() => setView('home')} onReply={(comment: any) => { setReplyToComment(comment); setShowReply(true); }} />
                {showReply && <ReplyModal onClose={() => { setShowReply(false); setReplyToComment(null); }} comment={replyToComment} content={replyContent} setContent={setReplyContent} onPost={handlePostReply} />}
            </>
        );
    }

    return (
        <>
            {showNewThread && <NewThreadModal onClose={() => setShowNewThread(false)} data={newThreadData} setData={setNewThreadData} onCreate={handleCreateNewThread} />}
        </>
    );
};

export default CommunityForums;