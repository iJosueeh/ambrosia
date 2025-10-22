package com.ambrosia.ambrosia.strategies;

import java.io.ByteArrayInputStream;
import java.util.List;

public interface ExportStrategy<T> {
    ByteArrayInputStream export(List<T> data);
    String getContentType();
    String getFileExtension();
}
