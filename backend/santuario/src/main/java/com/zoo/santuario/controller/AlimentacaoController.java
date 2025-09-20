package com.zoo.santuario.controller;

import com.zoo.santuario.dto.AlimentacaoRequestDTO;
import com.zoo.santuario.dto.AlimentacaoResponseDTO;
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
    public ResponseEntity<List<AlimentacaoResponseDTO>> getAllAlimentacoes() {
        List<AlimentacaoResponseDTO> alimentacoes = alimentacaoService.getAllAlimentacoes();
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

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAlimentacao(@PathVariable Long id) {
        if (alimentacaoService.deleteAlimentacao(id)) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }
}
