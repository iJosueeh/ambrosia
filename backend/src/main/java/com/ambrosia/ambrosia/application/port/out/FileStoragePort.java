package com.ambrosia.ambrosia.application.port.out;

import org.springframework.web.multipart.MultipartFile;

public interface FileStoragePort {
    String almacenarArchivo(MultipartFile archivo);

    void eliminarArchivo(String nombreArchivo);

    byte[] obtenerArchivo(String nombreArchivo);
}
