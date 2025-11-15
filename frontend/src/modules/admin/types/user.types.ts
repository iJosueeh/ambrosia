export interface AdminUser {
  id: number;
  nombre: string;
  correo: string;
  rol: 'ADMIN' | 'USER';
  fechaRegistro: string; // ISO date string
}

export interface PaginatedUsersResponse {
    content: AdminUser[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number; // current page number (0-indexed)
}

