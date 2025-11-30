import axiosInstance from '../../../utils/axiosInstance';

const API_URL = '/tests';

export interface Opcion {
    id: string;
    texto: string;
    valor: number;
}

export interface Pregunta {
    id: string;
    texto: string;
    opciones: Opcion[];
}

export interface TestDTO {
    id: string;
    titulo: string;
    descripcion: string;
    preguntas: Pregunta[];
}

export interface ResultadoDTO {
    usuarioId: string;
    testId: string;
    respuestas: {
        preguntaId: string;
        opcionId: string;
    }[];
    puntajeTotal: number;
}

export const listarTests = async (): Promise<TestDTO[]> => {
    const response = await axiosInstance.get<TestDTO[]>(API_URL);
    return response.data;
};

export const getTestById = async (id: string): Promise<TestDTO> => {
    try {
        const response = await axiosInstance.get<TestDTO>(`${API_URL}/${id}`);
        return response.data;
    } catch (error) {
        // Fallback: obtener todos y filtrar (si el backend no tiene endpoint por ID)
        const allTests = await listarTests();
        const test = allTests.find(t => t.id === id);
        if (!test) throw new Error('Test no encontrado');
        return test;
    }
};

export const guardarResultado = async (resultado: ResultadoDTO): Promise<void> => {
    await axiosInstance.post(`${API_URL}/resultado`, resultado);
};