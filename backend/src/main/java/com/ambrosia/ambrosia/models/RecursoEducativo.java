package com.ambrosia.ambrosia.models;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "recursos_educativos")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class RecursoEducativo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String titulo;
    private String descripcion;
    private String enlace;
    private String urlimg;
    @Column(columnDefinition = "TEXT") // Use this for explicit PostgreSQL TEXT type
    private String contenido;
    private String size;
    private Long downloads;
    private LocalDateTime fechaPublicacion;

    @ManyToOne
    @JoinColumn(name = "creador_id", nullable = true)
    private Profesional creador;

    @ManyToOne
    @JoinColumn(name = "aprobador_id", nullable = true)
    private Administrador aprobador;

    @ManyToOne
    @JoinColumn(name = "estado_id")
    private EstadoPublicado estado;

    @ManyToOne
    @JoinColumn(name = "categoria_id")
    private CategoriaRecurso categoria;
}