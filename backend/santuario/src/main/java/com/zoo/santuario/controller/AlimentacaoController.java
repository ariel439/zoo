package com.zoo.santuario.controller;

import com.zoo.santuario.dto.AlimentacaoRequestDTO;
import com.zoo.santuario.dto.AlimentacaoResponseDTO;
import com.zoo.santuario.exception.ResourceNotFoundException;
import com.zoo.santuario.service.AlimentacaoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/alimentacoes")
public class AlimentacaoController {

    @Autowired
    private AlimentacaoService alimentacaoService;

    @GetMapping
    public ResponseEntity<List<AlimentacaoResponseDTO>> getAlimentacoes(
            @RequestParam(required = false) String foodType,
            @RequestParam(required = false) Long animalId) {
        List<AlimentacaoResponseDTO> alimentacoes = alimentacaoService.getFilteredAlimentacoes(foodType, animalId);
        return new ResponseEntity<>(alimentacoes, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<AlimentacaoResponseDTO> getAlimentacaoById(@PathVariable Long id) {
        return alimentacaoService.getAlimentacaoById(id)
                .map(alimentacao -> new ResponseEntity<>(alimentacao, HttpStatus.OK))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @PostMapping
    public ResponseEntity<AlimentacaoResponseDTO> createAlimentacao(@RequestBody AlimentacaoRequestDTO alimentacaoRequestDTO) {
        AlimentacaoResponseDTO createdAlimentacao = alimentacaoService.createAlimentacao(alimentacaoRequestDTO);
        return new ResponseEntity<>(createdAlimentacao, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<AlimentacaoResponseDTO> updateAlimentacao(@PathVariable Long id, @RequestBody AlimentacaoRequestDTO alimentacaoRequestDTO) {
        return alimentacaoService.updateAlimentacao(id, alimentacaoRequestDTO)
                .map(alimentacao -> new ResponseEntity<>(alimentacao, HttpStatus.OK))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    // CHANGED: This method now uses a try/catch block to handle service-layer exceptions.
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAlimentacao(@PathVariable Long id) {
        try {
            alimentacaoService.deleteAlimentacao(id);
            // On success, return 204 No Content
            return ResponseEntity.noContent().build(); 
        } catch (ResourceNotFoundException e) {
            // If the service can't find the resource, return 404 Not Found
            return ResponseEntity.notFound().build();
        } catch (IllegalStateException e) {
            // If the service says it's in use, return 409 Conflict
            return ResponseEntity.status(HttpStatus.CONFLICT).build(); 
        }
    }
}