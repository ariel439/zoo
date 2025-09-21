package com.zoo.santuario.controller;

import com.zoo.santuario.SantuarioApplication;
import com.zoo.santuario.dto.AnimalRequestDTO;
import com.zoo.santuario.dto.CuidadorRequestDTO; // Import CuidadorRequestDTO
import com.zoo.santuario.repository.AnimalRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.springframework.test.web.servlet.MockMvc;
import org.testcontainers.containers.MySQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;
import org.testcontainers.utility.DockerImageName;
import org.springframework.boot.test.mock.mockito.MockBean;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.zoo.santuario.service.EmailService;
import com.zoo.santuario.repository.CuidadorRepository; // Import CuidadorRepository

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.hamcrest.Matchers.*;

@Testcontainers
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT, classes = SantuarioApplication.class)
@AutoConfigureMockMvc
public class AnimalControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private AnimalRepository animalRepository;

    @Autowired
    private CuidadorRepository cuidadorRepository;

    @MockBean
    private EmailService emailService;

    @Container
    static MySQLContainer<?> mysql = new MySQLContainer<>(DockerImageName.parse("mysql:8.0.26"))
            .withDatabaseName("testdb")
            .withUsername("test")
            .withPassword("test");

    @DynamicPropertySource
    static void configureProperties(DynamicPropertyRegistry registry) {
        registry.add("spring.datasource.url", mysql::getJdbcUrl);
        registry.add("spring.datasource.username", mysql::getUsername);
        registry.add("spring.datasource.password", mysql::getPassword);
        registry.add("spring.jpa.hibernate.ddl-auto", () -> "create-drop"); // Ensure schema is created for each test run
    }

    private Long caretakerId; // To store the ID of the created caretaker

    @BeforeEach
    void setUp() throws Exception {
        animalRepository.deleteAll(); // Clean up animal data before each test
        cuidadorRepository.deleteAll(); // Clean up cuidador data before each test

        // Create a caretaker first
        CuidadorRequestDTO cuidadorRequestDTO = new CuidadorRequestDTO(
                "John Doe", "john.doe@example.com", "Mammals", "Active", "Manhã"
        );

        String responseString = mockMvc.perform(post("/api/cuidadores")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(cuidadorRequestDTO)))
                .andExpect(status().isCreated())
                .andReturn().getResponse().getContentAsString();

        // Extract the ID of the created caretaker
        caretakerId = objectMapper.readTree(responseString).get("id").asLong();
    }

    @Test
    void testCreateAnimal() throws Exception {
        AnimalRequestDTO animalRequestDTO = new AnimalRequestDTO(
                "Simba", "Lion", 5, "Male", "2020-01-01", "Healthy", null, caretakerId, null, null, null
        );

        mockMvc.perform(post("/api/animals")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(animalRequestDTO)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.name", is("Simba")))
                .andExpect(jsonPath("$.species", is("Lion")));
    }

    @Test
    void testGetAllAnimals() throws Exception {
        // Create an animal first
        AnimalRequestDTO animalRequestDTO = new AnimalRequestDTO(
                "Simba", "Lion", 5, "Male", "2020-01-01", "Healthy", null, caretakerId, null, null, null
        );
        mockMvc.perform(post("/api/animals")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(animalRequestDTO)));

        mockMvc.perform(get("/api/animals")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].name", is("Simba")));
    }

    @Test
    void testGetAnimalById() throws Exception {
        // Create an animal first
        AnimalRequestDTO animalRequestDTO = new AnimalRequestDTO(
                "Nala", "Lion", 3, "Female", "2021-03-15", "Healthy", null, caretakerId, null, null, null
        );
        String responseString = mockMvc.perform(post("/api/animals")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(animalRequestDTO)))
                .andExpect(status().isCreated())
                .andReturn().getResponse().getContentAsString();

        Long animalId = objectMapper.readTree(responseString).get("id").asLong();

        mockMvc.perform(get("/api/animals/{id}", animalId)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name", is("Nala")))
                .andExpect(jsonPath("$.species", is("Lion")));
    }

    @Test
    void testUpdateAnimal() throws Exception {
        // Create an animal first
        AnimalRequestDTO animalRequestDTO = new AnimalRequestDTO(
                "Zazu", "Hornbill", 2, "Male", "2022-01-01", "Healthy", null, caretakerId, null, null, null
        );
        String responseString = mockMvc.perform(post("/api/animals")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(animalRequestDTO)))
                .andExpect(status().isCreated())
                .andReturn().getResponse().getContentAsString();

        Long animalId = objectMapper.readTree(responseString).get("id").asLong();

        // Update the animal
        AnimalRequestDTO updatedAnimalRequestDTO = new AnimalRequestDTO(
                "Zazu Updated", "Hornbill", 3, "Male", "2022-01-01", "Injured", null, caretakerId, null, null, null
        );

        mockMvc.perform(put("/api/animals/{id}", animalId)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updatedAnimalRequestDTO)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name", is("Zazu Updated")))
                .andExpect(jsonPath("$.status", is("Injured")));

        // Verify the update by getting the animal
        mockMvc.perform(get("/api/animals/{id}", animalId)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name", is("Zazu Updated")))
                .andExpect(jsonPath("$.status", is("Injured")));
    }

    @Test
    void testDeleteAnimal() throws Exception {
        // Create an animal first
        AnimalRequestDTO animalRequestDTO = new AnimalRequestDTO(
                "Timon", "Meerkat", 4, "Male", "2019-05-20", "Healthy", null, caretakerId, null, null, null
        );
        String responseString = mockMvc.perform(post("/api/animals")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(animalRequestDTO)))
                .andExpect(status().isCreated())
                .andReturn().getResponse().getContentAsString();

        Long animalId = objectMapper.readTree(responseString).get("id").asLong();

        // Delete the animal
        mockMvc.perform(delete("/api/animals/{id}", animalId)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isNoContent());

        // Verify deletion by trying to get the animal
        mockMvc.perform(get("/api/animals/{id}", animalId)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isNotFound());
    }
}