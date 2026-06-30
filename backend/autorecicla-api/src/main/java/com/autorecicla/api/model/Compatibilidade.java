package com.autorecicla.api.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity
@Table(name = "compatibilidade")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Compatibilidade {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_comp")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_peca", nullable = false)
    private Peca peca;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_modelo", nullable = false)
    private Modelo modelo;

    @Column(name = "ano_inicio", nullable = false)
    private Short anoInicio;

    @Column(name = "ano_fim", nullable = false)
    private Short anoFim;
}