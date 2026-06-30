package com.autorecicla.api.service;

import com.autorecicla.api.model.Filial;
import com.autorecicla.api.repository.FilialRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

// service/FilialService.java
// service/FilialService.java
@Service
@RequiredArgsConstructor
public class FilialService {
    private final FilialRepository repository;

    public Filial salvar(Filial filial) { return repository.save(filial); }
    public List<Filial> listar() { return repository.findAll(); }

    public Filial buscarPorId(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Filial não encontrada"));
    }

    public Filial atualizar(Long id, Filial dados) {
        Filial filial = buscarPorId(id);
        filial.setNomeUnidade(dados.getNomeUnidade());
        filial.setCidade(dados.getCidade());
        filial.setEndereco(dados.getEndereco());
        filial.setCnpj(dados.getCnpj());
        return repository.save(filial);
    }

    public void deletar(Long id) { repository.deleteById(id); }
}
