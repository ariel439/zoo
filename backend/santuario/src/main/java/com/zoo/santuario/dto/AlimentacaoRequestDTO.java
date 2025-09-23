package com.zoo.santuario.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AlimentacaoRequestDTO {
    @NotBlank
    private String planName;
    @NotBlank
    private String foodType;
    @NotBlank
    private String quantity;
    @NotBlank
    private String frequency;
}