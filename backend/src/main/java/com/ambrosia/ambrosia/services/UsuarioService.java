package com.ambrosia.ambrosia.services;

import com.ambrosia.ambrosia.exceptions.ResourceNotFoundException;
import com.ambrosia.ambrosia.models.Rol;
import com.ambrosia.ambrosia.models.Usuario;
import com.ambrosia.ambrosia.models.dto.UsuarioDTO;
import com.ambrosia.ambrosia.repository.RolRepository;
import com.ambrosia.ambrosia.repository.UsuarioRepository;
import com.google.common.base.Strings;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class UsuarioService {

    private static final Logger logger = LoggerFactory.getLogger(UsuarioService.class);

    private final UsuarioRepository usuarioRepository;
    private final RolRepository rolRepository;
    private final ModelMapper modelMapper;

    public UsuarioDTO registrar(UsuarioDTO dto) {
        if (Strings.isNullOrEmpty(dto.correo()) || Strings.isNullOrEmpty(dto.rol())) {
            throw new IllegalArgumentException("El correo y el rol no pueden ser nulos o vacíos");
        }

        logger.info("Registrando usuario con correo: {}", dto.correo());

        Usuario usuario = modelMapper.map(dto, Usuario.class);

        Rol rol = rolRepository.findByNombre(dto.rol())
                .orElseThrow(() -> new ResourceNotFoundException("Rol no encontrado con el nombre: " + dto.rol()));
        usuario.setRol(rol);

        usuario.setFecha_registro(LocalDateTime.now());

        Usuario usuarioGuardado = usuarioRepository.save(usuario);
        return modelMapper.map(usuarioGuardado, UsuarioDTO.class);
    }

    public UsuarioDTO buscarPorCorreo(String correo) {
        if (Strings.isNullOrEmpty(correo)) {
            throw new IllegalArgumentException("El correo no puede ser nulo o vacío");
        }
        logger.info("Buscando usuario con correo: {}", correo);
        Usuario usuario = usuarioRepository.findByEmail(correo)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado con el correo: " + correo));
        return modelMapper.map(usuario, UsuarioDTO.class);
    }
    public ByteArrayInputStream exportUsersToExcel() {
        String[] columns = {"ID", "Nombre", "Email", "Rol", "Fecha de Registro"};
        try (Workbook workbook = new XSSFWorkbook(); ByteArrayOutputStream out = new ByteArrayOutputStream();) {
            Sheet sheet = workbook.createSheet("Usuarios");

            Row headerRow = sheet.createRow(0);
            for (int col = 0; col < columns.length; col++) {
                Cell cell = headerRow.createCell(col);
                cell.setCellValue(columns[col]);
            }

            List<Usuario> usuarios = usuarioRepository.findAll();
            int rowIdx = 1;
            for (Usuario usuario : usuarios) {
                Row row = sheet.createRow(rowIdx++);
                row.createCell(0).setCellValue(usuario.getId());
                row.createCell(1).setCellValue(usuario.getNombre());
                row.createCell(2).setCellValue(usuario.getEmail());
                row.createCell(3).setCellValue(usuario.getRol().getNombre());
                row.createCell(4).setCellValue(usuario.getFecha_registro().toString());
            }

            workbook.write(out);
            return new ByteArrayInputStream(out.toByteArray());
        } catch (IOException e) {
            throw new RuntimeException("Error al generar el archivo Excel: " + e.getMessage());
        }
    }
}