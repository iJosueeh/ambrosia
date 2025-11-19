package com.ambrosia.ambrosia.config;

import com.ambrosia.ambrosia.models.Usuario;
import com.ambrosia.ambrosia.strategies.ExcelExportStrategy;
import com.ambrosia.ambrosia.strategies.ExportStrategy;
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