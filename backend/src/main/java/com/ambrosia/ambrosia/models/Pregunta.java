package com.ambrosia.ambrosia.models;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "preguntas")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class Pregunta {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String texto;

    @ManyToOne
    @JoinColumn(name = "test_id")
    private TestEvaluacion test;

    @OneToMany(mappedBy = "pregunta", cascade = CascadeType.ALL, orphanRemoval = true)
    private java.util.List<Opcion> opciones;

}
