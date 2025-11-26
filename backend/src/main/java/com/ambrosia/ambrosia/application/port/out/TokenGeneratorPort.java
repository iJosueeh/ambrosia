package com.ambrosia.ambrosia.application.port.out;

import com.ambrosia.ambrosia.domain.model.Usuario;

public interface TokenGeneratorPort {
    String generarToken(Usuario usuario);

    String extraerEmail(String token);

    boolean validarToken(String token);
}
