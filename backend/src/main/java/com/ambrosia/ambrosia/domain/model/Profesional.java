package com.ambrosia.ambrosia.domain.model;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "profesionales")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class Profesional {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(columnDefinition = "BINARY(16)")
    private UUID id;

    private String especialidad;

    @Column(columnDefinition = "TEXT")
    private String descripcion;

    private String telefono;
    private String ubicacion;
    private String profileImageUrl;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "profesional_habilidades", joinColumns = @JoinColumn(name = "profesional_id", columnDefinition = "BINARY(16)"))
    @Column(name = "habilidad")
    private List<String> habilidades;

    @OneToOne
    @JoinColumn(name = "usuario_id", columnDefinition = "BINARY(16)")
    private Usuario usuario;
}
