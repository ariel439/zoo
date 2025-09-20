package com.zoo.santuario.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AlimentacaoRequestDTO {

    @NotNull
    private String planName;
    @NotNull
    private String animalSpecies;
    @NotNull
    private String foodType;
    @NotNull
    private String quantity;
    @NotNull
    private String frequency;

}