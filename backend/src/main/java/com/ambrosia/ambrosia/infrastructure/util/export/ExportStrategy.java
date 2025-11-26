package com.ambrosia.ambrosia.infrastructure.util.export;

import java.io.ByteArrayInputStream;
import java.util.List;

public interface ExportStrategy<T> {
    ByteArrayInputStream export(List<T> data);
    String getContentType();
    String getFileExtension();
}
