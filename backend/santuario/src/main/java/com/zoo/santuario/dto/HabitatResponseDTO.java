package com.zoo.santuario.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class HabitatResponseDTO {

    private Long id;
    private String name;
    private String type;
    private int capacity;
    private String status;

}