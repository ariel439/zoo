package com.zoo.santuario.service;

import com.zoo.santuario.dto.AnimalRequestDTO;
import com.zoo.santuario.dto.AnimalResponseDTO;
import com.zoo.santuario.exception.CaretakerRequiredException;
import com.zoo.santuario.exception.HabitatCapacityExceededException;
import com.zoo.santuario.exception.ResourceNotFoundException;
import com.zoo.santuario.model.*; // CHANGED: Import all models for type safety
import com.zoo.santuario.repository.*; // CHANGED: Import all repositories
import jakarta.persistence.criteria.Predicate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
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
    @Autowired
    private VeterinarioRepository veterinarioRepository;
    @Autowired
    private AlimentacaoRepository alimentacaoRepository;

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

    // CHANGED: This method is updated to fetch related objects before saving.
    public AnimalResponseDTO createAnimal(AnimalRequestDTO dto) {
        logger.info("Attempting to create new animal: {}", dto.getName());
        if (dto.getKeeperId() == null) {
            logger.warn("Caretaker required for new animal: {}", dto.getName());
            throw new CaretakerRequiredException("Animal must have a caretaker associated.");
        }

        validateHabitatCapacity(dto.getHabitatId(), null);

        // Fetch related entities using the IDs from the DTO
        Cuidador keeper = cuidadorRepository.findById(dto.getKeeperId())
                .orElseThrow(() -> new ResourceNotFoundException("Keeper not found with ID: " + dto.getKeeperId()));
        Habitat habitat = habitatRepository.findById(dto.getHabitatId())
                .orElseThrow(() -> new ResourceNotFoundException("Habitat not found with ID: " + dto.getHabitatId()));
        Veterinario vet = veterinarioRepository.findById(dto.getVetId())
                .orElseThrow(() -> new ResourceNotFoundException("Vet not found with ID: " + dto.getVetId()));
        Alimentacao feedingPlan = alimentacaoRepository.findById(dto.getFeedingPlanId())
                .orElseThrow(() -> new ResourceNotFoundException("Feeding plan not found with ID: " + dto.getFeedingPlanId()));

        // Create the Animal and set the full objects
        Animal animal = new Animal();
        animal.setName(dto.getName());
        animal.setSpecies(dto.getSpecies());
        animal.setAge(dto.getAge());
        animal.setSex(dto.getSex());
        animal.setArrivalDate(dto.getArrivalDate());
        animal.setStatus(dto.getStatus());
        animal.setImage(dto.getImage());
        animal.setKeeper(keeper);
        animal.setHabitat(habitat);
        animal.setVet(vet);
        animal.setFeedingPlan(feedingPlan);

        Animal savedAnimal = animalRepository.save(animal);
        logger.info("Animal created successfully with ID: {}", savedAnimal.getId());

        String subject = "Novo Animal Atribuído: " + savedAnimal.getName();
        sendKeeperNotification(savedAnimal.getKeeper(), savedAnimal, subject, NEW_ASSIGNMENT_BODY);

        return convertToDto(savedAnimal);
    }

    // CHANGED: This method is updated to fetch and set full objects instead of just IDs.
    public AnimalResponseDTO updateAnimal(Long id, AnimalRequestDTO dto) {
        logger.info("Attempting to update animal with ID: {}", id);
        return animalRepository.findById(id)
                .map(existingAnimal -> {
                    logger.debug("Animal with ID {} found for update.", id);
                    
                    if (dto.getKeeperId() == null) {
                        logger.warn("Caretaker required for animal update with ID: {}", id);
                        throw new CaretakerRequiredException("Animal must have a caretaker associated.");
                    }

                    // Store the old keeper object for notification logic
                    Cuidador oldKeeper = existingAnimal.getKeeper();
                    
                    validateHabitatCapacity(dto.getHabitatId(), existingAnimal.getHabitat().getId());

                    // Fetch the new related objects
                    Cuidador newKeeper = cuidadorRepository.findById(dto.getKeeperId())
                            .orElseThrow(() -> new ResourceNotFoundException("Keeper not found with ID: " + dto.getKeeperId()));
                    Habitat newHabitat = habitatRepository.findById(dto.getHabitatId())
                            .orElseThrow(() -> new ResourceNotFoundException("Habitat not found with ID: " + dto.getHabitatId()));
                    Veterinario newVet = veterinarioRepository.findById(dto.getVetId())
                            .orElseThrow(() -> new ResourceNotFoundException("Vet not found with ID: " + dto.getVetId()));
                    Alimentacao newFeedingPlan = alimentacaoRepository.findById(dto.getFeedingPlanId())
                            .orElseThrow(() -> new ResourceNotFoundException("Feeding plan not found with ID: " + dto.getFeedingPlanId()));

                    // Update all fields on the existing animal
                    existingAnimal.setName(dto.getName());
                    existingAnimal.setSpecies(dto.getSpecies());
                    existingAnimal.setAge(dto.getAge());
                    existingAnimal.setSex(dto.getSex());
                    existingAnimal.setArrivalDate(dto.getArrivalDate());
                    existingAnimal.setStatus(dto.getStatus());
                    existingAnimal.setImage(dto.getImage());
                    existingAnimal.setKeeper(newKeeper);
                    existingAnimal.setVet(newVet);
                    existingAnimal.setHabitat(newHabitat);
                    existingAnimal.setFeedingPlan(newFeedingPlan);
                    
                    Animal updatedAnimal = animalRepository.save(existingAnimal);
                    logger.info("Animal with ID {} updated successfully.", updatedAnimal.getId());

                    handleUpdateNotifications(updatedAnimal, oldKeeper);
                    
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
        // CHANGED: Pass the full keeper object instead of an ID.
        sendKeeperNotification(animalToDelete.getKeeper(), animalToDelete, subject, DELETED_BODY);
    }

    // CHANGED: Method signature now uses the Cuidador object.
    private void handleUpdateNotifications(Animal updatedAnimal, Cuidador oldKeeper) {
        Cuidador newKeeper = updatedAnimal.getKeeper();

        try {
            // Compare objects now, not IDs.
            if (newKeeper != null && !newKeeper.equals(oldKeeper)) {
                String newAssignmentSubject = "Atribuição de Animal Atualizada: " + updatedAnimal.getName();
                sendKeeperNotification(newKeeper, updatedAnimal, newAssignmentSubject, NEW_ASSIGNMENT_BODY);
                
                if (oldKeeper != null) {
                    String unassignmentSubject = "Animal Desatribuído: " + updatedAnimal.getName();
                    sendKeeperNotification(oldKeeper, updatedAnimal, unassignmentSubject, UNASSIGNMENT_BODY);
                }
            }
            else if (newKeeper != null && newKeeper.equals(oldKeeper)) {
                String subject = "Detalhes do Animal Atualizados: " + updatedAnimal.getName();
                sendKeeperNotification(newKeeper, updatedAnimal, subject, UPDATE_DETAILS_BODY);
            }
            else if (newKeeper == null && oldKeeper != null) {
                String subject = "Animal Desatribuído: " + updatedAnimal.getName();
                sendKeeperNotification(oldKeeper, updatedAnimal, subject, UNASSIGNMENT_BODY);
            }
        } catch (Exception e) {
            logger.error("Error sending email notification for updated animal with ID {}: {}", updatedAnimal.getId(), e.getMessage(), e);
        }
    }

    // CHANGED: Method signature now uses the Cuidador object.
    private void sendKeeperNotification(Cuidador keeper, Animal animal, String subject, String bodyTemplate) {
        if (keeper == null) {
            logger.info("No keeper present for animal: {}. Skipping email notification.", animal.getName());
            return;
        }

        // No longer need to find the keeper, it's passed in directly.
        logger.info("Cuidador '{}' found for animal: {}. Attempting to send email to {}", keeper.getName(), animal.getName(), keeper.getContact());
        String body = String.format(bodyTemplate,
                keeper.getName().replace("%", "%%"),
                animal.getName().replace("%", "%%"),
                animal.getSpecies().replace("%", "%%")
        );
        emailService.sendAnimalNotificationEmail(keeper.getContact(), subject, body);
        logger.info("Email notification sent for animal {} to keeper {}", animal.getName(), keeper.getName());
    }

    private void validateHabitatCapacity(Long newHabitatId, Long oldHabitatId) {
        if (newHabitatId != null && !newHabitatId.equals(oldHabitatId)) {
            Habitat habitat = habitatRepository.findById(newHabitatId)
                    .orElseThrow(() -> new ResourceNotFoundException("Habitat not found with ID: " + newHabitatId));

            // CHANGED: Use the correct repository method name with the underscore.
            long currentAnimalsInHabitat = animalRepository.countByHabitat_Id(newHabitatId);
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
                animal.getKeeper() != null ? animal.getKeeper().getId() : null,
                animal.getVet() != null ? animal.getVet().getId() : null,
                animal.getHabitat() != null ? animal.getHabitat().getId() : null,
                animal.getFeedingPlan() != null ? animal.getFeedingPlan().getId() : null
        );
    }
}