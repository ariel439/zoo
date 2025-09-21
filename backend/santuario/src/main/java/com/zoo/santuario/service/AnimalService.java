package com.zoo.santuario.service;

import com.zoo.santuario.dto.AnimalRequestDTO;
import com.zoo.santuario.dto.AnimalResponseDTO;
import com.zoo.santuario.model.Animal;
import com.zoo.santuario.repository.AnimalRepository;
import com.zoo.santuario.repository.CuidadorRepository;
import com.zoo.santuario.repository.HabitatRepository;
import com.zoo.santuario.model.Habitat;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import jakarta.persistence.criteria.Predicate;

import java.util.ArrayList;
import java.util.List;
import com.zoo.santuario.exception.ResourceNotFoundException;
import com.zoo.santuario.exception.CaretakerRequiredException;
import com.zoo.santuario.exception.HabitatCapacityExceededException;
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
    @Autowired
    private HabitatRepository habitatRepository;

    public List<AnimalResponseDTO> getAllAnimals() {
        logger.debug("Fetching all animals");
        List<AnimalResponseDTO> animals = animalRepository.findAll().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
        logger.debug("Found {} animals", animals.size());
        return animals;
    }

    public List<AnimalResponseDTO> getFilteredAnimals(String species, Integer ageMin, Integer ageMax, String name) {
        logger.debug("Fetching filtered animals with species: {}, ageMin: {}, ageMax: {}, name: {}", species, ageMin, ageMax, name);
        Specification<Animal> spec = (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (species != null && !species.isEmpty()) {
                predicates.add(criteriaBuilder.equal(root.get("species"), species));
                logger.debug("Adding species filter: {}", species);
            }
            if (ageMin != null) {
                predicates.add(criteriaBuilder.greaterThanOrEqualTo(root.get("age"), ageMin));
                logger.debug("Adding ageMin filter: {}", ageMin);
            }
            if (ageMax != null) {
                predicates.add(criteriaBuilder.lessThanOrEqualTo(root.get("age"), ageMax));
                logger.debug("Adding ageMax filter: {}", ageMax);
            }
            if (name != null && !name.isEmpty()) {
                predicates.add(criteriaBuilder.like(criteriaBuilder.lower(root.get("name")), "%" + name.toLowerCase() + "%"));
                logger.debug("Adding name filter: {}", name);
            }

            return criteriaBuilder.and(predicates.toArray(Predicate[]::new));
        };

        List<Animal> animals = animalRepository.findAll(spec);
        logger.debug("Found {} filtered animals", animals.size());
        return animals.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public AnimalResponseDTO getAnimalById(Long id) {
        logger.debug("Fetching animal with ID: {}", id);
        return animalRepository.findById(id)
                .map(this::convertToDto)
                .orElseThrow(() -> {
                    logger.warn("Animal not found with ID: {}", id);
                    return new ResourceNotFoundException("Animal not found with ID: " + id);
                });
    }

    public AnimalResponseDTO createAnimal(AnimalRequestDTO animalRequestDTO) {
        logger.info("Attempting to create new animal: {}", animalRequestDTO.getName());
        // Business Rule 1: Each animal must have at least one caretaker associated.
        if (animalRequestDTO.getKeeperId() == null) {
            logger.warn("Caretaker required for new animal: {}", animalRequestDTO.getName());
            throw new CaretakerRequiredException("Animal must have a caretaker associated.");
        }

        // Business Rule 2: A habitat cannot exceed its maximum capacity of animals.
        if (animalRequestDTO.getHabitatId() != null) {
            Habitat habitat = habitatRepository.findById(animalRequestDTO.getHabitatId())
                    .orElseThrow(() -> {
                        logger.warn("Habitat not found with ID: {} for new animal: {}", animalRequestDTO.getHabitatId(), animalRequestDTO.getName());
                        return new ResourceNotFoundException("Habitat not found with ID: " + animalRequestDTO.getHabitatId());
                    });

            long currentAnimalsInHabitat = animalRepository.countByHabitatId(animalRequestDTO.getHabitatId());
            if (currentAnimalsInHabitat >= habitat.getCapacity()) {
                logger.warn("Habitat capacity exceeded for habitat ID: {} (current: {}, capacity: {}) for new animal: {}", habitat.getId(), currentAnimalsInHabitat, habitat.getCapacity(), animalRequestDTO.getName());
                throw new HabitatCapacityExceededException("Habitat " + habitat.getName() + " (ID: " + habitat.getId() + ") has reached its maximum capacity.");
            }
            logger.debug("Habitat capacity check passed for habitat ID: {}", habitat.getId());
        }

        Animal animal = convertToEntity(animalRequestDTO);
        Animal savedAnimal = animalRepository.save(animal);
        logger.info("Animal created successfully with ID: {}", savedAnimal.getId());

        // Send email notification if keeperId is present
        if (savedAnimal.getKeeperId() != null) {
            logger.info("Attempting to send email for new animal: {}", savedAnimal.getName());
            cuidadorRepository.findById(savedAnimal.getKeeperId()).ifPresent(cuidador -> {
                logger.info("Cuidador found for keeperId: {}. Contact email: {}", savedAnimal.getKeeperId(), cuidador.getContact());
                String subject = "Novo Animal Atribuído: " + savedAnimal.getName();
                String body = String.format("Prezado(a) %s,<br><br>Um novo animal, <b>%s</b> (Espécie: %s), foi atribuído a você.<br><br>Atenciosamente,<br>Gerência do Zoológico",
                        cuidador.getName().replace("%", "%%"), savedAnimal.getName().replace("%", "%%"), savedAnimal.getSpecies().replace("%", "%%"));
                emailService.sendAnimalNotificationEmail(cuidador.getContact(), subject, body);
                logger.info("Email notification sent for new animal {} to keeper {}", savedAnimal.getName(), cuidador.getName());
            });
        } else {
            logger.info("No keeperId present for new animal: {}. Skipping email notification.", savedAnimal.getName());
        }

        return convertToDto(savedAnimal);
    }

    public AnimalResponseDTO updateAnimal(Long id, AnimalRequestDTO animalRequestDTO) {
        logger.info("Attempting to update animal with ID: {}", id);
        return animalRepository.findById(id)
                .map(existingAnimal -> {
                    logger.debug("Animal with ID {} found for update.", id);
                    // Business Rule 1: Each animal must have at least one caretaker associated.
                    if (animalRequestDTO.getKeeperId() == null) {
                        logger.warn("Caretaker required for animal update with ID: {}", id);
                        throw new CaretakerRequiredException("Animal must have a caretaker associated.");
                    }

                    // Business Rule 2: A habitat cannot exceed its maximum capacity of animals.
                    // Only check if habitat is changing or if it's a new assignment
                    if (animalRequestDTO.getHabitatId() != null && !animalRequestDTO.getHabitatId().equals(existingAnimal.getHabitatId())) {
                        logger.debug("Habitat change detected for animal ID: {}. Old habitat ID: {}, New habitat ID: {}", id, existingAnimal.getHabitatId(), animalRequestDTO.getHabitatId());
                        Habitat newHabitat = habitatRepository.findById(animalRequestDTO.getHabitatId())
                                .orElseThrow(() -> {
                                    logger.warn("New habitat not found with ID: {} for animal update with ID: {}", animalRequestDTO.getHabitatId(), id);
                                    return new ResourceNotFoundException("Habitat not found with ID: " + animalRequestDTO.getHabitatId());
                                });

                        long currentAnimalsInNewHabitat = animalRepository.countByHabitatId(animalRequestDTO.getHabitatId());
                        if (currentAnimalsInNewHabitat >= newHabitat.getCapacity()) {
                            logger.warn("Habitat capacity exceeded for new habitat ID: {} (current: {}, capacity: {}) for animal ID: {}", newHabitat.getId(), currentAnimalsInNewHabitat, newHabitat.getCapacity(), id);
                            throw new HabitatCapacityExceededException("Habitat " + newHabitat.getName() + " (ID: " + newHabitat.getId() + ") has reached its maximum capacity.");
                        }
                        logger.debug("New habitat capacity check passed for habitat ID: {}", newHabitat.getId());
                    }

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
                        logger.info("Animal with ID {} updated successfully.", updatedAnimal.getId());
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
                                logger.info("Email notification sent for updated animal {} to new keeper {}", updatedAnimal.getName(), cuidador.getName());
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
                                logger.info("Email notification sent for updated animal {} to same keeper {}", updatedAnimal.getName(), cuidador.getName());
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
                                logger.info("Email notification sent for unassigned animal {} to old keeper {}", updatedAnimal.getName(), cuidador.getName());
                            });
                        }
                    } catch (Exception e) {
                        logger.error("Error sending email notification for animal with ID {}: {}", id, e.getMessage(), e);
                        // Continue processing even if email fails, or rethrow if email is critical
                        // For now, we'll just log and continue.
                    }


                    return convertToDto(updatedAnimal);
                })
                .orElseThrow(() -> {
                    logger.warn("Animal not found with ID: {} for update operation.", id);
                    return new ResourceNotFoundException("Animal not found with ID: " + id);
                });
    }

    public void deleteAnimal(Long id) {
        logger.info("Attempting to delete animal with ID: {}", id);
        Animal animalToDelete = animalRepository.findById(id)
                .orElseThrow(() -> {
                    logger.warn("Animal not found with ID: {} for delete operation.", id);
                    return new ResourceNotFoundException("Animal not found with ID: " + id);
                });

        animalRepository.deleteById(id);
        logger.info("Animal with ID {} deleted successfully.", id);

        // Send email notification to keeper if assigned
        if (animalToDelete.getKeeperId() != null) {
            logger.info("Attempting to send email for deleted animal: {}", animalToDelete.getName());
            cuidadorRepository.findById(animalToDelete.getKeeperId()).ifPresent(cuidador -> {
                logger.info("Cuidador found for keeperId: {}. Contact email: {}", animalToDelete.getKeeperId(), cuidador.getContact());
                String subject = "Animal Removido: " + animalToDelete.getName();
                String body = String.format("Prezado(a) %s,<br><br>O animal <b>%s</b> (Espécie: %s), que estava atribuído a você, foi removido do sistema.<br><br>Atenciosamente,<br>Gerência do Zoológico",
                        cuidador.getName().replace("%", "%%"), animalToDelete.getName().replace("%", "%%"), animalToDelete.getSpecies().replace("%", "%%"));
                emailService.sendAnimalNotificationEmail(cuidador.getContact(), subject, body);
                logger.info("Email notification sent for deleted animal {} to keeper {}", animalToDelete.getName(), cuidador.getName());
            });
        } else {
            logger.info("No keeperId present for deleted animal: {}. Skipping email notification.", animalToDelete.getName());
        }
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
