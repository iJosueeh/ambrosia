package com.ambrosia.ambrosia.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "profesionales")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class Profesional {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String especialidad;
    private String descripcion;

    @OneToOne
    @JoinColumn(name = "usuario_id")
    private Usuario usuario;
}
