import React, { useState, useEffect } from 'react';
import { ArrowLeft, Share2, Bookmark, Calendar, Tag, CheckCircle, FileText, Video, BookOpen, LoaderCircle } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { getArticleById } from '../services/resource.service';
import type { RecursoDTO } from '../types/recurso.types';
import { ShareModal } from "@shared/components/ShareModal";

import { motion } from "framer-motion";

export default function ArticleDetailPage() {
  const { articleId } = useParams<{ articleId: string }>();
  const navigate = useNavigate();
  const [article, setArticle] = useState<RecursoDTO | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  useEffect(() => {
    const fetchArticle = async () => {
      if (!articleId) {
        setError("ID de artículo no proporcionado.");
        setIsLoading(false);
        return;
      }
      try {
        setIsLoading(true);
        const fetchedArticle = await getArticleById(parseInt(articleId));
        setArticle(fetchedArticle);
      } catch (err) {
        console.error("Error fetching article:", err);
        setError("No se pudo cargar el artículo. Inténtalo de nuevo más tarde.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchArticle();
  }, [articleId]);

  const relatedResources = [
    {
      icon: FileText,
      title: 'Podcast: Mitos sobre la nutrición intuitiva',
      description: 'Escucha a expertos desmentir conceptos erróneos',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      icon: Video,
      title: 'Video: Técnicas de Mindfulness',
      description: 'Ejercicios guiados para comer conscientemente',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      icon: BookOpen,
      title: 'Artículo: Construyendo una imagen corporal positiva',
      description: 'Herramientas para mejorar tu relación contigo mismo',
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50'
    }
  ];

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
            <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-600 hover:text-emerald-600 mb-6 transition-colors">
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
                    <span>Publicado el {new Date(article.fechaPublicacion).toLocaleDateString()}</span>
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
                <div className="space-y-4">
                  {relatedResources.map((resource, index) => {
                    const Icon = resource.icon;
                    return (
                      <button
                        key={index}
                        className="w-full text-left p-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors group"
                      >
                        <div className="flex items-start gap-3">
                          <div className={`w-10 h-10 ${resource.bgColor} rounded-lg flex items-center justify-center flex-shrink-0`}>
                            <Icon className={`w-5 h-5 ${resource.color}`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-gray-900 mb-1 text-sm group-hover:text-emerald-600 transition-colors">
                              {resource.title}
                            </h4>
                            <p className="text-xs text-gray-600 line-clamp-2">
                              {resource.description}
                            </p>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Help CTA */}
              <div className="bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl shadow-lg p-6 text-white">
                <h3 className="text-xl font-bold mb-3">
                  ¿Necesitas ayuda?
                </h3>
                <p className="text-emerald-50 text-sm mb-6">
                  Si sientes que necesitas apoyo profesional, estamos aquí para ayudarte.
                </p>
                <button className="w-full bg-white text-emerald-600 py-3 rounded-lg font-semibold hover:bg-emerald-50 transition-colors shadow-md">
                  Contactar un especialista
                </button>
              </div>

              {/* Progress Tracker */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex items-center gap-2 mb-4">
                  <CheckCircle className="w-5 h-5 text-emerald-600" />
                  <h3 className="text-lg font-bold text-gray-900">
                    Tu Progreso
                  </h3>
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  Has leído <strong className="text-gray-900">12 de 20</strong> artículos recomendados
                </p>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div className="bg-gradient-to-r from-emerald-500 to-teal-500 h-2.5 rounded-full" style={{ width: '60%' }}></div>
                </div>
              </div>
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
