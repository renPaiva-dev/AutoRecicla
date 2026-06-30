package com.autorecicla.api.service;

import com.autorecicla.api.model.Categoria;
import com.autorecicla.api.repository.CategoriaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

// service/CategoriaService.java
@Service
@RequiredArgsConstructor
public class CategoriaService {
    private final CategoriaRepository repository;

    public Categoria salvar(Categoria categoria) { return repository.save(categoria); }
    public List<Categoria> listar() { return repository.findAll(); }

    public Categoria buscarPorId(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Categoria não encontrada"));
    }

    public Categoria atualizar(Long id, Categoria dados) {
        Categoria categoria = buscarPorId(id);
        categoria.setNomeCategoria(dados.getNomeCategoria());
        return repository.save(categoria);
    }

    public void deletar(Long id) { repository.deleteById(id); }
}
