import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getAllResources, getCategories } from "../services/resource.service";
import type { RecursoDTO } from "../types/recurso.types";
import type { CategoriaRecursoDTO } from "../types/categoria.types";
import { Search, Mic, BookOpen, Video, Zap, User, Smile, Baby, X } from "lucide-react";
import { toast, Toaster } from 'react-hot-toast';
import articulosImg from "../../../assets/imgArticulos/articulos.jpg";
import libroImg from "../../../assets/imgArticulos/libro.jpg";
import mentalImg from "../../../assets/imgArticulos/mental.gif";
import mitosImg from "../../../assets/imgArticulos/mitos.jpg";
import ninoImg from "../../../assets/imgArticulos/nino.jpg";
import podcastImg from "../../../assets/imgArticulos/podcast.jpg";
import videokImg from "../../../assets/imgArticulos/videok.gif";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const ResourceModal = ({ category, resources, onClose }: { category: string; resources: RecursoDTO[]; onClose: () => void; }) => {
    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex justify-center items-center p-4 transition-opacity duration-300">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col transform transition-all duration-300 scale-95 opacity-0 animate-fade-in-scale">
                <header className="p-6 flex justify-between items-center border-b border-gray-200">
                    <h2 className="text-2xl font-bold text-emerald-800">{category}</h2>
                    <button onClick={onClose} className="p-2 rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-800 transition-colors">
                        <X className="w-6 h-6" />
                    </button>
                </header>
                <main className="p-6 overflow-y-auto">
                    <ul className="space-y-4">
                        {resources.map(resource => (
                            <li key={resource.id}>
                                <a
                                    href={resource.enlace}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block p-4 rounded-lg border border-gray-200 hover:bg-emerald-50 hover:border-emerald-300 transition-all duration-200"
                                >
                                    <h3 className="font-semibold text-lg text-emerald-700 group-hover:text-emerald-800">{resource.titulo}</h3>
                                    <p className="text-gray-600 text-sm mt-1">{resource.descripcion}</p>
                                    <span className="text-xs text-gray-400 mt-2 block">
                                        Publicado el: {new Date(resource.fechaPublicacion).toLocaleDateString()}
                                    </span>
                                </a>
                            </li>
                        ))}
                    </ul>
                </main>
            </div>
        </div>
    );
};

const BuscadorFiltros: React.FC = () => (
    <div className="p-4 bg-white/90 backdrop-blur-md rounded-xl shadow-lg border-2 border-emerald-500/50 h-full">
        <h3 className="text-xl font-bold text-emerald-600 mb-4 text-center">Buscador</h3>
        <div className="flex items-center border border-gray-300 rounded-lg p-2 mb-4 bg-white">
            <Search className="w-5 h-5 text-gray-400 mr-2" />
            <input type="text" placeholder="Buscar..." className="w-full focus:outline-none bg-transparent" />
        </div>
        <div className="flex justify-center flex-wrap gap-2 text-sm font-medium">
            {["familia", "bienestar", "categorías"].map((filtro) => (
                <button key={filtro} className="px-4 py-1.5 rounded-full bg-emerald-100 text-emerald-700 hover:bg-emerald-200 transition">
                    {filtro}
                </button>
            ))}
        </div>
    </div>
);

interface RecursoCardProps {
  title: string;
  icon: React.ReactElement<{ className?: string }>;
  large?: boolean;
  borderColor?: string;
  backgroundImage?: string;
  onClick?: () => void;
}

const RecursoCard: React.FC<RecursoCardProps> = ({ title, icon, large = false, borderColor = "border-emerald-500", backgroundImage = articulosImg, onClick }) => {
    const styledIcon = React.cloneElement(icon, { className: `w-8 h-8 text-white ${icon.props.className || ''}` });
    return (
        <div onClick={onClick} className={`relative h-full rounded-xl shadow-lg border-2 ${borderColor} overflow-hidden group cursor-pointer transition-transform duration-300 hover:scale-[1.02]`}>
            <div className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105" style={{ backgroundImage: `url(${backgroundImage})` }} />
            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors duration-300"></div>
            <div className="relative z-10 p-6 flex flex-col justify-center items-center text-center text-white h-full">
                <div className="bg-white/20 p-3 rounded-full mb-2">{styledIcon}</div>
                <h2 className={`font-extrabold mt-1 ${large ? "text-4xl sm:text-5xl" : "text-xl"} drop-shadow-lg`}>{title}</h2>
            </div>
        </div>
    );
};

export const ListadoArticulosPage: React.FC = () => {
    const navigate = useNavigate();
    const [categories, setCategories] = useState<CategoriaRecursoDTO[]>([]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const fetchedCategories = await getCategories();
                setCategories(fetchedCategories);
            } catch (error) {
                console.error("Error fetching categories:", error);
            }
        };
        fetchCategories();
    }, []);

    const { data: allResources = [], isLoading, isError } = useQuery({
        queryKey: ['allResources'],
        queryFn: getAllResources,
    });

    const resourcesByCategory = allResources.reduce((acc, resource) => {
        const category = resource.nombreCategoria || 'Sin Categoría';
        if (!acc[category]) {
            acc[category] = [];
        }
        acc[category].push(resource);
        return acc;
    }, {} as Record<string, RecursoDTO[]>);

    const handleCardClick = (categoryName: string) => {
        const category = categories.find(cat => cat.nombre.toLowerCase() === categoryName.toLowerCase());
        if (category) {
            navigate(`/explorar-recursos/${category.id}`);
        } else {
            toast.error(`Categoría "${categoryName}" no encontrada.`);
        }
    };

    const images = {
        articulos: articulosImg,
        podcast: podcastImg,
        videos: videokImg,
        libros: libroImg,
        mitos: mitosImg,
        salud_mental: mentalImg,
        desarrollo_infantil: ninoImg
    };

    if (isLoading) {
        return <div className="min-h-screen flex justify-center items-center text-xl font-semibold text-emerald-700">Cargando recursos...</div>;
    }

    if (isError) {
        return <div className="min-h-screen flex justify-center items-center text-xl font-semibold text-red-700">Error al cargar los recursos.</div>;
    }

    return (
        <>
            <Toaster />

            <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
                <header className="text-center mb-10 mt-4 sm:mt-8">
                    <h1 className="text-4xl font-extrabold text-emerald-900 border-b-4 border-emerald-400 inline-block pb-1">
                        Nuestro Centro de Recursos
                    </h1>
                    <p className="mt-3 text-xl text-gray-600">
                        Explora guías, podcasts y videos sobre bienestar y salud.
                    </p>
                </header>

                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="md:col-span-1 md:row-span-4 min-h-[400px]">
                        <RecursoCard title="Artículos" icon={<User />} large backgroundImage={images.articulos} onClick={() => handleCardClick('Artículos')} />
                    </div>
                    <div className="md:col-span-3 min-h-[180px]">
                        <RecursoCard title="Podcast" icon={<Mic />} backgroundImage={images.podcast} onClick={() => handleCardClick('Podcast')} />
                    </div>
                    <div className="md:col-span-2">
                        <BuscadorFiltros />
                    </div>
                    <div className="md:col-span-1 md:row-span-2 min-h-[300px]">
                        <RecursoCard title="Videos" icon={<Video />} backgroundImage={images.videos} onClick={() => handleCardClick('Videos')} />
                    </div>
                    <div className="md:col-span-1 min-h-[180px]">
                        <RecursoCard title="Libros" icon={<BookOpen />} backgroundImage={images.libros} onClick={() => handleCardClick('Libros')} />
                    </div>
                    <div className="md:col-span-1 min-h-[180px]">
                        <RecursoCard title="Mitos y Realidades" icon={<Zap />} backgroundImage={images.mitos} onClick={() => handleCardClick('Mitos y Realidades')} />
                    </div>
                    <div className="md:col-span-1 min-h-[180px]">
                        <RecursoCard title="Desarrollo Infantil" icon={<Baby />} backgroundImage={images.desarrollo_infantil} onClick={() => handleCardClick('Desarrollo Infantil')} />
                    </div>
                    <div className="md:col-span-2 min-h-[180px]">
                        <RecursoCard title="Salud Mental" icon={<Smile />} backgroundImage={images.salud_mental} onClick={() => handleCardClick('Salud Mental')} />
                    </div>
                </div>
            </div>
        </>
    );
};
