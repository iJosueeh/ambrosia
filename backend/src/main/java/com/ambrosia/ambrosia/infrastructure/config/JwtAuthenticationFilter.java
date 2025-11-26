package com.ambrosia.ambrosia.infrastructure.config;

import com.ambrosia.ambrosia.application.service.MyUserDetails;
import com.ambrosia.ambrosia.application.service.UsuarioService;
import com.ambrosia.ambrosia.infrastructure.util.security.JwtUtil;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.UnsupportedJwtException;
import io.jsonwebtoken.security.SignatureException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.stereotype.Component;

import java.io.IOException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * Filtro que intercepta cada request para validar el token JWT.
 * Extrae el token del header Authorization, lo valida y establece la
 * autenticación en el SecurityContext.
 */
@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private static final Logger logger = LoggerFactory.getLogger(JwtAuthenticationFilter.class);

    private final JwtUtil jwtUtil;
    private final UsuarioService usuarioService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        // Rutas públicas - no requieren autenticación
        final String path = request.getServletPath();
        if (isPublicPath(path)) {
            filterChain.doFilter(request, response);
            return;
        }

        final String authorizationHeader = request.getHeader("Authorization");

        String username = null;
        String jwt = null;

        try {
            // Extraer token del header
            if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
                jwt = authorizationHeader.substring(7);
                username = jwtUtil.extractUsername(jwt);
                logger.debug("Token extraído para usuario: {}", username);
            }

            // Validar token y establecer autenticación
            if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                UserDetails userDetails = this.usuarioService.loadUserByUsername(username);

                if (jwtUtil.validateToken(jwt, userDetails)) {
                    logger.debug("Token válido para usuario: {} con roles: {}", username, userDetails.getAuthorities());

                    UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(
                            userDetails, null, userDetails.getAuthorities());

                    // Agregar detalles adicionales si es MyUserDetails
                    if (userDetails instanceof MyUserDetails
                            && ((MyUserDetails) userDetails).getProfesionalId() != null) {
                        authenticationToken.setDetails(((MyUserDetails) userDetails).getProfesionalId());
                    } else {
                        authenticationToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    }

                    SecurityContextHolder.getContext().setAuthentication(authenticationToken);
                    logger.debug("Autenticación establecida para: {}", username);
                } else {
                    logger.warn("Token inválido para usuario: {}", username);
                }
            }
        } catch (ExpiredJwtException e) {
            logger.warn("Token expirado: {}", e.getMessage());
            request.setAttribute("exception", e);
        } catch (MalformedJwtException e) {
            logger.warn("Token malformado: {}", e.getMessage());
            request.setAttribute("exception", e);
        } catch (SignatureException e) {
            logger.warn("Firma del token inválida: {}", e.getMessage());
            request.setAttribute("exception", e);
        } catch (UnsupportedJwtException e) {
            logger.warn("Token no soportado: {}", e.getMessage());
            request.setAttribute("exception", e);
        } catch (IllegalArgumentException e) {
            logger.warn("Token vacío o nulo: {}", e.getMessage());
            request.setAttribute("exception", e);
        } catch (Exception e) {
            logger.error("Error inesperado al procesar token JWT", e);
            request.setAttribute("exception", e);
        }

        filterChain.doFilter(request, response);
    }

    /**
     * Verifica si la ruta es pública y no requiere autenticación.
     */
    private boolean isPublicPath(String path) {
        return path.startsWith("/api/v1/auth/login") ||
                path.startsWith("/api/v1/usuarios/registrar") ||
                path.startsWith("/api/v1/tests") ||
                path.startsWith("/api/v1/recursos") ||
                path.startsWith("/api/resource-categories") ||
                path.startsWith("/api/resource-statuses") ||
                path.startsWith("/api/v1/contact");
    }
}
