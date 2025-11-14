export interface ForumCategoryType {
    id: number;
    titulo: string;
    descripcion: string;
}

export interface ForumThreadType {
    id: number;
    titulo: string;
    descripcion: string;
    autor: {
        id: number;
        nombre: string;
    };
    fechaCreacion: string; // ISO date string
    categoriaForo: ForumCategoryType;
    status: string; // e.g., ACTIVE, CLOSED, REPORTED
    comentarios: CommentType[]; // Assuming comments are part of the thread when fetched
}

export interface CommentType {
    id: number;
    contenido: string;
    autor: {
        id: number;
        nombre: string;
    };
    fechaCreacion: string; // ISO date string
    status: string; // e.g., ACTIVE, HIDDEN, REPORTED
}
