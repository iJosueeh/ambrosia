package com.ambrosia.ambrosia.services;

import com.ambrosia.ambrosia.models.Usuario;
import lombok.Getter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.User;

import java.util.Collection;

@Getter
public class MyUserDetails extends User {

    private final Long id;
    private final Long profesionalId; // Custom field for professional ID

    public MyUserDetails(Usuario usuario, Collection<? extends GrantedAuthority> authorities, Long profesionalId) {
        super(usuario.getEmail(), usuario.getPassword(), authorities);
        this.id = usuario.getId();
        this.profesionalId = profesionalId;
    }
}
