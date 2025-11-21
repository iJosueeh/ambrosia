import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../shared/hooks/useAuth';
import { createRecurso, updateRecurso, getRecursoById, getRecursoStatuses } from '../../resources/services/resource.service'; // Use resource service
import { getCategories } from '../../resources/services/resource.service';
import type { CategoriaRecursoDTO } from '../../resources/types/categoria.types';
import type { RecursoDTO } from '../../resources/types/recurso.types'; // Use RecursoDTO
import { uploadFile } from '../services/file.service';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css'; // Import Quill styles
import toast from 'react-hot-toast';

const RecursoEditor: React.FC = () => { // Renamed component
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { user } = useAuth();
    const quillRef = useRef<ReactQuill>(null);
    
    const [recursoData, setRecursoData] = useState<RecursoDTO>({ // Change to RecursoDTO
        id: undefined,
        titulo: '',
        descripcion: '',
        enlace: '',
        urlimg: '',
        contenido: '',
        size: '',
        downloads: 0,
        fechaPublicacion: undefined,
        nombreCategoria: '',
        estado: 'BORRADOR', // Default state
    });
    const [categories, setCategories] = useState<CategoriaRecursoDTO[]>([]);
    const [statuses, setStatuses] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const isEditing = id !== undefined;

    // Custom image handler
    const imageHandler = () => {
        const input = document.createElement('input');
        input.setAttribute('type', 'file');
        input.setAttribute('accept', 'image/png, image/jpeg, image/gif');
        input.click();

        input.onchange = async () => {
            if (input.files && input.files.length > 0) {
                const file = input.files[0];

                // Client-side validation
                const allowedTypes = ['image/png', 'image/jpeg', 'image/gif'];
                if (!allowedTypes.includes(file.type)) {
                    toast.error('Tipo de archivo no permitido. Solo se aceptan PNG, JPEG o GIF.');
                    return;
                }
                const maxSizeInBytes = 2 * 1024 * 1024; // 2MB
                if (file.size > maxSizeInBytes) {
                    toast.error('El archivo es demasiado grande. El tamaño máximo es de 2MB.');
                    return;
                }

                const toastId = toast.loading('Subiendo imagen...');
                try {
                    const uploadData = await uploadFile(file);
                    const quill = quillRef.current?.getEditor();
                    if (quill) {
                        const range = quill.getSelection(true);
                        quill.insertEmbed(range.index, 'image', uploadData.url);
                    }
                    toast.success('Imagen subida con éxito!', { id: toastId });
                } catch (err) {
                    console.error("Error al subir imagen:", err);
                    toast.error('Error al subir la imagen.', { id: toastId });
                }
            }
        };
    };

    const modules = {
        toolbar: {
            container: [
                [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
                ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
                ['link', 'image', 'video'],
                ['clean']
            ],
            handlers: {
                image: imageHandler,
            },
        },
    };

    useEffect(() => {
        const fetchDropdownData = async () => {
            try {
                const [categoriesData, fetchedAllStatusesData] = await Promise.all([
                    getCategories(),
                    getRecursoStatuses(),
                ]);
                setCategories(categoriesData);
                const allStatusNames = fetchedAllStatusesData.map(s => s.nombre);

                // Set initial statuses for the dropdown
                if (!isEditing) {
                    setStatuses(allStatusNames.filter(status => status !== 'PUBLICADO'));
                }
                // If editing, the statuses will be set after getRecursoById resolves

                if (categoriesData.length > 0 && !recursoData.nombreCategoria) {
                    setRecursoData(prev => ({ ...prev, nombreCategoria: categoriesData[0].nombre }));
                }
            } catch (err) {
                console.error("Error al cargar datos para los desplegables:", err);
                setError("No se pudieron cargar las opciones de tipo y estado.");
            }
        };

        fetchDropdownData();

        if (isEditing) {
            setLoading(true);
            getRecursoById(parseInt(id, 10))
                .then(data => {
                    setRecursoData({
                        ...data,
                        contenido: data.contenido || '',
                        estado: data.estado || 'BORRADOR',
                        nombreCategoria: data.nombreCategoria || (categories.length > 0 ? categories[0].nombre : ''),
                    });
                    // After loading resource data, update statuses for dropdown
                    if (data.estado === 'PUBLICADO') {
                        setStatuses(['PUBLICADO']); // Only 'PUBLICADO' if it's published
                    } else {
                        // If not published, show 'BORRADOR' and 'REVISION'
                        // Re-fetch all statuses to filter out 'PUBLICADO'
                        getRecursoStatuses().then(allStatuses => {
                            setStatuses(allStatuses.map(s => s.nombre).filter(status => status !== 'PUBLICADO'));
                        });
                    }
                })
                .catch(err => {
                    console.error("Error al cargar el recurso:", err);
                    setError("No se pudo cargar el recurso para editar.");
                })
                .finally(() => setLoading(false));
        }
    }, [id, isEditing]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setRecursoData(prev => ({ ...prev, [name]: value }));
    };

    const handleContentChange = (content: string) => {
        setRecursoData(prev => ({ ...prev, contenido: content }));
    };

    const handleSave = async () => {
        if (!user || !user.id) {
            setError("Usuario no autenticado.");
            return;
        }
        setLoading(true);
        try {
            const dataToSave: RecursoDTO = { 
                ...recursoData, 
                creadorId: user.id,
                // Ensure required fields are present for the backend
                nombreCategoria: recursoData.nombreCategoria || (categories.length > 0 ? categories[0].nombre : ''),
                estado: recursoData.estado || 'BORRADOR',
                contenido: recursoData.contenido || '',
                titulo: recursoData.titulo || '',
                descripcion: recursoData.descripcion || '',
            };
            if (isEditing) {
                await updateRecurso(parseInt(id!, 10), dataToSave); // Use new service method
                toast.success("Recurso actualizado con éxito!");
            } else {
                await createRecurso(dataToSave); // Use new service method
                toast.success("Recurso creado con éxito!");
            }
            navigate('/profesional/recursos'); // Navigate back to the list
        } catch (err) {
            console.error("Error al guardar el recurso:", err);
            setError("Ocurrió un error al guardar el recurso.");
        } finally {
            setLoading(false);
        }
    };

    if (loading && isEditing) return <div className="text-center py-8">Cargando editor...</div>;
    if (error) return <div className="text-center py-8 text-red-600">{error}</div>;

    return (
        <div className="px-4 py-8 md:px-8 bg-gray-50 min-h-screen">
            <header className="max-w-7xl mx-auto mb-8">
                <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
                        <span className="bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent">
                            {isEditing ? 'Editar Recurso' : 'Crear Nuevo Recurso'}
                        </span>
                    </h1>
                    <div className="flex gap-4 self-end md:self-auto">
                        <button onClick={() => navigate('/profesional/recursos')} className="bg-gray-200 text-gray-800 px-5 py-2.5 rounded-lg font-semibold hover:bg-gray-300 transition-colors">
                            Cancelar
                        </button>
                        <button onClick={handleSave} disabled={loading} className="bg-green-600 text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-green-700 disabled:bg-green-400 transition-colors">
                            {loading ? 'Guardando...' : 'Guardar Cambios'}
                        </button>
                    </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Editor Column */}
                <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
                    <div className="space-y-6">
                        <div>
                            <label htmlFor="titulo" className="block text-sm font-semibold text-gray-800 mb-2">Título del Recurso</label>
                            <input
                                id="titulo"
                                name="titulo"
                                type="text"
                                value={recursoData.titulo}
                                onChange={handleInputChange}
                                maxLength={255}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-shadow"
                            />
                            <span className="text-sm text-gray-500 mt-1 block text-right">
                                {recursoData.titulo.length}/255 caracteres
                            </span>
                        </div>
                        <div>
                            <label htmlFor="descripcion" className="block text-sm font-semibold text-gray-800 mb-2">Descripción</label>
                            <textarea
                                id="descripcion"
                                name="descripcion"
                                value={recursoData.descripcion}
                                onChange={handleInputChange}
                                maxLength={500}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-shadow h-24"
                            ></textarea>
                            <span className="text-sm text-gray-500 mt-1 block text-right">
                                {recursoData.descripcion.length}/500 caracteres
                            </span>
                        </div>
                        <div>
                            <label htmlFor="enlace" className="block text-sm font-semibold text-gray-800 mb-2">Enlace (URL)</label>
                            <input
                                id="enlace"
                                name="enlace"
                                type="text"
                                value={recursoData.enlace || ''}
                                onChange={handleInputChange}
                                maxLength={2048}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-shadow"
                            />
                        </div>
                        <div>
                            <label htmlFor="urlimg" className="block text-sm font-semibold text-gray-800 mb-2">URL de Imagen (Miniatura)</label>
                            <input
                                id="urlimg"
                                name="urlimg"
                                type="text"
                                value={recursoData.urlimg || ''}
                                onChange={handleInputChange}
                                maxLength={2048}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-shadow"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="nombreCategoria" className="block text-sm font-semibold text-gray-800 mb-2">Categoría</label>
                                <select
                                    id="nombreCategoria"
                                    name="nombreCategoria"
                                    value={recursoData.nombreCategoria}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-shadow"
                                >
                                    {categories.map(category => (
                                        <option key={category.id} value={category.nombre}>{category.nombre}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label htmlFor="estado" className="block text-sm font-semibold text-gray-800 mb-2">Estado</label>
                                <select
                                    id="estado"
                                    name="estado"
                                    value={recursoData.estado}
                                    onChange={handleInputChange}
                                    disabled={recursoData.estado === 'PUBLICADO'}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-shadow"
                                >
                                    {statuses.map(status => (
                                        <option key={status} value={status}>{status}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-800 mb-2">Contenido</label>
                            <div className="h-96 pb-10">
                                <ReactQuill 
                                    ref={quillRef}
                                    theme="snow" 
                                    value={recursoData.contenido} // Use contenido
                                    onChange={handleContentChange}
                                    modules={modules}
                                    className="h-full bg-white"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Preview Column */}
                <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b pb-3">Vista Previa</h2>
                    {recursoData.contenido ? (
                        <div 
                            className="prose prose-lg max-w-none mt-6"
                            dangerouslySetInnerHTML={{ __html: recursoData.contenido }}
                        />
                    ) : (
                        <div className="flex items-center justify-center h-full text-gray-500">
                            <p>El contenido aparecerá aquí a medida que escribes.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default RecursoEditor;
