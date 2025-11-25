import axiosInstance from '../../../utils/axiosInstance';
import type { AdminDashboardData } from '../types/dashboard.types';

export interface UsersGrowthData {
    [date: string]: number; // e.g., { "2023-10-26": 10, "2023-10-27": 15 }
}

export interface ResourcesStats {
    totalResources: number;
    // Add more specific resource stats if needed
}

export interface ForumStats {
    totalTopics: number;
    totalComments: number;
    // Add more specific forum stats if needed
}

export interface AnalyticsSummary {
    totalUsers: number;
    totalResources: number;
    totalTopics: number;
    totalComments: number;
    // Add more summary stats
}

export const fetchUsersGrowth = async (lastDays: number = 7): Promise<UsersGrowthData> => {
    const response = await axiosInstance.get<UsersGrowthData>(`/admin/analytics/users-growth?lastDays=${lastDays}`);
    return response.data;
};

export const fetchResourcesStats = async (): Promise<ResourcesStats> => {
    const response = await axiosInstance.get<ResourcesStats>('/admin/analytics/resources-stats');
    return response.data;
};

export const fetchForumStats = async (): Promise<ForumStats> => {
    const response = await axiosInstance.get<ForumStats>('/admin/analytics/forum-stats');
    return response.data;
};

export const fetchAnalyticsSummary = async (): Promise<AnalyticsSummary> => {
    const response = await axiosInstance.get<AnalyticsSummary>('/admin/analytics/summary');
    return response.data;
};

export const getAdminDashboardData = async (): Promise<AdminDashboardData> => {
    const response = await axiosInstance.get<AdminDashboardData>('/admin/dashboard/data');
    return response.data;
};
