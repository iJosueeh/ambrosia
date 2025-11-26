package com.ambrosia.ambrosia.infrastructure.adapter.out.export;

import com.ambrosia.ambrosia.application.port.out.ExportServicePort;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.util.List;

@Slf4j
@Component
@RequiredArgsConstructor
public class ExcelExportServiceAdapter implements ExportServicePort {

    @Override
    public byte[] exportarAExcel(List<?> datos, String nombreHoja) {
        // Implementación futura con Apache POI
        log.warn("Exportación a Excel no implementada completamente aún");
        throw new UnsupportedOperationException("Exportación a Excel no implementada");
    }

    @Override
    public byte[] exportarAPdf(List<?> datos, String titulo) {
        // Implementación futura para PDF
        log.warn("Exportación a PDF no implementada aún");
        throw new UnsupportedOperationException("Exportación a PDF no implementada");
    }
}
