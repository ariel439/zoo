package com.zoo.santuario.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class HabitatRequestDTO {

    @NotBlank
    private String name;
    @NotBlank
    private String type;
    private int capacity;
    @NotBlank
    private String status;

}