package com.ambrosia.ambrosia.dtos;

import java.time.LocalDateTime;

public class RecentActivityDTO {
    private String tipo; // "USUARIO", "RECURSO", "FORO"
    private String descripcion;
    private LocalDateTime fecha;

    public RecentActivityDTO(String tipo, String descripcion, LocalDateTime fecha) {
        this.tipo = tipo;
        this.descripcion = descripcion;
        this.fecha = fecha;
    }

    // Getters y Setters
    public String getTipo() { return tipo; }
    public void setTipo(String tipo) { this.tipo = tipo; }
    public String getDescripcion() { return descripcion; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }
    public LocalDateTime getFecha() { return fecha; }
    public void setFecha(LocalDateTime fecha) { this.fecha = fecha; }
}
