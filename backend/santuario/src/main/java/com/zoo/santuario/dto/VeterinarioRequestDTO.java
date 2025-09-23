package com.zoo.santuario.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class VeterinarioRequestDTO {

    @NotBlank
    private String name;
    @NotBlank
    private String crmv;
    @NotBlank
    private String specialty;
    @NotBlank
    private String status;

}