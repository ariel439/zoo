package com.zoo.santuario.controller;

import com.zoo.santuario.dto.CuidadorRequestDTO;
import com.zoo.santuario.dto.CuidadorResponseDTO;
import com.zoo.santuario.exception.ResourceNotFoundException;
import com.zoo.santuario.service.CuidadorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cuidadores")
public class CuidadorController {

    @Autowired
    private CuidadorService cuidadorService;

    // This method is correct.
    @GetMapping
    public ResponseEntity<List<CuidadorResponseDTO>> getCuidadores(
            @RequestParam(required = false) String specialty) {
        List<CuidadorResponseDTO> cuidadores = cuidadorService.getFilteredCuidadores(specialty);
        return new ResponseEntity<>(cuidadores, HttpStatus.OK);
    }

    // This method is correct.
    @GetMapping("/{id}")
    public ResponseEntity<CuidadorResponseDTO> getCuidadorById(@PathVariable Long id) {
        return cuidadorService.getCuidadorById(id)
                .map(cuidador -> new ResponseEntity<>(cuidador, HttpStatus.OK))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    // This method is correct.
    @PostMapping
    public ResponseEntity<CuidadorResponseDTO> createCuidador(@RequestBody CuidadorRequestDTO cuidadorRequestDTO) {
        CuidadorResponseDTO createdCuidador = cuidadorService.createCuidador(cuidadorRequestDTO);
        return new ResponseEntity<>(createdCuidador, HttpStatus.CREATED);
    }

    // This method is correct.
    @PutMapping("/{id}")
    public ResponseEntity<CuidadorResponseDTO> updateCuidador(@PathVariable Long id, @RequestBody CuidadorRequestDTO cuidadorRequestDTO) {
        return cuidadorService.updateCuidador(id, cuidadorRequestDTO)
                .map(cuidador -> new ResponseEntity<>(cuidador, HttpStatus.OK))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    // CHANGED: This method now correctly handles the exceptions from the service layer.
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCuidador(@PathVariable Long id) {
        try {
            cuidadorService.deleteCuidador(id);
            return ResponseEntity.noContent().build(); // HTTP 204
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.notFound().build(); // HTTP 404
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).build(); // HTTP 409
        }
    }
}