package com.autorecicla.api.controller;

import com.autorecicla.api.model.Filial;
import com.autorecicla.api.service.FilialService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

// controller/FilialController.java
@RestController
@RequestMapping("/filiais")
@RequiredArgsConstructor
public class FilialController {
    private final FilialService service;

    @GetMapping
    public ResponseEntity<List<Filial>> listar() {
        return ResponseEntity.ok(service.listar());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Filial> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(service.buscarPorId(id));
    }

    @PostMapping
    public ResponseEntity<Filial> salvar(@RequestBody Filial filial) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.salvar(filial));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Filial> atualizar(@PathVariable Long id, @RequestBody Filial filial) {
        return ResponseEntity.ok(service.atualizar(id, filial));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        service.deletar(id);
        return ResponseEntity.noContent().build();
    }
}
