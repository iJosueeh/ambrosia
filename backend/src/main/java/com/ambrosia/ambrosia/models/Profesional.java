package com.ambrosia.ambrosia.models;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Table(name = "profesionales")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class Profesional {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String especialidad;
    @Column(columnDefinition = "TEXT")
    private String descripcion;
    private String telefono;
    private String ubicacion;
    private String profileImageUrl;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "profesional_habilidades", joinColumns = @JoinColumn(name = "profesional_id"))
    @Column(name = "habilidad")
    private List<String> habilidades;

    @OneToOne
    @JoinColumn(name = "usuario_id")
    private Usuario usuario;
}
