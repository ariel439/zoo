package com.zoo.santuario.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CuidadorRequestDTO {

    @NotNull
    private String name;
    @NotNull
    private String contact;
    @NotNull
    private String specialty;
    @NotNull
    private String status;

}