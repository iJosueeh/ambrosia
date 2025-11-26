# Update package declarations for moved files

# Services
Get-ChildItem "src\main\java\com\ambrosia\ambrosia\application\service\*.java" | ForEach-Object {
    (Get-Content $_.FullName) -replace 'package com\.ambrosia\.ambrosia\.services;', 'package com.ambrosia.ambrosia.application.service;' | Set-Content $_.FullName
}

Get-ChildItem "src\main\java\com\ambrosia\ambrosia\application\service\admin\*.java" | ForEach-Object {
    (Get-Content $_.FullName) -replace 'package com\.ambrosia\.ambrosia\.services\.admin;', 'package com.ambrosia.ambrosia.application.service.admin;' | Set-Content $_.FullName
}

# Controllers
Get-ChildItem "src\main\java\com\ambrosia\ambrosia\infrastructure\adapter\in\web\controller\*.java" | ForEach-Object {
    (Get-Content $_.FullName) -replace 'package com\.ambrosia\.ambrosia\.controllers;', 'package com.ambrosia.ambrosia.infrastructure.adapter.in.web.controller;' | Set-Content $_.FullName
}

Get-ChildItem "src\main\java\com\ambrosia\ambrosia\infrastructure\adapter\in\web\controller\admin\*.java" | ForEach-Object {
    (Get-Content $_.FullName) -replace 'package com\.ambrosia\.ambrosia\.controllers\.admin;', 'package com.ambrosia.ambrosia.infrastructure.adapter.in.web.controller.admin;' | Set-Content $_.FullName
}

# Config
Get-ChildItem "src\main\java\com\ambrosia\ambrosia\infrastructure\config\*.java" | ForEach-Object {
    (Get-Content $_.FullName) -replace 'package com\.ambrosia\.ambrosia\.config;', 'package com.ambrosia.ambrosia.infrastructure.config;' | Set-Content $_.FullName
}

# Mappers
Get-ChildItem "src\main\java\com\ambrosia\ambrosia\infrastructure\util\mapper\*.java" | ForEach-Object {
    (Get-Content $_.FullName) -replace 'package com\.ambrosia\.ambrosia\.mappers;', 'package com.ambrosia.ambrosia.infrastructure.util.mapper;' | Set-Content $_.FullName
}

# Utils
Get-ChildItem "src\main\java\com\ambrosia\ambrosia\infrastructure\util\*.java" | ForEach-Object {
    (Get-Content $_.FullName) -replace 'package com\.ambrosia\.ambrosia\.utils;', 'package com.ambrosia.ambrosia.infrastructure.util;' | Set-Content $_.FullName
}

Get-ChildItem "src\main\java\com\ambrosia\ambrosia\infrastructure\util\security\*.java" | ForEach-Object {
    (Get-Content $_.FullName) -replace 'package com\.ambrosia\.ambrosia\.utils;', 'package com.ambrosia.ambrosia.infrastructure.util.security;' | Set-Content $_.FullName
}

# Strategies
Get-ChildItem "src\main\java\com\ambrosia\ambrosia\infrastructure\util\export\*.java" | ForEach-Object {
    (Get-Content $_.FullName) -replace 'package com\.ambrosia\.ambrosia\.strategies;', 'package com.ambrosia.ambrosia.infrastructure.util.export;' | Set-Content $_.FullName
}

# DTOs in infrastructure
Get-ChildItem "src\main\java\com\ambrosia\ambrosia\infrastructure\adapter\in\web\dto\AdminDashboardDTO.java" | ForEach-Object {
    (Get-Content $_.FullName) -replace 'package com\.ambrosia\.ambrosia\.dtos;', 'package com.ambrosia.ambrosia.infrastructure.adapter.in.web.dto;' | Set-Content $_.FullName
}

Get-ChildItem "src\main\java\com\ambrosia\ambrosia\infrastructure\adapter\in\web\dto\DashboardStatsDTO.java" | ForEach-Object {
    (Get-Content $_.FullName) -replace 'package com\.ambrosia\.ambrosia\.dtos;', 'package com.ambrosia.ambrosia.infrastructure.adapter.in.web.dto;' | Set-Content $_.FullName
}

Get-ChildItem "src\main\java\com\ambrosia\ambrosia\infrastructure\adapter\in\web\dto\RecentActivityDTO.java" | ForEach-Object {
    (Get-Content $_.FullName) -replace 'package com\.ambrosia\.ambrosia\.dtos;', 'package com.ambrosia.ambrosia.infrastructure.adapter.in.web.dto;' | Set-Content $_.FullName
}

Get-ChildItem "src\main\java\com\ambrosia\ambrosia\infrastructure\adapter\in\web\dto\UserGrowthDTO.java" | ForEach-Object {
    (Get-Content $_.FullName) -replace 'package com\.ambrosia\.ambrosia\.dtos;', 'package com.ambrosia.ambrosia.infrastructure.adapter.in.web.dto;' | Set-Content $_.FullName
}

Write-Host "Package declarations updated successfully"
