package com.ambrosia.ambrosia;

import com.ambrosia.ambrosia.domain.model.Usuario;
import com.ambrosia.ambrosia.domain.repository.ProfesionalRepositoryPort;
import com.ambrosia.ambrosia.domain.repository.ResultadoTestRepositoryPort;
import com.ambrosia.ambrosia.domain.repository.RolRepositoryPort;
import com.ambrosia.ambrosia.domain.repository.UsuarioRepositoryPort;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.MOCK, properties = {
        "spring.datasource.url=jdbc:h2:mem:testdb",
        "spring.datasource.driverClassName=org.h2.Driver",
        "spring.datasource.username=sa",
        "spring.datasource.password=",
        "spring.jpa.database-platform=org.hibernate.dialect.H2Dialect",
        "jwt.secret=aVeryLongAndSecureSecretKeyForTestingJWTpurposes",
        "jwt.expiration.ms=3600000",
        "file.upload-dir=uploads",
        "supabase.url=http://localhost:8000",
        "supabase.key=dummy-key",
        "supabase.service-role-key=dummy-service-role-key"
})
@AutoConfigureMockMvc
@ComponentScan(basePackages = "com.ambrosia.ambrosia")
@DirtiesContext(classMode = DirtiesContext.ClassMode.AFTER_EACH_TEST_METHOD)
public class AuthIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private UsuarioRepositoryPort usuarioRepository;

    @Autowired
    private ResultadoTestRepositoryPort resultadoTestRepository;

    @Autowired
    private ProfesionalRepositoryPort profesionalRepository;

    @Autowired
    private RolRepositoryPort rolRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Test
    void testUserRegistrationAndLogin() throws Exception {
        // Step 1: Create and save a user directly
        // Ensure "USER" role exists before trying to assign it
        rolRepository.findByNombre("USER").orElseGet(() -> {
            return rolRepository.save(com.ambrosia.ambrosia.domain.model.Rol.builder().nombre("USER").build());
        });

        String uniqueEmail = "test.user." + System.currentTimeMillis() + "@example.com";

        Usuario user = new Usuario();
        user.setNombre("Test User");
        user.setEmail(uniqueEmail);
        user.setPassword(passwordEncoder.encode("Password123"));
        user.setRol(
                rolRepository.findByNombre("USER").orElseThrow(() -> new RuntimeException("Rol USER no encontrado")));
        usuarioRepository.save(user);

        // Step 2: Log in with the new user
        String loginJson = "{\"correo\":\"" + uniqueEmail + "\",\"contrasena\":\"Password123\"}";

        mockMvc.perform(post("/api/v1/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(loginJson))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").exists())
                .andExpect(jsonPath("$.correo").value(uniqueEmail));
    }
}
