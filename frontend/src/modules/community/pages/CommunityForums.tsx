import { useState } from 'react';
import { useAuth } from '../../../shared/hooks/useAuth';
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
        if (!selectedThread || !selectedThread.id || !user) return;
        try {
            const newComment = {
                contenido: replyContent,
                autorId: user.id,
                foroId: selectedThread.id
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


    if (view === 'home') {
        return <ForumHome onSelectCategory={(cat: ForumCategoryType) => { setSelectedCategory(cat); setView('category'); }} searchQuery={searchQuery} setSearchQuery={setSearchQuery} />;
    }

    if (view === 'category' && selectedCategory) {
        return <ForumCategory category={selectedCategory} onBack={() => setView('home')} onBackToHome={() => setView('home')} onSelectThread={(thread: ForumThreadType) => { setSelectedThread(thread); setView('thread'); }} onNewThread={() => setShowNewThread(true)} />;
    }

    if (view === 'thread' && selectedThread) {
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
