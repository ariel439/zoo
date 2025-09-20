package com.zoo.santuario.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CuidadorRequestDTO {

    private String name;
    private String contact;
    private String specialty;
    private String status;

}