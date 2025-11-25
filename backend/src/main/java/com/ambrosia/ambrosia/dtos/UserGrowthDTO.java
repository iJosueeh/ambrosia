package com.ambrosia.ambrosia.dtos;

import java.util.List;

public class UserGrowthDTO {
    private List<String> labels; // Ej: ["Ene", "Feb", "Mar", ...]
    private List<Long> data;     // Ej: [10, 15, 25, ...]

    // Getters y Setters
    public List<String> getLabels() { return labels; }
    public void setLabels(List<String> labels) { this.labels = labels; }
    public List<Long> getData() { return data; }
    public void setData(List<Long> data) { this.data = data; }
}
