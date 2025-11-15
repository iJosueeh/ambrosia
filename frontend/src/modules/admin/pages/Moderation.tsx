import React, { useState, useEffect } from 'react';
import { Plus, ChevronLeft, ChevronRight, Trash2, Lock, Unlock, AlertTriangle, MessageSquare } from 'lucide-react';
import { fetchTopics, updateTopicStatus, deleteTopic, fetchComments, updateCommentStatus, deleteComment } from '../services/moderation.service';
import type { ForumAdminDTO, CommentAdminDTO, PaginatedForumsResponse, PaginatedCommentsResponse } from '../types/moderation.types';

// --- Component Props Interfaces ---

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

interface StatusBadgeProps {
  status: string;
}

interface FilterTabsProps {
  currentFilter: string;
  onFilterChange: (filter: string) => void;
  filters: string[];
}

// --- Reusable Components ---

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;
  return (
    <div className="flex items-center justify-between">
      <button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1} className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50">
        <ChevronLeft className="w-5 h-5 mr-2" /> Anterior
      </button>
      <span className="text-sm text-gray-700">Página {currentPage} de {totalPages}</span>
      <button onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages} className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50">
        Siguiente <ChevronRight className="w-5 h-5 ml-2" />
      </button>
    </div>
  );
};

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const styles: { [key: string]: string } = {
    ACTIVE: 'bg-green-100 text-green-800',
    CLOSED: 'bg-gray-100 text-gray-800',
    REPORTED: 'bg-yellow-100 text-yellow-800',
    HIDDEN: 'bg-red-100 text-red-800',
  };
  return <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${styles[status] || 'bg-gray-100 text-gray-800'}`}>{status}</span>;
};

const FilterTabs: React.FC<FilterTabsProps> = ({ currentFilter, onFilterChange, filters }) => {
  return (
    <div className="border-b border-gray-200">
      <nav className="-mb-px flex space-x-6" aria-label="Tabs">
        {filters.map(filter => (
          <button
            key={filter}
            onClick={() => onFilterChange(filter)}
            className={`whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm ${
              currentFilter === filter
                ? 'border-green-500 text-green-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            {filter}
          </button>
        ))}
      </nav>
    </div>
  );
};

// --- Main Moderation Page ---

const Moderation = () => {
  const [activeTab, setActiveTab] = useState<'topics' | 'comments'>('topics');

  // Topics State
  const [topics, setTopics] = useState<ForumAdminDTO[]>([]);
  const [loadingTopics, setLoadingTopics] = useState(true);
  const [totalPagesTopics, setTotalPagesTopics] = useState(0);
  const [topicStatusFilter, setTopicStatusFilter] = useState('ALL');
  const [currentPageTopics, setCurrentPageTopics] = useState(1);

  // Comments State
  const [comments, setComments] = useState<CommentAdminDTO[]>([]);
  const [loadingComments, setLoadingComments] = useState(true);
  const [totalPagesComments, setTotalPagesComments] = useState(0);
  const [commentStatusFilter, setCommentStatusFilter] = useState('ALL');
  const [currentPageComments, setCurrentPageComments] = useState(1);

  const itemsPerPage = 8;

  // --- Topics Fetching ---
  const loadTopics = async () => {
    setLoadingTopics(true);
    try {
      const data: PaginatedForumsResponse = await fetchTopics({ 
        page: currentPageTopics - 1, 
        size: itemsPerPage, 
        status: topicStatusFilter 
      });
      setTopics(data.content);
      setTotalPagesTopics(data.totalPages);
    } catch (error) {
      console.error("Failed to fetch topics:", error);
      setTopics([]);
      setTotalPagesTopics(0);
    } finally {
      setLoadingTopics(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'topics') {
      loadTopics();
    }
  }, [currentPageTopics, topicStatusFilter, activeTab]);

  // --- Comments Fetching ---
  const loadComments = async () => {
    setLoadingComments(true);
    try {
      const data: PaginatedCommentsResponse = await fetchComments({ 
        page: currentPageComments - 1, 
        size: itemsPerPage, 
        status: commentStatusFilter 
      });
      setComments(data.content);
      setTotalPagesComments(data.totalPages);
    } catch (error) {
      console.error("Failed to fetch comments:", error);
      setComments([]);
      setTotalPagesComments(0);
    } finally {
      setLoadingComments(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'comments') {
      loadComments();
    }
  }, [currentPageComments, commentStatusFilter, activeTab]);

  // --- Handlers ---
  const handleTopicStatusChange = (status: string) => {
    setTopicStatusFilter(status);
    setCurrentPageTopics(1);
  };

  const handleCommentStatusChange = (status: string) => {
    setCommentStatusFilter(status);
    setCurrentPageComments(1);
  };

  const handleDeleteTopic = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this topic?')) {
      try {
        await deleteTopic(id);
        loadTopics();
      } catch (error) {
        console.error("Failed to delete topic:", error);
      }
    }
  };

  const handleUpdateTopicStatus = async (id: number, newStatus: string) => {
    try {
      await updateTopicStatus(id, newStatus);
      loadTopics();
    } catch (error) {
      console.error("Failed to update topic status:", error);
    }
  };

  const handleDeleteComment = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this comment?')) {
      try {
        await deleteComment(id);
        loadComments();
      } catch (error) {
        console.error("Failed to delete comment:", error);
      }
    }
  };

  const handleUpdateCommentStatus = async (id: number, newStatus: string) => {
    try {
      await updateCommentStatus(id, newStatus);
      loadComments();
    } catch (error) {
      console.error("Failed to update comment status:", error);
    }
  };

  const topicFilters = ['ALL', 'ACTIVE', 'CLOSED', 'REPORTED'];
  const commentFilters = ['ALL', 'ACTIVE', 'HIDDEN', 'REPORTED'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-800">Moderación de Foros</h1>
        {/* "Nuevo Tema" button is removed for now as backend POST is not implemented for admin */}
      </div>

      {/* Main Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-6" aria-label="Tabs">
          <button
            onClick={() => setActiveTab('topics')}
            className={`whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'topics'
                ? 'border-green-500 text-green-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Temas
          </button>
          <button
            onClick={() => setActiveTab('comments')}
            className={`whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'comments'
                ? 'border-green-500 text-green-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Comentarios
          </button>
        </nav>
      </div>

      {activeTab === 'topics' && (
        <div className="space-y-6">
          <FilterTabs currentFilter={topicStatusFilter} onFilterChange={handleTopicStatusChange} filters={topicFilters} />

          <div className="bg-white shadow-sm border border-gray-200 rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Título del Tema</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Autor</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Categoría</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Comentarios</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha Creación</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                  <th scope="col" className="relative px-6 py-3"><span className="sr-only">Acciones</span></th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loadingTopics ? (
                  <tr><td colSpan={7} className="text-center py-8 text-gray-500">Cargando temas...</td></tr>
                ) : topics.length === 0 ? (
                  <tr><td colSpan={7} className="text-center py-8 text-gray-500">No se encontraron temas.</td></tr>
                ) : (
                  topics.map(topic => (
                    <tr key={topic.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{topic.titulo}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{topic.autorNombre}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{topic.categoriaForoNombre}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">{topic.commentCount}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(topic.fechaCreacion).toLocaleString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap"><StatusBadge status={topic.status} /></td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                            {topic.status === 'ACTIVE' && (
                                <button onClick={() => handleUpdateTopicStatus(topic.id, 'CLOSED')} className="text-gray-400 hover:text-gray-600 p-1" title="Cerrar Tema"><Lock className="w-5 h-5" /></button>
                            )}
                            {topic.status === 'CLOSED' && (
                                <button onClick={() => handleUpdateTopicStatus(topic.id, 'ACTIVE')} className="text-gray-400 hover:text-gray-600 p-1" title="Abrir Tema"><Unlock className="w-5 h-5" /></button>
                            )}
                            {topic.status === 'REPORTED' && (
                                <button onClick={() => handleUpdateTopicStatus(topic.id, 'ACTIVE')} className="text-gray-400 hover:text-gray-600 p-1" title="Marcar como Activo"><AlertTriangle className="w-5 h-5 text-yellow-500" /></button>
                            )}
                            <button onClick={() => handleDeleteTopic(topic.id)} className="text-gray-400 hover:text-red-600 p-1" title="Eliminar Tema"><Trash2 className="w-5 h-5" /></button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
            
            <div className="px-6 py-4 border-t border-gray-200">
              <Pagination currentPage={currentPageTopics} totalPages={totalPagesTopics} onPageChange={setCurrentPageTopics} />
            </div>
          </div>
        </div>
      )}

      {activeTab === 'comments' && (
        <div className="space-y-6">
          <FilterTabs currentFilter={commentStatusFilter} onFilterChange={handleCommentStatusChange} filters={commentFilters} />

          <div className="bg-white shadow-sm border border-gray-200 rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contenido</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Autor</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tema</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha Creación</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                  <th scope="col" className="relative px-6 py-3"><span className="sr-only">Acciones</span></th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loadingComments ? (
                  <tr><td colSpan={6} className="text-center py-8 text-gray-500">Cargando comentarios...</td></tr>
                ) : comments.length === 0 ? (
                  <tr><td colSpan={6} className="text-center py-8 text-800">No se encontraron comentarios.</td></tr>
                ) : (
                  comments.map(comment => (
                    <tr key={comment.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900 truncate w-64">{comment.contenido}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{comment.autorNombre}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{comment.foroTitulo}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(comment.fechaCreacion).toLocaleString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap"><StatusBadge status={comment.status} /></td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                            {comment.status === 'ACTIVE' && (
                                <button onClick={() => handleUpdateCommentStatus(comment.id, 'HIDDEN')} className="text-gray-400 hover:text-gray-600 p-1" title="Ocultar Comentario"><MessageSquare className="w-5 h-5" /></button>
                            )}
                            {comment.status === 'HIDDEN' && (
                                <button onClick={() => handleUpdateCommentStatus(comment.id, 'ACTIVE')} className="text-gray-400 hover:text-gray-600 p-1" title="Mostrar Comentario"><MessageSquare className="w-5 h-5" /></button>
                            )}
                            {comment.status === 'REPORTED' && (
                                <button onClick={() => handleUpdateCommentStatus(comment.id, 'ACTIVE')} className="text-gray-400 hover:text-gray-600 p-1" title="Marcar como Activo"><AlertTriangle className="w-5 h-5 text-yellow-500" /></button>
                            )}
                            <button onClick={() => handleDeleteComment(comment.id)} className="text-gray-400 hover:text-red-600 p-1" title="Eliminar Comentario"><Trash2 className="w-5 h-5" /></button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
            
            <div className="px-6 py-4 border-t border-gray-200">
              <Pagination currentPage={currentPageComments} totalPages={totalPagesComments} onPageChange={setCurrentPageComments} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Moderation;
