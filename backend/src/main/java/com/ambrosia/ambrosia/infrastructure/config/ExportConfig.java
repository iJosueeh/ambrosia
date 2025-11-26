package com.ambrosia.ambrosia.infrastructure.config;

import com.ambrosia.ambrosia.domain.model.Usuario;
import com.ambrosia.ambrosia.infrastructure.util.export.ExcelExportStrategy;
import com.ambrosia.ambrosia.infrastructure.util.export.ExportStrategy;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.HashMap;
import java.util.Map;

@Configuration
public class ExportConfig {

    @Bean
    public Map<String, ExportStrategy<Usuario>> userExportStrategies(ExcelExportStrategy excelExportStrategy) {
        Map<String, ExportStrategy<Usuario>> strategies = new HashMap<>();
        strategies.put("xlsx", excelExportStrategy);
        return strategies;
    }
}
