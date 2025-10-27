package com.ambrosia.ambrosia.models;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Table(name = "categorias_foro")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class CategoriaForo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String titulo;
    private String descripcion;

    @OneToMany(mappedBy = "categoriaForo", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Foro> foros;
}
