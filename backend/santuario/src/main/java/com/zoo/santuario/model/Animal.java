package com.zoo.santuario.model;

import jakarta.persistence.*;
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
    @Column(nullable = false)
    private String name;
    @Column(nullable = false)
    private String species;
    private int age;
    @Column(nullable = false)
    private String sex;
    @Column(nullable = false)
    private String arrivalDate;
    @Column(nullable = false)
    private String status;
    private String image;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "keeper_id")
    private Cuidador keeper;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "vet_id")
    private Veterinario vet;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "habitat_id")
    private Habitat habitat; 

    @ManyToOne(fetch = FetchType.LAZY) 
    @JoinColumn(name = "feeding_plan_id")
    private Alimentacao feedingPlan;
}