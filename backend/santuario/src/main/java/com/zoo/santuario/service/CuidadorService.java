package com.zoo.santuario.service;

import com.zoo.santuario.dto.CuidadorRequestDTO;
import com.zoo.santuario.dto.CuidadorResponseDTO;
import com.zoo.santuario.model.Cuidador;
import com.zoo.santuario.repository.CuidadorRepository;
import com.zoo.santuario.exception.ResourceNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class CuidadorService {

    @Autowired
    private CuidadorRepository cuidadorRepository;

    public List<CuidadorResponseDTO> getAllCuidadores() {
        return cuidadorRepository.findAll().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public List<CuidadorResponseDTO> getFilteredCuidadores(String specialty) {
        List<Cuidador> cuidadores;
        if (specialty != null) {
            cuidadores = cuidadorRepository.findBySpecialty(specialty);
        } else {
            cuidadores = cuidadorRepository.findAll();
        }
        return cuidadores.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public Optional<CuidadorResponseDTO> getCuidadorById(Long id) {
        return cuidadorRepository.findById(id)
                .map(this::convertToDto);
    }

    public CuidadorResponseDTO createCuidador(CuidadorRequestDTO cuidadorRequestDTO) {
        if (cuidadorRepository.findByContact(cuidadorRequestDTO.getContact()).isPresent()) {
            throw new IllegalArgumentException("A cuidador with this contact already exists.");
        }
        Cuidador cuidador = convertToEntity(cuidadorRequestDTO);
        Cuidador savedCuidador = cuidadorRepository.save(cuidador);
        return convertToDto(savedCuidador);
    }

    public Optional<CuidadorResponseDTO> updateCuidador(Long id, CuidadorRequestDTO cuidadorRequestDTO) {
        return cuidadorRepository.findById(id)
                .map(existingCuidador -> {
                    // Check if the contact is being changed to an existing one by another cuidador
                    if (!existingCuidador.getContact().equals(cuidadorRequestDTO.getContact())) {
                        if (cuidadorRepository.findByContact(cuidadorRequestDTO.getContact()).isPresent()) {
                            throw new IllegalArgumentException("A cuidador with this contact already exists.");
                        }
                    }
                    existingCuidador.setName(cuidadorRequestDTO.getName());
                    existingCuidador.setContact(cuidadorRequestDTO.getContact());
                    existingCuidador.setSpecialty(cuidadorRequestDTO.getSpecialty());
                    existingCuidador.setStatus(cuidadorRequestDTO.getStatus());
                    existingCuidador.setWorkShift(cuidadorRequestDTO.getWorkShift());
                    Cuidador updatedCuidador = cuidadorRepository.save(existingCuidador);
                    return convertToDto(updatedCuidador);
                });
    }

public boolean deleteCuidador(Long id) {
    // 1. Find the keeper first to check their relationships
    Cuidador cuidador = cuidadorRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Cuidador not found with ID: " + id));

    // 2. Check if the keeper's list of animals is empty
    if (!cuidador.getAnimals().isEmpty()) {
        // If the list is NOT empty, throw an error and do not delete
        throw new IllegalStateException("Cannot delete keeper " + cuidador.getName() + " because they are still assigned to " + cuidador.getAnimals().size() + " animal(s).");
    }

    // 3. If the list is empty, it's safe to delete
    cuidadorRepository.delete(cuidador);
    return true;
}

    private CuidadorResponseDTO convertToDto(Cuidador cuidador) {
        return new CuidadorResponseDTO(
                cuidador.getId(),
                cuidador.getName(),
                cuidador.getContact(),
                cuidador.getSpecialty(),
                cuidador.getStatus(),
                cuidador.getWorkShift()
        );
    }

    private Cuidador convertToEntity(CuidadorRequestDTO cuidadorRequestDTO) {
        return new Cuidador(
                null, // ID
                cuidadorRequestDTO.getName(),
                cuidadorRequestDTO.getContact(),
                cuidadorRequestDTO.getSpecialty(),
                cuidadorRequestDTO.getStatus(),
                cuidadorRequestDTO.getWorkShift(),
                null // Pass null for the new 'animals' list
        );
    }
}