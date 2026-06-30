package com.autorecicla.api.service;

import com.autorecicla.api.dto.AbrirNotaRequest;
import com.autorecicla.api.dto.AdicionarPecaRequest;
import com.autorecicla.api.dto.FinalizarNotaRequest;
import com.autorecicla.api.model.*;
import com.autorecicla.api.repository.*;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class NotaService {

    private final NotaRepository notaRepository;
    private final NotaPecaRepository notaPecaRepository;
    private final VendedorRepository vendedorRepository;
    private final ClienteRepository clienteRepository;
    private final PecaRepository pecaRepository;

    // ── 1. ABRIR NOTA ──────────────────────────────────────────────
    @Transactional
    public Nota abrirNota(AbrirNotaRequest request) {
        Vendedor vendedor = vendedorRepository.findById(request.getVendedorId())
                .orElseThrow(() -> new RuntimeException("Vendedor não encontrado"));

        if (!vendedor.getAtivo()) {
            throw new RuntimeException("Vendedor inativo não pode abrir notas");
        }

        Cliente cliente = clienteRepository.findById(request.getClienteId())
                .orElseThrow(() -> new RuntimeException("Cliente não encontrado"));

        Nota nota = new Nota();
        nota.setVendedor(vendedor);
        nota.setCliente(cliente);
        nota.setStatus("Aberto");
        nota.setValorTotal(BigDecimal.ZERO);
        // dataCriacao e status já setados pelo @PrePersist

        return notaRepository.save(nota);
    }

    // ── 2. ADICIONAR PEÇA À NOTA ────────────────────────────────────
    @Transactional
    public NotaPeca adicionarPeca(Long notaId, AdicionarPecaRequest request) {
        Nota nota = notaRepository.findById(notaId)
                .orElseThrow(() -> new RuntimeException("Nota não encontrada"));

        if (!nota.getStatus().equals("Aberto")) {
            throw new RuntimeException("Só é possível adicionar peças em notas com status Aberto");
        }

        Peca peca = pecaRepository.findById(request.getPecaId())
                .orElseThrow(() -> new RuntimeException("Peça não encontrada"));

        // ── REGRA DE FILIAL: peça deve pertencer à mesma filial do vendedor
        Long filialVendedor = nota.getVendedor().getFilial().getId();
        Long filialPeca = peca.getFilial().getId();
        if (!filialVendedor.equals(filialPeca)) {
            throw new RuntimeException(
                    "Peça pertence à filial " + filialPeca +
                            ", mas o vendedor é da filial " + filialVendedor
            );
        }

        // ── REGRA DE ESTOQUE: quantidade disponível suficiente
        if (peca.getQuantidade() < request.getQuantidade()) {
            throw new RuntimeException(
                    "Estoque insuficiente. Disponível: " + peca.getQuantidade() +
                            ", solicitado: " + request.getQuantidade()
            );
        }

        // ── BAIXA NO ESTOQUE (Disponível → Reservada)
        peca.setQuantidade(peca.getQuantidade() - request.getQuantidade());
        pecaRepository.save(peca);

        // ── CRIA O ITEM DA NOTA
        NotaPeca item = new NotaPeca();
        item.setNota(nota);
        item.setPeca(peca);
        item.setQuantidade(request.getQuantidade());
        item.setValorVendido(peca.getValor());
        notaPecaRepository.save(item);

        // ── RECALCULA VALOR TOTAL DA NOTA
        recalcularTotal(nota);

        return item;
    }

    // ── 3. FINALIZAR NOTA (Reservada → Vendida) ────────────────────
    @Transactional
    public Nota finalizarNota(Long notaId, FinalizarNotaRequest request) {
        Nota nota = notaRepository.findById(notaId)
                .orElseThrow(() -> new RuntimeException("Nota não encontrada"));

        if (!nota.getStatus().equals("Aberto")) {
            throw new RuntimeException("Nota já foi finalizada ou cancelada");
        }

        List<NotaPeca> itens = notaPecaRepository.findByNota(nota);
        if (itens.isEmpty()) {
            throw new RuntimeException("Não é possível finalizar uma nota sem itens");
        }

        nota.setStatus("Finalizado");
        nota.setFormaPagamento(request.getFormaPagamento());
        nota.setDataVenda(LocalDateTime.now());

        return notaRepository.save(nota);
    }

    // ── 4. CANCELAR NOTA ────────────────────────────────────────────
    @Transactional
    public Nota cancelarNota(Long notaId) {
        Nota nota = notaRepository.findById(notaId)
                .orElseThrow(() -> new RuntimeException("Nota não encontrada"));

        if (!nota.getStatus().equals("Aberto")) {
            throw new RuntimeException("Só é possível cancelar notas com status Aberto");
        }

        // ── DEVOLVE AS PEÇAS AO ESTOQUE (Reservada → Disponível)
        List<NotaPeca> itens = notaPecaRepository.findByNota(nota);
        for (NotaPeca item : itens) {
            Peca peca = item.getPeca();
            peca.setQuantidade(peca.getQuantidade() + item.getQuantidade());
            pecaRepository.save(peca);
        }

        nota.setStatus("Cancelado");
        return notaRepository.save(nota);
    }

    // ── HELPER: recalcula valor_total somando os itens ──────────────
    private void recalcularTotal(Nota nota) {
        List<NotaPeca> itens = notaPecaRepository.findByNota(nota);
        BigDecimal total = itens.stream()
                .map(i -> i.getValorVendido().multiply(BigDecimal.valueOf(i.getQuantidade())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        nota.setValorTotal(total);
        notaRepository.save(nota);
    }

    // ── CONSULTAS ───────────────────────────────────────────────────
    public List<Nota> listarTodas() {
        return notaRepository.findAll();
    }

    public Nota buscarPorId(Long id) {
        return notaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Nota não encontrada"));
    }

    public List<NotaPeca> listarItensDaNota(Long notaId) {
        Nota nota = buscarPorId(notaId);
        return notaPecaRepository.findByNota(nota);
    }
}