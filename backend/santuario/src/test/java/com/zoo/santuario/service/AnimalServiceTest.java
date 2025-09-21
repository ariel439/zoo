package com.zoo.santuario.service;

import com.zoo.santuario.dto.AnimalRequestDTO;
import com.zoo.santuario.dto.AnimalResponseDTO;
import com.zoo.santuario.model.Animal;
import com.zoo.santuario.model.Habitat;
import com.zoo.santuario.repository.AnimalRepository;
import com.zoo.santuario.repository.CuidadorRepository;
import com.zoo.santuario.repository.HabitatRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(MockitoExtension.class)
class AnimalServiceTest {

    @Mock
    private AnimalRepository animalRepository;

    @Mock
    private HabitatRepository habitatRepository;

    @Mock
    private CuidadorRepository cuidadorRepository;

    @Mock
    private EmailService emailService;

    @InjectMocks
    private AnimalService animalService;

    @Test
    void createAnimal_Success() {
        // Arrange
        AnimalRequestDTO requestDTO = new AnimalRequestDTO();
        requestDTO.setName("Simba");
        requestDTO.setKeeperId(1L);
        requestDTO.setHabitatId(1L);

        Habitat habitat = new Habitat();
        habitat.setId(1L);
        habitat.setName("Savana");
        habitat.setCapacity(10);

        Animal animal = new Animal();
        animal.setId(1L);
        animal.setName("Simba");

        when(habitatRepository.findById(1L)).thenReturn(Optional.of(habitat));
        when(animalRepository.countByHabitatId(1L)).thenReturn(5L);
        when(animalRepository.save(any(Animal.class))).thenAnswer(invocation -> invocation.getArgument(0));

        // Act
        AnimalResponseDTO response = animalService.createAnimal(requestDTO);

        // Assert
        assertNotNull(response);
        assertEquals("Simba", response.getName());
    }
}
