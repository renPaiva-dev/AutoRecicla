package com.autorecicla.api.service;

import com.autorecicla.api.model.Categoria;
import com.autorecicla.api.model.Filial;
import com.autorecicla.api.model.Peca;
import com.autorecicla.api.repository.CategoriaRepository;
import com.autorecicla.api.repository.FilialRepository;
import com.autorecicla.api.repository.PecaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

// service/PecaService.java
@Service
@RequiredArgsConstructor
public class PecaService {
    private final PecaRepository repository;
    private final CategoriaRepository categoriaRepository;
    private final FilialRepository filialRepository;

    public Peca salvar(Peca peca) { return repository.save(peca); }
    public List<Peca> listar() { return repository.findAll(); }

    public Peca buscarPorId(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Peça não encontrada"));
    }

    public List<Peca> listarPorFilial(Long filialId) {
        Filial filial = filialRepository.findById(filialId)
                .orElseThrow(() -> new RuntimeException("Filial não encontrada"));
        return repository.findByFilial(filial);
    }

    public Peca atualizar(Long id, Peca dados) {
        Peca peca = buscarPorId(id);
        peca.setNomePeca(dados.getNomePeca());
        peca.setValor(dados.getValor());
        peca.setEstadoConservacao(dados.getEstadoConservacao());
        peca.setQuantidade(dados.getQuantidade());
        if (dados.getCategoria() != null) {
            Categoria cat = categoriaRepository.findById(dados.getCategoria().getId())
                    .orElseThrow(() -> new RuntimeException("Categoria não encontrada"));
            peca.setCategoria(cat);
        }
        return repository.save(peca);
    }

    public void deletar(Long id) { repository.deleteById(id); }
}
