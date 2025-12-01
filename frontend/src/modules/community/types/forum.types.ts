export interface ForumCategoryType {
    id: string;
    titulo: string;
    descripcion: string;
}

export interface ForumThreadType {
    id: string;
    titulo: string;
    descripcion: string;
    autor: {
        id: string;
        nombre: string;
    };
    fechaCreacion: string; // ISO date string
    categoriaForo: ForumCategoryType;
    status: string; // e.g., ACTIVE, CLOSED, REPORTED
    comentarios: CommentType[]; // Assuming comments are part of the thread when fetched
    commentCount?: number; // Contador de comentarios del backend
}

export interface CommentType {
    id: string;
    contenido: string;
    autor: {
        id: string;
        nombre: string;
    };
    fechaCreacion: string; // ISO date string
    status: string; // e.g., ACTIVE, HIDDEN, REPORTED
    foroId?: string; // Optional
    foroTitulo?: string; // Optional
    likesCount?: number; // Total de likes del comentario
}
