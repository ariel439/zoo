package com.zoo.santuario.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Column;
import jakarta.persistence.Id;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Cuidador {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false)
    private String name;
    @Column(nullable = false, unique = true)
    private String contact;
    @Column(nullable = false)
    private String specialty;
    @Column(nullable = false)
    private String status; // This field represents the general employment status (e.g., 'Active', 'On Leave'), not the work shift.
    @Column(nullable = false)
    private String workShift; // Represents the work shift of the caretaker (e.g., 'Morning', 'Afternoon', 'Night')

    @OneToMany(mappedBy = "keeper")
    private List<Animal> animals;
}
