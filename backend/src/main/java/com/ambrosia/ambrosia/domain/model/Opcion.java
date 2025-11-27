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
    private UUID id;

    private String texto;
    private Integer valor;

    @ManyToOne
    @JoinColumn(name = "pregunta_id")
    private Pregunta pregunta;
}
