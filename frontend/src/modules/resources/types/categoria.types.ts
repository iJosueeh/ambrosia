export interface CategoriaRecursoDTO {
    id: string; // UUID from backend
    nombre: string;
    descripcion: string;
    icono?: string; // Nombre del icono de Lucide React
    color?: string; // Color hexadecimal
}
