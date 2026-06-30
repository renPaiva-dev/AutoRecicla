package com.autorecicla.api.dto;

import lombok.Data;

@Data
public class AdicionarPecaRequest {
    private Long pecaId;
    private Integer quantidade;
}