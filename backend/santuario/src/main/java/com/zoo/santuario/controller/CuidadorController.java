package com.zoo.santuario.controller;

import com.zoo.santuario.dto.CuidadorRequestDTO;
import com.zoo.santuario.dto.CuidadorResponseDTO;
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

    @GetMapping
    public ResponseEntity<List<CuidadorResponseDTO>> getAllCuidadores() {
        List<CuidadorResponseDTO> cuidadores = cuidadorService.getAllCuidadores();
        return new ResponseEntity<>(cuidadores, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<CuidadorResponseDTO> getCuidadorById(@PathVariable Long id) {
        return cuidadorService.getCuidadorById(id)
                .map(cuidador -> new ResponseEntity<>(cuidador, HttpStatus.OK))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @PostMapping
    public ResponseEntity<CuidadorResponseDTO> createCuidador(@RequestBody CuidadorRequestDTO cuidadorRequestDTO) {
        CuidadorResponseDTO createdCuidador = cuidadorService.createCuidador(cuidadorRequestDTO);
        return new ResponseEntity<>(createdCuidador, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<CuidadorResponseDTO> updateCuidador(@PathVariable Long id, @RequestBody CuidadorRequestDTO cuidadorRequestDTO) {
        return cuidadorService.updateCuidador(id, cuidadorRequestDTO)
                .map(cuidador -> new ResponseEntity<>(cuidador, HttpStatus.OK))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCuidador(@PathVariable Long id) {
        if (cuidadorService.deleteCuidador(id)) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }
}
