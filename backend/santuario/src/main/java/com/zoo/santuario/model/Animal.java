package com.zoo.santuario.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Animal {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
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