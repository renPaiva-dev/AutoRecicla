package com.autorecicla.api.controller;
import com.autorecicla.api.model.Peca;
import com.autorecicla.api.service.PecaService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/pecas")
@RequiredArgsConstructor
public class PecaController {
    private final PecaService service;

    @GetMapping
    public ResponseEntity<List<Peca>> listar() {
        return ResponseEntity.ok(service.listar());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Peca> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(service.buscarPorId(id));
    }

    @GetMapping("/filial/{filialId}")
    public ResponseEntity<List<Peca>> listarPorFilial(@PathVariable Long filialId) {
        return ResponseEntity.ok(service.listarPorFilial(filialId));
    }

    @PostMapping
    public ResponseEntity<Peca> salvar(@RequestBody Peca peca) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.salvar(peca));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Peca> atualizar(@PathVariable Long id, @RequestBody Peca peca) {
        return ResponseEntity.ok(service.atualizar(id, peca));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        service.deletar(id);
        return ResponseEntity.noContent().build();
    }
}
