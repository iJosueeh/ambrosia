package com.ambrosia.ambrosia;

import com.ambrosia.ambrosia.domain.model.CategoriaForo;
import com.ambrosia.ambrosia.domain.model.Usuario;
import com.ambrosia.ambrosia.infrastructure.adapter.in.web.dto.LoginRequest;
import com.ambrosia.ambrosia.infrastructure.adapter.in.web.dto.LoginResponseDTO;
import com.ambrosia.ambrosia.domain.repository.CategoriaForoRepositoryPort;
import com.ambrosia.ambrosia.domain.repository.ComentarioRepositoryPort;
import com.ambrosia.ambrosia.domain.repository.ForoRepositoryPort;
import com.ambrosia.ambrosia.domain.repository.ProfesionalRepositoryPort;
import com.ambrosia.ambrosia.domain.repository.ResultadoTestRepositoryPort;
import com.ambrosia.ambrosia.domain.repository.RolRepositoryPort;
import com.ambrosia.ambrosia.domain.repository.UsuarioRepositoryPort;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
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
public class ForoIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private UsuarioRepositoryPort usuarioRepository;

    @Autowired
    private CategoriaForoRepositoryPort categoriaForoRepository;

    @Autowired
    private ForoRepositoryPort foroRepository;

    @Autowired
    private ComentarioRepositoryPort comentarioRepository;

    @Autowired
    private ResultadoTestRepositoryPort resultadoTestRepository;

    @Autowired
    private ProfesionalRepositoryPort profesionalRepository;

    @Autowired
    private RolRepositoryPort rolRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    private String userToken;
    private Usuario user;
    private CategoriaForo categoriaForo;

    @BeforeEach
    void setUp() throws Exception {
        // Generar un email único para cada ejecución del test
        String uniqueEmail = "test.user." + System.currentTimeMillis() + "@example.com";

        // Create a user
        user = new Usuario();
        user.setNombre("Test User");
        user.setEmail(uniqueEmail);
        user.setPassword(passwordEncoder.encode("Password123"));
        user.setRol(rolRepository.findByNombre("USER").orElseGet(() -> {
            return rolRepository.save(com.ambrosia.ambrosia.domain.model.Rol.builder().nombre("USER").build());
        }));
        user = usuarioRepository.save(user);

        // Ensure "ADMIN" role exists if needed for other tests
        rolRepository.findByNombre("ADMIN").orElseGet(() -> {
            return rolRepository.save(com.ambrosia.ambrosia.domain.model.Rol.builder().nombre("ADMIN").build());
        });

        // Create a forum category
        categoriaForo = new CategoriaForo();
        categoriaForo.setNombre("General Test " + System.currentTimeMillis());
        categoriaForo.setDescripcion("Discusión general");
        categoriaForo = categoriaForoRepository.save(categoriaForo);

        // Log in as the user to get a token
        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setCorreo(uniqueEmail);
        loginRequest.setContrasena("Password123");

        MvcResult result = mockMvc.perform(post("/api/v1/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isOk())
                .andReturn();

        String responseString = result.getResponse().getContentAsString();
        LoginResponseDTO loginResponse = objectMapper.readValue(responseString, LoginResponseDTO.class);
        userToken = loginResponse.getToken();
    }

    @Test
    void testCreateAndRetrieveForumPost() throws Exception {
        // Step 1: Create a new forum post
        java.util.Map<String, Object> foroJson = new java.util.HashMap<>();
        foroJson.put("titulo", "Mi primer post");
        foroJson.put("descripcion", "Este es el contenido de mi primer post.");
        foroJson.put("autorId", user.getId());
        foroJson.put("categoriaForoId", categoriaForo.getId());

        mockMvc.perform(post("/api/v1/foros")
                .header("Authorization", "Bearer " + userToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(foroJson)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.titulo").value("Mi primer post"));

        // Step 2: Retrieve the list of forum posts to verify the new post is present
        mockMvc.perform(get("/api/v1/foros")
                .header("Authorization", "Bearer " + userToken)
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content[0].titulo").value("Mi primer post"));
    }
}
