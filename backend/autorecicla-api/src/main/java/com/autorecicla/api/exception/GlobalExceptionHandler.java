
package com.autorecicla.api.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<Map<String, Object>> handleRuntimeException(RuntimeException ex) {

        String mensagem = ex.getMessage();
        HttpStatus status = resolverStatus(mensagem);

        Map<String, Object> body = Map.of(
                "timestamp", LocalDateTime.now().toString(),
                "status", status.value(),
                "erro", status.getReasonPhrase(),
                "mensagem", mensagem
        );

        return ResponseEntity.status(status).body(body);
    }

    private HttpStatus resolverStatus(String mensagem) {
        if (mensagem == null) return HttpStatus.INTERNAL_SERVER_ERROR;

        if (mensagem.contains("não encontrad")) return HttpStatus.NOT_FOUND;

        if (mensagem.contains("inativo")
                || mensagem.contains("insuficiente")
                || mensagem.contains("filial")
                || mensagem.contains("Só é possível")
                || mensagem.contains("sem itens")
                || mensagem.contains("finalizada ou cancelada")) {
            return HttpStatus.BAD_REQUEST;
        }

        return HttpStatus.INTERNAL_SERVER_ERROR;
    }
}