import { useState, useEffect } from 'react';
import { ArrowLeft, Share2, Bookmark, Calendar, Tag, CheckCircle, FileText, Video, BookOpen, LoaderCircle } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { getRecursoBySlug, getRecursosRelacionados, marcarRecursoComoLeido, getProgresoUsuario, type RecursoRelacionado, type ProgresoUsuario } from '../services/resource.service';
import type { RecursoDTO } from '../types/recurso.types';
import { ShareModal } from "@shared/components/ShareModal";
import { useAuth } from '@shared/hooks/useAuth';

import { motion } from "framer-motion";

export default function ArticleDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [article, setArticle] = useState<RecursoDTO | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [relatedResources, setRelatedResources] = useState<RecursoRelacionado[]>([]);
  const [userProgress, setUserProgress] = useState<ProgresoUsuario | null>(null);
  const [isLoadingRelated, setIsLoadingRelated] = useState(false);
  const [isMarkedAsRead, setIsMarkedAsRead] = useState(false);
  const [isMarkingAsRead, setIsMarkingAsRead] = useState(false);

  useEffect(() => {
    const fetchArticle = async () => {
      if (!slug) {
        setError("Slug de artículo no proporcionado.");
        setIsLoading(false);
        return;
      }
      try {
        setIsLoading(true);
        const fetchedArticle = await getRecursoBySlug(slug);
        setArticle(fetchedArticle);

        // Cargar recursos relacionados y progreso en paralelo
        if (fetchedArticle.id) {
          setIsLoadingRelated(true);
          try {
            // Solo obtener progreso si el usuario está autenticado
            const progressPromise = isAuthenticated
              ? getProgresoUsuario().catch(() => null)
              : Promise.resolve(null);

            const [related, progress] = await Promise.all([
              getRecursosRelacionados(fetchedArticle.id, 3),
              progressPromise
            ]);
            setRelatedResources(related);
            setUserProgress(progress);

            // Verificar si ya está marcado como leído
            if (progress && progress.recursosLeidosIds.includes(fetchedArticle.id)) {
              setIsMarkedAsRead(true);
            }
          } catch (err) {
            console.error('Error loading related data:', err);
          } finally {
            setIsLoadingRelated(false);
          }
        }
      } catch (err) {
        console.error("Error fetching article:", err);
        setError("No se pudo cargar el artículo. Inténtalo de nuevo más tarde.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchArticle();
  }, [slug]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <LoaderCircle className="w-16 h-16 text-emerald-500 animate-spin" />
        <p className="ml-4 text-lg text-gray-700">Cargando artículo...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 text-red-600 text-lg">
        <p>{error}</p>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-700 text-lg">
        <p>Artículo no encontrado.</p>
      </div>
    );
  }

  const openShareModal = () => setIsShareModalOpen(true);
  const closeShareModal = () => setIsShareModalOpen(false);

  const currentArticleUrl = window.location.href;
  const currentArticleTitle = article?.titulo || "Artículo de Ambrosia";

  const handleMarcarComoLeido = async () => {
    if (!article?.id || isMarkingAsRead || isMarkedAsRead) return;

    setIsMarkingAsRead(true);
    try {
      await marcarRecursoComoLeido(article.id);
      setIsMarkedAsRead(true);
      // Recargar progreso
      const nuevoProgreso = await getProgresoUsuario().catch(() => null);
      if (nuevoProgreso) {
        setUserProgress(nuevoProgreso);
      }
    } catch (error) {
      // Error silencioso - probablemente no autenticado
    } finally {
      setIsMarkingAsRead(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <motion.article
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-2"
          >
            {/* Back Button */}
            <button onClick={() => navigate(`/explorar-recursos`)} className="flex items-center gap-2 text-gray-600 hover:text-emerald-600 mb-6 transition-colors">
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Volver</span>
            </button>

            {/* Article Header */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
              <div className="p-8 md:p-10">
                {/* Category Badge */}
                <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 px-4 py-2 rounded-full text-sm font-semibold mb-4">
                  <Tag className="w-4 h-4" />
                  {article.nombreCategoria || 'Sin Categoría'}
                </div>

                {/* Title */}
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">
                  {article.titulo}
                </h1>

                {/* Meta Info */}
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-6">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>Publicado el {article.fechaPublicacion ? new Date(article.fechaPublicacion).toLocaleDateString() : 'Fecha no disponible'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Bookmark className="w-4 h-4" />
                    <button className="hover:text-emerald-600 transition-colors">
                      Guardar
                    </button>
                  </div>
                  <div className="flex items-center gap-2">
                    <Share2 className="w-4 h-4" />
                    <button onClick={openShareModal} className="hover:text-emerald-600 transition-colors">
                      Compartir
                    </button>
                  </div>
                </div>

                {/* Intro Text */}
                <p className="text-lg text-gray-700 leading-relaxed border-l-4 border-emerald-500 pl-6 py-2 bg-emerald-50 rounded-r-lg mb-8">
                  {article.descripcion}
                </p>

                {/* Main Image - Placeholder for now */}
                <div className="rounded-xl overflow-hidden mb-8">
                  <img
                    src={article.urlimg}
                    alt={article.titulo}
                    className="w-full h-auto"
                  />
                </div>

                {/* Article Content - Using contenido field */}
                <div className="prose prose-lg max-w-none">
                  {article.contenido && (
                    <div
                      className="text-gray-700 leading-relaxed mb-6"
                      dangerouslySetInnerHTML={{ __html: article.contenido }}
                    />
                  )}
                  {!article.contenido && (
                    <p className="text-gray-700 leading-relaxed mb-6">
                      {article.descripcion} {/* Fallback to description if no specific content */}
                    </p>
                  )}
                </div>

                {/* Botón Marcar como Leído */}
                {isAuthenticated && !isMarkedAsRead && (
                  <div className="mt-8 pt-6 border-t border-gray-200">
                    <button
                      onClick={handleMarcarComoLeido}
                      disabled={isMarkingAsRead}
                      className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white py-4 px-6 rounded-xl font-semibold hover:from-emerald-600 hover:to-teal-600 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {isMarkingAsRead ? (
                        <>
                          <LoaderCircle className="w-5 h-5 animate-spin" />
                          Marcando...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="w-5 h-5" />
                          Marcar como leído
                        </>
                      )}
                    </button>
                  </div>
                )}

                {isMarkedAsRead && (
                  <div className="mt-8 pt-6 border-t border-gray-200">
                    <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-center gap-3">
                      <CheckCircle className="w-6 h-6 text-emerald-600 flex-shrink-0" />
                      <p className="text-emerald-800 font-medium">
                        ¡Artículo marcado como leído!
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.article>

          {/* Sidebar */}
          <motion.aside
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-1"
          >
            <div className="sticky top-8 space-y-6">
              {/* Related Resources */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Recursos Relacionados
                </h3>
                {isLoadingRelated ? (
                  <div className="flex items-center justify-center py-8">
                    <LoaderCircle className="w-8 h-8 text-emerald-500 animate-spin" />
                  </div>
                ) : relatedResources.length > 0 ? (
                  <div className="space-y-4">
                    {relatedResources.map((resource) => {
                      const Icon = resource.tipoRecurso === 'Video' ? Video : resource.tipoRecurso === 'Podcast' ? FileText : BookOpen;
                      const color = resource.tipoRecurso === 'Video' ? 'text-purple-600' : resource.tipoRecurso === 'Podcast' ? 'text-blue-600' : 'text-emerald-600';
                      const bgColor = resource.tipoRecurso === 'Video' ? 'bg-purple-50' : resource.tipoRecurso === 'Podcast' ? 'bg-blue-50' : 'bg-emerald-50';

                      return (
                        <button
                          key={resource.id}
                          onClick={() => navigate(`/articulos/${resource.slug}`)}
                          className="w-full text-left p-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors group"
                        >
                          <div className="flex items-start gap-3">
                            <div className={`w-10 h-10 ${bgColor} rounded-lg flex items-center justify-center flex-shrink-0`}>
                              <Icon className={`w-5 h-5 ${color}`} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-semibold text-gray-900 mb-1 text-sm group-hover:text-emerald-600 transition-colors">
                                {resource.titulo}
                              </h4>
                              <p className="text-xs text-gray-600 line-clamp-2">
                                {resource.descripcion}
                              </p>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 text-center py-4">No hay recursos relacionados disponibles.</p>
                )}
              </div>

              {/* Help CTA */}
              <div className="bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl shadow-lg p-6 text-white">
                <h3 className="text-xl font-bold mb-3">
                  ¿Necesitas ayuda?
                </h3>
                <p className="text-emerald-50 text-sm mb-6">
                  Si sientes que necesitas apoyo profesional, estamos aquí para ayudarte.
                </p>
                <button
                  onClick={() => navigate('/contacto')}
                  className="w-full bg-white text-emerald-600 py-3 rounded-lg font-semibold hover:bg-emerald-50 transition-colors shadow-md"
                >
                  Contactar un especialista
                </button>
              </div>

              {/* Progress Tracker */}
              {userProgress && (
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <CheckCircle className="w-5 h-5 text-emerald-600" />
                    <h3 className="text-lg font-bold text-gray-900">
                      Tu Progreso
                    </h3>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">
                    Has leído <strong className="text-gray-900">{userProgress.articulosLeidos} de {userProgress.totalArticulosRecomendados}</strong> artículos recomendados
                  </p>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-gradient-to-r from-emerald-500 to-teal-500 h-2.5 rounded-full"
                      style={{ width: `${userProgress.porcentaje}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>
          </motion.aside>
        </div>
      </div>
      {article && (
        <ShareModal
          isOpen={isShareModalOpen}
          onClose={closeShareModal}
          articleUrl={currentArticleUrl}
          articleTitle={currentArticleTitle}
        />
      )}
    </div>
  );
}
