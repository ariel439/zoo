package com.zoo.santuario.service;

import com.zoo.santuario.dto.AnimalRequestDTO;
import com.zoo.santuario.dto.AnimalResponseDTO;
import com.zoo.santuario.model.Animal;
import com.zoo.santuario.repository.AnimalRepository;
import com.zoo.santuario.repository.CuidadorRepository;
import com.zoo.santuario.model.Cuidador;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class AnimalService {

    @Autowired
    private AnimalRepository animalRepository;
    @Autowired
    private EmailService emailService;
    
    @Autowired
    private CuidadorRepository cuidadorRepository;

    public List<AnimalResponseDTO> getAllAnimals() {
        return animalRepository.findAll().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public Optional<AnimalResponseDTO> getAnimalById(Long id) {
        return animalRepository.findById(id)
                .map(this::convertToDto);
    }

    public AnimalResponseDTO createAnimal(AnimalRequestDTO animalRequestDTO) {
        Animal animal = convertToEntity(animalRequestDTO);
        Animal savedAnimal = animalRepository.save(animal);

        // Send email notification if keeperId is present
        if (savedAnimal.getKeeperId() != null) {
            cuidadorRepository.findById(savedAnimal.getKeeperId()).ifPresent(cuidador -> {
                String subject = "New Animal Assigned: " + savedAnimal.getName();
                String body = String.format("Dear %s,<br><br>A new animal, <b>%s</b> (Species: %s), has been assigned to you.<br><br>Regards,<br>Zoo Management",
                        cuidador.getName(), savedAnimal.getName(), savedAnimal.getSpecies());
                emailService.sendAnimalNotificationEmail(cuidador.getContact(), subject, body);
            });
        }

        return convertToDto(savedAnimal);
    }

    public Optional<AnimalResponseDTO> updateAnimal(Long id, AnimalRequestDTO animalRequestDTO) {
        return animalRepository.findById(id)
                .map(existingAnimal -> {
                    // Store old keeperId to check if it changed
                    Long oldKeeperId = existingAnimal.getKeeperId();

                    existingAnimal.setName(animalRequestDTO.getName());
                    existingAnimal.setSpecies(animalRequestDTO.getSpecies());
                    existingAnimal.setAge(animalRequestDTO.getAge());
                    existingAnimal.setSex(animalRequestDTO.getSex());
                    existingAnimal.setArrivalDate(animalRequestDTO.getArrivalDate());
                    existingAnimal.setStatus(animalRequestDTO.getStatus());
                    existingAnimal.setImage(animalRequestDTO.getImage());
                    existingAnimal.setKeeperId(animalRequestDTO.getKeeperId());
                    existingAnimal.setVetId(animalRequestDTO.getVetId());
                    existingAnimal.setHabitatId(animalRequestDTO.getHabitatId());
                    existingAnimal.setFeedingPlanId(animalRequestDTO.getFeedingPlanId());
                    Animal updatedAnimal = animalRepository.save(existingAnimal);

                    // Send email notification if keeperId changed or is newly assigned
                    if (updatedAnimal.getKeeperId() != null && !updatedAnimal.getKeeperId().equals(oldKeeperId)) {
                        cuidadorRepository.findById(updatedAnimal.getKeeperId()).ifPresent(cuidador -> {
                            String subject = "Animal Assignment Updated: " + updatedAnimal.getName();
                            String body = String.format("Dear %s,<br><br>The animal <b>%s</b> (Species: %s) has been assigned to you.<br><br>Regards,<br>Zoo Management",
                                    cuidador.getName(), updatedAnimal.getName(), updatedAnimal.getSpecies());
                            emailService.sendAnimalNotificationEmail(cuidador.getContact(), subject, body);
                        });
                    }
                    // Optionally, notify the old keeper if assignment changed
                    if (oldKeeperId != null && (updatedAnimal.getKeeperId() == null || !updatedAnimal.getKeeperId().equals(oldKeeperId))) {
                         cuidadorRepository.findById(oldKeeperId).ifPresent(cuidador -> {
                            String subject = "Animal Unassigned: " + updatedAnimal.getName();
                            String body = String.format("Dear %s,<br><br>The animal <b>%s</b> (Species: %s) has been unassigned from you.<br><br>Regards,<br>Zoo Management",
                                    cuidador.getName(), updatedAnimal.getName(), updatedAnimal.getSpecies());
                            emailService.sendAnimalNotificationEmail(cuidador.getContact(), subject, body);
                        });
                    }


                    return convertToDto(updatedAnimal);
                });
    }

    public boolean deleteAnimal(Long id) {
        Optional<Animal> animalOptional = animalRepository.findById(id);
        if (animalOptional.isPresent()) {
            Animal animalToDelete = animalOptional.get();
            animalRepository.deleteById(id);

            // Send email notification to keeper if assigned
            if (animalToDelete.getKeeperId() != null) {
                cuidadorRepository.findById(animalToDelete.getKeeperId()).ifPresent(cuidador -> {
                    String subject = "Animal Removed: " + animalToDelete.getName();
                    String body = String.format("Dear %s,<br><br>The animal <b>%s</b> (Species: %s), which was assigned to you, has been removed from the system.<br><br>Regards,<br>Zoo Management",
                            cuidador.getName(), animalToDelete.getName(), animalToDelete.getSpecies());
                    emailService.sendAnimalNotificationEmail(cuidador.getContact(), subject, body);
                });
            }
            return true;
        }
        return false;
    }

    private AnimalResponseDTO convertToDto(Animal animal) {
        return new AnimalResponseDTO(
                animal.getId(),
                animal.getName(),
                animal.getSpecies(),
                animal.getAge(),
                animal.getSex(),
                animal.getArrivalDate(),
                animal.getStatus(),
                animal.getImage(),
                animal.getKeeperId(),
                animal.getVetId(),
                animal.getHabitatId(),
                animal.getFeedingPlanId()
        );
    }

    private Animal convertToEntity(AnimalRequestDTO animalRequestDTO) {
        return new Animal(
                null, // ID will be generated by the database
                animalRequestDTO.getName(),
                animalRequestDTO.getSpecies(),
                animalRequestDTO.getAge(),
                animalRequestDTO.getSex(),
                animalRequestDTO.getArrivalDate(),
                animalRequestDTO.getStatus(),
                animalRequestDTO.getImage(),
                animalRequestDTO.getKeeperId(),
                animalRequestDTO.getVetId(),
                animalRequestDTO.getHabitatId(),
                animalRequestDTO.getFeedingPlanId()
        );
    }
}