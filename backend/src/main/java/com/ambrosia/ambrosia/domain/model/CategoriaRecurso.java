package com.ambrosia.ambrosia.domain.model;

import jakarta.persistence.*;
import lombok.*;

import java.util.UUID;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
@Table(name = "categorias_recurso")
public class CategoriaRecurso {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, unique = true)
    private String nombre;

    private String descripcion;

    /**
     * Nombre del icono de Lucide React (ej: "Heart", "Apple", "BookOpen")
     */
    @Column(length = 50)
    private String icono;

    /**
     * Color hexadecimal para la categoría (ej: "#10b981", "#ec4899")
     */
    @Column(length = 20)
    private String color;
}
