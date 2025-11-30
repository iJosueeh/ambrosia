import { ArrowRight, Calendar, User } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { getAllResources } from "../../resources/services/resource.service";
import type { RecursoDTO } from "../../resources/types/recurso.types";

// Helper para asignar colores según la categoría (puedes expandirlo según tus categorías reales)
const getCategoryColor = (category: string) => {
  const normalized = category.toLowerCase();
  if (normalized.includes("nutrición") || normalized.includes("alimentación")) return "bg-emerald-500";
  if (normalized.includes("bienestar") || normalized.includes("salud")) return "bg-teal-500";
  if (normalized.includes("familia") || normalized.includes("apoyo")) return "bg-pink-500";
  if (normalized.includes("psicología") || normalized.includes("mente")) return "bg-purple-500";
  return "bg-emerald-500"; // Color por defecto
};

export const Articulos = () => {
  const [articles, setArticles] = useState<RecursoDTO[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        // Obtenemos los últimos 3 recursos (page 0, size 3)
        const response = await getAllResources(0, 3);
        setArticles(response.content);
      } catch (error) {
        console.error("Error al cargar artículos:", error);
        // En caso de error, podríamos dejar el estado vacío o mostrar un mensaje
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  if (loading) {
    return (
      <section className="py-16 px-4 bg-gradient-to-b from-gray-50 to-white min-h-[400px] flex items-center justify-center">
        <div className="text-emerald-600 font-semibold">Cargando artículos...</div>
      </section>
    );
  }

  // Si no hay artículos, no mostramos la sección (o podrías mostrar un mensaje vacío)
  if (articles.length === 0) {
    return null;
  }

  return (
    <section id="articles" className="py-16 px-4 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12" data-aos="fade-up">
          <h2 className="text-3xl md:text-4xl font-bold text-teal-800 mb-4">
            Nuestros Artículos
          </h2>
          <p className="text-gray-600 text-lg max-w-3xl mx-auto">
            Recursos, guías y testimonios para acompañarte en tu proceso de
            recuperación
          </p>
        </div>

        {/* Articles Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {articles.map((article, index) => (
            <article
              key={article.id || index}
              className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
              data-aos="fade-up"
              data-aos-delay={100 * (index + 1)}
            >
              {/* Image y Content */}
              <div className="relative h-56 overflow-hidden">
                <img
                  src={article.urlimg || "https://images.unsplash.com/photo-1511690743698-d9d85f2fbf38?w=800&h=600&fit=crop"} // Imagen por defecto si no hay
                  alt={article.titulo}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
                <span
                  className={`absolute top-4 left-4 ${getCategoryColor(article.nombreCategoria)} text-white px-4 py-1 rounded-full text-sm font-medium`}
                >
                  {article.nombreCategoria}
                </span>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-3 line-clamp-2">
                  {article.titulo}
                </h3>

                <p className="text-gray-600 mb-4 line-clamp-3">
                  {article.descripcion}
                </p>

                {/* Meta Info */}
                <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                  <div className="flex items-center gap-1">
                    <User className="w-4 h-4" />
                    <span>{article.nombreCreador || "Ambrosía"}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>{article.fechaPublicacion ? new Date(article.fechaPublicacion).toLocaleDateString() : "Reciente"}</span>
                  </div>
                </div>

                {/* Read More Link */}
                <Link
                  to={`/articulos/${article.slug || article.id}`} // Enlace dinámico al detalle
                  className="inline-flex items-center gap-2 text-emerald-600 font-medium hover:text-emerald-700 transition-colors"
                >
                  Leer más
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </article>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center" data-aos="fade-up">
          <Link
            to="/articulos"
            className="inline-block border-2 border-emerald-600 text-emerald-600 px-8 py-3 rounded-lg font-medium hover:bg-emerald-50 transition-all duration-200 transform hover:scale-105"
          >
            Ver todos los artículos
          </Link>
        </div>
      </div>
    </section>
  );
};