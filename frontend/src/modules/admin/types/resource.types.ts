export interface ResourceAdminDTO {
  id: number;
  titulo: string;
  categoriaNombre: string;
  estadoNombre: string;
  fechaPublicacion: string; // ISO date string
  creadorNombre: string;
}

export interface ResourceUpdateDTO {
  titulo: string;
  descripcion: string;
  enlace: string;
  urlimg: string;
  contenido: string;
  categoriaId: number;
  estadoId: number;
}

export interface ResourceCategory {
    id: number;
    nombre: string;
}

export interface ResourceStatus {
    id: number;
    nombre: string;
}

export interface PaginatedAdminResources {
    content: ResourceAdminDTO[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number; // current page number (0-indexed)
}
