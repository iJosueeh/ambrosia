package com.ambrosia.ambrosia.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "recursos_educativos")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class RecursoEducativo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String titulo;
    private String descripcion;
    private String enlace;
    private LocalDateTime fechaPublicacion;

    @ManyToOne
    @JoinColumn(name = "creador_id")
    private Profesional creador;

    @ManyToOne
    @JoinColumn(name = "aprobador_id")
    private Administrador aprobador;

    @ManyToOne
    @JoinColumn(name = "estado_id")
    private EstadoPublicado estado;

    @ManyToOne
    @JoinColumn(name = "categoria_id")
    private CategoriaRecurso categoria;
}