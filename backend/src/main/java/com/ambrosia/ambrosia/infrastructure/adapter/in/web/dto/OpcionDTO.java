package com.ambrosia.ambrosia.infrastructure.adapter.in.web.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OpcionDTO {
    private UUID id;
    private String texto;
    private Integer valor;
}