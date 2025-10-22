package com.ambrosia.ambrosia.utils;

import java.time.LocalDateTime;

public record ErrorDetails(
        LocalDateTime timestamp,
        String message,
        String details) {
}
