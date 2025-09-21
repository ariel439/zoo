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

    @GetMapping
    public ResponseEntity<List<HabitatResponseDTO>> getHabitats(
            @RequestParam(required = false) String type) {
        List<HabitatResponseDTO> habitats = habitatService.getFilteredHabitats(type);
        return new ResponseEntity<>(habitats, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<HabitatResponseDTO> getHabitatById(@PathVariable Long id) {
        return habitatService.getHabitatById(id)
                .map(habitat -> new ResponseEntity<>(habitat, HttpStatus.OK))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @PostMapping
    public ResponseEntity<HabitatResponseDTO> createHabitat(@RequestBody HabitatRequestDTO habitatRequestDTO) {
        HabitatResponseDTO createdHabitat = habitatService.createHabitat(habitatRequestDTO);
        return new ResponseEntity<>(createdHabitat, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<HabitatResponseDTO> updateHabitat(@PathVariable Long id, @RequestBody HabitatRequestDTO habitatRequestDTO) {
        return habitatService.updateHabitat(id, habitatRequestDTO)
                .map(habitat -> new ResponseEntity<>(habitat, HttpStatus.OK))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteHabitat(@PathVariable Long id) {
        if (habitatService.deleteHabitat(id)) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }
}
