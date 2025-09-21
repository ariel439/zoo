# Backend Documentation: Zoo Management System

## 1. Project Overview

The backend of the Zoo Management System is a Spring Boot application built with Maven. It provides RESTful APIs for managing various aspects of a zoo, including animals, habitats, caretakers (cuidadores), veterinarians, and feeding plans (alimentacao). The application follows a standard layered architecture (Controller-Service-Repository) to ensure maintainability, scalability, and separation of concerns.

**Key Technologies:**
*   **Spring Boot:** Framework for building stand-alone, production-grade Spring applications.
*   **Maven:** Dependency management and build automation tool.
*   **MySQL:** Relational database for data persistence.
*   **Spring Data JPA:** Simplifies data access layer implementation using JPA and Hibernate.
*   **Lombok:** Reduces boilerplate code for Java classes.
*   **Spring Boot Validation:** Provides robust data validation capabilities.
*   **SpringDoc OpenAPI:** Automatically generates OpenAPI (Swagger UI) documentation for the REST APIs.
*   **SendGrid:** Email service for sending notifications.

## 2. Package Structure

The core application logic resides within the `com.zoo.santuario` package, organized into the following sub-packages:

*   `com.zoo.santuario.controller`: Contains REST controllers that handle incoming HTTP requests, interact with the service layer, and return appropriate responses.
*   `com.zoo.santuario.service`: Encapsulates the business logic of the application. Services orchestrate operations, perform validations, and interact with the repository layer. Includes `EmailService` for notifications.
*   `com.zoo.santuario.repository`: Provides interfaces for data access operations, extending `JpaRepository` for CRUD functionalities.
*   `com.zoo.santuario.model`: Defines the JPA entities that map to database tables. These are the core data structures of the application.
*   `com.zoo.santuario.dto`: Contains Data Transfer Objects used for transferring data between the client and the server, and between different layers of the application. This decouples the API from the internal data model.
*   `com.zoo.santuario.config`: Holds configuration classes for various aspects of the application, such as CORS and OpenAPI documentation.

The main entry point for the application is `SantuarioApplication.java`.

## 3. Entities (Model Layer)

The `com.zoo.santuario.model` package defines the JPA entities, representing the core data structures and their relationships within the database.

### Alimentacao

Represents a feeding plan.

**Attributes:**
*   `id`: Unique identifier (Long).
*   `planName`: Name of the feeding plan (String).
*   `animalSpecies`: Species of the animal the plan is for (String).
*   `foodType`: Type of food (String).
*   `quantity`: Quantity of food (String).
*   `frequency`: Feeding frequency (String).

### Animal

Represents an animal in the sanctuary.

**Attributes:**
*   `id`: Unique identifier (Long).
*   `name`: Name of the animal (String).
*   `species`: Species of the animal (String).
*   `age`: Age of the animal (int).
*   `sex`: Sex of the animal (String).
*   `arrivalDate`: Date of arrival at the sanctuary (String).
*   `status`: Current status of the animal (String).
*   `image`: Optional URL for the animal's image (String).
*   `keeperId`: ID of the assigned caretaker (Long).
*   `vetId`: ID of the assigned veterinarian (Long).
*   `habitatId`: ID of the assigned habitat (Long).
*   `feedingPlanId`: ID of the assigned feeding plan (Long).

### Cuidador

Represents a caretaker (cuidador) responsible for animals.

**Attributes:**
*   `id`: Unique identifier (Long).
*   `name`: Name of the caretaker (String).
*   `contact`: Contact information (e.g., email, phone), must be unique (String).
*   `specialty`: Specialty of the caretaker (String).
*   `status`: Current employment status of the caretaker (String).

### Habitat

Represents an animal habitat within the sanctuary.

**Attributes:**
*   `id`: Unique identifier (Long).
*   `name`: Name of the habitat (String).
*   `type`: Type of habitat (e.g., "Jungle", "Aquatic") (String).
*   `capacity`: Maximum animal capacity of the habitat (int).
*   `status`: Current status of the habitat (e.g., "Occupied", "Available", "Under Maintenance") (String).

### Veterinario

Represents a veterinarian working at the sanctuary.

**Attributes:**
*   `id`: Unique identifier (Long).
*   `name`: Name of the veterinarian (String).
*   `crmv`: Veterinary council registration number, must be unique (String).
*   `specialty`: Specialty of the veterinarian (String).
*   `status`: Current employment status of the veterinarian (String).

## 4. Repository Layer

The `com.zoo.santuario.repository` package contains interfaces that extend Spring Data JPA's `JpaRepository`. These repositories provide powerful and flexible methods for interacting with the database, abstracting away much of the boilerplate code for data access operations (CRUD - Create, Read, Update, Delete).

Each repository is defined for a specific entity, allowing for type-safe data access.

*   **`AlimentacaoRepository`**: Extends `JpaRepository<Alimentacao, Long>`, providing CRUD operations for `Alimentacao` entities.
*   **`AnimalRepository`**: Extends `JpaRepository<Animal, Long>`, providing CRUD operations for `Animal` entities.
*   **`CuidadorRepository`**: Extends `JpaRepository<Cuidador, Long>`, providing CRUD operations for `Cuidador` entities. Includes `findByContact(String contact)` for retrieving a caretaker by their unique contact information.
*   **`HabitatRepository`**: Extends `JpaRepository<Habitat, Long>`, providing CRUD operations for `Habitat` entities.
*   **`VeterinarioRepository`**: Extends `JpaRepository<Veterinario, Long>`, providing CRUD operations for `Veterinario` entities.

## 5. DTO (Data Transfer Object) Layer

The `com.zoo.santuario.dto` package contains Data Transfer Objects. DTOs are used to define the structure of data sent to and received from the API, ensuring a clear contract between the frontend and backend, and decoupling the internal data model from the external API representation.

### AlimentacaoRequestDTO

Represents the data required to create or update an `Alimentacao` (feeding plan). All fields are marked as `@NotNull` for validation.

**Attributes:**
*   `planName`: Name of the feeding plan (String).
*   `animalSpecies`: Species of the animal the plan is for (String).
*   `foodType`: Type of food (String).
    *   `quantity`: Quantity of food (String).
    *   `frequency`: Feeding frequency (String).

### AlimentacaoResponseDTO

Represents the data returned for an `Alimentacao` (feeding plan). It includes the `id` along with the request attributes.

**Attributes:**
*   `id`: Unique identifier for the feeding plan (Long).
*   `planName`: Name of the feeding plan (String).
*   `animalSpecies`: Species of the animal the plan is for (String).
*   `foodType`: Type of food (String).
*   `quantity`: Quantity of food (String).
*   `frequency`: Feeding frequency (String).

### AnimalRequestDTO

Represents the data required to create or update an `Animal`. All fields are marked as `@NotNull` for validation where applicable.

**Attributes:**
*   `name`: Name of the animal (String).
*   `species`: Species of the animal (String).
*   `age`: Age of the animal (int).
*   `sex`: Sex of the animal (String).
*   `arrivalDate`: Date of arrival at the sanctuary (String).
*   `status`: Current status of the animal (String).
*   `image`: Optional URL for the animal's image (String).
*   `keeperId`: ID of the assigned caretaker (Long).
*   `vetId`: ID of the assigned veterinarian (Long).
*   `habitatId`: ID of the assigned habitat (Long).
*   `feedingPlanId`: ID of the assigned feeding plan (Long).

### AnimalResponseDTO

Represents the data returned for an `Animal`.

**Attributes:**
*   `id`: Unique identifier (Long).
*   `name`: Name of the animal (String).
*   `species`: Species of the animal (String).
*   `age`: Age of the animal (int).
*   `sex`: Sex of the animal (String).
*   `arrivalDate`: Date of arrival at the sanctuary (String).
*   `status`: Current status of the animal (String).
*   `image`: Optional URL for the animal's image (String).
*   `keeperId`: ID of the assigned caretaker (Long).
*   `vetId`: ID of the assigned veterinarian (Long).
*   `habitatId`: ID of the assigned habitat (Long).
*   `feedingPlanId`: ID of the assigned feeding plan (Long).

### CuidadorRequestDTO

Represents the data required to create or update a `Cuidador` (caretaker). All fields are marked as `@NotNull` for validation.

**Attributes:**
*   `name`: Name of the caretaker (String).
*   `contact`: Contact information (String).
*   `specialty`: Specialty of the caretaker (String).
*   `status`: Current employment status (String).

### CuidadorResponseDTO

Represents the data returned for a `Cuidador` (caretaker).

**Attributes:**
*   `id`: Unique identifier (Long).
*   `name`: Name of the caretaker (String).
*   `contact`: Contact information (String).
*   `specialty`: Specialty of the caretaker (String).
*   `status`: Current employment status (String).

### HabitatRequestDTO

Represents the data required to create or update a `Habitat`. All fields are marked as `@NotNull` for validation.

**Attributes:**
*   `name`: Name of the habitat (String).
*   `type`: Type of habitat (String).
*   `capacity`: Maximum animal capacity (int).
*   `status`: Current status of the habitat (String).

### HabitatResponseDTO

Represents the data returned for a `Habitat`.

**Attributes:**
*   `id`: Unique identifier (Long).
*   `name`: Name of the habitat (String).
*   `type`: Type of habitat (String).
*   `capacity`: Maximum animal capacity (int).
*   `status`: Current status of the habitat (String).

### VeterinarioRequestDTO

Represents the data required to create or update a `Veterinario`. All fields are marked as `@NotNull` for validation.

**Attributes:**
*   `name`: Name of the veterinarian (String).
*   `crmv`: Veterinary council registration number (String).
*   `specialty`: Specialty of the veterinarian (String).
*   `status`: Current employment status (String).

### VeterinarioResponseDTO

Represents the data returned for a `Veterinario`.

**Attributes:**
*   `id`: Unique identifier (Long).
*   `name`: Name of the veterinarian (String).
*   `crmv`: Veterinary council registration number (String).
*   `specialty`: Specialty of the veterinarian (String).
    *   `status`: Current employment status (String).

## 6. Service Layer

The `com.zoo.santuario.service` package contains the business logic for the application. Services orchestrate operations, perform validations, and interact with the repository layer.

*   **`AlimentacaoService`**: Manages business logic for `Alimentacao` (feeding plans), including CRUD operations.
*   **`AnimalService`**: Manages business logic for `Animal` entities, including CRUD operations and email notifications to caretakers upon assignment/update/deletion.
*   **`CuidadorService`**: Manages business logic for `Cuidador` (caretaker) entities, including CRUD operations and ensuring unique contact information.
*   **`EmailService`**: Handles sending email notifications, particularly for animal assignments, using SendGrid.
*   **`HabitatService`**: Manages business logic for `Habitat` entities, including CRUD operations.
*   **`VeterinarioService`**: Manages business logic for `Veterinario` entities, including CRUD operations.

## 7. Controller Layer

The `com.zoo.santuario.controller` package contains REST controllers that handle incoming HTTP requests, interact with the service layer, and return appropriate responses. Each controller exposes a set of RESTful endpoints for managing its respective resource.

*   **`AlimentacaoController`**: REST controller for `Alimentacao` (feeding plan) resources, exposing endpoints for CRUD operations.
*   **`AnimalController`**: REST controller for `Animal` resources, exposing endpoints for CRUD operations.
*   **`CuidadorController`**: REST controller for `Cuidador` (caretaker) resources, exposing endpoints for CRUD operations.
*   **`HabitatController`**: REST controller for `Habitat` resources, exposing endpoints for CRUD operations.
*   **`VeterinarioController`**: REST controller for `Veterinario` resources, exposing endpoints for CRUD operations.

## 8. Testing

The backend project incorporates both unit and integration tests to ensure the reliability and correctness of the application logic and API endpoints.

### Unit Tests

Unit tests focus on testing individual components (e.g., service methods) in isolation, typically by mocking their dependencies (e.g., repository interfaces). This allows for fast execution and precise identification of issues within a specific unit of code.

*   **Example:** `AnimalServiceTest.java` demonstrates unit testing for the `AnimalService`, where the `AnimalRepository` and `EmailService` are mocked.

### Integration Tests

Integration tests verify the interactions between different components and layers of the application, ensuring they work correctly together. For RESTful APIs, this often involves testing the entire request-response cycle.

*   **Key Technologies Used:**
    *   **`@SpringBootTest`**: Loads the full Spring application context, allowing the entire application stack to be tested.
    *   **`MockMvc`**: Provided by Spring Test, `MockMvc` allows for simulating HTTP requests to controllers and asserting on the responses without needing to start a full HTTP server. This makes API testing fast and efficient.
    *   **`Testcontainers`**: A powerful library that provides lightweight, throwaway instances of databases, message brokers, web browsers, or anything else that can run in a Docker container. For this project, `Testcontainers` is used to spin up a **real MySQL database** for integration tests. This ensures that database interactions are tested against the same technology used in production, preventing subtle bugs that might arise from differences between in-memory databases (like H2) and production databases.

*   **How Integration Tests Work:**
    1.  When an integration test class annotated with `@Testcontainers` and `@SpringBootTest` runs, `Testcontainers` starts a Docker container with a MySQL instance.
    2.  `@DynamicPropertySource` dynamically configures Spring's datasource properties to connect to this temporary MySQL container.
    3.  The Spring application context is loaded, connecting to the Testcontainers-managed database.
    4.  `MockMvc` is then used to send simulated HTTP requests to the API endpoints.
    5.  Assertions are made on the HTTP status code, response headers, and JSON body to verify the API's behavior.
    6.  After the tests complete, `Testcontainers` automatically shuts down and removes the Docker container, leaving your system clean.

*   **How to Run Tests:**
    *   **Prerequisite:** Ensure **Docker is running** on your machine.
    *   Navigate to the `backend/santuario` directory in your terminal.
    *   Execute: `./mvnw test` (or `mvnw.cmd test` on Windows).

*   **Interpreting Test Results:**
    *   A `[INFO] BUILD SUCCESS` message at the end of the Maven output indicates that all tests passed.
    *   If `[INFO] BUILD FAILURE` occurs, review the test summary for `Failures` (assertion failures) or `Errors` (unexpected exceptions). Detailed stack traces and error messages will be provided in the console output for debugging.