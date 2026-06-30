package com.autorecicla.api.service;

import com.autorecicla.api.model.Cliente;
import com.autorecicla.api.repository.ClienteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;


@Service
@RequiredArgsConstructor
public class ClienteService {
    private final ClienteRepository repository;

    public Cliente salvar(Cliente cliente) { return repository.save(cliente); }
    public List<Cliente> listar() { return repository.findAll(); }

    public Cliente buscarPorId(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Cliente não encontrado"));
    }

    public Cliente atualizar(Long id, Cliente dados) {
        Cliente cliente = buscarPorId(id);
        cliente.setNome(dados.getNome());
        cliente.setTelefone(dados.getTelefone());
        cliente.setEmail(dados.getEmail());
        return repository.save(cliente);
    }

    public void deletar(Long id) { repository.deleteById(id); }
}
