export interface Profesional {
    id: string;
    especialidad: string;
    descripcion: string;
    usuarioId: string;
    nombreUsuario: string;
    emailUsuario: string;
    habilidades: string[];
    telefono: string;
    ubicacion: string;
    profileImageUrl?: string | null;
}
