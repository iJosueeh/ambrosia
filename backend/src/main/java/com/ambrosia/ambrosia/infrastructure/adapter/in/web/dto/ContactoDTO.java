package com.ambrosia.ambrosia.infrastructure.adapter.in.web.dto;

import lombok.Data;

@Data
public class ContactoDTO {
    private String fullName;
    private String email;
    private String subject;
    private String message;
}
