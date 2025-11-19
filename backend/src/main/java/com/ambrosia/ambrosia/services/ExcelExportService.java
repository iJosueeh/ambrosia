package com.ambrosia.ambrosia.services;

import com.ambrosia.ambrosia.models.dto.ProfesionalEstadisticasDTO;
import com.ambrosia.ambrosia.models.dto.ResourcePopularityDataDTO;
import com.ambrosia.ambrosia.models.dto.TrendDataDTO;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;

@Service
public class ExcelExportService {

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
