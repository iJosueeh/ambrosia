# Script para actualizar @GenericGenerator deprecated a @UuidGenerator
# Hibernate 6.5+ forma moderna

$files = @(
    "Actividad.java",
    "CategoriaForo.java",
    "CategoriaRecurso.java",
    "Comentario.java",
    "EstadoPublicado.java",
    "Foro.java",
    "Opcion.java",
    "Pregunta.java",
    "Profesional.java",
    "RecursoEducativo.java",
    "ResultadoTest.java",
    "Rol.java",
    "TestEvaluacion.java",
    "Usuario.java"
)

$basePath = "src\main\java\com\ambrosia\ambrosia\domain\model"

foreach ($file in $files) {
    $filePath = Join-Path $basePath $file
    
    if (Test-Path $filePath) {
        Write-Host "Actualizando $file..."
        
        $content = Get-Content $filePath -Raw
        
        # Reemplazar import
        $content = $content -replace 'import org\.hibernate\.annotations\.GenericGenerator;', 'import org.hibernate.annotations.UuidGenerator;'
        
        # Reemplazar anotaciones
        $content = $content -replace '@GeneratedValue\(generator = "uuid2"\)\s*@GenericGenerator\(name = "uuid2", strategy = "uuid2"\)', '@GeneratedValue(strategy = GenerationType.UUID)'
        
        # Guardar
        Set-Content -Path $filePath -Value $content -NoNewline
        
        Write-Host "✓ $file actualizado"
    }
}

Write-Host "`n✅ Todos los archivos actualizados"
