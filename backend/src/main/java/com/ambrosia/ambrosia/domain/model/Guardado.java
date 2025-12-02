package com.ambrosia.ambrosia.domain.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "guardados", uniqueConstraints = {
        @UniqueConstraint(columnNames = { "usuario_id", "tipo", "item_id" })
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Guardado {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TipoContenido tipo;

    @Column(name = "item_id", nullable = false)
    private UUID itemId;

    @Column(name = "fecha_guardado", nullable = false)
    private LocalDateTime fechaGuardado;

    @PrePersist
    protected void onCreate() {
        fechaGuardado = LocalDateTime.now();
    }

    public enum TipoContenido {
        ARTICULO,
        RECURSO,
        TEST
    }
}
