import axiosInstance from '../../../utils/axiosInstance';
import type { ContactoDTO } from "../types/contact.types";

export const sendContactMessage = async (data: ContactoDTO): Promise<void> => {
    await axiosInstance.post('/contact', data);
};
