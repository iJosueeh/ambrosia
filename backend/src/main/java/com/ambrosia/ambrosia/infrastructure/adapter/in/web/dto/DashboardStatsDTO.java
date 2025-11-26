package com.ambrosia.ambrosia.infrastructure.adapter.in.web.dto;

public class DashboardStatsDTO {
    private long totalUsuarios;
    private long recursosPublicados;
    private long hilosActivos;
    private long nuevosRegistrosMes;

    // Getters y Setters
    public long getTotalUsuarios() { return totalUsuarios; }
    public void setTotalUsuarios(long totalUsuarios) { this.totalUsuarios = totalUsuarios; }
    public long getRecursosPublicados() { return recursosPublicados; }
    public void setRecursosPublicados(long recursosPublicados) { this.recursosPublicados = recursosPublicados; }
    public long getHilosActivos() { return hilosActivos; }
    public void setHilosActivos(long hilosActivos) { this.hilosActivos = hilosActivos; }
    public long getNuevosRegistrosMes() { return nuevosRegistrosMes; }
    public void setNuevosRegistrosMes(long nuevosRegistrosMes) { this.nuevosRegistrosMes = nuevosRegistrosMes; }
}
