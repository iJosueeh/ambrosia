import { ArrowRight, Calendar, User } from "lucide-react";

export const Articulos = () => {
  const articles = [
    {
      category: "Nutrición",
      categoryColor: "bg-emerald-500",
      image:
        "https://images.unsplash.com/photo-1511690743698-d9d85f2fbf38?w=800&h=600&fit=crop",
      title: "El camino hacia una relación saludable con la comida",
      description:
        "Descubre estrategias prácticas para desarrollar hábitos alimenticios equilibrados y sostenibles.",
      author: "Dra. María González",
      date: "15 Oct 2025",
    },
    {
      category: "Bienestar",
      categoryColor: "bg-teal-500",
      image:
        "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&h=600&fit=crop",
      title: "Mindfulness y bienestar emocional",
      description:
        "Aprende técnicas de atención plena para manejar el estrés y las emociones difíciles.",
      author: "Lic. Carlos Ruiz",
      date: "10 Oct 2025",
    },
    {
      category: "Familia",
      categoryColor: "bg-pink-500",
      image:
        "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=800&h=600&fit=crop",
      title: "Cómo apoyar a un ser querido",
      description:
        "Guía para familias y amigos que quieren ayudar a alguien con un trastorno alimenticio.",
      author: "Psic. Ana Torres",
      date: "5 Oct 2025",
    },
  ];

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
              key={index}
              className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
              data-aos="fade-up"
              data-aos-delay={100 * (index + 1)}
            >
              {/* Image */}
              <div className="relative h-56 overflow-hidden">
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
                <span
                  className={`absolute top-4 left-4 ${article.categoryColor} text-white px-4 py-1 rounded-full text-sm font-medium`}
                >
                  {article.category}
                </span>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-3 line-clamp-2">
                  {article.title}
                </h3>

                <p className="text-gray-600 mb-4 line-clamp-3">
                  {article.description}
                </p>

                {/* Meta Info */}
                <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                  <div className="flex items-center gap-1">
                    <User className="w-4 h-4" />
                    <span>{article.author}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>{article.date}</span>
                  </div>
                </div>

                {/* Read More Link */}
                <a
                  href="#"
                  className="inline-flex items-center gap-2 text-emerald-600 font-medium hover:text-emerald-700 transition-colors"
                >
                  Leer más
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </article>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center" data-aos="fade-up">
          <button className="border-2 border-emerald-600 text-emerald-600 px-8 py-3 rounded-lg font-medium hover:bg-emerald-50 transition-all duration-200 transform hover:scale-105">
            Ver todos los artículos
          </button>
        </div>
      </div>
    </section>
  );
};