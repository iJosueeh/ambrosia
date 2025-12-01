package com.ambrosia.ambrosia.domain.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "comentario_likes", uniqueConstraints = @UniqueConstraint(columnNames = { "comentario_id",
        "usuario_id" }))
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class ComentarioLike {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "comentario_id", nullable = false)
    private Comentario comentario;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;

    @Column(name = "fecha_like", nullable = false)
    private LocalDateTime fechaLike;

    @PrePersist
    protected void onCreate() {
        if (fechaLike == null) {
            fechaLike = LocalDateTime.now();
        }
    }
}
