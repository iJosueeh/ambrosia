import axiosInstance from '../../../utils/axiosInstance';
import type { AdminProfileDTO } from '../types/settings.types';

export const fetchAdminProfile = async (): Promise<AdminProfileDTO> => {
    const response = await axiosInstance.get<AdminProfileDTO>('/api/v1/admin/profile');
    return response.data;
};

export const updateAdminProfile = async (profile: AdminProfileDTO): Promise<AdminProfileDTO> => {
    const response = await axiosInstance.put<AdminProfileDTO>('/api/v1/admin/profile', profile);
    return response.data;
};

export const updateAdminPreferences = async (): Promise<void> => {
    // Placeholder for future preference updates
    await axiosInstance.put('/api/v1/admin/preferences');
};
