package com.ambrosia.ambrosia.models;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "comentarios")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class Comentario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String contenido;
    private LocalDateTime fechaCreacion;
    private String status = "ACTIVE"; // e.g., ACTIVE, HIDDEN, REPORTED

    @ManyToOne
    @JoinColumn(name = "autor_id")
    private Usuario autor;

    @ManyToOne
    @JoinColumn(name = "foro_id")
    private Foro foro;

    @ManyToOne
    @JoinColumn(name = "moderador_id")
    private Administrador moderador;

}