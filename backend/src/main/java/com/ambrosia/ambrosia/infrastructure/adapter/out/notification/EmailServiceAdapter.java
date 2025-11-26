package com.ambrosia.ambrosia.infrastructure.adapter.out.notification;

import com.ambrosia.ambrosia.application.port.out.EmailServicePort;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

@Slf4j
@Component
public class EmailServiceAdapter implements EmailServicePort {

    @Override
    public void enviarEmail(String destinatario, String asunto, String cuerpo) {
        // Implementación futura con JavaMailSender o servicio externo
        log.info("Simulando envío de email a: {}, asunto: {}", destinatario, asunto);
        log.debug("Cuerpo del email: {}", cuerpo);

        // TODO: Implementar con JavaMailSender
        // mailSender.send(message);
    }

    @Override
    public void enviarEmailConPlantilla(String destinatario, String plantilla, Object datos) {
        // Implementación futura con motor de plantillas (Thymeleaf, FreeMarker)
        log.info("Simulando envío de email con plantilla '{}' a: {}", plantilla, destinatario);

        // TODO: Implementar con motor de plantillas
        // String contenido = templateEngine.process(plantilla, datos);
        // enviarEmail(destinatario, asunto, contenido);
    }
}
