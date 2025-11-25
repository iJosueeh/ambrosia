package com.ambrosia.ambrosia;

import com.ambrosia.ambrosia.models.Administrador;
import com.ambrosia.ambrosia.models.CategoriaRecurso;
import com.ambrosia.ambrosia.models.EstadoPublicado;
import com.ambrosia.ambrosia.models.Usuario;
import com.ambrosia.ambrosia.models.dto.LoginRequest;
import com.ambrosia.ambrosia.models.dto.LoginResponseDTO;
import com.ambrosia.ambrosia.models.dto.ResourceUpdateDTO;
import com.ambrosia.ambrosia.repository.*;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.persistence.EntityManager; // Import EntityManager
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.MOCK)
@AutoConfigureMockMvc
public class RecursoIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private AdministradorRepository administradorRepository;

    @Autowired
    private CategoriaRecursoRepository categoriaRecursoRepository;

    @Autowired
    private EstadoPublicadoRepository estadoPublicadoRepository;

    @Autowired
    private RecursoRepository recursoRepository;

    @Autowired
    private ResultadoRepository resultadoRepository; // Inyectar ResultadoRepository

    @Autowired
    private ProfesionalRepository profesionalRepository; // Inyectar ProfesionalRepository

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private EntityManager entityManager; // Inyectar EntityManager

    private String adminToken;
    private CategoriaRecurso categoria;
    private EstadoPublicado estado;

    @BeforeEach
    @Transactional // Add @Transactional here
    void setUp() throws Exception {
        // Generar un email único para cada ejecución del test
        String uniqueEmail = "admin." + System.currentTimeMillis() + "@example.com";

        // Create and save a CategoriaRecurso
        categoria = new CategoriaRecurso();
        categoria.setNombre("Test Category");
        categoria = categoriaRecursoRepository.save(categoria);

        // Create and save an EstadoPublicado
        estado = new EstadoPublicado();
        estado.setNombre("Publicado");
        estado = estadoPublicadoRepository.save(estado);

        // Create an admin user
        Usuario adminUser = new Usuario();
        adminUser.setNombre("Admin User");
        adminUser.setEmail(uniqueEmail);
        adminUser.setPassword(passwordEncoder.encode("Password123"));
        adminUser = usuarioRepository.saveAndFlush(adminUser);

        Administrador admin = new Administrador();
        admin.setUsuario(adminUser);
        admin.setNivelAcceso(1);
        entityManager.persist(admin); // Use entityManager.persist
        entityManager.flush(); // Flush to ensure it's in the DB

        // Log in as the admin user to get a token
        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setCorreo(uniqueEmail);
        loginRequest.setContrasena("Password123");
        MvcResult result = mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isOk())
                .andReturn();

        String responseString = result.getResponse().getContentAsString();
        LoginResponseDTO loginResponse = objectMapper.readValue(responseString, LoginResponseDTO.class);
        adminToken = loginResponse.getToken();
    }

    @AfterEach
    void tearDown() {
        recursoRepository.deleteAll();
        administradorRepository.deleteAll();
        profesionalRepository.deleteAll(); // Eliminar profesionales antes que usuarios
        resultadoRepository.deleteAll(); // Eliminar resultados antes que usuarios
        usuarioRepository.deleteAll();
        categoriaRecursoRepository.deleteAll();
        estadoPublicadoRepository.deleteAll();
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

        mockMvc.perform(post("/api/v1/admin/resources")
                        .header("Authorization", "Bearer " + adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(resourceDTO)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.titulo").value("Test Resource"));

        // Step 2: Retrieve the list of resources to verify the new resource is present
        mockMvc.perform(get("/api/recursos")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content[0].titulo").value("Test Resource"));
    }
}
