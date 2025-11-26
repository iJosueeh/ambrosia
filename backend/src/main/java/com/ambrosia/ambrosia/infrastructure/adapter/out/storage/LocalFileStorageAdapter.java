package com.ambrosia.ambrosia.infrastructure.adapter.out.storage;

import com.ambrosia.ambrosia.application.port.out.FileStoragePort;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Slf4j
@Component
@RequiredArgsConstructor
public class LocalFileStorageAdapter implements FileStoragePort {

    @Value("${file.upload-dir:uploads}")
    private String uploadDir;

    @Override
    public String almacenarArchivo(MultipartFile archivo) {
        try {
            // Crear directorio si no existe
            Path uploadPath = Paths.get(uploadDir);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            // Generar nombre único para el archivo
            String fileName = UUID.randomUUID().toString() + "_" + archivo.getOriginalFilename();
            Path filePath = uploadPath.resolve(fileName);

            // Guardar archivo
            Files.copy(archivo.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            log.info("Archivo almacenado exitosamente: {}", fileName);
            return fileName;
        } catch (IOException e) {
            log.error("Error al almacenar archivo", e);
            throw new RuntimeException("Error al almacenar archivo: " + e.getMessage());
        }
    }

    @Override
    public void eliminarArchivo(String nombreArchivo) {
        try {
            Path filePath = Paths.get(uploadDir).resolve(nombreArchivo);
            Files.deleteIfExists(filePath);
            log.info("Archivo eliminado exitosamente: {}", nombreArchivo);
        } catch (IOException e) {
            log.error("Error al eliminar archivo", e);
            throw new RuntimeException("Error al eliminar archivo: " + e.getMessage());
        }
    }

    @Override
    public byte[] obtenerArchivo(String nombreArchivo) {
        try {
            Path filePath = Paths.get(uploadDir).resolve(nombreArchivo);
            return Files.readAllBytes(filePath);
        } catch (IOException e) {
            log.error("Error al obtener archivo", e);
            throw new RuntimeException("Error al obtener archivo: " + e.getMessage());
        }
    }
}
