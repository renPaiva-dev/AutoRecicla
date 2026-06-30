package com.autorecicla.api.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.math.BigDecimal;

@Entity
@Table(name = "nota_peca")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class NotaPeca {

    @EmbeddedId
    private NotaPecaId id = new NotaPecaId();

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("idNota")
    @JoinColumn(name = "id_nota")
    private Nota nota;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("idPeca")
    @JoinColumn(name = "id_peca")
    private Peca peca;

    @Column(name = "valor_vendido", nullable = false, precision = 10, scale = 2)
    private BigDecimal valorVendido;

    @Column(nullable = false)
    private Integer quantidade;
}