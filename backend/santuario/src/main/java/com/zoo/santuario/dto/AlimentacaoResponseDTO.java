package com.zoo.santuario.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AlimentacaoResponseDTO {

    private Long id;
    private String planName;
    private String animalSpecies;
    private String foodType;
    private String quantity;
    private String frequency;
    private Long animalId;

}