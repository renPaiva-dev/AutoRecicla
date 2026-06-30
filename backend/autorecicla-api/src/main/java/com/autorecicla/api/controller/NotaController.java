package com.autorecicla.api.controller;
import com.autorecicla.api.dto.AbrirNotaRequest;
import com.autorecicla.api.dto.AdicionarPecaRequest;
import com.autorecicla.api.dto.FinalizarNotaRequest;
import com.autorecicla.api.model.Nota;
import com.autorecicla.api.model.NotaPeca;
import com.autorecicla.api.service.NotaService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/notas")
@RequiredArgsConstructor
public class NotaController {
    private final NotaService service;

    @GetMapping
    public ResponseEntity<List<Nota>> listar() {
        return ResponseEntity.ok(service.listarTodas());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Nota> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(service.buscarPorId(id));
    }

    @GetMapping("/{id}/itens")
    public ResponseEntity<List<NotaPeca>> listarItens(@PathVariable Long id) {
        return ResponseEntity.ok(service.listarItensDaNota(id));
    }

    @PostMapping
    public ResponseEntity<Nota> abrirNota(@RequestBody AbrirNotaRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.abrirNota(request));
    }

    @PostMapping("/{id}/itens")
    public ResponseEntity<NotaPeca> adicionarPeca(
            @PathVariable Long id,
            @RequestBody AdicionarPecaRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.adicionarPeca(id, request));
    }

    @PatchMapping("/{id}/finalizar")
    public ResponseEntity<Nota> finalizar(
            @PathVariable Long id,
            @RequestBody FinalizarNotaRequest request) {
        return ResponseEntity.ok(service.finalizarNota(id, request));
    }

    @PatchMapping("/{id}/cancelar")
    public ResponseEntity<Nota> cancelar(@PathVariable Long id) {
        return ResponseEntity.ok(service.cancelarNota(id));
    }
}
