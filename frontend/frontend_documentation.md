## Frontend Documentation: Zoo Management System

## 1. Project Overview

The frontend of the Zoo Management System is a modern web application built with React and TypeScript. It provides a user-friendly interface for managing various aspects of the zoo, interacting with the backend APIs to display and manipulate data related to animals, habitats, caretakers, veterinarians, and feeding plans.

**Key Technologies:**
*   **React:** A JavaScript library for building user interfaces.
*   **TypeScript:** A typed superset of JavaScript that compiles to plain JavaScript, enhancing code quality and maintainability.
*   **Vite:** A fast build tool that provides a lightning-fast development experience.
*   **HTML/CSS:** Standard web technologies for structuring and styling the application.
*   **Axios (likely, for API calls):** A promise-based HTTP client for the browser and node.js.

## 2. Folder Structure

The frontend application is organized into the following main directories:

*   `public/`: Static assets like `index.html`.
*   `src/`: Contains the core application source code.
    *   `App.tsx`: The main application component.
    *   `index.tsx`: The entry point of the React application.
    *   `components/`: Reusable UI components used across different pages.
    *   `pages/`: Top-level components representing different views or routes of the application.
    *   `services/`: Modules responsible for interacting with backend APIs.
    *   `types/`: TypeScript type definitions for data structures.
    *   `utils/`: Utility functions and helpers.

## 3. Components

The `components` directory houses various reusable UI elements:

*   `AboutUs.tsx`: Displays information about the zoo.
*   `AnimalDetailsPage.tsx`: Shows detailed information for a single animal.
*   `AnimalFormPage.tsx`: Form for creating or editing animal information.
*   `AnimalManagementPage.tsx`: Manages a list of animals (display, add, edit, delete).
*   `ConfirmationModal.tsx`: A generic modal for user confirmations.
*   `FeedingPlanDetailsPage.tsx`: Displays detailed information for a single feeding plan.
*   `FeedingPlanFormPage.tsx`: Form for creating or editing feeding plan information.
*   `Footer.tsx`: The application's footer component.
*   `GenericManagementPage.tsx`: A generic component for managing lists of entities.
*   `HabitatDetailsPage.tsx`: Shows detailed information for a single habitat.
*   `HabitatFormPage.tsx`: Form for creating or editing habitat information.
*   `HeroCarousel.tsx`: A carousel component for displaying prominent content.
*   `Icons.tsx`: Contains SVG icons or icon components.
*   `ImageSelectionModal.tsx`: A modal for selecting images.
*   `KeeperDetailsPage.tsx`: Shows detailed information for a single caretaker.
*   `KeeperFormPage.tsx`: Form for creating or editing caretaker information.
*   `Navbar.tsx`: The application's navigation bar.
*   `TeamSection.tsx`: Displays information about the team.
*   `ToastNotification.tsx`: Component for displaying transient notifications.
*   `VetDetailsPage.tsx`: Shows detailed information for a single veterinarian.
*   `VetFormPage.tsx`: Form for creating or editing veterinarian information.

## 4. Pages

The `pages` directory contains the main views of the application:

*   `AnimalGalleryPage.tsx`: Displays a gallery of animals.
*   `DashboardPage.tsx`: The main dashboard for authenticated users.
*   `EmployeeLoginPage.tsx`: Login page for employees.
*   `VisitContactPage.tsx`: Page for visitors to contact the zoo.

## 5. Services

*   `api.ts`: Configures and exports an Axios instance for making HTTP requests to the backend API. It centralizes API call logic and potentially handles authentication or error handling.

## 6. Types

The `types` directory defines TypeScript interfaces and types used throughout the application:

*   `dashboard.ts`: Type definitions specific to the dashboard.
*   `site.ts`: Type definitions related to general site structure or content.
*   `types.ts`: General or shared type definitions.

## 7. Utilities

*   `animalImages.ts`: Contains utility functions or data related to animal images, possibly providing a list of image URLs or helper functions for image handling.
