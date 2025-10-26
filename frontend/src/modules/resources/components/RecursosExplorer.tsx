import React, { useState, useEffect } from 'react';
import { FileText, Heart, Apple, BookOpen, Search, ChevronLeft, ChevronRight, LoaderCircle } from 'lucide-react';
import { getCategories, getResourcesByCategory, getAllResources } from '../services/resource.service';
import type { CategoriaRecursoDTO } from '../types/categoria.types';
import type { RecursoDTO } from '../types/recurso.types';
import { useNavigate, useParams, Link } from 'react-router-dom';

// Helper to map category names to icons
const iconMap: { [key: string]: React.ElementType } = {
  'articulos': FileText,
  'salud-mental': Heart,
  'nutricion': Apple,
  'historias': BookOpen,
  'default': FileText
};

export const RecursosExplorer: React.FC = () => {
  const { categoryId } = useParams<{ categoryId?: string }>();
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [categories, setCategories] = useState<CategoriaRecursoDTO[]>([]);
  const [resources, setResources] = useState<RecursoDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const fetchedCategories = await getCategories();
        setCategories(fetchedCategories);
        if (categoryId && fetchedCategories.some(c => c.id === parseInt(categoryId))) {
          setSelectedCategory(parseInt(categoryId));
        } else {
          setSelectedCategory(null);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, [categoryId]);

  useEffect(() => {
    const fetchResources = async () => {
      setIsLoading(true);
      setResources([]); // Clear previous resources
      try {
        const fetchedResources = selectedCategory !== null
          ? await getResourcesByCategory(selectedCategory)
          : await getAllResources();
        setResources(fetchedResources);
      } catch (error) {
        console.error("Error fetching resources:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchResources();
  }, [selectedCategory]);

  const filteredResources = resources.filter(resource => 
    (searchQuery === '' || 
     resource.titulo.toLowerCase().includes(searchQuery.toLowerCase()) ||
     resource.descripcion.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const articlesPerPage = 6;
  const totalPages = Math.ceil(filteredResources.length / articlesPerPage);
  const startIndex = (currentPage - 1) * articlesPerPage;
  const displayedArticles = filteredResources.slice(startIndex, startIndex + articlesPerPage);

  const handleCategoryClick = (id: number | null) => {
    setSelectedCategory(id);
    setCurrentPage(1);
    navigate(id === null ? '/explorar-recursos' : `/explorar-recursos/${id}`, { replace: true });
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="text-center py-16 bg-white rounded-2xl shadow-md flex flex-col items-center justify-center">
          <LoaderCircle className="w-16 h-16 text-emerald-500 mx-auto mb-4 animate-spin" />
          <h3 className="text-xl font-semibold text-gray-800">Cargando Recursos...</h3>
        </div>
      );
    }

    if (displayedArticles.length > 0) {
      return (
        <>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {displayedArticles.map((article) => (
              <article
                key={article.id}
                className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 group cursor-pointer flex flex-col h-full"
              >
                <div className="relative h-52 overflow-hidden bg-gray-200">
                  <img
                    src={`https://source.unsplash.com/800x600/?food,${article.id}`}// Placeholder image
                    alt={article.titulo}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-emerald-600 transition-colors leading-snug">
                    {article.titulo}
                  </h3>
                  <p className="text-gray-600 mb-4 line-clamp-2 text-sm flex-1">
                    {article.descripcion}
                  </p>
                  <Link to={`/articulos/${article.id}`} className="inline-flex items-center gap-2 text-emerald-600 font-semibold hover:text-emerald-700 text-sm group/link">
                    <span>Leer más</span>
                    <ChevronRight className="w-4 h-4 ml-1 group-hover/link:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </article>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2">
              <button onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))} disabled={currentPage === 1} className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-40 transition-colors text-gray-700">
                <ChevronLeft className="w-5 h-5" />
              </button>
              {[...Array(totalPages)].map((_, index) => {
                const pageNum = index + 1;
                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`w-10 h-10 rounded-lg font-semibold transition-all duration-200 ${
                      currentPage === pageNum
                        ? 'bg-emerald-500 text-white shadow-md'
                        : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
              <button onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))} disabled={currentPage === totalPages} className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-40 transition-colors text-gray-700">
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </>
      );
    }

    return (
      <div className="text-center py-16 bg-white rounded-2xl shadow-md">
        <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-800 mb-2">No se encontraron artículos</h3>
        <p className="text-gray-600">Intenta con otra búsqueda o selecciona una categoría diferente</p>
      </div>
    );
  };

    return (

      <>

        <div className="min-h-screen bg-gray-50">

          <div className="max-w-7xl mx-auto px-4 py-8">

            <div className="flex flex-col lg:flex-row gap-8">

              {/* Sidebar - Categories */}

              <aside className="lg:w-64 flex-shrink-0">

                <div className="bg-white rounded-xl shadow-md p-6 lg:sticky lg:top-8">

                  <h2 className="text-lg font-bold text-gray-800 mb-4">Categorías</h2>

                  <nav className="space-y-2">

                    <button

                      onClick={() => handleCategoryClick(null)}

                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 text-left ${

                        selectedCategory === null

                          ? 'bg-emerald-50 text-emerald-700 font-semibold border-l-4 border-emerald-500'

                          : 'text-gray-600 hover:bg-gray-50 border-l-4 border-transparent'

                      }`}

                    >

                      <FileText className="w-5 h-5 flex-shrink-0" />

                      <span>Todos</span>

                    </button>

                    {categories.map((category) => {

                      const Icon = iconMap[category.nombre.toLowerCase()] || iconMap['default'];

                      const isActive = selectedCategory === category.id;

                      return (

                        <button

                          key={category.id}

                          onClick={() => handleCategoryClick(category.id)}

                          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 text-left ${

                            isActive

                              ? 'bg-emerald-50 text-emerald-700 font-semibold border-l-4 border-emerald-500'

                              : 'text-gray-600 hover:bg-gray-50 border-l-4 border-transparent'

                          }`}

                        >

                          <Icon className="w-5 h-5 flex-shrink-0" />

                          <span>{category.nombre}</span>

                        </button>

                      );

                    })}

                  </nav>

                </div>

              </aside>

  

              {/* Main Content */}

              <main className="flex-1 min-w-0">

                <div className="mb-8">

                  <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">

                    Explora Nuestros Recursos

                  </h1>

                  <div className="relative max-w-2xl">

                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />

                    <input

                      type="text"

                      placeholder="Buscar por palabra clave"

                      value={searchQuery}

                      onChange={(e) => {

                        setSearchQuery(e.target.value);

                        setCurrentPage(1);

                      }}

                      className="w-full pl-12 pr-4 py-3.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent shadow-sm"

                    />

                  </div>

                </div>

                {renderContent()}

              </main>

            </div>

          </div>

        </div>

      </>

    );

  }

  
