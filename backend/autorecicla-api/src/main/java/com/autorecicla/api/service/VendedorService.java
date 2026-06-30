package com.autorecicla.api.service;

import com.autorecicla.api.model.Filial;
import com.autorecicla.api.model.Vendedor;
import com.autorecicla.api.repository.FilialRepository;
import com.autorecicla.api.repository.VendedorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

// service/VendedorService.java
@Service
@RequiredArgsConstructor
public class VendedorService {
    private final VendedorRepository repository;
    private final FilialRepository filialRepository;

    public Vendedor salvar(Vendedor vendedor) { return repository.save(vendedor); }

    public List<Vendedor> listar() { return repository.findAll(); }

    public Vendedor buscarPorId(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Vendedor não encontrado"));
    }

    public Vendedor atualizar(Long id, Vendedor dados) {
        Vendedor vendedor = buscarPorId(id);
        vendedor.setNome(dados.getNome());
        vendedor.setCargo(dados.getCargo());
        vendedor.setAtivo(dados.getAtivo());
        if (dados.getFilial() != null) {
            Filial filial = filialRepository.findById(dados.getFilial().getId())
                    .orElseThrow(() -> new RuntimeException("Filial não encontrada"));
            vendedor.setFilial(filial);
        }
        return repository.save(vendedor);
    }

    public void deletar(Long id) { repository.deleteById(id); }
}
