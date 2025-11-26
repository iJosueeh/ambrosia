package com.ambrosia.ambrosia.application.port.out;

public interface EmailServicePort {
    void enviarEmail(String destinatario, String asunto, String cuerpo);

    void enviarEmailConPlantilla(String destinatario, String plantilla, Object datos);
}
