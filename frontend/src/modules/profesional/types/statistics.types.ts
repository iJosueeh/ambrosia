export interface TrendData {
    date: string;
    count: number;
}

export interface ResourcePopularityData {
    resourceTitle: string;
    count: number;
}

export interface CategoryPerformanceData {
    categoryName: string;
    count: number;
}

export interface StatisticData {
    totalDownloads: number;
    publishedResources: number;
    uniqueUsers: number;
    downloadTrends: TrendData[];
    resourcePopularity: ResourcePopularityData[];
    resourceDistributionByCategory: CategoryPerformanceData[];
    downloadPerformanceByCategory: CategoryPerformanceData[];
}