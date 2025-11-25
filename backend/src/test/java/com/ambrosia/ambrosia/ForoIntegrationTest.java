package com.ambrosia.ambrosia;

import com.ambrosia.ambrosia.models.CategoriaForo;
import com.ambrosia.ambrosia.models.Foro;
import com.ambrosia.ambrosia.models.Usuario;
import com.ambrosia.ambrosia.models.dto.LoginRequest;
import com.ambrosia.ambrosia.models.dto.LoginResponseDTO;
import com.ambrosia.ambrosia.repository.CategoriaForoRepository;
import com.ambrosia.ambrosia.repository.ComentarioRepository;
import com.ambrosia.ambrosia.repository.ForoRepository;
import com.ambrosia.ambrosia.repository.ProfesionalRepository;
import com.ambrosia.ambrosia.repository.ResultadoRepository;
import com.ambrosia.ambrosia.repository.UsuarioRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
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

import java.time.LocalDateTime;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.MOCK)
@AutoConfigureMockMvc
public class ForoIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private CategoriaForoRepository categoriaForoRepository;

    @Autowired
    private ForoRepository foroRepository;

    @Autowired
    private ComentarioRepository comentarioRepository; // Inyectar ComentarioRepository

    @Autowired
    private ResultadoRepository resultadoRepository; // Inyectar ResultadoRepository

    @Autowired
    private ProfesionalRepository profesionalRepository; // Inyectar ProfesionalRepository

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
        user = usuarioRepository.save(user);

        // Create a forum category
        categoriaForo = new CategoriaForo();
        categoriaForo.setTitulo("General");
        categoriaForo.setDescripcion("Discusión general");
        categoriaForo = categoriaForoRepository.save(categoriaForo);

        // Log in as the user to get a token
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
        userToken = loginResponse.getToken();
    }

    @AfterEach
    void tearDown() {
        comentarioRepository.deleteAll(); // Eliminar comentarios primero
        foroRepository.deleteAll();
        profesionalRepository.deleteAll(); // Eliminar profesionales antes que usuarios
        resultadoRepository.deleteAll(); // Eliminar resultados antes que usuarios
        categoriaForoRepository.deleteAll();
        usuarioRepository.deleteAll();
    }

    @Test
    void testCreateAndRetrieveForumPost() throws Exception {
        // Step 1: Create a new forum post
        java.util.Map<String, Object> foroJson = new java.util.HashMap<>();
        foroJson.put("titulo", "Mi primer post");
        foroJson.put("descripcion", "Este es el contenido de mi primer post.");
        
        java.util.Map<String, Object> authorJson = new java.util.HashMap<>();
        authorJson.put("id", user.getId());
        foroJson.put("autor", authorJson);

        java.util.Map<String, Object> categoryJson = new java.util.HashMap<>();
        categoryJson.put("id", categoriaForo.getId());
        foroJson.put("categoriaForo", categoryJson);

        foroJson.put("fechaCreacion", LocalDateTime.now().toString());

        mockMvc.perform(post("/api/foros")
                        .header("Authorization", "Bearer " + userToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(foroJson)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.titulo").value("Mi primer post"));

        // Step 2: Retrieve the list of forum posts to verify the new post is present
        mockMvc.perform(get("/api/foros")
                        .header("Authorization", "Bearer " + userToken)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].titulo").value("Mi primer post"));
    }
}
