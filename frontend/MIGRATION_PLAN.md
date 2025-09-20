# Migration Plan: Zoo Management System

## 1. Project Setup

*   **Backend:**
    *   Create a `backend` directory for the Spring Boot project.
    *   Initialize a Spring Boot project using Maven within the `backend` directory.
    *   Add dependencies: Spring Web, Spring Data JPA, MySQL Driver, Lombok, Spring Boot Validation, SpringDoc (OpenAPI), and Resend Java SDK.
    *   Configure the database connection to MySQL in `application.properties`.
*   **Frontend:**
    *   The existing frontend setup is ready for integration.

## 2. Backend Development (Layered Architecture)

Our backend will follow a standard layered architecture (Controller-Service-Repository) to ensure the code is organized, scalable, and easy to maintain.

### 2.1. Package Structure
*   Inside the main application source, we will create the following Java packages:
    *   `com.zoo.controller`
    *   `com.zoo.service`
    *   `com.zoo.repository`
    *   `com.zoo.model` (for JPA Entities)
    *   `com.zoo.dto` (for Data Transfer Objects)

### 2.2. Model (Entity) Layer
*   Create JPA entities (`@Entity`) in the `model` package for `Animal`, `Habitat`, `Cuidador`, `Veterinario`, and `Alimentacao`.
*   These classes will define the database table structures.

### 2.3. Repository Layer
*   Create Spring Data JPA interfaces (`extends JpaRepository`) in the `repository` package for each entity to handle all database operations (CRUD, etc.).

### 2.4. DTO (Data Transfer Object) Layer
*   Create DTO classes in the `dto` package. These will be plain Java objects used to transfer data between the controllers and services, and as the JSON format for our API. This decouples our API from the database structure.

### 2.5. Service Layer
*   Create service classes (`@Service`) in the `service` package.
*   This layer will contain all the core business logic (e.g., checking habitat capacity, validating data, sending emails).
*   It will mediate between the controllers and the repositories.

### 2.6. Controller Layer (API Endpoints)
*   Create REST controllers (`@RestController`) in the `controller` package.
*   These will define the API endpoints (e.g., `/api/animais`).
*   They will handle HTTP requests, call the appropriate service methods, and return DTOs as JSON responses.

### 2.7. Filtering and Advanced Queries
*   Implement custom query methods in the JPA repositories.
*   Add methods to the service and controller layers to expose the required filtering endpoints (e.g., `GET /animais?especie=...`).

### 2.8. Business Logic Implementation
*   Implement the specific business rules within the service layer:
    *   Check habitat capacity before adding an animal.
    *   Ensure an animal has at least one caretaker.

### 2.9. Email Notifications
*   Create an `EmailService` that uses the Resend Java SDK.
*   Inject this service into other services (e.g., `AnimalService`) to trigger email notifications on create, update, and delete operations related to zookeepers.

### 2.10. API Documentation & CORS
*   Configure SpringDoc to automatically generate OpenAPI (Swagger UI) documentation from the controllers.
*   Configure Cross-Origin Resource Sharing (CORS) globally to allow requests from the React frontend.

## 3. Frontend-Backend Integration

*   Update the `services/api.ts` file in the frontend to connect to the new Spring Boot backend endpoints.
*   Replace mock data with real data from the API.
*   Connect the CRUD operations in the UI to the backend API.
*   Ensure filtering UI components are connected to the filtering endpoints.

## 4. Hosting and Deployment

*   Deploy the Spring Boot application and MySQL database on Railway.
*   Deploy the React frontend on Railway.
