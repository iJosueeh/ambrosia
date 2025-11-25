export interface RecursoDTO {
    id?: number; // Make optional for creation
    titulo: string;
    descripcion: string;
    enlace?: string; // Make optional
    urlimg?: string; // Make optional
    contenido: string;
    size?: string; // Changed to string, make optional
    downloads?: number; // Changed to number, make optional
    fechaPublicacion?: string; // ISO date string, make optional
    nombreCategoria: string;
    estado: string;
    creadorId?: number; // Added
    nombreCreador?: string; // Added
}
