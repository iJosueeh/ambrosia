import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { listarTests, TestDTO } from '../services/test.service';
import { ClipboardList, ArrowRight, Brain, Heart, Activity } from 'lucide-react';

export const TestsDashboard = () => {
    const [tests, setTests] = useState<TestDTO[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchTests = async () => {
            try {
                const data = await listarTests();
                setTests(data);
            } catch (error) {
                console.error('Error al cargar tests:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchTests();
    }, []);

    // Helper para asignar iconos según el título del test
    const getTestIcon = (title: string) => {
        const t = title.toLowerCase();
        if (t.includes('ansiedad') || t.includes('estrés')) return <Brain className="w-8 h-8 text-purple-500" />;
        if (t.includes('depresión') || t.includes('ánimo')) return <Heart className="w-8 h-8 text-pink-500" />;
        if (t.includes('nutrición') || t.includes('alimentación')) return <Activity className="w-8 h-8 text-emerald-500" />;
        return <ClipboardList className="w-8 h-8 text-blue-500" />;
    };

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center bg-gray-50 text-emerald-600 font-semibold">Cargando evaluaciones...</div>;
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">Centro de Evaluaciones</h1>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Descubre más sobre tu bienestar con nuestras herramientas de autoevaluación.
                        Recuerda que estos tests son orientativos y no reemplazan un diagnóstico profesional.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {tests.map((test) => (
                        <div key={test.id} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 flex flex-col">
                            <div className="p-8 flex-1">
                                <div className="bg-gray-50 w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
                                    {getTestIcon(test.titulo)}
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-3">{test.titulo}</h3>
                                <p className="text-gray-600 leading-relaxed mb-6">
                                    {test.descripcion}
                                </p>
                                <div className="flex items-center gap-4 text-sm text-gray-500">
                                    <span className="flex items-center gap-1">
                                        <ClipboardList className="w-4 h-4" />
                                        {test.preguntas.length} preguntas
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <Activity className="w-4 h-4" />
                                        ~{Math.ceil(test.preguntas.length * 0.5)} min
                                    </span>
                                </div>
                            </div>
                            <div className="p-6 bg-gray-50 border-t border-gray-100">
                                <button
                                    onClick={() => navigate(`/quiz/${test.id}`)}
                                    className="w-full bg-white text-emerald-600 font-semibold py-3 px-6 rounded-xl border-2 border-emerald-600 hover:bg-emerald-50 transition-colors flex items-center justify-center gap-2 group"
                                >
                                    Comenzar Evaluación
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {tests.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-gray-500 text-lg">No hay evaluaciones disponibles en este momento.</p>
                    </div>
                )}
            </div>
        </div>
    );
};
