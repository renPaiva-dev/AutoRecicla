package com.autorecicla.api.controller;

import com.autorecicla.api.model.Compatibilidade;
import com.autorecicla.api.service.CompatibilidadeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/compatibilidades")
@RequiredArgsConstructor
public class CompatibilidadeController {
    private final CompatibilidadeService service;

    @GetMapping
    public ResponseEntity<List<Compatibilidade>> listar() {
        return ResponseEntity.ok(service.listar());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Compatibilidade> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(service.buscarPorId(id));
    }

    @GetMapping("/peca/{pecaId}")
    public ResponseEntity<List<Compatibilidade>> listarPorPeca(@PathVariable Long pecaId) {
        return ResponseEntity.ok(service.listarPorPeca(pecaId));
    }

    @GetMapping("/modelo/{modeloId}")
    public ResponseEntity<List<Compatibilidade>> listarPorModelo(@PathVariable Long modeloId) {
        return ResponseEntity.ok(service.listarPorModelo(modeloId));
    }

    @PostMapping
    public ResponseEntity<Compatibilidade> salvar(@RequestBody Compatibilidade compatibilidade) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.salvar(compatibilidade));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        service.deletar(id);
        return ResponseEntity.noContent().build();
    }
}
