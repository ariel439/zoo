package com.zoo.santuario.controller;

import com.zoo.santuario.dto.AnimalRequestDTO;
import com.zoo.santuario.dto.AnimalResponseDTO;
import com.zoo.santuario.service.AnimalService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;

@RestController
@RequestMapping("/api/animals")
public class AnimalController {

    private static final Logger logger = LoggerFactory.getLogger(AnimalController.class);

    @Autowired
    private AnimalService animalService;

    @GetMapping
    public ResponseEntity<List<AnimalResponseDTO>> getAnimals(
            @RequestParam(required = false) String species,
            @RequestParam(required = false) Integer ageMin,
            @RequestParam(required = false) Integer ageMax,
            @RequestParam(required = false) String name) {
        logger.debug("Received request to get animals with species: {}, ageMin: {}, ageMax: {}, name: {}", species, ageMin, ageMax, name);
        List<AnimalResponseDTO> animals = animalService.getFilteredAnimals(species, ageMin, ageMax, name);
        logger.debug("Returning {} animals", animals.size());
        return new ResponseEntity<>(animals, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<AnimalResponseDTO> getAnimalById(@PathVariable Long id) {
        logger.debug("Received request to get animal by ID: {}", id);
        AnimalResponseDTO animal = animalService.getAnimalById(id);
        logger.debug("Returning animal with ID: {}", id);
        return new ResponseEntity<>(animal, HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<AnimalResponseDTO> createAnimal(@RequestBody AnimalRequestDTO animalRequestDTO) {
        logger.debug("Received request to create animal: {}", animalRequestDTO.getName());
        AnimalResponseDTO createdAnimal = animalService.createAnimal(animalRequestDTO);
        logger.info("Animal created successfully with ID: {}", createdAnimal.getId());
        return new ResponseEntity<>(createdAnimal, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<AnimalResponseDTO> updateAnimal(@PathVariable Long id, @RequestBody AnimalRequestDTO animalRequestDTO) {
        logger.debug("Received request to update animal with ID: {}", id);
        AnimalResponseDTO updatedAnimal = animalService.updateAnimal(id, animalRequestDTO);
        logger.info("Animal with ID {} updated successfully.", updatedAnimal.getId());
        return new ResponseEntity<>(updatedAnimal, HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAnimal(@PathVariable Long id) {
        logger.debug("Received request to delete animal with ID: {}", id);
        animalService.deleteAnimal(id);
        logger.info("Animal with ID {} deleted successfully.", id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
