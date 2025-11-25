package com.ambrosia.ambrosia.dtos;

import java.util.List;

public class AdminDashboardDTO {
    private DashboardStatsDTO stats;
    private UserGrowthDTO userGrowth;
    private List<RecentActivityDTO> recentActivity;

    // Getters y Setters
    public DashboardStatsDTO getStats() { return stats; }
    public void setStats(DashboardStatsDTO stats) { this.stats = stats; }
    public UserGrowthDTO getUserGrowth() { return userGrowth; }
    public void setUserGrowth(UserGrowthDTO userGrowth) { this.userGrowth = userGrowth; }
    public List<RecentActivityDTO> getRecentActivity() { return recentActivity; }
    public void setRecentActivity(List<RecentActivityDTO> recentActivity) { this.recentActivity = recentActivity; }
}
