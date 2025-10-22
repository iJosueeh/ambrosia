package com.ambrosia.ambrosia.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "opciones")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
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
