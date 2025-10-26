export interface ActividadReciente {
    tipoActividad: 'REGISTRO' | 'TEST_COMPLETADO' | 'ARTICULO_LEIDO' | 'RECURSO_DESCARGADO';
    descripcion: string;
    fecha: string; // ISO date string
}

export interface ProgresoItem {
    label: string;
    current: number;
    total: number;
    percentage: number;
}

export interface Recomendacion {
    tipo: 'TEST' | 'ARTICULO' | 'RECURSO';
    title: string;
    description: string;
    link: string;
}

export interface UsuarioDTO {
    id: number;
    nombre: string;
    correo: string;
    rol: string;
    articulosLeidos: number;
    testsCompletados: number;
    recursosDescargados: number;
    diasActivo: number;
    actividadReciente: ActividadReciente[];
    progreso: ProgresoItem[];
    recomendaciones: Recomendacion[];
}
