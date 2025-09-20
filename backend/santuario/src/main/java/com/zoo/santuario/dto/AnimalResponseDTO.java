package com.zoo.santuario.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AnimalResponseDTO {

    private Long id;
    private String name;
    private String species;
    private String breed;
    private int age;
    private String location;
    private String healthStatus;

}
