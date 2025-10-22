package com.ambrosia.ambrosia.models;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "administradores")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class Administrador {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Integer nivelAcceso;

    @OneToOne
    @JoinColumn(name = "usuario_id")
    private Usuario usuario;
}