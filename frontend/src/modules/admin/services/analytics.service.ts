import axiosInstance from '../../../utils/axiosInstance';

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
    const response = await axiosInstance.get<UsersGrowthData>(`/api/v1/admin/analytics/users-growth?lastDays=${lastDays}`);
    return response.data;
};

export const fetchResourcesStats = async (): Promise<ResourcesStats> => {
    const response = await axiosInstance.get<ResourcesStats>('/api/v1/admin/analytics/resources-stats');
    return response.data;
};

export const fetchForumStats = async (): Promise<ForumStats> => {
    const response = await axiosInstance.get<ForumStats>('/api/v1/admin/analytics/forum-stats');
    return response.data;
};

export const fetchAnalyticsSummary = async (): Promise<AnalyticsSummary> => {
    const response = await axiosInstance.get<AnalyticsSummary>('/api/v1/admin/analytics/summary');
    return response.data;
};
