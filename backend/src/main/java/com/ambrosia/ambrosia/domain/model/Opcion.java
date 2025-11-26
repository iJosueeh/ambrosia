package com.ambrosia.ambrosia.domain.model;

import jakarta.persistence.*;
import lombok.*;

import java.util.UUID;

@Entity
@Table(name = "opciones")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class Opcion {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(columnDefinition = "BINARY(16)")
    private UUID id;

    private String texto;
    private Integer valor;

    @ManyToOne
    @JoinColumn(name = "pregunta_id", columnDefinition = "BINARY(16)")
    private Pregunta pregunta;
}
