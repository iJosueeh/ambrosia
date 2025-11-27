package com.ambrosia.ambrosia.domain.model;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "preguntas")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class Pregunta {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    private String texto;

    @ManyToOne
    @JoinColumn(name = "test_id")
    private TestEvaluacion test;

    @OneToMany(mappedBy = "pregunta", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Opcion> opciones;
}
