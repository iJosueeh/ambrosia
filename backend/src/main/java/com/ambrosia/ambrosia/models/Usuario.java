package com.ambrosia.ambrosia.models;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "usuarios")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nombre;
    @Column(unique = true)
    private String email;
    private String password;
    private LocalDateTime fecha_registro;

    @ManyToOne
    @JoinColumn(name = "rol_id")
    private Rol rol;

    public Long getId() {
        return this.id;
    }

    public String getNombre() {
        return this.nombre;
    }
}