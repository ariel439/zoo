package com.zoo.santuario.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Column;
import jakarta.persistence.Id;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Alimentacao {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false)
    private String planName;
    @Column(nullable = false)
    private String foodType;
    @Column(nullable = false)
    private String quantity;
    @Column(nullable = false)
    private String frequency;

    @OneToMany(mappedBy = "feedingPlan")
    private List<Animal> animals;
}