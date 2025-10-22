package com.ambrosia.ambrosia.models;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "opciones")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class Opcion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String texto;
    private Integer valor;

    @ManyToOne
    @JoinColumn(name = "pregunta_id")
    private Pregunta pregunta;
}
