package com.ambrosia.ambrosia.models.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProfesionalEstadisticasDTO {
    private int totalDownloads;
    private int publishedResources;
    private int uniqueUsers;
    private List<TrendDataDTO> downloadTrends;
    private List<ResourcePopularityDataDTO> resourcePopularity;
    private List<CategoryPerformanceDTO> resourceDistributionByCategory;
    private List<CategoryPerformanceDTO> downloadPerformanceByCategory;
}
