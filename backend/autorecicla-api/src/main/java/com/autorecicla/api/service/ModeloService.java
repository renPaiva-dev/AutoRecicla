package com.autorecicla.api.service;

import com.autorecicla.api.model.Marca;
import com.autorecicla.api.model.Modelo;
import com.autorecicla.api.repository.MarcaRepository;
import com.autorecicla.api.repository.ModeloRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

// service/ModeloService.java
@Service
@RequiredArgsConstructor
public class ModeloService {
    private final ModeloRepository repository;
    private final MarcaRepository marcaRepository;

    public Modelo salvar(Modelo modelo) { return repository.save(modelo); }
    public List<Modelo> listar() { return repository.findAll(); }

    public Modelo buscarPorId(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Modelo não encontrado"));
    }

    public Modelo atualizar(Long id, Modelo dados) {
        Modelo modelo = buscarPorId(id);
        modelo.setNomeModelo(dados.getNomeModelo());
        if (dados.getMarca() != null) {
            Marca marca = marcaRepository.findById(dados.getMarca().getId())
                    .orElseThrow(() -> new RuntimeException("Marca não encontrada"));
            modelo.setMarca(marca);
        }
        return repository.save(modelo);
    }

    public void deletar(Long id) { repository.deleteById(id); }
}
