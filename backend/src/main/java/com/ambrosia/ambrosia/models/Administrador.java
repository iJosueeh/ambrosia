package com.ambrosia.ambrosia.models;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
// Excluimos las colecciones de la recursión de toString()
@ToString(exclude = {"recursosAprobados", "comentariosModerados", "usuario"})
@Table(name = "administradores")
public class Administrador {

    // 1. Campo para la Clave Primaria (PK)
    // El nombre debe coincidir con el tipo de la PK de Usuario (ej. Long)
    @Id
    private Long usuarioId;

    // 2. Relación de mapeo: indica que la PK de esta entidad (usuarioId)
    // es también una Clave Foránea a la entidad Usuario.
    @OneToOne
    @MapsId // <<--- ESTO ES CRÍTICO: Mapea la PK al campo de la FK
    @JoinColumn(name = "usuario_id") // El nombre de la columna en la tabla administradores
    private Usuario usuario;

    // 3. Campo de la Columna nivel_acceso
    @Column(name = "nivel_acceso")
    private Integer nivelAcceso;

    // 4. Colecciones de dependencias (Recursos y Comentarios)
    @OneToMany(mappedBy = "aprobador")
    private List<RecursoEducativo> recursosAprobados;

    @OneToMany(mappedBy = "moderador")
    private List<Comentario> comentariosModerados;
}