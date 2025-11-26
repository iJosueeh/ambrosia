# Update imports throughout the project

$files = Get-ChildItem -Path "src\main\java" -Recurse -Filter "*.java"

foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw
    $originalContent = $content
    
    # Update service imports
    $content = $content -replace 'import com\.ambrosia\.ambrosia\.services\.', 'import com.ambrosia.ambrosia.application.service.'
    
    # Update controller imports
    $content = $content -replace 'import com\.ambrosia\.ambrosia\.controllers\.', 'import com.ambrosia.ambrosia.infrastructure.adapter.in.web.controller.'
    
    # Update config imports
    $content = $content -replace 'import com\.ambrosia\.ambrosia\.config\.', 'import com.ambrosia.ambrosia.infrastructure.config.'
    
    # Update mapper imports
    $content = $content -replace 'import com\.ambrosia\.ambrosia\.mappers\.', 'import com.ambrosia.ambrosia.infrastructure.util.mapper.'
    
    # Update utils imports
    $content = $content -replace 'import com\.ambrosia\.ambrosia\.utils\.JwtUtil;', 'import com.ambrosia.ambrosia.infrastructure.util.security.JwtUtil;'
    $content = $content -replace 'import com\.ambrosia\.ambrosia\.utils\.ErrorDetails;', 'import com.ambrosia.ambrosia.infrastructure.util.ErrorDetails;'
    $content = $content -replace 'import com\.ambrosia\.ambrosia\.utils\.', 'import com.ambrosia.ambrosia.infrastructure.util.'
    
    # Update strategies imports
    $content = $content -replace 'import com\.ambrosia\.ambrosia\.strategies\.', 'import com.ambrosia.ambrosia.infrastructure.util.export.'
    
    # Update dtos imports (only for the 4 files we moved)
    $content = $content -replace 'import com\.ambrosia\.ambrosia\.dtos\.AdminDashboardDTO;', 'import com.ambrosia.ambrosia.infrastructure.adapter.in.web.dto.AdminDashboardDTO;'
    $content = $content -replace 'import com\.ambrosia\.ambrosia\.dtos\.DashboardStatsDTO;', 'import com.ambrosia.ambrosia.infrastructure.adapter.in.web.dto.DashboardStatsDTO;'
    $content = $content -replace 'import com\.ambrosia\.ambrosia\.dtos\.RecentActivityDTO;', 'import com.ambrosia.ambrosia.infrastructure.adapter.in.web.dto.RecentActivityDTO;'
    $content = $content -replace 'import com\.ambrosia\.ambrosia\.dtos\.UserGrowthDTO;', 'import com.ambrosia.ambrosia.infrastructure.adapter.in.web.dto.UserGrowthDTO;'
    
    # Only write if content changed
    if ($content -ne $originalContent) {
        Set-Content -Path $file.FullName -Value $content -NoNewline
    }
}

Write-Host "Imports updated successfully in all files"
