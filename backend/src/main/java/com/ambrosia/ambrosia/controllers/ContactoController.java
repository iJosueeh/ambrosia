package com.ambrosia.ambrosia.controllers;

import com.ambrosia.ambrosia.models.dto.ContactoDTO;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/contact")
public class ContactoController {

    private static final Logger logger = LoggerFactory.getLogger(ContactoController.class);

    @PostMapping
    public ResponseEntity<Void> receiveContactMessage(@RequestBody ContactoDTO contactoDTO) {
        logger.info("Received contact message: {}", contactoDTO);
        // Here you can add the logic to send an email or save the message to the database
        return ResponseEntity.ok().build();
    }
}
