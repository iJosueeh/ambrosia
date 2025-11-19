package com.ambrosia.ambrosia.services;

import com.ambrosia.ambrosia.models.Profesional;
import com.ambrosia.ambrosia.models.RecursoEducativo;
import com.ambrosia.ambrosia.models.Rol;
import com.ambrosia.ambrosia.models.Usuario;
import com.ambrosia.ambrosia.models.dto.ProfesionalDTO;
import com.ambrosia.ambrosia.models.dto.ProfesionalEstadisticasDTO;
import com.ambrosia.ambrosia.models.dto.ResourcePopularityDataDTO;
import com.ambrosia.ambrosia.models.dto.TrendDataDTO;
import com.ambrosia.ambrosia.repository.ProfesionalRepository;
import com.ambrosia.ambrosia.repository.RecursoRepository;
import com.ambrosia.ambrosia.repository.RolRepository;
import com.ambrosia.ambrosia.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.client.RestTemplate;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.core.io.ByteArrayResource;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProfesionalService {

        private final ProfesionalRepository profesionalRepository;
        private final UsuarioRepository usuarioRepository;
        private final RolRepository rolRepository;
        private final RecursoRepository recursoRepository;
        private final RestTemplate restTemplate;
        private final ExcelExportService excelExportService;

        @Value("${supabase.url}")
        private String supabaseUrl;
        @Value("${supabase.service-role-key}")
        private String supabaseServiceRoleKey;

        public ProfesionalDTO createProfesional(ProfesionalDTO profesionalDTO) {
                Usuario usuario = usuarioRepository.findById(profesionalDTO.getUsuarioId())
                                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

                if (usuario.getRol() != null && "PROFESSIONAL".equals(usuario.getRol().getNombre())) {
                        throw new RuntimeException("El usuario ya tiene el rol PROFESSIONAL.");
                }

                Profesional profesional = Profesional.builder()
                                .especialidad(profesionalDTO.getEspecialidad())
                                .descripcion(profesionalDTO.getDescripcion())
                                .telefono(profesionalDTO.getTelefono())
                                .ubicacion(profesionalDTO.getUbicacion())
                                .habilidades(profesionalDTO.getHabilidades())
                                .usuario(usuario)
                                .build();

                Profesional savedProfesional = profesionalRepository.save(profesional);

                Rol profesionalRol = rolRepository.findByNombre("PROFESSIONAL")
                                .orElseThrow(() -> new RuntimeException(
                                                "Rol 'PROFESSIONAL' no encontrado en la base de datos."));
                usuario.setRol(profesionalRol);
                usuarioRepository.save(usuario);

                return convertToDTO(savedProfesional);
        }

        public List<ProfesionalDTO> getAllProfesionales() {
                return profesionalRepository.findAll().stream()
                                .map(this::convertToDTO)
                                .collect(Collectors.toList());
        }

        public Optional<ProfesionalDTO> getProfesionalById(Long id) {
                return profesionalRepository.findById(id)
                                .map(this::convertToDTO);
        }

        public ProfesionalDTO updateProfesional(Long id, ProfesionalDTO profesionalDTO) {
                Profesional profesional = profesionalRepository.findById(id)
                                .orElseThrow(() -> new RuntimeException("Profesional no encontrado"));

                profesional.setEspecialidad(profesionalDTO.getEspecialidad());
                profesional.setDescripcion(profesionalDTO.getDescripcion());
                profesional.setTelefono(profesionalDTO.getTelefono());
                profesional.setUbicacion(profesionalDTO.getUbicacion());
                profesional.setHabilidades(profesionalDTO.getHabilidades());
                profesional.setProfileImageUrl(profesionalDTO.getProfileImageUrl());

                Profesional updatedProfesional = profesionalRepository.save(profesional);
                return convertToDTO(updatedProfesional);
        }

        public void deleteProfesional(Long id) {
                Profesional profesional = profesionalRepository.findById(id)
                                .orElseThrow(() -> new RuntimeException("Profesional no encontrado"));
                Usuario usuario = profesional.getUsuario();

                Rol userRol = rolRepository.findByNombre("USER")
                                .orElseThrow(() -> new RuntimeException(
                                                "Rol 'USER' no encontrado en la base de datos."));
                usuario.setRol(userRol);
                usuarioRepository.save(usuario);

                profesionalRepository.deleteById(id);
        }

        public ProfesionalDTO uploadProfilePicture(Long id, MultipartFile file) {
                Profesional profesional = profesionalRepository.findById(id)
                                .orElseThrow(() -> new RuntimeException("Profesional no encontrado"));

                try {
                        String bucketName = "profile-pictures";
                        String originalFilename = file.getOriginalFilename();
                        String fileExtension = "";
                        if (originalFilename != null && originalFilename.contains(".")) {
                                fileExtension = originalFilename.substring(originalFilename.lastIndexOf("."));
                        }
                        String fileName = id + "-" + UUID.randomUUID().toString() + fileExtension;
                        String uploadUrl = supabaseUrl + "/storage/v1/object/" + bucketName + "/" + fileName;

                        HttpHeaders headers = new HttpHeaders();
                        headers.setContentType(MediaType.MULTIPART_FORM_DATA);
                        headers.set("apikey", supabaseServiceRoleKey);
                        headers.setBearerAuth(supabaseServiceRoleKey);

                        MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
                        body.add("file", new ByteArrayResource(file.getBytes()) {
                                @Override
                                public String getFilename() {
                                        return file.getOriginalFilename();
                                }
                        });

                        HttpEntity<MultiValueMap<String, Object>> requestEntity = new HttpEntity<>(body, headers);

                        ResponseEntity<String> response = restTemplate.exchange(
                                        uploadUrl,
                                        HttpMethod.POST,
                                        requestEntity,
                                        String.class);

                        if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                                String publicImageUrl = supabaseUrl + "/storage/v1/object/public/" + bucketName + "/"
                                                + fileName;

                                profesional.setProfileImageUrl(publicImageUrl);
                                Profesional updatedProfesional = profesionalRepository.save(profesional);

                                return convertToDTO(updatedProfesional);
                        } else {
                                throw new RuntimeException("Error al subir la imagen a Supabase Storage: "
                                                + response.getStatusCode()
                                                + " " + response.getBody());
                        }

                } catch (Exception e) {
                        throw new RuntimeException("Fallo al subir la imagen de perfil: " + e.getMessage(), e);
                }
        }

        public void deleteProfilePicture(Long id) {
                Profesional profesional = profesionalRepository.findById(id)
                                .orElseThrow(() -> new RuntimeException("Profesional no encontrado"));
                profesional.setProfileImageUrl(null);
                profesionalRepository.save(profesional);
        }

        private ProfesionalDTO convertToDTO(Profesional profesional) {
                return ProfesionalDTO.builder()
                                .id(profesional.getId())
                                .especialidad(profesional.getEspecialidad())
                                .descripcion(profesional.getDescripcion())
                                .telefono(profesional.getTelefono())
                                .ubicacion(profesional.getUbicacion())
                                .habilidades(profesional.getHabilidades())
                                .usuarioId(profesional.getUsuario().getId())
                                .nombreUsuario(profesional.getUsuario().getNombre())
                                .emailUsuario(profesional.getUsuario().getEmail())
                                .profileImageUrl(profesional.getProfileImageUrl())
                                .build();

        }

        public ProfesionalEstadisticasDTO getProfesionalStatistics(Long profesionalId) {
                profesionalRepository.findById(profesionalId)
                                .orElseThrow(() -> new RuntimeException(
                                                "Profesional no encontrado con ID: " + profesionalId));
                List<RecursoEducativo> recursos = recursoRepository.findByCreadorId(profesionalId);
                int publishedResources = recursos.size();
                int totalDownloads = recursos.stream()
                                .mapToInt(recurso -> recurso.getDownloads() != null ? recurso.getDownloads().intValue()
                                                : 0)
                                .sum();

                List<ResourcePopularityDataDTO> resourcePopularity = recursos.stream()
                                .map(recurso -> new ResourcePopularityDataDTO(
                                                recurso.getTitulo(),
                                                recurso.getDownloads() != null ? recurso.getDownloads().intValue() : 0))
                                .collect(Collectors.toList());

                java.util.Map<String, Long> resourcesByCategory = recursos.stream()
                                .filter(r -> r.getCategoria() != null)
                                .collect(java.util.stream.Collectors.groupingBy(r -> r.getCategoria().getNombre(),
                                                java.util.stream.Collectors.counting()));

                List<com.ambrosia.ambrosia.models.dto.CategoryPerformanceDTO> resourceDistribution = resourcesByCategory
                                .entrySet().stream()
                                .map(entry -> new com.ambrosia.ambrosia.models.dto.CategoryPerformanceDTO(
                                                entry.getKey(), entry.getValue()))
                                .collect(Collectors.toList());

                java.util.Map<String, Long> downloadsByCategory = recursos.stream()
                                .filter(r -> r.getCategoria() != null && r.getDownloads() != null)
                                .collect(java.util.stream.Collectors.groupingBy(r -> r.getCategoria().getNombre(),
                                                java.util.stream.Collectors
                                                                .summingLong(RecursoEducativo::getDownloads)));

                List<com.ambrosia.ambrosia.models.dto.CategoryPerformanceDTO> downloadPerformance = downloadsByCategory
                                .entrySet().stream()
                                .map(entry -> new com.ambrosia.ambrosia.models.dto.CategoryPerformanceDTO(
                                                entry.getKey(), entry.getValue()))
                                .collect(Collectors.toList());

                List<TrendDataDTO> downloadTrends = recursos.stream()
                                .map(recurso -> new TrendDataDTO(
                                                recurso.getFechaPublicacion() != null
                                                                ? recurso.getFechaPublicacion().toLocalDate().toString()
                                                                : "N/A",

                                                recurso.getDownloads() != null ? recurso.getDownloads().intValue() : 0

                                ))
                                .collect(Collectors.toList());
                int uniqueUsers = totalDownloads;
                return new ProfesionalEstadisticasDTO(
                                totalDownloads,
                                publishedResources,
                                uniqueUsers,
                                downloadTrends,
                                resourcePopularity,
                                resourceDistribution,
                                downloadPerformance);
        }

        public java.io.ByteArrayInputStream exportStatisticsToExcel(Long profesionalId) {
                ProfesionalEstadisticasDTO statistics = getProfesionalStatistics(profesionalId);
                try {
                        return excelExportService.exportStatisticsToExcel(statistics);
                } catch (java.io.IOException e) {
                        throw new RuntimeException("Fallo al generar el archivo Excel", e);
                }
        }
}