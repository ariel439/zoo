package com.zoo.santuario.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AlimentacaoResponseDTO {

    private Long id;
    private String foodType;
    private double quantity;
    private LocalDateTime feedingTime;

}
