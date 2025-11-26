package com.ambrosia.ambrosia.domain.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "comentarios")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class Comentario {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(columnDefinition = "BINARY(16)")
    private UUID id;

    private String contenido;
    private LocalDateTime fechaCreacion;

    @Builder.Default
    private String status = "ACTIVE";

    @ManyToOne
    @JoinColumn(name = "autor_id", columnDefinition = "BINARY(16)")
    private Usuario autor;

    @ManyToOne
    @JoinColumn(name = "foro_id", columnDefinition = "BINARY(16)")
    private Foro foro;

    @ManyToOne
    @JoinColumn(name = "moderador_id", columnDefinition = "BINARY(16)")
    private Usuario moderador;
}