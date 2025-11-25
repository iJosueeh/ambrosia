package com.ambrosia.ambrosia.models;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

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
    private String descripcion;

    @ManyToOne
    @JoinColumn(name = "autor_id")
    private Usuario autor;

    private LocalDateTime fechaCreacion;

    @Builder.Default
    private String status = "ACTIVE"; // e.g., ACTIVE, CLOSED, HIDDEN, REPORTED

    @ManyToOne
    @JoinColumn(name = "categoria_foro_id")
    private CategoriaForo categoriaForo;

    @OneToMany(mappedBy = "foro", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<Comentario> comentarios = new ArrayList<>();
}