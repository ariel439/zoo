package com.zoo.santuario.controller;

import com.zoo.santuario.dto.HabitatRequestDTO;
import com.zoo.santuario.dto.HabitatResponseDTO;
import com.zoo.santuario.service.HabitatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/habitats")
public class HabitatController {

    @Autowired
    private HabitatService habitatService;

    // This method is correct.
    @GetMapping
    public ResponseEntity<List<HabitatResponseDTO>> getHabitats(
            @RequestParam(required = false) String type) {
        List<HabitatResponseDTO> habitats = habitatService.getFilteredHabitats(type);
        return new ResponseEntity<>(habitats, HttpStatus.OK);
    }

    // This method is correct.
    @GetMapping("/{id}")
    public ResponseEntity<HabitatResponseDTO> getHabitatById(@PathVariable Long id) {
        return habitatService.getHabitatById(id)
                .map(habitat -> new ResponseEntity<>(habitat, HttpStatus.OK))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    // This method is correct.
    @PostMapping
    public ResponseEntity<HabitatResponseDTO> createHabitat(@RequestBody HabitatRequestDTO habitatRequestDTO) {
        HabitatResponseDTO createdHabitat = habitatService.createHabitat(habitatRequestDTO);
        return new ResponseEntity<>(createdHabitat, HttpStatus.CREATED);
    }

    // This method is correct.
    @PutMapping("/{id}")
    public ResponseEntity<HabitatResponseDTO> updateHabitat(@PathVariable Long id, @RequestBody HabitatRequestDTO habitatRequestDTO) {
        return habitatService.updateHabitat(id, habitatRequestDTO)
                .map(habitat -> new ResponseEntity<>(habitat, HttpStatus.OK))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    // CHANGED: This is the super-clean version that relies on the GlobalExceptionHandler.
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteHabitat(@PathVariable Long id) {
        // Call the service. If it throws an exception, the GlobalExceptionHandler will catch it
        // and return the correct 404 (Not Found) or 409 (Conflict) response.
        habitatService.deleteHabitat(id);
        
        // If no exception is thrown, the deletion was successful.
        return ResponseEntity.noContent().build();
    }
}