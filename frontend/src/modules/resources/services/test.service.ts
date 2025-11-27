import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

export interface Opcion {
    id: number;
    texto: string;
}

export interface Pregunta {
    id: number;
    texto: string;
    opciones: Opcion[];
}

export interface TestDTO {
    id: number;
    titulo: string;
    descripcion: string;
    preguntas: Pregunta[];
}

export interface ResultadoDTO {
    usuarioId: string;
    testId: number;
    respuestas: {
        preguntaId: number;
        opcionId: number;
    }[];
    puntajeTotal: number;
}

export const listarTests = async (): Promise<TestDTO[]> => {
    const response = await axios.get(`${API_URL}/tests`);
    return response.data;
};

export const guardarResultado = async (resultado: ResultadoDTO): Promise<void> => {
    await axios.post(`${API_URL}/tests/resultado`, resultado);
};