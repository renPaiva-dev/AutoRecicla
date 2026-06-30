package com.autorecicla.api.controller;
import com.autorecicla.api.model.Vendedor;
import com.autorecicla.api.service.VendedorService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
// controller/VendedorController.java
@RestController
@RequestMapping("/vendedores")
@RequiredArgsConstructor
public class VendedorController {
    private final VendedorService service;

    @GetMapping
    public ResponseEntity<List<Vendedor>> listar() {
        return ResponseEntity.ok(service.listar());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Vendedor> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(service.buscarPorId(id));
    }

    @PostMapping
    public ResponseEntity<Vendedor> salvar(@RequestBody Vendedor vendedor) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.salvar(vendedor));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Vendedor> atualizar(@PathVariable Long id, @RequestBody Vendedor vendedor) {
        return ResponseEntity.ok(service.atualizar(id, vendedor));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        service.deletar(id);
        return ResponseEntity.noContent().build();
    }
}
