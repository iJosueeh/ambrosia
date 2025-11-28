import React, { useState, useEffect, JSX } from "react";
import { useQuery } from "@tanstack/react-query";
import { getAllResources, getCategories } from "../services/resource.service";
import type { CategoriaRecursoDTO } from "../types/categoria.types";
import { Search, Zap, User, Smile } from "lucide-react";
import { Toaster } from 'react-hot-toast';
import articulosImg from "../../../assets/imgArticulos/articulos.jpg";
import libroImg from "../../../assets/imgArticulos/libro.jpg";
import mentalImg from "../../../assets/imgArticulos/mental.gif";
import mitosImg from "../../../assets/imgArticulos/mitos.jpg";
import podcastImg from "../../../assets/imgArticulos/podcast.jpg";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const BuscadorFiltros: React.FC = () => (
    <div className="p-4 bg-white/90 backdrop-blur-md rounded-xl shadow-lg border-2 border-emerald-500/50 h-full flex flex-col justify-center">
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

const ListadoArticulosPage: React.FC = () => {
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

    const { isLoading, isError } = useQuery({
        queryKey: ['allResources'],
        queryFn: () => getAllResources(0, 20, ''),
    });

    const handleCardClick = (categoryId: string) => {
        navigate(`/explorar-recursos/${categoryId}`);
    };

    // Mapeo de imágenes por categoría
    const getCategoryImage = (categoryName: string) => {
        const imageMap: Record<string, string> = {
            'ansiedad': articulosImg,
            'depresión': podcastImg,
            'mindfulness': mentalImg,
            'autoestima': libroImg,
            'relaciones': mitosImg,
        };
        return imageMap[categoryName.toLowerCase()] || articulosImg;
    };

    // Mapeo de iconos por categoría
    const getCategoryIcon = (categoryName: string) => {
        const iconMap: Record<string, JSX.Element> = {
            'ansiedad': <Zap />,
            'depresión': <Smile />,
            'mindfulness': <Zap />,
            'autoestima': <User />,
            'relaciones': <User />,
        };
        return iconMap[categoryName.toLowerCase()] || <User />;
    };

    if (isLoading || categories.length === 0) {
        return <div className="min-h-screen flex justify-center items-center text-xl font-semibold text-emerald-700">Cargando recursos...</div>;
    }

    if (isError) {
        return <div className="min-h-screen flex justify-center items-center text-xl font-semibold text-red-700">Error al cargar los recursos.</div>;
    }

    return (
        <>
            <Toaster />

            <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
                <motion.header
                    initial={{ opacity: 0, y: -50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-10 mt-4 sm:mt-8"
                >
                    <h1 className="text-4xl font-extrabold text-emerald-900 border-b-4 border-emerald-400 inline-block pb-1">
                        Nuestro Centro de Recursos
                    </h1>
                    <p className="mt-3 text-xl text-gray-600">
                        Explora guías y recursos sobre bienestar y salud mental.
                    </p>
                </motion.header>

                <motion.div
                    variants={{
                        hidden: { opacity: 0 },
                        show: {
                            opacity: 1,
                            transition: {
                                staggerChildren: 0.2
                            }
                        }
                    }}
                    initial="hidden"
                    animate="show"
                    className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-5 md:grid-rows-5 gap-2 h-auto md:h-[600px]"
                >
                    {/* Div 1: Left Column (Row Span 5) */}
                    {categories[0] && (
                        <motion.div
                            variants={{ hidden: { opacity: 0, y: 50 }, show: { opacity: 1, y: 0 } }}
                            className="md:row-span-5 md:col-start-1 md:row-start-1 min-h-[200px]"
                        >
                            <RecursoCard
                                title={categories[0].nombre}
                                icon={getCategoryIcon(categories[0].nombre)}
                                large={true}
                                backgroundImage={getCategoryImage(categories[0].nombre)}
                                onClick={() => handleCardClick(categories[0].id)}
                            />
                        </motion.div>
                    )}

                    {/* Div 3: Top Center (Col Span 3, Row Span 2) */}
                    {categories[1] && (
                        <motion.div
                            variants={{ hidden: { opacity: 0, y: 50 }, show: { opacity: 1, y: 0 } }}
                            className="md:col-span-3 md:row-span-2 md:col-start-2 md:row-start-1 min-h-[200px]"
                        >
                            <RecursoCard
                                title={categories[1].nombre}
                                icon={getCategoryIcon(categories[1].nombre)}
                                backgroundImage={getCategoryImage(categories[1].nombre)}
                                onClick={() => handleCardClick(categories[1].id)}
                            />
                        </motion.div>
                    )}

                    {/* Div 2: Center Middle (Search Input) */}
                    <motion.div
                        variants={{ hidden: { opacity: 0, y: 50 }, show: { opacity: 1, y: 0 } }}
                        className="md:col-span-3 md:col-start-2 md:row-start-3 min-h-[100px]"
                    >
                        <BuscadorFiltros />
                    </motion.div>

                    {/* Div 4: Bottom Center (Col Span 3, Row Span 2) */}
                    {categories[2] && (
                        <motion.div
                            variants={{ hidden: { opacity: 0, y: 50 }, show: { opacity: 1, y: 0 } }}
                            className="md:col-span-3 md:row-span-2 md:col-start-2 md:row-start-4 min-h-[200px]"
                        >
                            <RecursoCard
                                title={categories[2].nombre}
                                icon={getCategoryIcon(categories[2].nombre)}
                                backgroundImage={getCategoryImage(categories[2].nombre)}
                                onClick={() => handleCardClick(categories[2].id)}
                            />
                        </motion.div>
                    )}

                    {/* Div 5: Right Column (Row Span 5) */}
                    {categories[3] && (
                        <motion.div
                            variants={{ hidden: { opacity: 0, y: 50 }, show: { opacity: 1, y: 0 } }}
                            className="md:row-span-5 md:col-start-5 md:row-start-1 min-h-[200px]"
                        >
                            <RecursoCard
                                title={categories[3].nombre}
                                icon={getCategoryIcon(categories[3].nombre)}
                                large={true}
                                backgroundImage={getCategoryImage(categories[3].nombre)}
                                onClick={() => handleCardClick(categories[3].id)}
                            />
                        </motion.div>
                    )}
                </motion.div>
            </div>
        </>
    );
};

export default ListadoArticulosPage;