package com.ambrosia.ambrosia.infrastructure.adapter.in.web.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ProgressItemDTO {
    private String label;
    private int current;
    private long total;
    private int percentage;
}
