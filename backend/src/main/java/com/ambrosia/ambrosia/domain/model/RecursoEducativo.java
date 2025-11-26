package com.ambrosia.ambrosia.domain.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "recursos_educativos")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class RecursoEducativo {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(columnDefinition = "BINARY(16)")
    private UUID id;

    @Column(columnDefinition = "TEXT")
    private String titulo;

    @Column(columnDefinition = "TEXT")
    private String descripcion;

    @Column(columnDefinition = "TEXT")
    private String enlace;

    @Column(columnDefinition = "TEXT")
    private String urlimg;

    @Column(columnDefinition = "TEXT")
    private String contenido;

    private String size;
    private Long downloads;

    @ManyToOne
    @JoinColumn(name = "categoria_id", columnDefinition = "BINARY(16)")
    private CategoriaRecurso categoria;

    @ManyToOne
    @JoinColumn(name = "estado_id", columnDefinition = "BINARY(16)")
    private EstadoPublicado estado;

    private LocalDateTime fechaPublicacion;

    @ManyToOne
    @JoinColumn(name = "creador_id", nullable = true, columnDefinition = "BINARY(16)")
    private Profesional creador;

    @ManyToOne
    @JoinColumn(name = "aprobador_id", nullable = true, columnDefinition = "BINARY(16)")
    private Usuario aprobador;
}