package com.ambrosia.ambrosia.application.port.out;

import java.util.List;

public interface ExportServicePort {
    byte[] exportarAExcel(List<?> datos, String nombreHoja);

    byte[] exportarAPdf(List<?> datos, String titulo);
}
