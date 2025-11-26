package com.ambrosia.ambrosia;

import com.ambrosia.ambrosia.domain.model.CategoriaRecurso;
import com.ambrosia.ambrosia.domain.model.EstadoPublicado;
import com.ambrosia.ambrosia.domain.model.Usuario;
import com.ambrosia.ambrosia.infrastructure.adapter.in.web.dto.LoginRequest;
import com.ambrosia.ambrosia.infrastructure.adapter.in.web.dto.LoginResponseDTO;
import com.ambrosia.ambrosia.infrastructure.adapter.in.web.dto.ResourceUpdateDTO;
import com.ambrosia.ambrosia.domain.repository.*;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.jayway.jsonpath.JsonPath;
import jakarta.persistence.EntityManager;
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
import org.springframework.transaction.annotation.Transactional;

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
@Transactional
@DirtiesContext(classMode = DirtiesContext.ClassMode.AFTER_EACH_TEST_METHOD)
public class RecursoIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private UsuarioRepositoryPort usuarioRepository;

    @Autowired
    private CategoriaRecursoRepositoryPort categoriaRecursoRepository;

    @Autowired
    private EstadoPublicadoRepositoryPort estadoPublicadoRepository;

    @Autowired
    private RecursoRepositoryPort recursoRepository;

    @Autowired
    private ResultadoTestRepositoryPort resultadoTestRepository;

    @Autowired
    private ProfesionalRepositoryPort profesionalRepository;

    @Autowired
    private RolRepositoryPort rolRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private EntityManager entityManager;

    private String adminToken;
    private CategoriaRecurso categoria;
    private EstadoPublicado estado;

    @BeforeEach
    void setUp() throws Exception {
        // Generar un email único para cada ejecución del test
        String uniqueEmail = "admin." + System.currentTimeMillis() + "@example.com";

        // Create and save a CategoriaRecurso
        categoria = new CategoriaRecurso();
        categoria.setNombre("Test Category");
        categoria = categoriaRecursoRepository.save(categoria);

        // Create and save an EstadoPublicado
        estado = estadoPublicadoRepository.findByNombre("PUBLICADO").orElseGet(() -> {
            EstadoPublicado publishedState = new EstadoPublicado();
            publishedState.setNombre("PUBLICADO");
            return estadoPublicadoRepository.save(publishedState);
        });

        // Create an admin user
        Usuario adminUser = new Usuario();
        adminUser.setNombre("Admin User");
        adminUser.setEmail(uniqueEmail);
        adminUser.setPassword(passwordEncoder.encode("Password123"));
        adminUser.setNivelAcceso(1);
        adminUser.setRol(rolRepository.findByNombre("ADMIN").orElseGet(() -> {
            return rolRepository.save(com.ambrosia.ambrosia.domain.model.Rol.builder().nombre("ADMIN").build());
        }));
        entityManager.persist(adminUser);

        // Ensure the "USER" role exists for other tests that might create regular users
        rolRepository.findByNombre("USER").orElseGet(() -> {
            return rolRepository.save(com.ambrosia.ambrosia.domain.model.Rol.builder().nombre("USER").build());
        });

        entityManager.flush();
        entityManager.clear();

        // Log in as the admin user to get a token
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
        adminToken = loginResponse.getToken();
    }

    @Test
    void testCreateAndRetrieveResource() throws Exception {
        // Step 1: Create a new resource as an admin
        ResourceUpdateDTO resourceDTO = new ResourceUpdateDTO();
        resourceDTO.setTitulo("Test Resource");
        resourceDTO.setDescripcion("Test Description");
        resourceDTO.setEnlace("http://example.com");
        resourceDTO.setCategoriaId(categoria.getId());
        resourceDTO.setEstadoId(estado.getId());

        MvcResult createResult = mockMvc.perform(post("/api/v1/admin/resources")
                .header("Authorization", "Bearer " + adminToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(resourceDTO)))
                .andDo(org.springframework.test.web.servlet.result.MockMvcResultHandlers.print())
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.titulo").value("Test Resource"))
                .andReturn();

        String createResponseString = createResult.getResponse().getContentAsString();
        String resourceId = JsonPath.read(createResponseString, "$.id");

        // Step 2: Retrieve the newly created resource by its ID
        mockMvc.perform(get("/api/v1/recursos/{id}", resourceId)
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(resourceId))
                .andExpect(jsonPath("$.titulo").value("Test Resource"));
    }
}
