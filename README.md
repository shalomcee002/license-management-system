# Fullstack Spring Boot and React Application

This project is a fullstack application that combines a Spring Boot backend with a React frontend and uses MySQL as the database. 

## Project Structure

- **backend**: Contains the Spring Boot application.
  - **src/main/java/com/example/project**: Java source files for the application.
    - **controllers**: Handles incoming requests and responses.
    - **models**: Represents the data structure of the application.
    - **repositories**: Interfaces for data access.
    - **services**: Contains business logic.
    - **Application.java**: Entry point of the Spring Boot application.
  - **src/main/resources**: Contains configuration files.
    - **application.properties**: Configuration properties for the Spring Boot application.
  - **pom.xml**: Maven configuration file listing dependencies.
  - **README.md**: Documentation for the backend.

- **frontend**: Contains the React application.
  - **src/components**: React components used in the application.
    - **index.js**: Exports the components.
  - **src/services**: Functions for making API calls.
    - **api.js**: API call functions.
  - **src/App.js**: Main component of the React application.
  - **src/index.js**: Entry point for the React application.
  - **package.json**: npm configuration file listing dependencies.
  - **README.md**: Documentation for the frontend.

## Getting Started

To get started with this project, clone the repository and follow the instructions in the backend and frontend README files for setup and running the applications.

## License

This project is licensed under the MIT License.