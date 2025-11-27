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
    @JoinColumn(name = "categoria_id")
    private CategoriaRecurso categoria;

    @ManyToOne
    @JoinColumn(name = "estado_id")
    private EstadoPublicado estado;

    private LocalDateTime fechaPublicacion;

    @ManyToOne
    @JoinColumn(name = "creador_id", nullable = true)
    private Profesional creador;

    @ManyToOne
    @JoinColumn(name = "aprobador_id", nullable = true)
    private Usuario aprobador;
}