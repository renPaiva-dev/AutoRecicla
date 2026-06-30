package com.autorecicla.api.controller;
import com.autorecicla.api.model.Marca;
import com.autorecicla.api.service.MarcaService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/marcas")
@RequiredArgsConstructor
public class MarcaController {
    private final MarcaService service;

    @GetMapping
    public ResponseEntity<List<Marca>> listar() {
        return ResponseEntity.ok(service.listar());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Marca> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(service.buscarPorId(id));
    }

    @PostMapping
    public ResponseEntity<Marca> salvar(@RequestBody Marca marca) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.salvar(marca));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Marca> atualizar(@PathVariable Long id, @RequestBody Marca marca) {
        return ResponseEntity.ok(service.atualizar(id, marca));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        service.deletar(id);
        return ResponseEntity.noContent().build();
    }
}
