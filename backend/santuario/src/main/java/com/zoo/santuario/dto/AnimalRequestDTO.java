package com.zoo.santuario.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AnimalRequestDTO {

    private String name;
    private String species;
    private int age;
    private String sex;
    private String arrivalDate;
    private String status;
    private String image; // Optional image URL

    // Relational IDs
    private Long keeperId;
    private Long vetId;
    private Long habitatId;
    private Long feedingPlanId;

}