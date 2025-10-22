package com.ambrosia.ambrosia.models;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "resultados_tests")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class ResultadoTest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Integer puntaje;
    private LocalDateTime fechaRealizacion;

    @ManyToOne
    @JoinColumn(name = "usuario_id")
    private Usuario usuario;

    @ManyToOne
    @JoinColumn(name = "test_id")
    private TestEvaluacion test;
}