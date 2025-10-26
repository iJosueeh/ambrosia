package com.ambrosia.ambrosia.config;

import com.ambrosia.ambrosia.models.RecursoEducativo;
import com.ambrosia.ambrosia.models.dto.RecursoDTO;
import org.modelmapper.ModelMapper;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class ModelMapperConfig {

    @Bean
    public ModelMapper modelMapper() {
        ModelMapper modelMapper = new ModelMapper();

        // Mapeo customizado para RecursoEducativo -> RecursoDTO
        modelMapper.typeMap(RecursoEducativo.class, RecursoDTO.class).addMappings(mapper -> {
            mapper.map(src -> src.getCategoria().getNombre(), RecursoDTO::setNombreCategoria);
            mapper.map(src -> src.getEstado().getNombre(), RecursoDTO::setEstado);
            mapper.map(RecursoEducativo::getId, RecursoDTO::setId);
            mapper.map(RecursoEducativo::getTitulo, RecursoDTO::setTitulo);
            mapper.map(RecursoEducativo::getDescripcion, RecursoDTO::setDescripcion);
            mapper.map(RecursoEducativo::getEnlace, RecursoDTO::setEnlace);
            mapper.map(RecursoEducativo::getContenido, RecursoDTO::setContenido);
            mapper.map(RecursoEducativo::getSize, RecursoDTO::setSize);
            mapper.map(RecursoEducativo::getDownloads, RecursoDTO::setDownloads);
            mapper.map(RecursoEducativo::getFechaPublicacion, RecursoDTO::setFechaPublicacion);
        });

        return modelMapper;
    }
}
