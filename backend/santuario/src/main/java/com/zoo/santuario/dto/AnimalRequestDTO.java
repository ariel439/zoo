package com.zoo.santuario.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AnimalRequestDTO {

    @NotNull
    private String name;
    @NotNull
    private String species;
    private int age;
    @NotNull
    private String sex;
    @NotNull
    private String arrivalDate;
    @NotNull
    private String status;
    private String image; // Optional image URL

    // Relational IDs
    private Long keeperId;
    private Long vetId;
    private Long habitatId;
    private Long feedingPlanId;

}