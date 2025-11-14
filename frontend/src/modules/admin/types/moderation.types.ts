export interface ForumAdminDTO {
    id: number;
    titulo: string;
    autorNombre: string;
    categoriaForoNombre: string;
    fechaCreacion: string; // ISO date string
    status: string; // e.g., ACTIVE, CLOSED, HIDDEN, REPORTED
    commentCount: number;
}

export interface CommentAdminDTO {
    id: number;
    contenido: string;
    autorNombre: string;
    foroId: number;
    foroTitulo: string;
    fechaCreacion: string; // ISO date string
    status: string; // e.g., ACTIVE, HIDDEN, REPORTED
}

export interface PaginatedForumsResponse {
    content: ForumAdminDTO[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number; // current page number (0-indexed)
}

export interface PaginatedCommentsResponse {
    content: CommentAdminDTO[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number; // current page number (0-indexed)
}
