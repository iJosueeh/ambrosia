package com.ambrosia.ambrosia;

import com.ambrosia.ambrosia.models.Usuario;
import com.ambrosia.ambrosia.repository.ProfesionalRepository;
import com.ambrosia.ambrosia.repository.ResultadoRepository;
import com.ambrosia.ambrosia.repository.UsuarioRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.MOCK)
@AutoConfigureMockMvc
public class AuthIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private ResultadoRepository resultadoRepository; // Inyectar ResultadoRepository

    @Autowired
    private ProfesionalRepository profesionalRepository; // Inyectar ProfesionalRepository

    @Autowired
    private PasswordEncoder passwordEncoder;

    @AfterEach
    void tearDown() {
        profesionalRepository.deleteAll(); // Eliminar profesionales antes que usuarios
        resultadoRepository.deleteAll(); // Eliminar resultados primero
        usuarioRepository.deleteAll();
    }

    @Test
    void testUserRegistrationAndLogin() throws Exception {
        // Generar un email único para cada ejecución del test
        String uniqueEmail = "test.user." + System.currentTimeMillis() + "@example.com";

        // Step 1: Create and save a user directly
        Usuario user = new Usuario();
        user.setNombre("Test User");
        user.setEmail(uniqueEmail);
        user.setPassword(passwordEncoder.encode("Password123"));
        usuarioRepository.save(user);

        // Step 2: Log in with the new user
        String loginJson = "{\"correo\":\"" + uniqueEmail + "\",\"contrasena\":\"Password123\"}";

        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(loginJson))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").exists())
                .andExpect(jsonPath("$.correo").value(uniqueEmail));
    }
}



