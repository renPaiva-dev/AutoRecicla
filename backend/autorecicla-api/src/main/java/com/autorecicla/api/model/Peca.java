package com.autorecicla.api.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.math.BigDecimal;

@Entity
@Table(name = "peca")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Peca {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_peca")
    private Long id;

    @Column(name = "nome_peca", nullable = false)
    private String nomePeca;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal valor;

    @Column(name = "estado_conservacao", nullable = false)
    private String estadoConservacao; // Novo, Seminovo, Usado

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_categoria", nullable = false)
    private Categoria categoria;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_filial", nullable = false)
    private Filial filial;

    @Column(nullable = false)
    private Integer quantidade;
}