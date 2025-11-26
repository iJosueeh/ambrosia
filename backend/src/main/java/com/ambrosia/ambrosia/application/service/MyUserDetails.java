package com.ambrosia.ambrosia.application.service;

import com.ambrosia.ambrosia.domain.model.Usuario;
import lombok.Getter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.User;

import java.util.Collection;
import java.util.UUID;

@Getter
public class MyUserDetails extends User {

    private final UUID id;
    private final UUID profesionalId; // Custom field for professional ID

    public MyUserDetails(Usuario usuario, Collection<? extends GrantedAuthority> authorities, UUID profesionalId) {
        super(usuario.getEmail(), usuario.getPassword(), authorities);
        this.id = usuario.getId();
        this.profesionalId = profesionalId;
    }
}
