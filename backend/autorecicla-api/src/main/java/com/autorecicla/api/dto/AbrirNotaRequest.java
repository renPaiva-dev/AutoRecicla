package com.autorecicla.api.dto;

import lombok.Data;

@Data
public class AbrirNotaRequest {
    private Long clienteId;
    private Long vendedorId;
}
