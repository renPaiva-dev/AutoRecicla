package com.autorecicla.api.service;

import com.autorecicla.api.model.Marca;
import com.autorecicla.api.repository.MarcaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

// service/MarcaService.java
@Service
@RequiredArgsConstructor
public class MarcaService {
    private final MarcaRepository repository;

    public Marca salvar(Marca marca) { return repository.save(marca); }
    public List<Marca> listar() { return repository.findAll(); }

    public Marca buscarPorId(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Marca não encontrada"));
    }

    public Marca atualizar(Long id, Marca dados) {
        Marca marca = buscarPorId(id);
        marca.setNomeMarca(dados.getNomeMarca());
        return repository.save(marca);
    }

    public void deletar(Long id) { repository.deleteById(id); }
}
