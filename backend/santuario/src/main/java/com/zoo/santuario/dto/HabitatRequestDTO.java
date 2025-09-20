package com.zoo.santuario.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class HabitatRequestDTO {

    @NotNull
    private String name;
    @NotNull
    private String type;
    private int capacity;
    @NotNull
    private String status;

}