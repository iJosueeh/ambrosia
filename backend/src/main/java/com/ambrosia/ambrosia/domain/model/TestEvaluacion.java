package com.ambrosia.ambrosia.domain.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "tests_auto")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class TestEvaluacion {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    private String titulo;
    private String descripcion;
    private LocalDateTime fechaCreacion;

    @OneToMany(mappedBy = "test", cascade = CascadeType.ALL, orphanRemoval = true)
    private java.util.List<Pregunta> preguntas;
}
