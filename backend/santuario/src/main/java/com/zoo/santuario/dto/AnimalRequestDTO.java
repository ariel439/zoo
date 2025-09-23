package com.zoo.santuario.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AnimalRequestDTO {

    @NotBlank
    private String name;
    @NotBlank
    private String species;
    private int age;
    @NotBlank
    private String sex;
    @NotBlank
    private String arrivalDate;
    @NotBlank
    private String status;
    private String image; // Optional image URL

    // Relational IDs
    private Long keeperId;
    private Long vetId;
    private Long habitatId;
    private Long feedingPlanId;

}