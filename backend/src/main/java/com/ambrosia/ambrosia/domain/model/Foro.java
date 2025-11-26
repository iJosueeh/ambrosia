package com.ambrosia.ambrosia.domain.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "foros")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class Foro {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(columnDefinition = "BINARY(16)")
    private UUID id;

    private String titulo;
    private String descripcion;

    @ManyToOne
    @JoinColumn(name = "autor_id", columnDefinition = "BINARY(16)")
    private Usuario autor;

    private LocalDateTime fechaCreacion;

    @Builder.Default
    private String status = "ACTIVE";

    @ManyToOne
    @JoinColumn(name = "categoria_foro_id", columnDefinition = "BINARY(16)")
    private CategoriaForo categoriaForo;

    @OneToMany(mappedBy = "foro", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<Comentario> comentarios = new ArrayList<>();
}