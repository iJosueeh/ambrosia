package com.ambrosia.ambrosia.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "administradores")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class Administrador {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Integer nivelAcceso;

    @OneToOne
    @JoinColumn(name = "usuario_id")
    private Usuario usuario;
}