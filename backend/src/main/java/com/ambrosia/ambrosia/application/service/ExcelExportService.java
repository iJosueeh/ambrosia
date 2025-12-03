package com.ambrosia.ambrosia.application.service;

import com.ambrosia.ambrosia.domain.model.Usuario;
import com.ambrosia.ambrosia.domain.repository.UsuarioRepositoryPort;
import com.ambrosia.ambrosia.infrastructure.adapter.in.web.dto.ProfesionalEstadisticasDTO;
import com.ambrosia.ambrosia.infrastructure.adapter.in.web.dto.ResourcePopularityDataDTO;
import com.ambrosia.ambrosia.infrastructure.adapter.in.web.dto.TrendDataDTO;
import lombok.RequiredArgsConstructor;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ExcelExportService {

    private final UsuarioRepositoryPort usuarioRepository;

    public ByteArrayInputStream exportUsuariosToExcel() throws IOException {
        List<Usuario> usuarios = usuarioRepository.findAll();

        try (Workbook workbook = new XSSFWorkbook(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Sheet sheet = workbook.createSheet("Usuarios");

            // Crear estilos
            CellStyle headerStyle = createHeaderStyleForUsers(workbook);
            CellStyle dateStyle = createDateStyleForUsers(workbook);

            // Crear encabezados
            Row headerRow = sheet.createRow(0);
            String[] headers = { "ID", "Nombre", "Email", "Rol", "Teléfono", "Fecha de Registro", "Nivel de Acceso" };

            for (int i = 0; i < headers.length; i++) {
                Cell cell = headerRow.createCell(i);
                cell.setCellValue(headers[i]);
                cell.setCellStyle(headerStyle);
            }

            // Llenar datos
            int rowNum = 1;
            DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");

            for (Usuario usuario : usuarios) {
                Row row = sheet.createRow(rowNum++);

                row.createCell(0).setCellValue(usuario.getId().toString());
                row.createCell(1).setCellValue(usuario.getNombre());
                row.createCell(2).setCellValue(usuario.getEmail());
                row.createCell(3).setCellValue(usuario.getRol() != null ? usuario.getRol().getNombre() : "Sin rol");
                row.createCell(4).setCellValue(usuario.getTelefono() != null ? usuario.getTelefono() : "");

                Cell dateCell = row.createCell(5);
                if (usuario.getFechaRegistro() != null) {
                    dateCell.setCellValue(usuario.getFechaRegistro().format(dateFormatter));
                    dateCell.setCellStyle(dateStyle);
                }

                row.createCell(6)
                        .setCellValue(usuario.getNivelAcceso() != null ? String.valueOf(usuario.getNivelAcceso()) : "");
            }

            // Auto-ajustar columnas
            for (int i = 0; i < headers.length; i++) {
                sheet.autoSizeColumn(i);
            }

            workbook.write(out);
            return new ByteArrayInputStream(out.toByteArray());
        }
    }

    private CellStyle createHeaderStyleForUsers(Workbook workbook) {
        CellStyle style = workbook.createCellStyle();
        Font font = workbook.createFont();
        font.setBold(true);
        font.setColor(IndexedColors.WHITE.getIndex());
        style.setFont(font);
        style.setFillForegroundColor(IndexedColors.DARK_BLUE.getIndex());
        style.setFillPattern(FillPatternType.SOLID_FOREGROUND);
        style.setAlignment(HorizontalAlignment.CENTER);
        style.setVerticalAlignment(VerticalAlignment.CENTER);
        return style;
    }

    private CellStyle createDateStyleForUsers(Workbook workbook) {
        CellStyle style = workbook.createCellStyle();
        style.setAlignment(HorizontalAlignment.LEFT);
        return style;
    }

    public ByteArrayInputStream exportStatisticsToExcel(ProfesionalEstadisticasDTO statistics) throws IOException {
        try (Workbook workbook = new XSSFWorkbook(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Sheet sheet = workbook.createSheet("Estadisticas");

            // Header Font
            Font headerFont = workbook.createFont();
            headerFont.setBold(true);
            headerFont.setFontHeightInPoints((short) 14);
            headerFont.setColor(IndexedColors.WHITE.getIndex());

            // Header Cell Style
            CellStyle headerCellStyle = workbook.createCellStyle();
            headerCellStyle.setFont(headerFont);
            headerCellStyle.setFillForegroundColor(IndexedColors.SEA_GREEN.getIndex());
            headerCellStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);

            // Summary Section
            createSectionHeader(sheet, 0, "Resumen General", headerCellStyle);
            Row totalDownloadsRow = sheet.createRow(1);
            totalDownloadsRow.createCell(0).setCellValue("Total de Descargas");
            totalDownloadsRow.createCell(1).setCellValue(statistics.getTotalDownloads());

            Row publishedResourcesRow = sheet.createRow(2);
            publishedResourcesRow.createCell(0).setCellValue("Recursos Publicados");
            publishedResourcesRow.createCell(1).setCellValue(statistics.getPublishedResources());

            Row uniqueUsersRow = sheet.createRow(3);
            uniqueUsersRow.createCell(0).setCellValue("Usuarios Únicos");
            uniqueUsersRow.createCell(1).setCellValue(statistics.getUniqueUsers());

            // Resource Popularity Section
            int rowIndex = 5;
            createSectionHeader(sheet, rowIndex++, "Popularidad de Recursos", headerCellStyle);
            Row popularityHeaderRow = sheet.createRow(rowIndex++);
            popularityHeaderRow.createCell(0).setCellValue("Título del Recurso");
            popularityHeaderRow.createCell(1).setCellValue("Vistas/Descargas");
            for (ResourcePopularityDataDTO item : statistics.getResourcePopularity()) {
                Row row = sheet.createRow(rowIndex++);
                row.createCell(0).setCellValue(item.getResourceTitle());
                row.createCell(1).setCellValue(item.getCount());
            }

            // Download Trends Section
            rowIndex++;
            createSectionHeader(sheet, rowIndex++, "Tendencia de Descargas", headerCellStyle);
            Row trendHeaderRow = sheet.createRow(rowIndex++);
            trendHeaderRow.createCell(0).setCellValue("Fecha");
            trendHeaderRow.createCell(1).setCellValue("Descargas");
            for (TrendDataDTO item : statistics.getDownloadTrends()) {
                Row row = sheet.createRow(rowIndex++);
                row.createCell(0).setCellValue(item.getDate());
                row.createCell(1).setCellValue(item.getCount());
            }

            // Auto-size columns
            sheet.autoSizeColumn(0);
            sheet.autoSizeColumn(1);

            workbook.write(out);
            return new ByteArrayInputStream(out.toByteArray());
        }
    }

    private void createSectionHeader(Sheet sheet, int rowIndex, String title, CellStyle style) {
        Row headerRow = sheet.createRow(rowIndex);
        Cell cell = headerRow.createCell(0);
        cell.setCellValue(title);
        cell.setCellStyle(style);
    }
}
