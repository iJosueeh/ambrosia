package com.ambrosia.ambrosia.infrastructure.util;

import java.time.LocalDateTime;

public record ErrorDetails(
        LocalDateTime timestamp,
        String message,
        String details) {
}
