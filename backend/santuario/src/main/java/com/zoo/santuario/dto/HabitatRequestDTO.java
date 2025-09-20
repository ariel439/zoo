package com.zoo.santuario.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class HabitatRequestDTO {

    private String name;
    private String type;
    private int capacity;
    private String status;

}