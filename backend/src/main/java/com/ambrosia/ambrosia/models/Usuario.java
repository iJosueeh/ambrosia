package com.ambrosia.ambrosia.models;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.Collections;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "usuarios")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class Usuario implements UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nombre;
    @Column(unique = true)
    private String email;
    private String password;
    private LocalDateTime fecha_registro;
    private Integer testsCompletados = 0;
    private Integer articulosLeidos = 0;
    private Integer recursosDescargados = 0;

    @ManyToOne(fetch = FetchType.EAGER) // Cargar el rol eagerly para que esté disponible
    @JoinColumn(name = "rol_id", nullable = false)
    private Rol rol; // Relación con la nueva entidad Rol

    // Ya no necesitamos las relaciones OneToOne con Administrador y Profesional aquí
    // Esas entidades ahora pueden simplemente tener un Usuario al que se refieren

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        Set<GrantedAuthority> authorities = new HashSet<>();
        // El rol se deriva directamente del objeto Rol asociado
        if (this.rol != null) {
            authorities.add(new SimpleGrantedAuthority("ROLE_" + this.rol.getNombre()));
        }
        return authorities;
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public String getUsername() {
        return email;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}
