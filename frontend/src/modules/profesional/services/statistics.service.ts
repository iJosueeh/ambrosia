import axiosInstance from '../../../utils/axiosInstance';
import type { StatisticData } from '../types/statistics.types';

export const getStatistics = async (professionalId: number): Promise<StatisticData> => {
    try {
        const response = await axiosInstance.get(`/profesionales/${professionalId}/statistics`);
        return response.data;
    } catch (error) {
        console.error("Error fetching statistics:", error);
        throw error;
    }
};

export const exportStatisticsToExcel = async (professionalId: number): Promise<Blob> => {
    try {
        const response = await axiosInstance.get(`/profesionales/${professionalId}/statistics/export/excel`, {
            responseType: 'blob', // Important for downloading files
        });
        return response.data;
    } catch (error) {
        console.error("Error exporting statistics to Excel:", error);
        throw error;
    }
};
