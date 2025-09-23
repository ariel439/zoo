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

/**
 * This service class acts as the brain for all operations involving animals. 
 * It contains the core business logic, validation rules, and coordinates actions 
 * like database changes and sending email notifications.
 *
 * --- How It Works ---
 *
 * 1.  API Layer Interaction: The `AnimalController` receives requests and calls the public methods here 
 * (e.g., `createAnimal`, `updateAnimal`). These methods manage the entire workflow.
 *
 * 2.  Business Rule Validation:  Before making changes, it enforces key rules using private helper methods. For example, 
 * `validateHabitatCapacity` checks if a habitat is full, and other checks ensure an 
 * animal always has a keeper assigned.
 *
 * 3.  Database Operations: It uses the `AnimalRepository` with JPA to save, update, delete, and find animal data in the database.
 *
 * 4.  Email Notification Workflow:
 * This is a key feature. After a successful database change (create, update, or delete), 
 * the service triggers a notification.
 * - The main method calls a specific helper `handleUpdateNotifications`.
 * - It analyzes the situation, decides who needs an email (the new keeper, the old keeper, or both), and determines what message they should get.
 * - It then calls the generic `sendKeeperNotification` method, providing the correct email template.
 * - Finally, `sendKeeperNotification` finds the keeper's contact info and tells the external `EmailService` to send the actual email.
 */
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

    // Email templates for sending notifications
    private static final String EMAIL_GREETING = "Prezado(a) %s,<br><br>";
    private static final String EMAIL_SIGN_OFF = "<br><br>Atenciosamente,<br>Gerência do Zoológico";
    private static final String NEW_ASSIGNMENT_BODY = EMAIL_GREETING + "Um novo animal, <b>%s</b> (Espécie: %s), foi atribuído a você." + EMAIL_SIGN_OFF;
    private static final String UPDATE_DETAILS_BODY = EMAIL_GREETING + "Os detalhes do animal <b>%s</b> (Espécie: %s), atribuído a você, foram atualizados." + EMAIL_SIGN_OFF;
    private static final String UNASSIGNMENT_BODY = EMAIL_GREETING + "O animal <b>%s</b> (Espécie: %s) foi desatribuído de você." + EMAIL_SIGN_OFF;
    private static final String DELETED_BODY = EMAIL_GREETING + "O animal <b>%s</b> (Espécie: %s), que estava atribuído a você, foi removido do sistema." + EMAIL_SIGN_OFF;

    public List<AnimalResponseDTO> getAllAnimals() {
        logger.debug("Fetching all animals");
        List<AnimalResponseDTO> animals = animalRepository.findAll().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
        logger.debug("Found {} animals", animals.size());
        return animals;
    }

    //This code uses a criteriaBuilder to create individual filter rules, called Predicates, and adds them to a list only for the search terms that aren't empty
    //Finally, it combines all the rules in the list with AND to build a safe, dynamic database query.
    public List<AnimalResponseDTO> getFilteredAnimals(String species, Integer ageMin, Integer ageMax, String name) {
        logger.debug("Fetching filtered animals with species: {}, ageMin: {}, ageMax: {}, name: {}", species, ageMin, ageMax, name);
        Specification<Animal> spec = (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (species != null && !species.isEmpty()) {
                predicates.add(criteriaBuilder.equal(root.get("species"), species));
            }
            if (ageMin != null) {
                predicates.add(criteriaBuilder.greaterThanOrEqualTo(root.get("age"), ageMin));
            }
            if (ageMax != null) {
                predicates.add(criteriaBuilder.lessThanOrEqualTo(root.get("age"), ageMax));
            }
            if (name != null && !name.isEmpty()) {
                predicates.add(criteriaBuilder.like(criteriaBuilder.lower(root.get("name")), "%" + name.toLowerCase() + "%"));
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
        if (animalRequestDTO.getKeeperId() == null) {
            logger.warn("Caretaker required for new animal: {}", animalRequestDTO.getName());
            throw new CaretakerRequiredException("Animal must have a caretaker associated.");
        }

        validateHabitatCapacity(animalRequestDTO.getHabitatId(), null);

        Animal animal = convertToEntity(animalRequestDTO);
        Animal savedAnimal = animalRepository.save(animal);
        logger.info("Animal created successfully with ID: {}", savedAnimal.getId());

        String subject = "Novo Animal Atribuído: " + savedAnimal.getName();
        sendKeeperNotification(savedAnimal.getKeeperId(), savedAnimal, subject, NEW_ASSIGNMENT_BODY);

        return convertToDto(savedAnimal);
    }

     public AnimalResponseDTO updateAnimal(Long id, AnimalRequestDTO animalRequestDTO) {
        logger.info("Attempting to update animal with ID: {}", id);
        return animalRepository.findById(id)
                .map(existingAnimal -> {
                    logger.debug("Animal with ID {} found for update.", id);
                    
                    if (animalRequestDTO.getKeeperId() == null) {
                        logger.warn("Caretaker required for animal update with ID: {}", id);
                        throw new CaretakerRequiredException("Animal must have a caretaker associated.");
                    }

                    Long oldKeeperId = existingAnimal.getKeeperId();
                    
                    validateHabitatCapacity(animalRequestDTO.getHabitatId(), existingAnimal.getHabitatId());

                    // CORRECTED: Using the correct 'animalRequestDTO' variable instead of 'dto'
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
                    logger.info("Animal with ID {} updated successfully.", updatedAnimal.getId());

                    handleUpdateNotifications(updatedAnimal, oldKeeperId);
                    
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

        String subject = "Animal Removido: " + animalToDelete.getName();
        sendKeeperNotification(animalToDelete.getKeeperId(), animalToDelete, subject, DELETED_BODY);
    }

    private void handleUpdateNotifications(Animal updatedAnimal, Long oldKeeperId) {
        Long newKeeperId = updatedAnimal.getKeeperId();

        try {
            if (newKeeperId != null && !newKeeperId.equals(oldKeeperId)) {
                String newAssignmentSubject = "Atribuição de Animal Atualizada: " + updatedAnimal.getName();
                sendKeeperNotification(newKeeperId, updatedAnimal, newAssignmentSubject, NEW_ASSIGNMENT_BODY);
                
                if (oldKeeperId != null) {
                    String unassignmentSubject = "Animal Desatribuído: " + updatedAnimal.getName();
                    sendKeeperNotification(oldKeeperId, updatedAnimal, unassignmentSubject, UNASSIGNMENT_BODY);
                }
            } 
            else if (newKeeperId != null && newKeeperId.equals(oldKeeperId)) {
                String subject = "Detalhes do Animal Atualizados: " + updatedAnimal.getName();
                sendKeeperNotification(newKeeperId, updatedAnimal, subject, UPDATE_DETAILS_BODY);
            }
            else if (newKeeperId == null && oldKeeperId != null) {
                String subject = "Animal Desatribuído: " + updatedAnimal.getName();
                sendKeeperNotification(oldKeeperId, updatedAnimal, subject, UNASSIGNMENT_BODY);
            }
        } catch (Exception e) {
             logger.error("Error sending email notification for updated animal with ID {}: {}", updatedAnimal.getId(), e.getMessage(), e);
        }
    }

    private void sendKeeperNotification(Long keeperId, Animal animal, String subject, String bodyTemplate) {
        if (keeperId == null) {
            logger.info("No keeperId present for animal: {}. Skipping email notification.", animal.getName());
            return;
        }

        cuidadorRepository.findById(keeperId).ifPresentOrElse(
            cuidador -> {
                logger.info("Cuidador '{}' found for keeperId: {}. Attempting to send email to {}", cuidador.getName(), keeperId, cuidador.getContact());
                String body = String.format(bodyTemplate,
                        cuidador.getName().replace("%", "%%"),
                        animal.getName().replace("%", "%%"),
                        animal.getSpecies().replace("%", "%%")
                );
                emailService.sendAnimalNotificationEmail(cuidador.getContact(), subject, body);
                logger.info("Email notification sent for animal {} to keeper {}", animal.getName(), cuidador.getName());
            },
            () -> logger.warn("Could not send email. Cuidador not found for keeperId: {}", keeperId)
        );
    }

    private void validateHabitatCapacity(Long newHabitatId, Long oldHabitatId) {
        if (newHabitatId != null && !newHabitatId.equals(oldHabitatId)) {
            Habitat habitat = habitatRepository.findById(newHabitatId)
                    .orElseThrow(() -> new ResourceNotFoundException("Habitat not found with ID: " + newHabitatId));

            long currentAnimalsInHabitat = animalRepository.countByHabitatId(newHabitatId);
            if (currentAnimalsInHabitat >= habitat.getCapacity()) {
                logger.warn("Habitat capacity exceeded for habitat ID: {} (current: {}, capacity: {})", habitat.getId(), currentAnimalsInHabitat, habitat.getCapacity());
                throw new HabitatCapacityExceededException("Habitat " + habitat.getName() + " (ID: " + habitat.getId() + ") has reached its maximum capacity.");
            }
            logger.debug("Habitat capacity check passed for habitat ID: {}", habitat.getId());
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
                null, // ID is generated by the database
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