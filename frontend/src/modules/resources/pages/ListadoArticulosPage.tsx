import React from "react";
// Importamos solo los íconos necesarios
import { Search, Mic, BookOpen, Video, Zap, User, Smile, Baby } from "lucide-react";


import articulos from "../../../assets/imgArticulos/articulos.jpg";
import libro from "../../../assets/imgArticulos/libro.jpg";
import mental from "../../../assets/imgArticulos/mental.gif"; 
import mitos from "../../../assets/imgArticulos/mitos.jpg"; 
import nino from "../../../assets/imgArticulos/nino.jpg"; 
import podcast from "../../../assets/imgArticulos/podcast.jpg"; 
import videok from "../../../assets/imgArticulos/videok.gif"; 

interface RecursoCardProps {
  title: string;

  icon: React.ReactElement<{ className?: string }>; 
  large?: boolean;
  borderColor?: string;
  backgroundImage?: string;
}


const BuscadorFiltros: React.FC = () => (
  <div className="p-4 bg-white/90 backdrop-blur-md rounded-xl shadow-lg border-2 border-emerald-500/50">
    <h3 className="text-xl font-bold text-emerald-600 mb-4 text-center">buscador</h3>

    {/* Campo de búsqueda */}
    <div className="flex items-center border border-gray-300 rounded-lg p-2 mb-4 bg-white">
      <Search className="w-5 h-5 text-gray-400 mr-2" />
      <input
        type="text"
        placeholder="Buscar..."
        className="w-full focus:outline-none bg-transparent"
      />
    </div>

    {/* Filtros */}
    <div className="flex justify-center flex-wrap gap-2 text-sm font-medium">
      {["familia", "bienestar", "categorías"].map((filtro) => (
        <button
          key={filtro}
          className="px-4 py-1.5 rounded-full bg-emerald-100 text-emerald-700 hover:bg-emerald-200 transition"
        >
          {filtro}
        </button>
      ))}
    </div>
  </div>
);

// =========================================================================
// 🎴 Tarjeta genérica con fondo de imagen
// =========================================================================
const RecursoCard: React.FC<RecursoCardProps> = ({
  title,
  icon,
  large = false,
  borderColor = "border-emerald-500", // Color de borde ajustado
  // ⭐️ Cambiado el valor por defecto a 'articulos'
  backgroundImage = articulos, 
}) => {
  
  // Clonamos el ícono para asegurar que tenga las clases de Tailwind
  const styledIcon = React.cloneElement(icon, { 
    className: `w-8 h-8 text-white ${icon.props.className || ''}` 
  });


  return (
    // Aseguramos h-full para que Artículos llene su espacio
    <div
      className={`relative h-full rounded-xl shadow-lg border-2 ${borderColor} overflow-hidden group cursor-pointer transition-transform duration-300 hover:scale-[1.02]`}
    >
      {/* Fondo con imagen */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
        // ⭐️ Uso de la variable de imagen local
        style={{ backgroundImage: `url(${backgroundImage || articulos})` }} 
      />

      {/* Capa de oscurecimiento (Ajustado a un tono más verde-oscuro) */}
      <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors duration-300"></div>

      {/* Contenido principal */}
      <div className="relative z-10 p-6 flex flex-col justify-center items-center text-center text-white h-full">
        <div className="bg-white/20 p-3 rounded-full mb-2">
          {styledIcon}
        </div>
        <h2
          className={`font-extrabold mt-1 ${
            large ? "text-4xl sm:text-5xl" : "text-xl"
          } drop-shadow-lg`}
        >
          {title}
        </h2>
      </div>
    </div>
  );
};

// =========================================================================
// 🌿 Página Principal: Listado de Recursos
// =========================================================================
export const ListadoArticulosPage: React.FC = () => {
  // ⭐️ ASIGNACIÓN DE LAS IMÁGENES IMPORTADAS
  const images = {
    articulos: articulos,
    podcast: podcast,
    videos: videok,
    libros: libro,
    mitos: mitos,
    salud_mental: mental,
    desarrollo_infantil: nino
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      {/* 2. Título ajustado con más margen superior (mt-12) y color verde */}
      <header className="text-center mb-10 mt-4 sm:mt-8">
        <h1 className="text-4xl font-extrabold text-emerald-900 border-b-4 border-emerald-400 inline-block pb-1">
          Nuestro Centro de Recursos
        </h1>
        <p className="mt-3 text-xl text-gray-600">
          Explora guías, podcasts y videos sobre bienestar y salud.
        </p>
      </header>

      {/* 🧩 Distribución de tarjetas */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-6">
        
        {/* 1. Articulos (Columna Izquierda, larga, con imagen) */}
        <div className="md:col-span-1 md:row-span-4 min-h-[400px]">
          <RecursoCard 
            title="Artículos" 
            icon={<User />}
            large 
            backgroundImage={images.articulos}
          />
        </div>

        {/* 2. Podcast (Fila Superior Central) */}
        <div className="md:col-span-3 min-h-[180px]">
          <RecursoCard 
            title="Podcast" 
            icon={<Mic />} 
            backgroundImage={images.podcast} 
          />
        </div>

        {/* 3. Buscador y Categorías (Centro) */}
        <div className="md:col-span-2">
          <BuscadorFiltros />
        </div>

        {/* 4. Videos (Fila Central Derecha, ocupa 2 filas) */}
        <div className="md:col-span-1 md:row-span-2 min-h-[300px]">
          <RecursoCard 
            title="Videos" 
            icon={<Video />} 
            backgroundImage={images.videos} 
          />
        </div>

        {/* 5. Libros (Inferior Izquierda, debajo del buscador) */}
        <div className="md:col-span-1 min-h-[180px]">
          <RecursoCard 
            title="Libros" 
            icon={<BookOpen />} 
            backgroundImage={images.libros} 
          />
        </div>

        {/* 6. Mitos y realidades (Inferior Centro Izquierda) */}
        <div className="md:col-span-1 min-h-[180px]">
          <RecursoCard 
            title="Mitos y Realidades" 
            icon={<Zap />} 
            backgroundImage={images.mitos} 
          />
        </div>

        {/* 7. Comida saludable (Inferior Centro Derecha) */}
        <div className="md:col-span-1 min-h-[180px]">
          <RecursoCard 
            title="Desarrollo Infantil" 
            icon={<Baby />} 
            backgroundImage={images.desarrollo_infantil} 
          />
        </div>

        {/* ⭐️ 8. Salud Mental (Abajo, col-span-2) */}
        <div className="md:col-span-2 min-h-[180px]">
          <RecursoCard 
            title="Salud Mental" 
            icon={<Smile />} 
            backgroundImage={images.salud_mental} 
          />
        </div>

      

      </div>
    </div>
  );
};
