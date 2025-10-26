import React, { useState, useEffect } from 'react';
import { ArrowLeft, Heart, Phone, Mail, MessageCircle, FileText, Download, ChevronDown, BookOpen, Video, Mic, Zap, Smile, Baby } from 'lucide-react';
import { getAllResources, getCategories, getResourcesByCategory, incrementDownloadCount } from '../services/resource.service';
import type { CategoriaRecursoDTO } from '../types/categoria.types';
import type { RecursoDTO } from '../types/recurso.types';

import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

interface ResourceItemCardProps {
    resource: RecursoDTO;
    handleDownload: (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>, resourceId: number, enlace: string) => void;
}

const categoryIconMap: Record<string, { icon: React.ElementType, color: string, bgColor: string }> = {
    'Artículos': { icon: FileText, color: 'text-blue-600', bgColor: 'bg-blue-50' },
    'Podcast': { icon: Mic, color: 'text-purple-600', bgColor: 'bg-purple-50' },
    'Videos': { icon: Video, color: 'text-red-600', bgColor: 'bg-red-50' },
    'Libros': { icon: BookOpen, color: 'text-yellow-600', bgColor: 'bg-yellow-50' },
    'Mitos y Realidades': { icon: Zap, color: 'text-indigo-600', bgColor: 'bg-indigo-50' },
    'Salud Mental': { icon: Smile, color: 'text-green-600', bgColor: 'bg-green-50' },
    'Desarrollo Infantil': { icon: Baby, color: 'text-pink-600', bgColor: 'bg-pink-50' },
    'Sin Categoría': { icon: FileText, color: 'text-gray-600', bgColor: 'bg-gray-50' }, // Default
};

const ResourceItemCard: React.FC<ResourceItemCardProps> = ({ resource, handleDownload }) => {
    const categoryName = resource.nombreCategoria || 'Sin Categoría';
    const { icon: Icon, color, bgColor } = categoryIconMap[categoryName] || categoryIconMap['Sin Categoría'];

    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-200 p-6 border border-gray-100"
        >
            <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 ${bgColor} rounded-lg flex items-center justify-center`}>
                    <Icon className={`w-6 h-6 ${color}`} />
                </div>
                <span className="bg-gray-100 text-gray-600 text-xs font-semibold px-2 py-1 rounded">
                    {categoryName}
                </span>
            </div>

            <h4 className="font-bold text-gray-800 mb-2 line-clamp-2">
                {resource.titulo}
            </h4>
            <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                {resource.descripcion}
            </p>

            <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                <span>{resource.size}</span>
                <span>{resource.downloads?.toLocaleString()} descargas</span>
            </div>

            <a href={resource.enlace} onClick={(e) => handleDownload(e, resource.id, resource.enlace)} target="_blank" rel="noopener noreferrer" className="w-full bg-emerald-500 text-white py-2.5 rounded-lg font-semibold hover:bg-emerald-600 transition-colors flex items-center justify-center gap-2">
                <Download className="w-4 h-4" />
                Descargar
            </a>
        </motion.div>
    );
};

export const ResourcesPage = () => {
    const navigate = useNavigate();

    const [activeTab, setActiveTab] = useState<number | null>(null);
    const [openFaq, setOpenFaq] = useState<number | null>(null);
    const [resources, setResources] = useState<RecursoDTO[]>([]);
    const [categories, setCategories] = useState<CategoriaRecursoDTO[]>([]);
    const [isLoading, setIsLoading] = useState(true); // Added isLoading state

    useEffect(() => {
        const fetchCategories = async () => {
            setIsLoading(true); // Set loading to true
            try {
                const fetchedCategories = await getCategories();
                console.log("Fetched categories:", fetchedCategories); // Add this
                setCategories(fetchedCategories);
                if (fetchedCategories.length > 0) {
                    // Find the "Artículos" category
                    setActiveTab(0); // Set to 0 for 'Todos' by default
                } else {
                    setActiveTab(0); // Ensure activeTab is 0 if no categories
                }
            } catch (error) {
                console.error("Error fetching categories:", error);
            } finally {
                setIsLoading(false); // Set loading to false after fetch
            }
        };
        fetchCategories();
    }, []);

    useEffect(() => {
        const fetchResources = async () => {
            setIsLoading(true); // Set loading to true
            try {
                if (activeTab === 0) {
                    const fetchedResources = await getAllResources();
                    setResources(fetchedResources);
                } else if (activeTab !== null) {
                    const fetchedResources = await getResourcesByCategory(activeTab);
                    setResources(fetchedResources);
                } else {
                    setResources([]);
                }
            } catch (error) {
                console.error("Error fetching resources:", error);
            } finally {
                setIsLoading(false); // Set loading to false after fetch
            }
        };
        fetchResources();
    }, [activeTab]);

    const handleDownload = async (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>, resourceId: number, enlace: string) => {
        event.preventDefault();
        try {
            await incrementDownloadCount(resourceId);
            window.open(enlace, '_blank');
        } catch (error) {
            console.error("Error incrementing download count:", error);
            // still open the link
            window.open(enlace, '_blank');
        }
    };

    const faqs = [
        {
            question: '¿Los servicios de la Línea 113 tienen costo?',
            answer: 'No. La Línea 113 es un servicio gratuito del Ministerio de Salud (MINSA) de Perú. Brinda orientación en salud mental sin costo alguno, las 24 horas del día.'
        },
        {
            question: '¿Dónde puedo encontrar más ayuda profesional?',
            answer: 'Además de la Línea 113, el MINSA cuenta con Centros de Salud Mental Comunitaria (CSMC) en todo el país. Puedes acudir al centro de salud más cercano para una evaluación y, si es necesario, ser derivado a un CSMC para atención especializada.'
        },
        {
            question: '¿Los grupos de apoyo son confidenciales?',
            answer: 'Absolutamente. Todos nuestros grupos mantienen estricta confidencialidad. Lo que se comparte en el grupo, se queda en el grupo.'
        },
        {
            question: '¿Puedo acceder a los recursos de forma anónima?',
            answer: 'Sí, puedes descargar y acceder a todos los recursos sin necesidad de crear una cuenta. Sin embargo, crear un perfil te permite hacer seguimiento de tu progreso.'
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
            {/* Header */}
            <motion.div 
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white"
            >
                <div className="max-w-7xl mx-auto px-4 py-8">
                    <button className="flex items-center gap-2 text-white hover:text-emerald-100 mb-6 transition-colors">
                        <ArrowLeft className="w-5 h-5" />
                        <span className="font-medium">Volver al inicio</span>
                    </button>

                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                            <Heart className="w-6 h-6 text-emerald-500 fill-emerald-500" />
                        </div>
                        <h1 className="text-xl font-semibold">Ambrosia</h1>
                    </div>

                    <h2 className="text-3xl font-bold mb-3">Centro de Recursos</h2>
                    <p className="text-emerald-100 max-w-3xl">
                        Aquí encontrarás una combinación de recursos verificados del sistema de salud pública peruano y herramientas exclusivas de Ambrosia, diseñadas por nuestros especialistas para apoyarte en tu proceso.
                    </p>
                </div>
            </motion.div>

            {/* Contact Options */}
            <div className="max-w-7xl mx-auto px-4 mt-8 mb-8">
                <motion.div 
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="grid md:grid-cols-2 gap-4"
                >
                    {/* Crisis Line Card */}
                    <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-red-100">
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center flex-shrink-0">
                                <Phone className="w-6 h-6 text-red-600" />
                            </div>
                            <div className="flex-1">
                                <h3 className="font-bold text-gray-800 mb-2">Línea de Ayuda en Salud Mental</h3>
                                <p className="text-sm text-gray-600 mb-4">
                                    Si estás en crisis o necesitas orientación, comunícate con la Línea 113 del Ministerio de Salud. Hay un especialista dispuesto a escucharte.
                                </p>
                                <div className="space-y-2">
                                    <a href="tel:113" className="flex items-center gap-2 text-red-600 hover:text-red-700 font-semibold">
                                        <Phone className="w-4 h-4" />
                                        <span>Marcar 113 (Opción 5)</span>
                                    </a>
                                    <a href="https://wa.me/51952842623" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-gray-600 hover:text-gray-800 text-sm">
                                        <MessageCircle className="w-4 h-4" />
                                        <span>WhatsApp: +51 952 842 623</span>
                                    </a>
                                    <a href="mailto:infosalud@minsa.gob.pe" className="flex items-center gap-2 text-gray-600 hover:text-gray-800 text-sm">
                                        <Mail className="w-4 h-4" />
                                        <span>infosalud@minsa.gob.pe</span>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Online Support Card */}
                    <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-green-100">
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center flex-shrink-0">
                                <MessageCircle className="w-6 h-6 text-green-600" />
                            </div>
                            <div className="flex-1">
                                <h3 className="font-bold text-gray-800 mb-2">Chatea por WhatsApp</h3>
                                <p className="text-sm text-gray-600 mb-4">
                                    Escribe a la Línea 113 del MINSA para recibir orientación por chat de forma confidencial.
                                </p>
                                <a
                                    href="https://wa.me/51952842623"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-full bg-green-500 text-white py-2.5 rounded-lg font-semibold hover:bg-green-600 transition-colors flex items-center justify-center gap-2"
                                >
                                    <MessageCircle className="w-5 h-5" />
                                    Iniciar Chat
                                </a>
                                <p className="text-xs text-gray-500 mt-2 text-center">
                                    Servicio disponible 24/7
                                </p>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 pb-12">
                {/* Tabs */}
                <motion.div 
                    initial={{ opacity: 0, x: -100 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="bg-white rounded-xl shadow-md mb-8 overflow-hidden"
                >
                    <div className="flex overflow-x-auto border-b border-gray-200">
                        <button
                            key={0} // Use 0 for 'Todos'
                            onClick={() => setActiveTab(0)}
                            className={`px-6 py-4 font-medium transition-colors whitespace-nowrap ${activeTab === 0
                                    ? 'border-b-2 border-emerald-500 text-emerald-600 bg-emerald-50'
                                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                                }`}
                        >
                            Todos
                        </button>
                        {categories.map((cat) => (
                            <button
                                key={cat.id}
                                onClick={() => setActiveTab(cat.id)}
                                className={`px-6 py-4 font-medium transition-colors whitespace-nowrap ${activeTab === cat.id
                                        ? 'border-b-2 border-emerald-500 text-emerald-600 bg-emerald-50'
                                        : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                                    }`}
                            >
                                {cat.nombre}
                            </button>
                        ))}
                    </div>
                </motion.div>

                {/* Resources Section */}
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
                    className="mb-12"
                >
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">
                        Guías y Herramientas de Ambrosia
                    </h3>
                    <p className="text-gray-600 mb-6">
                        Nuestro equipo de profesionales ha desarrollado las siguientes guías y herramientas para complementar tu camino hacia el bienestar.
                    </p>

                    {isLoading ? (
                        <div className="text-center col-span-full text-gray-500">Cargando recursos...</div>
                    ) : (
                        resources.length > 0 ? (
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {resources.map((resource, index) => (
                                    <ResourceItemCard key={index} resource={resource} handleDownload={handleDownload} />
                                ))}
                            </div>
                        ) : (
                            <p className="text-center col-span-full text-gray-500">No hay recursos disponibles en esta categoría en este momento.</p>
                        )
                    )}
                </motion.div>

                {/* FAQ Section */}
                <motion.div 
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                    className="mb-12"
                >
                    <h3 className="text-2xl font-bold text-gray-800 mb-6">
                        Preguntas Frecuentes
                    </h3>

                    <div className="space-y-3">
                        {faqs.map((faq, index) => (
                            <div
                                key={index}
                                className="bg-white rounded-xl shadow-md overflow-hidden"
                            >
                                <button
                                    onClick={() => setOpenFaq(openFaq === index ? null : index)}
                                    className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
                                >
                                    <span className="font-medium text-gray-800">{faq.question}</span>
                                    <ChevronDown
                                        className={`w-5 h-5 text-gray-400 transition-transform ${openFaq === index ? 'transform rotate-180' : ''
                                            }`}
                                    />
                                </button>
                                {openFaq === index && (
                                    <div className="px-6 pb-4 text-gray-600">
                                        {faq.answer}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* CTA Section */}
                <motion.div 
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.8 }}
                    className="bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl shadow-xl p-8 md:p-12 text-center text-white"
                >
                    <h3 className="text-2xl md:text-3xl font-bold mb-4">
                        ¿No encuentras lo que buscas?
                    </h3>
                    <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
                        Nuestro equipo está aquí para ayudarte a encontrar los recursos y el apoyo que necesitas.
                        Contáctanos y te guiaremos.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button 
                            onClick={() => navigate('/contacto')}
                            className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
                        >
                            Contactar Equipo de Apoyo
                        </button>
                        <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:bg-opacity-10 transition-colors">
                            Ver Más Recursos
                        </button>
                    </div>
                </motion.div>
            </div>
        </div>
    )
}