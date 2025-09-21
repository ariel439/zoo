package com.zoo.santuario.service;

import com.zoo.santuario.dto.AnimalRequestDTO;
import com.zoo.santuario.dto.AnimalResponseDTO;
import com.zoo.santuario.model.Animal;
import com.zoo.santuario.repository.AnimalRepository;
import com.zoo.santuario.repository.CuidadorRepository;
import com.zoo.santuario.model.Cuidador;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class AnimalService {

    private static final Logger logger = LoggerFactory.getLogger(AnimalService.class);

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
            logger.info("Attempting to send email for new animal: {}", savedAnimal.getName());
            cuidadorRepository.findById(savedAnimal.getKeeperId()).ifPresent(cuidador -> {
                logger.info("Cuidador found for keeperId: {}. Contact email: {}", savedAnimal.getKeeperId(), cuidador.getContact());
                String subject = "Novo Animal Atribuído: " + savedAnimal.getName();
                String body = String.format("Prezado(a) %s,<br><br>Um novo animal, <b>%s</b> (Espécie: %s), foi atribuído a você.<br><br>Atenciosamente,<br>Gerência do Zoológico",
                        cuidador.getName().replace("%", "%%"), savedAnimal.getName().replace("%", "%%"), savedAnimal.getSpecies().replace("%", "%%"));
                emailService.sendAnimalNotificationEmail(cuidador.getContact(), subject, body);
            });
        } else {
            logger.info("No keeperId present for new animal: {}. Skipping email notification.", savedAnimal.getName());
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
                    Animal updatedAnimal;
                    try {
                        updatedAnimal = animalRepository.save(existingAnimal);
                    } catch (Exception e) {
                        logger.error("Error saving animal with ID {}: {}", id, e.getMessage(), e);
                        throw new RuntimeException("Failed to save animal: " + e.getMessage(), e);
                    }

                    // Send email notification if keeperId changed or is newly assigned
                    try {
                        if (updatedAnimal.getKeeperId() != null && !updatedAnimal.getKeeperId().equals(oldKeeperId)) {
                            logger.info("Attempting to send email for updated animal (new keeper): {}", updatedAnimal.getName());
                            cuidadorRepository.findById(updatedAnimal.getKeeperId()).ifPresent(cuidador -> {
                                logger.info("Cuidador found for new keeperId: {}. Contact email: {}", updatedAnimal.getKeeperId(), cuidador.getContact());
                                String subject = "Atribuição de Animal Atualizada: " + updatedAnimal.getName();
                                String body = String.format("Prezado(a) %s,<br><br>O animal <b>%s</b> (Espécie: %s) foi atribuído a você.<br><br>Atenciosamente,<br>Gerência do Zoológico",
                                        cuidador.getName().replace("%", "%%"), updatedAnimal.getName().replace("%", "%%"), updatedAnimal.getSpecies().replace("%", "%%"));
                                emailService.sendAnimalNotificationEmail(cuidador.getContact(), subject, body);
                            });
                        } else if (updatedAnimal.getKeeperId() != null && updatedAnimal.getKeeperId().equals(oldKeeperId)) {
                            // If keeperId is the same but other animal details might have changed, notify the keeper
                            logger.info("Attempting to send email for updated animal (same keeper): {}", updatedAnimal.getName());
                            cuidadorRepository.findById(updatedAnimal.getKeeperId()).ifPresent(cuidador -> {
                                logger.info("Cuidador found for keeperId: {}. Contact email: {}", updatedAnimal.getKeeperId(), cuidador.getContact());
                                String subject = "Detalhes do Animal Atualizados: " + updatedAnimal.getName();
                                String body = String.format("Prezado(a) %s,<br><br>Os detalhes do animal <b>%s</b> (Espécie: %s), atribuído a você, foram atualizados.<br><br>Atenciosamente,<br>Gerência do Zoológico",
                                        cuidador.getName().replace("%", "%%"), updatedAnimal.getName().replace("%", "%%"), updatedAnimal.getSpecies().replace("%", "%%"));
                                emailService.sendAnimalNotificationEmail(cuidador.getContact(), subject, body);
                            });
                        } else if (updatedAnimal.getKeeperId() == null && oldKeeperId != null) {
                            logger.info("Animal {} unassigned from keeper {}. Attempting to notify old keeper.", updatedAnimal.getName(), oldKeeperId);
                        } else {
                            logger.info("No keeperId change or new assignment for updated animal: {}. Skipping email notification.", updatedAnimal.getName());
                        }
                        // Optionally, notify the old keeper if assignment changed (animal unassigned or reassigned)
                        if (oldKeeperId != null && (updatedAnimal.getKeeperId() == null || !updatedAnimal.getKeeperId().equals(oldKeeperId))) {
                             cuidadorRepository.findById(oldKeeperId).ifPresent(cuidador -> {
                                logger.info("Cuidador found for old keeperId: {}. Contact email: {}", oldKeeperId, cuidador.getContact());
                                String subject = "Animal Desatribuído: " + updatedAnimal.getName();
                                String body = String.format("Prezado(a) %s,<br><br>O animal <b>%s</b> (Espécie: %s) foi desatribuído de você.<br><br>Atenciosamente,<br>Gerência do Zoológico",
                                        cuidador.getName().replace("%", "%%"), updatedAnimal.getName().replace("%", "%%"), updatedAnimal.getSpecies().replace("%", "%%"));
                                emailService.sendAnimalNotificationEmail(cuidador.getContact(), subject, body);
                            });
                        }
                    } catch (Exception e) {
                        logger.error("Error sending email notification for animal with ID {}: {}", id, e.getMessage(), e);
                        // Continue processing even if email fails, or rethrow if email is critical
                        // For now, we'll just log and continue.
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
                logger.info("Attempting to send email for deleted animal: {}", animalToDelete.getName());
                cuidadorRepository.findById(animalToDelete.getKeeperId()).ifPresent(cuidador -> {
                    logger.info("Cuidador found for keeperId: {}. Contact email: {}", animalToDelete.getKeeperId(), cuidador.getContact());
                    String subject = "Animal Removido: " + animalToDelete.getName();
                    String body = String.format("Prezado(a) %s,<br><br>O animal <b>%s</b> (Espécie: %s), que estava atribuído a você, foi removido do sistema.<br><br>Atenciosamente,<br>Gerência do Zoológico",
                            cuidador.getName().replace("%", "%%"), animalToDelete.getName().replace("%", "%%"), animalToDelete.getSpecies().replace("%", "%%"));
                    emailService.sendAnimalNotificationEmail(cuidador.getContact(), subject, body);
                });
            } else {
                logger.info("No keeperId present for deleted animal: {}. Skipping email notification.", animalToDelete.getName());
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