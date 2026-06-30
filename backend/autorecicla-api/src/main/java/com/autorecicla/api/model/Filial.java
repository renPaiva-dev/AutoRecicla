package com.autorecicla.api.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity
@Table(name = "filial")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Filial {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_filial")
    private Long id;

    @Column(name = "nome_unidade", nullable = false)
    private String nomeUnidade;

    @Column(nullable = false)
    private String cidade;

    @Column(nullable = false)
    private String endereco;

    @Column(nullable = false, unique = true)
    private String cnpj;
}