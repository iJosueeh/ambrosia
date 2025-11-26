package com.ambrosia.ambrosia.infrastructure.adapter.in.web.exception;

import com.ambrosia.ambrosia.domain.exception.*;
import com.ambrosia.ambrosia.infrastructure.adapter.in.web.dto.error.ErrorResponse;
import com.ambrosia.ambrosia.infrastructure.adapter.in.web.dto.error.FieldError;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.ConstraintViolationException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.MissingServletRequestParameterException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Manejador global de excepciones para toda la aplicación.
 * Proporciona respuestas de error consistentes y logging estructurado.
 */
@RestControllerAdvice
@Slf4j
public class GlobalExceptionHandler {

    /**
     * Maneja excepciones cuando un recurso no es encontrado.
     */
    @ExceptionHandler(ResourceNotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public ErrorResponse handleResourceNotFound(
            ResourceNotFoundException ex,
            HttpServletRequest request) {

        log.warn("Recurso no encontrado: {}", ex.getMessage());

        return ErrorResponse.builder()
                .timestamp(LocalDateTime.now())
                .status(HttpStatus.NOT_FOUND.value())
                .error(HttpStatus.NOT_FOUND.getReasonPhrase())
                .message(ex.getMessage())
                .path(request.getRequestURI())
                .build();
    }

    /**
     * Maneja excepciones de lógica de negocio.
     */
    @ExceptionHandler(BusinessException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ErrorResponse handleBusinessException(
            BusinessException ex,
            HttpServletRequest request) {

        log.warn("Error de negocio: {}", ex.getMessage());

        return ErrorResponse.builder()
                .timestamp(LocalDateTime.now())
                .status(HttpStatus.BAD_REQUEST.value())
                .error(HttpStatus.BAD_REQUEST.getReasonPhrase())
                .message(ex.getMessage())
                .path(request.getRequestURI())
                .build();
    }

    /**
     * Maneja excepciones de usuario no autenticado.
     */
    @ExceptionHandler(UnauthorizedException.class)
    @ResponseStatus(HttpStatus.UNAUTHORIZED)
    public ErrorResponse handleUnauthorized(
            UnauthorizedException ex,
            HttpServletRequest request) {

        log.warn("Acceso no autorizado: {}", ex.getMessage());

        return ErrorResponse.builder()
                .timestamp(LocalDateTime.now())
                .status(HttpStatus.UNAUTHORIZED.value())
                .error(HttpStatus.UNAUTHORIZED.getReasonPhrase())
                .message(ex.getMessage())
                .path(request.getRequestURI())
                .build();
    }

    /**
     * Maneja excepciones de acceso prohibido.
     */
    @ExceptionHandler({ ForbiddenException.class, AccessDeniedException.class })
    @ResponseStatus(HttpStatus.FORBIDDEN)
    public ErrorResponse handleForbidden(
            Exception ex,
            HttpServletRequest request) {

        log.warn("Acceso prohibido: {}", ex.getMessage());

        return ErrorResponse.builder()
                .timestamp(LocalDateTime.now())
                .status(HttpStatus.FORBIDDEN.value())
                .error(HttpStatus.FORBIDDEN.getReasonPhrase())
                .message("No tienes permisos para acceder a este recurso")
                .path(request.getRequestURI())
                .build();
    }

    /**
     * Maneja excepciones de conflicto de datos.
     */
    @ExceptionHandler(ConflictException.class)
    @ResponseStatus(HttpStatus.CONFLICT)
    public ErrorResponse handleConflict(
            ConflictException ex,
            HttpServletRequest request) {

        log.warn("Conflicto de datos: {}", ex.getMessage());

        return ErrorResponse.builder()
                .timestamp(LocalDateTime.now())
                .status(HttpStatus.CONFLICT.value())
                .error(HttpStatus.CONFLICT.getReasonPhrase())
                .message(ex.getMessage())
                .path(request.getRequestURI())
                .build();
    }

    /**
     * Maneja excepciones de validación personalizada.
     */
    @ExceptionHandler(ValidationException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ErrorResponse handleValidationException(
            ValidationException ex,
            HttpServletRequest request) {

        log.warn("Error de validación: {}", ex.getMessage());

        return ErrorResponse.builder()
                .timestamp(LocalDateTime.now())
                .status(HttpStatus.BAD_REQUEST.value())
                .error(HttpStatus.BAD_REQUEST.getReasonPhrase())
                .message(ex.getMessage())
                .path(request.getRequestURI())
                .build();
    }

    /**
     * Maneja errores de validación de Bean Validation (@Valid).
     */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ErrorResponse handleValidationErrors(
            MethodArgumentNotValidException ex,
            HttpServletRequest request) {

        BindingResult bindingResult = ex.getBindingResult();

        List<FieldError> fieldErrors = bindingResult.getFieldErrors().stream()
                .map(error -> new FieldError(
                        error.getField(),
                        error.getDefaultMessage(),
                        error.getRejectedValue()))
                .collect(Collectors.toList());

        log.warn("Errores de validación en {}: {} errores", request.getRequestURI(), fieldErrors.size());

        return ErrorResponse.builder()
                .timestamp(LocalDateTime.now())
                .status(HttpStatus.BAD_REQUEST.value())
                .error(HttpStatus.BAD_REQUEST.getReasonPhrase())
                .message("Errores de validación")
                .path(request.getRequestURI())
                .errors(fieldErrors)
                .build();
    }

    /**
     * Maneja violaciones de constraints (validaciones en path/query params).
     */
    @ExceptionHandler(ConstraintViolationException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ErrorResponse handleConstraintViolation(
            ConstraintViolationException ex,
            HttpServletRequest request) {

        List<FieldError> fieldErrors = ex.getConstraintViolations().stream()
                .map(violation -> new FieldError(
                        getFieldName(violation),
                        violation.getMessage(),
                        violation.getInvalidValue()))
                .collect(Collectors.toList());

        log.warn("Violaciones de constraints en {}: {} errores", request.getRequestURI(), fieldErrors.size());

        return ErrorResponse.builder()
                .timestamp(LocalDateTime.now())
                .status(HttpStatus.BAD_REQUEST.value())
                .error(HttpStatus.BAD_REQUEST.getReasonPhrase())
                .message("Errores de validación en parámetros")
                .path(request.getRequestURI())
                .errors(fieldErrors)
                .build();
    }

    /**
     * Maneja errores de JSON malformado.
     */
    @ExceptionHandler(HttpMessageNotReadableException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ErrorResponse handleHttpMessageNotReadable(
            HttpMessageNotReadableException ex,
            HttpServletRequest request) {

        log.warn("JSON malformado en {}: {}", request.getRequestURI(), ex.getMessage());

        return ErrorResponse.builder()
                .timestamp(LocalDateTime.now())
                .status(HttpStatus.BAD_REQUEST.value())
                .error(HttpStatus.BAD_REQUEST.getReasonPhrase())
                .message("El formato del JSON es inválido")
                .path(request.getRequestURI())
                .build();
    }

    /**
     * Maneja parámetros de request faltantes.
     */
    @ExceptionHandler(MissingServletRequestParameterException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ErrorResponse handleMissingParams(
            MissingServletRequestParameterException ex,
            HttpServletRequest request) {

        log.warn("Parámetro faltante en {}: {}", request.getRequestURI(), ex.getParameterName());

        List<FieldError> fieldErrors = List.of(
                new FieldError(
                        ex.getParameterName(),
                        "Este parámetro es obligatorio",
                        null));

        return ErrorResponse.builder()
                .timestamp(LocalDateTime.now())
                .status(HttpStatus.BAD_REQUEST.value())
                .error(HttpStatus.BAD_REQUEST.getReasonPhrase())
                .message("Parámetros obligatorios faltantes")
                .path(request.getRequestURI())
                .errors(fieldErrors)
                .build();
    }

    /**
     * Maneja todas las excepciones no capturadas específicamente.
     */
    @ExceptionHandler(Exception.class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    public ErrorResponse handleGenericException(
            Exception ex,
            HttpServletRequest request) {

        log.error("Error inesperado en {}: {}", request.getRequestURI(), ex.getMessage(), ex);

        return ErrorResponse.builder()
                .timestamp(LocalDateTime.now())
                .status(HttpStatus.INTERNAL_SERVER_ERROR.value())
                .error(HttpStatus.INTERNAL_SERVER_ERROR.getReasonPhrase())
                .message("Ha ocurrido un error interno en el servidor")
                .path(request.getRequestURI())
                .build();
    }

    /**
     * Extrae el nombre del campo de una violación de constraint.
     */
    private String getFieldName(ConstraintViolation<?> violation) {
        String propertyPath = violation.getPropertyPath().toString();
        String[] parts = propertyPath.split("\\.");
        return parts[parts.length - 1];
    }
}
