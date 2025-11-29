package com.ambrosia.ambrosia.domain.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "recursos_leidos", uniqueConstraints = {
        @UniqueConstraint(columnNames = { "usuario_id", "recurso_id" })
})
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class RecursoLeido {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;

    @ManyToOne
    @JoinColumn(name = "recurso_id", nullable = false)
    private RecursoEducativo recurso;

    @Column(name = "fecha_lectura", nullable = false)
    private LocalDateTime fechaLectura;

    @Column(name = "tiempo_lectura_segundos")
    private Integer tiempoLecturaSegundos;

    @PrePersist
    protected void onCreate() {
        if (fechaLectura == null) {
            fechaLectura = LocalDateTime.now();
        }
    }
}
