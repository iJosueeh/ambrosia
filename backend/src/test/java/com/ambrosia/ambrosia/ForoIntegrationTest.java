package com.ambrosia.ambrosia;

import com.ambrosia.ambrosia.models.CategoriaForo;
import com.ambrosia.ambrosia.models.Foro;
import com.ambrosia.ambrosia.models.Usuario;
import com.ambrosia.ambrosia.models.dto.LoginRequest;
import com.ambrosia.ambrosia.models.dto.LoginResponseDTO;
import com.ambrosia.ambrosia.repository.CategoriaForoRepository;
import com.ambrosia.ambrosia.repository.UsuarioRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.MOCK)
@AutoConfigureMockMvc
@Transactional
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
    private PasswordEncoder passwordEncoder;

    private String userToken;
    private Usuario user;
    private CategoriaForo categoriaForo;

    @BeforeEach
    void setUp() throws Exception {
        // Create a user
        user = new Usuario();
        user.setNombre("Test User");
        user.setEmail("test.user@example.com");
        user.setPassword(passwordEncoder.encode("Password123"));
        user = usuarioRepository.save(user);

        // Create a forum category
        categoriaForo = new CategoriaForo();
        categoriaForo.setTitulo("General");
        categoriaForo.setDescripcion("Discusión general");
        categoriaForo = categoriaForoRepository.save(categoriaForo);

        // Log in as the user to get a token
        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setCorreo("test.user@example.com");
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
