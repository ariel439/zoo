package com.zoo.santuario.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Veterinario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false)
    private String name;
    @Column(nullable = false, unique = true)
    private String crmv;
    @Column(nullable = false)
    private String specialty;
    @Column(nullable = false)
    private String status;

    @OneToMany(mappedBy = "vet")
    private List<Animal> animals;
}