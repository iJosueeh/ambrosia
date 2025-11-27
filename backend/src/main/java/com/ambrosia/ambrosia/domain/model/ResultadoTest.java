package com.ambrosia.ambrosia.domain.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "resultados_tests")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class ResultadoTest {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    private Integer puntaje;
    private Integer cantidadTestsRespondidos;
    private LocalDateTime fechaRealizacion;

    @ManyToOne
    @JoinColumn(name = "usuario_id")
    private Usuario usuario;

    @ManyToOne
    @JoinColumn(name = "test_id")
    private TestEvaluacion test;
}