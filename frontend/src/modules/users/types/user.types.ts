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

// DTO que coincide con UsuarioDashboardDTO del backend
export interface UsuarioDTO {
    nombre: string;
    correo: string;
    fechaRegistro: string; // ISO date string
    diasActivo: number;
    articulosLeidos: number;
    testsCompletados: number;
    recursosDescargados: number;
    progreso: ProgresoItem[];
    actividadReciente: ActividadReciente[];
    recomendaciones: Recomendacion[];
}
