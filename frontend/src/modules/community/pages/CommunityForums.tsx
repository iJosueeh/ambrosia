import { useState } from 'react';
import { useAuth } from '../../../shared/hooks/useAuth';
import { toast } from 'react-hot-toast';
import { NewThreadModal, ReplyModal, NewThreadData } from '../components/ForumModals';
import ForumHome from '../components/ForumHome';
import ForumCategory from '../components/ForumCategory';
import ForumThread from '../components/ForumThread';

import { forumService } from '../services/forum.service';
import type { ForumCategoryType, ForumThreadType } from '../types/forum.types';


const CommunityForums = () => {
    const { user } = useAuth();
    const [view, setView] = useState('home');
    const [selectedCategory, setSelectedCategory] = useState<ForumCategoryType | null>(null);
    const [selectedThread, setSelectedThread] = useState<ForumThreadType | null>(null);
    const [showNewThread, setShowNewThread] = useState(false);
    const [showReply, setShowReply] = useState(false);
    const [replyToComment, setReplyToComment] = useState<any>(null); // Keep any for now, as CommentType is not fully integrated here
    const [newThreadData, setNewThreadData] = useState<NewThreadData>({ title: '', content: '', categoriaForoId: null });
    const [replyContent, setReplyContent] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [threadKey, setThreadKey] = useState(0); // Key para forzar re-render
    const handleCreateNewThread = async () => {
        if (!selectedCategory || !selectedCategory.id || !user) return;
        try {
            const newForo = {
                titulo: newThreadData.title,
                descripcion: newThreadData.content,
                autorId: user.id,
                categoriaForoId: selectedCategory.id
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
        // Validar autenticación
        if (!user) {
            toast.error('Debes iniciar sesión para comentar.');
            setShowReply(false);
            return;
        }

        // Validar que hay un thread seleccionado
        if (!selectedThread || !selectedThread.id) {
            toast.error('No se ha seleccionado ningún tema.');
            return;
        }

        // Validar que el contenido no esté vacío
        if (!replyContent.trim()) {
            toast.error('El comentario no puede estar vacío.');
            return;
        }

        setIsSubmitting(true);
        const toastId = toast.loading('Enviando comentario...');

        try {
            const newComment = {
                contenido: replyContent.trim(),
                autorId: user.id,
                foroId: selectedThread.id
            };
            await forumService.createComment(selectedThread.id, newComment);

            toast.success('Comentario publicado con éxito!', { id: toastId });
            setShowReply(false);
            setReplyToComment(null);
            setReplyContent('');

            // Forzar re-render del thread para recargar comentarios
            setThreadKey(prev => prev + 1);
        } catch (error: any) {
            console.error("Error posting reply:", error);
            const errorMessage = error.response?.data?.message || 'Error al publicar comentario. Por favor, inténtalo de nuevo.';
            toast.error(errorMessage, { id: toastId });
        } finally {
            setIsSubmitting(false);
        }
    };


    if (view === 'home') {
        return <ForumHome onSelectCategory={(cat: ForumCategoryType) => { setSelectedCategory(cat); setView('category'); }} searchQuery={searchQuery} setSearchQuery={setSearchQuery} />;
    }

    if (view === 'category' && selectedCategory) {
        return <ForumCategory category={selectedCategory} onBack={() => setView('home')} onBackToHome={() => setView('home')} onSelectThread={(thread: ForumThreadType) => { setSelectedThread(thread); setView('thread'); }} onNewThread={() => setShowNewThread(true)} />;
    }

    if (view === 'thread' && selectedThread) {
        const handleReply = (comment: any) => {
            if (!user) {
                toast.error('Debes iniciar sesión para comentar.');
                return;
            }
            setReplyToComment(comment);
            setShowReply(true);
        };

        return (
            <>
                <ForumThread
                    key={threadKey}
                    thread={selectedThread}
                    onBack={() => setView('category')}
                    onBackToHome={() => setView('home')}
                    onReply={handleReply}
                />
                {showReply && (
                    <ReplyModal
                        onClose={() => {
                            setShowReply(false);
                            setReplyToComment(null);
                            setReplyContent('');
                        }}
                        comment={replyToComment}
                        content={replyContent}
                        setContent={setReplyContent}
                        onPost={handlePostReply}
                        isSubmitting={isSubmitting}
                    />
                )}
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
