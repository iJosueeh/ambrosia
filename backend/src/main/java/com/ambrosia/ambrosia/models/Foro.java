package com.ambrosia.ambrosia.models;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "foros")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class Foro {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String titulo;
    private String contenido;
    private LocalDateTime fechaCreacion;

    @ManyToOne
    @JoinColumn(name = "autor_id")
    private Usuario autor;

    @ManyToOne
    @JoinColumn(name = "aprobador_id")
    private Administrador aprobador;

    @ManyToOne
    @JoinColumn(name = "estado_id")
    private EstadoPublicado estado;

    @OneToMany(mappedBy = "foro", cascade = CascadeType.ALL, orphanRemoval = true)
    private java.util.List<Comentario> comentarios;
}