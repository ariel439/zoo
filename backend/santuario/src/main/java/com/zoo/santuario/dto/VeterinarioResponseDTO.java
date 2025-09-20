package com.zoo.santuario.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class VeterinarioResponseDTO {

    private Long id;
    private String name;
    private String crmv;
    private String specialty;
    private String status;

}