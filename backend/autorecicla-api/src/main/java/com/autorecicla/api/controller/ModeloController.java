package com.autorecicla.api.controller;
import com.autorecicla.api.model.Modelo;
import com.autorecicla.api.service.ModeloService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/modelos")
@RequiredArgsConstructor
public class ModeloController {
    private final ModeloService service;

    @GetMapping
    public ResponseEntity<List<Modelo>> listar() {
        return ResponseEntity.ok(service.listar());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Modelo> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(service.buscarPorId(id));
    }

    @PostMapping
    public ResponseEntity<Modelo> salvar(@RequestBody Modelo modelo) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.salvar(modelo));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Modelo> atualizar(@PathVariable Long id, @RequestBody Modelo modelo) {
        return ResponseEntity.ok(service.atualizar(id, modelo));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        service.deletar(id);
        return ResponseEntity.noContent().build();
    }
}
