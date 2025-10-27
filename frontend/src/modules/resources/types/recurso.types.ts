import type { ReactNode } from "react";

export interface RecursoDTO {
    size: ReactNode;
    downloads: any;
    id: number;
    titulo: string;
    descripcion: string;
    enlace: string;
    urlimg: string;
    contenido: string;
    fechaPublicacion: string; // ISO date string
    nombreCategoria: string;
    estado: string;
}
