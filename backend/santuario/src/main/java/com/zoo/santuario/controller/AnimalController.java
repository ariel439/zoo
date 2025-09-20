package com.zoo.santuario.controller;

import com.zoo.santuario.dto.AnimalRequestDTO;
import com.zoo.santuario.dto.AnimalResponseDTO;
import com.zoo.santuario.service.AnimalService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/animals")
public class AnimalController {

    @Autowired
    private AnimalService animalService;

    @GetMapping
    public ResponseEntity<List<AnimalResponseDTO>> getAllAnimals() {
        List<AnimalResponseDTO> animals = animalService.getAllAnimals();
        return new ResponseEntity<>(animals, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<AnimalResponseDTO> getAnimalById(@PathVariable Long id) {
        return animalService.getAnimalById(id)
                .map(animal -> new ResponseEntity<>(animal, HttpStatus.OK))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @PostMapping
    public ResponseEntity<AnimalResponseDTO> createAnimal(@RequestBody AnimalRequestDTO animalRequestDTO) {
        AnimalResponseDTO createdAnimal = animalService.createAnimal(animalRequestDTO);
        return new ResponseEntity<>(createdAnimal, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<AnimalResponseDTO> updateAnimal(@PathVariable Long id, @RequestBody AnimalRequestDTO animalRequestDTO) {
        return animalService.updateAnimal(id, animalRequestDTO)
                .map(animal -> new ResponseEntity<>(animal, HttpStatus.OK))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAnimal(@PathVariable Long id) {
        if (animalService.deleteAnimal(id)) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }
}
