package com.zoo.santuario.controller;

import com.zoo.santuario.dto.VeterinarioRequestDTO;
import com.zoo.santuario.dto.VeterinarioResponseDTO;
import com.zoo.santuario.service.VeterinarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/veterinarios")
public class VeterinarioController {

    @Autowired
    private VeterinarioService veterinarioService;

    @GetMapping
    public ResponseEntity<List<VeterinarioResponseDTO>> getVeterinarios(
            @RequestParam(required = false) String specialty) {
        List<VeterinarioResponseDTO> veterinarios = veterinarioService.getFilteredVeterinarios(specialty);
        return new ResponseEntity<>(veterinarios, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<VeterinarioResponseDTO> getVeterinarioById(@PathVariable Long id) {
        return veterinarioService.getVeterinarioById(id)
                .map(veterinario -> new ResponseEntity<>(veterinario, HttpStatus.OK))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @PostMapping
    public ResponseEntity<VeterinarioResponseDTO> createVeterinario(@RequestBody VeterinarioRequestDTO veterinarioRequestDTO) {
        VeterinarioResponseDTO createdVeterinario = veterinarioService.createVeterinario(veterinarioRequestDTO);
        return new ResponseEntity<>(createdVeterinario, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<VeterinarioResponseDTO> updateVeterinario(@PathVariable Long id, @RequestBody VeterinarioRequestDTO veterinarioRequestDTO) {
        return veterinarioService.updateVeterinario(id, veterinarioRequestDTO)
                .map(veterinario -> new ResponseEntity<>(veterinario, HttpStatus.OK))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    // CHANGED: This now relies on the GlobalExceptionHandler to manage errors.
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteVeterinario(@PathVariable Long id) {
        veterinarioService.deleteVeterinario(id);
        return ResponseEntity.noContent().build();
    }
}