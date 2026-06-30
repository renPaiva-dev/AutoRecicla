package com.autorecicla.api.service;

import com.autorecicla.api.model.Compatibilidade;
import com.autorecicla.api.model.Modelo;
import com.autorecicla.api.model.Peca;
import com.autorecicla.api.repository.CompatibilidadeRepository;
import com.autorecicla.api.repository.ModeloRepository;
import com.autorecicla.api.repository.PecaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

// service/CompatibilidadeService.java
@Service
@RequiredArgsConstructor
public class CompatibilidadeService {
    private final CompatibilidadeRepository repository;
    private final PecaRepository pecaRepository;
    private final ModeloRepository modeloRepository;

    public Compatibilidade salvar(Compatibilidade compatibilidade) {
        return repository.save(compatibilidade);
    }

    public List<Compatibilidade> listar() { return repository.findAll(); }

    public Compatibilidade buscarPorId(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Compatibilidade não encontrada"));
    }

    public List<Compatibilidade> listarPorPeca(Long pecaId) {
        Peca peca = pecaRepository.findById(pecaId)
                .orElseThrow(() -> new RuntimeException("Peça não encontrada"));
        return repository.findByPeca(peca);
    }

    public List<Compatibilidade> listarPorModelo(Long modeloId) {
        Modelo modelo = modeloRepository.findById(modeloId)
                .orElseThrow(() -> new RuntimeException("Modelo não encontrado"));
        return repository.findByModelo(modelo);
    }

    public void deletar(Long id) { repository.deleteById(id); }
}
