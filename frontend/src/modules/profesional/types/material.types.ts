export interface Material {
    id: number;
    titulo: string;
    contenidoHtml: string;
    tipo: string;
    fechaCreacion: string; // Usar string para LocalDateTime del backend
    profesionalId: number;
    nombreProfesional: string;
    estado: string; // New field for material status
}
